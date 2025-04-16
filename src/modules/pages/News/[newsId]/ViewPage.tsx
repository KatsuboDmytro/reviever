import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

import { useAuthorsInfo } from "../../../../app/useAuthorInfo";
import { useReaction } from "../../../../app/useReaction";
import { db } from "../../../../firebase/firebase";
import { News } from "../../../../types/News";
import { CommentThread, Disclaimer, ShareSection } from "../../../index";
import "./viewPage.scss";
import { useAppSelector } from "../../../../app/hooks";

export const ViewPage = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const { authors } = useAppSelector((state) => state.authors);
  const [news, setNews] = useState<News | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [newsList, setNewsList] = useState<News[]>([]);
  const authorIds = newsList.map((c) => c.unchangeable.author_id);
  const authorInfoMap = useAuthorsInfo(authorIds);
  const { likes, dislikes, userReaction, react, loading } = useReaction(
    "news",
    newsId!,
    authors?.authors_id!,
  );

  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) return;

      try {
        const newsRef = doc(db, "news", newsId);
        const newsSnap = await getDoc(newsRef);
        if (newsSnap.exists()) {
          setNews(newsSnap.data() as News);
        } else {
          console.warn("News not found");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [newsId]);

  const renderVideo = (videoUrl: string, index: number) => {
    const getEmbedType = (url: string) => {
      if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
      if (/vimeo\.com/.test(url)) return "vimeo";
      if (/\.(mp4|webm|ogg)$/i.test(url)) return "direct";
      if (/firebasestorage\.googleapis\.com/.test(url)) return "firebase";
      return "unknown";
    };

    const type = getEmbedType(videoUrl);

    switch (type) {
      case "youtube": {
        const videoId = videoUrl.includes("watch?v=")
          ? videoUrl.split("watch?v=")[1].split("&")[0]
          : videoUrl.split("/").pop();
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            key={index}
            src={embedUrl}
            title={`youtube-video-${index}`}
            className="rich-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      case "vimeo": {
        const videoId = videoUrl.split("/").pop();
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return (
          <iframe
            key={index}
            src={embedUrl}
            title={`vimeo-video-${index}`}
            className="rich-video"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }

      default:
        return null;
    }
  };

  const handleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  async function getAuthorsNews() {
    try {
      const newsCollection = collection(db, "news");
      const q = query(newsCollection, where("isPublished", "==", true));

      const querySnapshot = await getDocs(q);
      const newsList = querySnapshot.docs.map((doc) => doc.data());

      setNewsList(newsList as News[]);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }

  useEffect(() => {
    getAuthorsNews();
  }, []);

  const total = likes! + dislikes!;
  const likesPercentage = total > 0 ? (likes! / total) * 100 : 100;
  const dislikesPercentage = 100 - likesPercentage;

  return (
    <section className="view container m-preview">
      <div className="view__main">
        <div className="news-preview">
          <h1 className="title">{news?.title}</h1>
          <div className="meta">
            <div className="meta__left">
              {news?.unchangeable && (
                <>
                  <img
                    src={authorInfoMap[news.unchangeable.author_id]?.avatar}
                    alt={
                      authorInfoMap[news.unchangeable.author_id]?.display_name
                    }
                    className="image"
                  />
                  <span className="author">
                    {authorInfoMap[news.unchangeable.author_id]?.display_name}
                  </span>
                </>
              )}
            </div>
            <span className="date">{news?.unchangeable.date}</span>
          </div>
          <div className="tags">
            {news?.hashtags.slice(0, 5).map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
            {news?.hashtags && news?.hashtags.length > 5 && !showAllTags && (
              <span className="show-more" onClick={handleShowAllTags}>
                Показати всі
              </span>
            )}
            {showAllTags &&
              news?.hashtags.slice(5).map((tag, index) => (
                <span key={index + 5} className="tag">
                  #{tag}
                </span>
              ))}
            {showAllTags && (
              <span className="show-more" onClick={handleShowAllTags}>
                Сховати
              </span>
            )}
          </div>
          <div className="rich-content">
            {news?.content.map((item) => {
              if (item.type === "text" && typeof item.value === "string") {
                return (
                  <div
                    key={item.id}
                    dangerouslySetInnerHTML={{ __html: item.value }}
                  />
                );
              }
              if (item.type === "image" && Array.isArray(item.value)) {
                return item.value.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`image-${item.id}-${index}`}
                    className="rich-image"
                  />
                ));
              }
              if (item.type === "video" && Array.isArray(item.value)) {
                return item.value.map(renderVideo);
              }
              return null;
            })}
          </div>
          <div className="view__action">
            <ShareSection />
            <div className="view__action-analytics">
              <button
                className="view__action-analytics-item"
                disabled={loading}
                onClick={() => react("like")}
                style={{ color: userReaction === "like" ? "green" : "gray" }}
              >
                <ThumbsUp /> {likes}
              </button>
              <button
                className="view__action-analytics-item"
                disabled={loading}
                onClick={() => react("dislike")}
                style={{ color: userReaction === "dislike" ? "red" : "gray" }}
              >
                <ThumbsDown /> {dislikes}
              </button>
              <div
                title={`👍 ${news?.likes} лайків / 👎 ${news?.dislikes} дизлайків`}
                style={{
                  position: "absolute",
                  bottom: -10,
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
          </div>
          <hr />
          <CommentThread newsId={news?.news_id!} />
        </div>
        <aside className="view__talks">
          <h3 className="main-news__articles-title">Обговорення за темою</h3>
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
                  <span className="main-news__article-date">12.12.2023</span>
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
      <div className="view__bottom">
        <h3 className="main-news__articles-title">Вас це точно зацікавить!</h3>

        <div className="main-news__articles-flex">
          {newsList.slice(1, 6).map((item) => {
            const total = item.likes + item.dislikes;
            const likesPercentage =
              total > 0 ? (item.likes / total) * 100 : 100;
            const dislikesPercentage = 100 - likesPercentage;

            return (
              <article className={`publication__list-item`} key={item.news_id}>
                <Link to={`/news/${item.news_id}/view`} key={12}>
                  <img src={item.news_preview} alt={item.title} />
                  <aside className="publication__list-item-aside">
                    <img
                      src={authorInfoMap[item!.unchangeable.author_id]?.avatar}
                      alt={
                        authorInfoMap[item!.unchangeable.author_id]
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
                    {authorInfoMap[item!.unchangeable.author_id]?.display_name}
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
        </div>
        <div className="m-20">
          <Link to="/news" className="hyperlink">
            Переглянути більше
          </Link>
        </div>
      </div>
      <Disclaimer authorMail={news?.unchangeable.author_email || ""} />
    </section>
  );
};
