import { useState } from "react";
import { useNavigate } from "react-router";

import { doc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useAppSelector } from "../../../../app/hooks";
import { db } from "../../../../firebase/firebase";
import { getFormattedTimeAndDate } from "../../../../vars";
import "./newsModal.scss";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [author] = useAppSelector((state) => [state.authors.authors]);
  const navigate = useNavigate();
  const [newsTitle, setNewsTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onCreateNews = async () => {
    if (!newsTitle || !author) return;

    setIsLoading(true);
    const newsId = uuidv4();

    const newNews = {
      news_id: newsId,
      title: newsTitle,
      unchangeable: {
        author_id: author.authors_id,
        avatar: author.avatar,
        display_name: author.display_name,
        author_email: author.email,
        date: getFormattedTimeAndDate(),
      },
      content: [],
      hashtags: [],
      isPublished: false,
      news_preview: "",
      likes: 0,
      dislikes: 0,
      comments: [],
      views: 0,
    };

    try {
      await setDoc(doc(db, "news", newsId), newNews);
      setNewsTitle("");
      navigate(`/news/${newsId}/edit`);
    } catch (error) {
      console.error("Помилка при створенні публікації:", error);
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
        <h2>Зробити публікацію</h2>
        <p>Додай назву яка чіплятиме за душу</p>

        <input
          type="text"
          placeholder="Як окупити бізнес за 3 місяці"
          value={newsTitle}
          onChange={(e) => setNewsTitle(e.target.value)}
        />
        <div className="modal__actions">
          <button className="modal__cancel" onClick={onClose}>
            Відмінити
          </button>
          <button
            className="modal__create"
            disabled={!newsTitle || isLoading}
            onClick={onCreateNews}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Створити"}
          </button>
        </div>
      </div>
    </div>
  );
};
