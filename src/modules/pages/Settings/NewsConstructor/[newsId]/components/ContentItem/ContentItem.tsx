import { useRef, useState } from "react";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Loader2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../../../../../app/hooks";
import { setNewsInfo } from "../../../../../../../features/newsSlice";
import { storage } from "../../../../../../../firebase/firebase";
import { RichTextEditor } from "../../../../../../index";

interface ContentItemProps {
  handleRichTextEditorChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    name: string,
    index: number,
  ) => void;
  handleImageUpload: (id: number, newImages: string[]) => void;
  type: string;
  id: number;
  value?: string | string[];
}

export const ContentItem: React.FC<ContentItemProps> = ({
  type,
  handleRichTextEditorChange,
  id,
  value,
  handleImageUpload,
}) => {
  const dispatch = useAppDispatch();
  const { newsInfo } = useAppSelector((state) => state.news);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Map<number, boolean>>(
    new Map(),
  );
  const [videoLink, setVideoLink] = useState("");

  const handleAddLink = () => {
    if (!videoLink.trim()) return;

    const updatedValue = [
      ...(Array.isArray(value) ? value : []),
      videoLink.trim(),
    ];
    handleImageUpload(id, updatedValue);

    dispatch(
      setNewsInfo({
        ...newsInfo,
        content: newsInfo.content.map((item) =>
          item.id === id ? { ...item, value: updatedValue } : item,
        ),
      }),
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    const newUploadingFiles = new Map<number, boolean>();
    files.forEach((_, index) => newUploadingFiles.set(index, true));
    setUploadingFiles(newUploadingFiles);

    const uploadedImageData = await Promise.all(
      files.map(async (file) => {
        const storagePath = `images/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return { downloadURL, storagePath };
      }),
    );

    uploadedImageData.forEach((data, index) => {
      newUploadingFiles.set(index, false);
      handleImageUpload(id, [
        ...(Array.isArray(value) ? value : []),
        data.downloadURL,
      ]);
    });

    setUploadingFiles(newUploadingFiles);
  };

  const handleDeleteImage = async (index: number) => {
    const imageToDelete = (Array.isArray(value) && value[index]) || "";

    if (imageToDelete) {
      const imageRef = ref(storage, imageToDelete);
      try {
        await deleteObject(imageRef);
        const updatedValue = (Array.isArray(value) ? value : []).filter(
          (_, i) => i !== index,
        );

        handleImageUpload(id, updatedValue);
        dispatch(
          setNewsInfo({
            ...newsInfo,
            content: newsInfo.content.map((item) =>
              item.id === id ? { ...item, value: updatedValue } : item,
            ),
          }),
        );
      } catch (error) {
        console.error("Помилка при видаленні зображення:", error);
      }
    }
  };

  return (
    <div className={`content-item content-item--${type}`}>
      {type === "text" && (
        <div className="forms__form-item">
          <label htmlFor="title" className="forms__form-item-label">
            Тут можете написати захопливий текст
          </label>
          <RichTextEditor
            onRichTextEditorChange={(event: any) =>
              handleRichTextEditorChange(event, "text", id)
            }
            prevValue={typeof value === "string" ? value : undefined}
          />
        </div>
      )}

      {type === "image" && (
        <div className="image-uploader">
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
              handleFileChange(e as any); // переюзати логіку
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

          {Array.isArray(value) && value.length > 0 ? (
            <div className="image-uploader__preview">
              {value.map((url, index) => (
                <div
                  key={`existing-image-${index}`}
                  className="image-uploader__preview-item"
                >
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    className="image-uploader__image"
                  />
                  <button
                    className="image-uploader__delete-button"
                    onClick={() => handleDeleteImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {/* Якщо зображення ще завантажуються */}
          {Array.from(uploadingFiles.values()).some(
            (isLoading) => isLoading,
          ) && (
            <div className="image-uploader__preview">
              {Array.from(uploadingFiles.entries()).map(
                ([index, isLoading]) => (
                  <div
                    key={`new-image-${index}`}
                    className="image-uploader__preview-item"
                  >
                    {isLoading ? (
                      <div className="image-uploader__loader">
                        <Loader2 className="animate-spin" />
                      </div>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}

      {type === "video" && (
        <div className="video-uploader">
          <div className="video-uploader__link-section">
            <input
              type="text"
              placeholder="Вставте посилання на відео (YouTube, Vimeo тощо)"
              className="video-uploader__input-link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddLink}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "5px 10px",
              }}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
