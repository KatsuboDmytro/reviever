import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Trash } from "lucide-react";

import { NEWS_EDIT_TEXT_PROMPT } from "../../../../../../../../prompts.ts";
import { AIChatSession } from "../../../../../../../../service/AIModal.ts";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../app/hooks.ts";
import { setNewsInfo } from "../../../../../../../features/newsSlice.ts";
import { News } from "../../../../../../../types/News.ts";
import "./sortableItem.scss";
import { showToast } from "../../../../../../../data/toastNotifications.ts";

interface SortableItemProps {
  id: number;
  type: string;
  children: React.ReactNode;
  value?: string | string[];
  deleteContentItem: (id: number) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  type,
  value,
  children,
  deleteContentItem,
}) => {
  const { newsInfo } = useAppSelector((state) => state.news);
  const [isLoading, setIsLoading] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const dispatch = useAppDispatch();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const generateNormalizedTextWithAI = async () => {
    setIsLoading(true);
    try {
      const PROMPT = NEWS_EDIT_TEXT_PROMPT.replace("{text}", value as string);
      const result = await AIChatSession.sendMessage(PROMPT);
      const aiResponse = result.response.text();

      const updatedContent = newsInfo.content.map((item) =>
        item.id === id ? { ...item, value: aiResponse } : item,
      );

      const updatedNews: News = {
        ...newsInfo,
        content: updatedContent,
      };

      dispatch(setNewsInfo(updatedNews));
    } catch (error) {
      showToast.error("❌ Error while generating AI response:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div className="handle-icons">
        <div className="drag-handle" {...attributes} {...listeners}>
          <GripVertical size={20} />
        </div>
        <div className="delete-handle" onClick={() => deleteContentItem(id)}>
          <Trash size={20} />
        </div>
        {type === "text" && (
          <div className="tooltip-container">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <img
              title={`Improve your text with AI`}
                src="/img/icons/gemini.svg"
                alt="gemini"
                className="tooltip-image"
                onClick={() => generateNormalizedTextWithAI()}
              />
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
