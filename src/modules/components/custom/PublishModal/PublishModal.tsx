import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { showToast } from "../../../../data/toastNotifications";
import { setNewsInfo } from "../../../../features/newsSlice";
import { db } from "../../../../firebase/firebase";

interface PublishModalProps {
  isOpen: boolean;
  id?: string;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  id,
  onClose,
}) => {
  if (!isOpen) return null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { newsId } = useParams();
  const { newsInfo } = useAppSelector((state) => state.news);
  const [isLoading, setIsLoading] = useState(false);

  const onPublishNews = async () => {
    setIsLoading(true);
  
    try {
      const validNewsId = newsId ?? id;
      if (!validNewsId) {
        showToast.error("Відсутній ID новини");
        setIsLoading(false);
        return;
      }
      const newsRef = doc(db, "news", validNewsId);
      
      if (newsId) {
        await setDoc(newsRef, { ...newsInfo, isPublished: !newsInfo.isPublished }, { merge: true },);
      } else {
        await updateDoc(newsRef, {
          isPublished: !newsInfo.isPublished,
        });
      }
  
      dispatch(
        setNewsInfo({
          ...newsInfo,
          isPublished: !newsInfo.isPublished,
        })
      );
  
      navigate(`/settings/news`);
      onClose();
      showToast.success(
        `Статтю успішно ${!newsInfo.isPublished ? "опубліковано" : "приховано"}`
      );
    } catch (error) {
      console.error("Помилка при оновленні новини:", error);
      showToast.error("Помилка при опублікуванні");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2>
          {newsInfo.isPublished
            ? "Ви впевнені що хочете приховати статтю?"
            : "Ви впевнені що хочете опублікувати статтю?"}
        </h2>
        <p>
          {newsInfo.isPublished
            ? "Тепер її ніхто не зможе побачити"
            : "Тепер вона стане доступною для всіх користувачів"}
        </p>

        <div className="modal__actions" style={{ marginTop: "50px" }}>
          <button className="modal__cancel" onClick={onClose}>
            Відмінити
          </button>
          <button
            className="modal__create"
            disabled={isLoading}
            onClick={onPublishNews}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              `${newsInfo.isPublished ? "Приховати" : "Опублікувати"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
