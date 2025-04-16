import { useEffect, useState } from "react";
import { Link } from "react-router";

import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Eye,
  EyeClosed,
  PlusSquare,
  Trash2,
} from "lucide-react";

import { useAppSelector } from "../../../../app/hooks";
import { db } from "../../../../firebase/firebase";
import { News } from "../../../../types/News";
import { DeleteModal, NewsModal, PublishModal } from "../../../index";
import "./newsConstructor.scss";

export const NewsConstructor = () => {
  const { authors } = useAppSelector((state) => state.authors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalToDeleteOpen, setIsModalToDeleteOpen] = useState(false);
  const [isModalToPublishOpen, setIsModalToPublishOpen] = useState(false);
  const [newsID, setNewsID] = useState<string>("");
  const [newsList, setNewsList] = useState<News[]>([]);

  async function getAuthorsNews() {
    try {
      const newsCollection = collection(db, "news");
      const q = query(
        newsCollection,
        where("unchangeable.author_id", "==", authors?.authors_id),
      );

      const querySnapshot = await getDocs(q);

      const newsList = querySnapshot.docs.map((doc) => doc.data());

      console.log("🚀 ~ getAuthorsNews ~ newsList:", newsList);

      setNewsList(newsList as News[]);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }

  useEffect(() => {
    authors && getAuthorsNews();
  }, [authors, isModalToPublishOpen, isModalToDeleteOpen]);

  return (
    <section className="publication">
      <div className="publication__data">
        <h1>Мої новини</h1>
        <span>
          Почни створювати публікації щоб розширювати можливості спільноти рости
        </span>
        <div className="publication__list">
          <div
            className="publication__list-add"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusSquare />
          </div>
          {newsList.map((news: any) => {
            const total = news.likes + news.dislikes;
            const likesPercentage =
              total > 0 ? (news.likes / total) * 100 : 100;
            const dislikesPercentage = 100 - likesPercentage;

            return (
              <div
                className="publication__list-item"
                style={{ position: "relative" }}
              >
                <Link to={`/news/${news.news_id}/edit`} key={news.id}>
                  <img src={news.news_preview} alt="looksLike" />
                  <div className="publication__list-item-title">
                    {news.title}
                  </div>
                  {!news.isPublished && (
                    <div className="draft-tape">
                      <img src="/img/bg/1.png" alt="template" />
                      <img src="/img/bg/1.png" alt="template" />
                    </div>
                  )}
                </Link>
                <div className="publication__list-item-buttons">
                  <div className="publication__list-item-buttons-left">
                    <button
                      className="hover-icon-circle"
                      onClick={() => {
                        setIsModalToDeleteOpen(true);
                        setNewsID(news.news_id);
                      }}
                    >
                      <Trash2 />
                    </button>
                    {news.isPublished ? (
                      <button
                        className="hover-icon-circle"
                        onClick={() => {
                          setIsModalToPublishOpen(true);
                          setNewsID(news.news_id);
                        }}
                      >
                        <Eye />
                      </button>
                    ) : (
                      <button
                        className="hover-icon-circle"
                        onClick={() => {
                          setIsModalToPublishOpen(true);
                          setNewsID(news.news_id);
                        }}
                      >
                        <EyeClosed />
                      </button>
                    )}
                    {news.views}
                  </div>
                  <span>{news.unchangeable.date}</span>
                </div>
                <div
                  title={`👍 ${news.likes} лайків / 👎 ${news.dislikes} дизлайків`}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "4px",
                    width: "100%",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${likesPercentage}%`,
                      backgroundColor: "green",
                      borderBottomLeftRadius: "5px",
                    }}
                  />
                  <div
                    style={{
                      width: `${dislikesPercentage}%`,
                      backgroundColor: "red",
                      borderBottomRightRadius: "5px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <NewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PublishModal
        id={newsID}
        isOpen={isModalToPublishOpen}
        onClose={() => setIsModalToPublishOpen(false)}
      />
      <DeleteModal
        id={newsID}
        isOpen={isModalToDeleteOpen}
        onClose={() => setIsModalToDeleteOpen(false)}
      />
    </section>
  );
};
