import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { useAppSelector } from "../../../../../../../app/hooks";
import { db } from "../../../../../../../firebase/firebase";
import "./newsPreview.scss";

export const NewsPreview = () => {
  const { newsInfo } = useAppSelector((state) => state.news);
  const [showAllTags, setShowAllTags] = useState(false);
  const [author, setAuthor] = useState<{
    display_name?: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!newsInfo.unchangeable.author_id) return;

      try {
        const authorRef = doc(db, "authors", newsInfo.unchangeable.author_id);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          setAuthor(authorSnap.data());
        } else {
          console.warn("Author not found");
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [newsInfo.unchangeable.author_id]);

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

  return (
    <div className="news-preview">
      <h1 className="title">{newsInfo.title}</h1>
      <div className="meta">
        <div className="meta__left">
          <img
            src={author?.avatar}
            alt={author?.display_name}
            className="image"
          />
          <span className="author">{author?.display_name}</span>
        </div>
        <span className="date">{newsInfo.unchangeable.date}</span>
      </div>
      <div className="tags">
        {newsInfo.hashtags.slice(0, 5).map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
        {newsInfo.hashtags.length > 5 && !showAllTags && (
          <span className="show-more" onClick={handleShowAllTags}>
            Показати всі
          </span>
        )}
        {showAllTags &&
          newsInfo.hashtags.slice(5).map((tag, index) => (
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
        {newsInfo.content.map((item) => {
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
    </div>
  );
};
