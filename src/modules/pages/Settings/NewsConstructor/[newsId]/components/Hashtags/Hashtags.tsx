import { useState } from "react";

import { Trash } from "lucide-react";

import { AI_HASHTAGS_PROMPT } from "../../../../../../../../prompts";
import { AIChatSession } from "../../../../../../../../service/AIModal";
import { useAppDispatch, useAppSelector } from "../../../../../../../app/hooks";
import { showToast } from "../../../../../../../data/toastNotifications";
import { setNewsInfo } from "../../../../../../../features/newsSlice";
import { BorderButton } from "../../../../../../components/ui/Button";

export const Hashtags = () => {
  const { newsInfo } = useAppSelector((state) => state.news);
  const [newHashtag, setNewHashtag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHashtag(e.target.value);
  };

  const handleAddHashtag = () => {
    if (newHashtag && !newsInfo.hashtags.includes(newHashtag)) {
      dispatch(
        setNewsInfo({
          ...newsInfo,
          hashtags: [...(newsInfo.hashtags || []), newHashtag],
        }),
      );
      setNewHashtag("");
    }
  };

  const handleDeleteHashtag = (index: number) => {
    dispatch(
      setNewsInfo({
        ...newsInfo,
        hashtags: newsInfo.hashtags.filter((_, idx) => idx !== index),
      }),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "+") {
      handleAddHashtag();
    }
  };

  const generateHashtagsWithAI = async () => {
    setIsLoading(true);
    const textContentValues = newsInfo?.content
      .filter((item) => item.type === "text")
      .map((item) => item.value)
      .join(" ");

    try {
      const PROMPT = AI_HASHTAGS_PROMPT.replace("{text}", textContentValues);
      const result = await AIChatSession.sendMessage(PROMPT);
      const aiResponse = result.response.text();

      const newHashtags = aiResponse.split(" ");
      const filteredHashtags = newHashtags
        .map((hashtag) => hashtag.trim())
        .filter((hashtag) => !newsInfo.hashtags.includes(hashtag));

      if (filteredHashtags.length > 0) {
        dispatch(
          setNewsInfo({
            ...newsInfo,
            hashtags: [...(newsInfo.hashtags || []), ...filteredHashtags],
          }),
        );
      }
    } catch (error) {
      showToast.error("❌ Error while generating AI response:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forms__form-item">
      <BorderButton onClick={generateHashtagsWithAI} disabled={isLoading}>
        Згенерувати AI теги
        <img src="/img/icons/gemini.svg" alt="gemini" />
      </BorderButton>
      <label htmlFor="hashtags" className="forms__form-item-label">
        Хештеги
      </label>
      <div className="hashtags-container">
        <input
          type="text"
          id="hashtags"
          value={newHashtag}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="hashtags-input"
          placeholder="Введіть хештег і натискайте Enter або +"
        />
        <button
          type="button"
          className="hashtags-btn"
          onClick={handleAddHashtag}
        >
          +
        </button>
      </div>
      <div className="hashtags-list">
        {newsInfo.hashtags.map((hashtag, index) => (
          <div key={index} className="hashtags-item">
            <span className="hashtag-text">#{hashtag}</span>
            <button
              type="button"
              className="delete-hashtag-btn"
              onClick={() => handleDeleteHashtag(index)}
            >
              <Trash color="white" width={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
