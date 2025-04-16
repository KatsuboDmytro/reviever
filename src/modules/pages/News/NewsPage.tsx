import { useEffect, useState } from "react";
import { Link } from "react-router";

import { collection, getDocs, query, where } from "firebase/firestore";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

import { useAuthorsInfo } from "../../../app/useAuthorInfo";
import { db } from "../../../firebase/firebase";
import { News } from "../../../types/News";
import "./newsPage.scss";

export const NewsPage = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const authorIds = newsList.map((c) => c.unchangeable.author_id);
  const authorInfoMap = useAuthorsInfo(authorIds);

  async function getAuthorsNews() {
    try {
      const newsCollection = collection(db, "news");
      const q = query(newsCollection, where("isPublished", "==", true));

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
    getAuthorsNews();
  }, []);

  return (
    <section className="main-news-container">
      <div className="main-news container">
        <h1 className="main-news__title">Головні новини бізнесу</h1>
        <p className="main-news__description">Підтримуй економіку України</p>
        <div className="main-news__box">
          <div className="main-news__posts">
            {newsList.slice(0, 1).map((item) => {
              const total = item.likes + item.dislikes;
              const likesPercentage =
                total > 0 ? (item.likes / total) * 100 : 100;
              const dislikesPercentage = 100 - likesPercentage;

              return (
                <article className="main-news__posts-big" key={item.news_id}>
                  <Link to={`/news/${item.news_id}/view`}>
                    <img src={item.news_preview} alt={item.title} />
                    <div className="main-news__posts-big-info">
                      <div className="main-news__posts-big-title">
                        {item.title}
                      </div>
                      <div className="publication__list-item-buttons">
                        <span>{item.unchangeable.date}</span>
                      </div>
                      <div
                        title={`👍 ${item.likes} лайків / 👎 ${item.dislikes} дизлайків`}
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
                  </Link>
                </article>
              );
            })}
            {newsList.slice(1, 6).map((item, i) => {
              const total = item.likes + item.dislikes;
              const likesPercentage =
                total > 0 ? (item.likes / total) * 100 : 100;
              const dislikesPercentage = 100 - likesPercentage;
              return (
                <article
                  className={`publication__list-item main-news__posts-small small-${i + 1}`}
                  key={item.news_id}
                >
                  <Link to={`/news/${item.news_id}/view`}>
                    <img src={item.news_preview} alt={item.title} />
                    <aside className="publication__list-item-aside">
                      <img
                        src={authorInfoMap[item.unchangeable.author_id]?.avatar}
                        alt={
                          authorInfoMap[item.unchangeable.author_id]
                            ?.display_name
                        }
                        className="publication__list-item-image"
                      />
                      <div className="publication__list-item-title">
                        {item.title}
                      </div>
                    </aside>
                  </Link>
                  <div className="publication__list-item-down">
                    <span>
                      {authorInfoMap[item.unchangeable.author_id]?.display_name}
                    </span>
                    <span>{item.unchangeable.date}</span>
                  </div>
                  <div
                    title={`👍 ${item.likes} лайків / 👎 ${item.dislikes} дизлайків`}
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
                </article>
              );
            })}
            <aside className="main-news__articles">
              <h3 className="main-news__articles-title">
                Топ обговорень за тиждень
              </h3>
              {Array.from({ length: 5 }, (_, i) => (
                <article className="main-news__article" key={i}>
                  <Link to={`/talks/:talkId/view`}>
                    <div className="main-news__article-top">
                      <div className="main-news__article-author">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/reviever.firebasestorage.app/o/avatars%2F1744624718458_Frame%2037.png?alt=media&token=629cf4d6-5140-4e20-a9b7-2ab90e320e61"
                          alt="News 1"
                          className="main-news__article-image"
                        />
                        <span className="main-news__article-tag">
                          Dmytro Katsubo
                        </span>
                      </div>
                      <span className="main-news__article-date">
                        12.12.2023
                      </span>
                    </div>
                    <div className="main-news__article-title">
                      Як працюють акції в ресторанах та кафе?
                    </div>
                    <div className="main-news__article-analytics">
                      <span>
                        <ThumbsUp />
                        <span className="main-news__article-likes">12</span>
                      </span>
                      <span>
                        <ThumbsDown />
                        <span className="main-news__article-likes">12</span>
                      </span>
                      <span>
                        <MessageCircle />
                        <span className="main-news__article-comments">12</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
              <Link to="/talks" className="hyperlink">
                Переглянути більше
              </Link>
            </aside>
          </div>
        </div>

        <div className="m-50">
          <h3 className="main-news__articles-title">
            Топові події яким варто приділити увагу!
          </h3>

          <div className="main-news__articles-flex">
            {newsList.slice(1, 6).map((item) => {
              const total = item.likes + item.dislikes;
              const likesPercentage =
                total > 0 ? (item.likes / total) * 100 : 100;
              const dislikesPercentage = 100 - likesPercentage;
              return (
                <article
                  className={`publication__list-item`}
                  key={item.news_id}
                >
                  <Link to={`/news/${item.news_id}/view`} key={12}>
                    <img src={item.news_preview} alt={item.title} />
                    <aside className="publication__list-item-aside">
                      <img
                        src={authorInfoMap[item.unchangeable.author_id]?.avatar}
                        alt={authorInfoMap[item.unchangeable.author_id]?.display_name}
                        className="publication__list-item-image"
                      />
                      <div className="publication__list-item-title">
                        {item.title}
                      </div>
                    </aside>
                  </Link>
                  <div className="publication__list-item-down">
                    <span>{authorInfoMap[item.unchangeable.author_id]?.display_name}</span>
                    <span>{item.unchangeable.date}</span>
                  </div>
                  <div
                    title={`👍 ${item.likes} лайків / 👎 ${item.dislikes} дизлайків`}
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
                </article>
              );
            })}
          </div>
          <div className="m-20">
            <Link to="/news" className="hyperlink">
              Переглянути більше
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
