import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { doc, deleteDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

import { showToast } from "../../../../data/toastNotifications";
import { db } from "../../../../firebase/firebase";

interface DeleteModalProps {
  isOpen: boolean;
  id: string;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  id,
  onClose,
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const { newsId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteNews = async () => {
    setIsLoading(true);

    try {
      const validNewsId = newsId ?? id;
      if (!validNewsId) {
        showToast.error("Відсутній ID новини");
        setIsLoading(false);
        return;
      }

      const newsRef = doc(db, "news", validNewsId);

      await deleteDoc(newsRef);

      navigate(`/settings/news`);
      onClose();
      showToast.success("Статтю успішно видалено");
    } catch (error) {
      showToast.error("Помилка при видаленні");
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
        <h2>Ви впевнені, що хочете видалити статтю?</h2>
        <p>Цю дію не можна буде скасувати</p>

        <div className="modal__actions" style={{ marginTop: "50px" }}>
          <button className="modal__cancel" onClick={onClose}>
            Відмінити
          </button>
          <button
            className="modal__create"
            disabled={isLoading}
            onClick={onDeleteNews}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Видалити"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
