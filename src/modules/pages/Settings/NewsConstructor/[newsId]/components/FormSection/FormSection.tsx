import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { doc, setDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Loader2, PlusIcon } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../../../../../app/hooks";
import { showToast } from "../../../../../../../data/toastNotifications";
import { setNewsInfo } from "../../../../../../../features/newsSlice";
import { db, storage } from "../../../../../../../firebase/firebase";
import { contentTypes } from "../../../../../../../vars";
import { MainButton } from "../../../../../../components/ui/Button";
import { ContentItem, PublishModal } from "../../../../../../index";
import { Hashtags } from "../Hashtags/Hashtags";
import { SortableItem } from "../SortableItem/SortableItem";
import "./formSection.scss";

interface FormSectionProps {
  enableNext: (val: boolean) => void;
  activeFormIndex: number;
}

export const FormSection: React.FC<FormSectionProps> = ({
  activeFormIndex,
  enableNext,
}) => {
  const { newsId } = useParams();
  const { newsInfo } = useAppSelector((state) => state.news);
  console.log("🚀 ~ newsInfo:", newsInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const contentItems = newsInfo.content || [];
  const dispatch = useAppDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch(setNewsInfo({ ...newsInfo, [name]: value }));
  };

  const handleRichTextEditorChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => {
    const { value } = event.target;

    const updated = contentItems.map((item) =>
      item.id === id ? { ...item, value } : item,
    );

    dispatch(setNewsInfo({ ...newsInfo, content: updated }));
  };

  const handleImageUpload = (id: number, newImages: string[]) => {
    const updated = contentItems.map((item) =>
      item.id === id && item.type === "image"
        ? { ...item, value: [...(item.value as string[]), ...newImages] }
        : item,
    );

    dispatch(setNewsInfo({ ...newsInfo, content: updated }));
  };

  useEffect(() => {
    dispatch(setNewsInfo({ ...newsInfo, content: contentItems }));

    if (newsInfo.content.length > 0) {
      enableNext(true);
    } else {
      enableNext(false);
    }
  }, [dispatch, contentItems]);

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!newsId) {
        showToast.error("News ID is missing.");
        setIsLoading(false);
        return;
      }
      const newsRef = doc(db, "news", newsId);
      await setDoc(newsRef, newsInfo, { merge: true });

      showToast.success("Author data saved successfully!");
    } catch (error) {
      showToast.error(
        `Failed to save author data: ${(error as Error).message}`,
      );
      console.error("Error saving author data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addContentItem = (type: string) => {
    const newId = Date.now();
    const newItem = { id: newId, type, value: type === "image" ? [] : "" };

    dispatch(
      setNewsInfo({
        ...newsInfo,
        content: [...contentItems, newItem],
      }),
    );
  };

  const deleteContentItem = (deleteId: number) => {
    const updated = contentItems.filter((item) => item.id !== deleteId);
    dispatch(setNewsInfo({ ...newsInfo, content: updated }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = contentItems.findIndex((item) => item.id === active.id);
      const newIndex = contentItems.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(contentItems, oldIndex, newIndex);

      dispatch(setNewsInfo({ ...newsInfo, content: reordered }));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const oldImageUrl = newsInfo.news_preview;

    if (oldImageUrl) {
      try {
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
      } catch (error) {
        console.error("Помилка при видаленні старого зображення:", error);
      }
    }
    const storagePath = `newsPreviews/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    try {
      setIsFileLoading(true);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const updatedNewsInfo = {
        ...newsInfo,
        news_preview: downloadURL,
      };

      dispatch(setNewsInfo(updatedNewsInfo));
    } catch (error) {
      console.error("Помилка при завантаженні нового зображення:", error);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handlePublishModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  return (
    <section className="forms">
      {activeFormIndex === 1 && (
        <form className="forms__form" onSubmit={onSave}>
          <div className="forms__form-item">
            <label htmlFor="title" className="forms__form-item-label">
              Ваш заголовок
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="forms__form-item-input"
              placeholder="Заголовок"
              onChange={handleInputChange}
              defaultValue={newsInfo.title}
              required
            />
          </div>

          <div className="forms__form-item">
            <label className="forms__form-item-label">
              Оберіть який контент хочете додати наступним
            </label>
            <div className="forms__content-buttons">
              {contentTypes.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  className={`forms__button forms__button--${type}`}
                  onClick={() => addContentItem(type)}
                >
                  <PlusIcon />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="forms__content">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={contentItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {newsInfo.content.map(({ id, type, value }) => (
                  <SortableItem
                    key={id}
                    id={id}
                    type={type}
                    value={value}
                    deleteContentItem={deleteContentItem}
                  >
                    <ContentItem
                      id={id}
                      type={type}
                      handleImageUpload={handleImageUpload}
                      handleRichTextEditorChange={(event) =>
                        handleRichTextEditorChange(event, id)
                      }
                      value={
                        newsInfo.content.find((item) => item.id === id)?.value
                      }
                    />
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="edit-news__edit-buttons">
            <MainButton type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Зберегти"}
            </MainButton>
            {!newsInfo.isPublished && (
              <span className="unpublished">*Чернетка</span>
            )}
          </div>
        </form>
      )}
      {activeFormIndex === 2 && (
        <>
          <Hashtags />
          <form className="edit-news__edit-buttons" onSubmit={onSave}>
            <MainButton type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Зберегти"}
            </MainButton>
            {!newsInfo.isPublished && (
              <span className="unpublished">*Чернетка</span>
            )}
          </form>
        </>
      )}
      {activeFormIndex === 3 && (
        <>
          <label className="forms__form-item-label">
            Додайте фото на прев'ю новини, яке буде відображатись для всіх
            користувачів першим, ваша ціль - зацікавити їх
          </label>
          <div
            className={`image-uploader__drop-area ${isDragging ? "image-uploader__drop-area--dragging" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileChange(e as any);
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="image-uploader__input"
              onChange={handleFileChange}
            />
            <div className="image-uploader__content">
              <img
                src="/img/bg/upload_image.png"
                alt="upload_image"
                className="image-uploader__icon"
              />
              <p className="image-uploader__text">
                Перетягніть або клацніть тут, щоб завантажити зображення
              </p>
              <small className="image-uploader__subtext">
                Завантажуйте будь-які зображення з робочого столу
              </small>
            </div>
          </div>

          {newsInfo.news_preview && (
            <div className="image-uploader__preview">
              <div className="image-uploader__preview-item">
                {isFileLoading ? (
                  <div className="image-uploader__loader">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <img
                    src={newsInfo.news_preview}
                    alt={`news preview`}
                    className="image-uploader__image"
                  />
                )}
              </div>
            </div>
          )}

          <form
            className="edit-news__edit-buttons"
            onSubmit={handlePublishModal}
          >
            <MainButton type="submit" disabled={isLoading || isFileLoading}>
              Зберегти та опублікувати зміни
            </MainButton>
            {!newsInfo.isPublished && (
              <span className="unpublished">*Чернетка</span>
            )}
          </form>

          <PublishModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </section>
  );
};
