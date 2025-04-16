import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Reply,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";

import { useReaction } from "../../../../../app/useReaction";
import { Comment } from "../../../../../types/Comments";

interface CommentNodeProps {
  comment: Comment;
  level: number;
  replies: Comment[];
  postComment: (parent_id: string | null) => void;
  deleteComment: (commentId: string) => void;
  updateComment: (commentId: string, newText: string) => void;
  authorInfo?: {
    display_name: string;
    avatar: string;
  };
  userId: string;
  authorInfoMap?: Record<string, { display_name: string; avatar: string }>;
}

const REPLIES_CHUNK = 5;

export const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  level,
  replies,
  postComment,
  deleteComment,
  updateComment,
  authorInfo,
  authorInfoMap,
  userId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const { likes, dislikes, userReaction, react, loading } = useReaction(
    "comments",
    comment.comment_id,
    userId,
  );

  const toggleReplies = () => {
    if (!isExpanded) {
      setVisibleCount(Math.min(REPLIES_CHUNK, replies.length));
      setIsExpanded(true);
    } else {
      setVisibleCount(0);
      setIsExpanded(false);
    }
  };

  const visibleReplies = replies.slice(0, visibleCount);
  const hiddenRepliesCount = replies.length - visibleReplies.length;

  return (
    <div className="comment-node" style={{ marginLeft: level * 20 }}>
      <div className="comment">
        <div className="avatar-column">
          <img src={authorInfo?.avatar} />
          <div className="vertical-line" />
        </div>

        <div className="content">
          <div className="comment-comment">
            <div className="comment-top">
              <div>
                <strong>{authorInfo?.display_name}</strong> •{" "}
                <small>{comment.date.toLocaleString()}</small>
              </div>
              <div className="actions">
                {comment.author_id === userId && (
                  <>
                    <button
                      onClick={() =>
                        updateComment(
                          comment.comment_id,
                          prompt("Нове повідомлення:", comment.text) ||
                            comment.text,
                        )
                      }
                    >
                      <Pencil />
                    </button>
                    <button onClick={() => deleteComment(comment.comment_id)}>
                      <Trash />
                    </button>
                  </>
                )}
                <button onClick={() => postComment(comment.comment_id)}>
                  <Reply />
                </button>
              </div>
            </div>
            <p className="">{comment.text}</p>
            <div className="reactions">
              <button
                disabled={loading}
                onClick={() => react("like")}
                style={{ color: userReaction === "like" ? "green" : "gray" }}
              >
                <ThumbsUp /> {likes}
              </button>
              <button
                disabled={loading}
                onClick={() => react("dislike")}
                style={{ color: userReaction === "dislike" ? "red" : "gray" }}
              >
                <ThumbsDown /> {dislikes}
              </button>
            </div>
          </div>
        </div>
      </div>

      {visibleReplies.map((reply) => (
        <CommentNode
          key={reply.comment_id}
          comment={reply}
          level={level + 1}
          replies={replies.filter((r) => r.parent_id === reply.comment_id)}
          postComment={postComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          userId={userId}
          authorInfoMap={authorInfoMap}
          authorInfo={
            authorInfoMap?.[comment.author_id] ?? {
              display_name: "Unknown",
              avatar: "",
            }
          }
        />
      ))}

      {replies.length > 0 && (
        <button className="show-replies" onClick={toggleReplies}>
          {isExpanded ? (
            <>
              <ChevronUp /> Згорнути відповіді
            </>
          ) : (
            <>
              <ChevronDown /> Показати відповіді ({replies.length})
            </>
          )}
        </button>
      )}

      {isExpanded && hiddenRepliesCount > 0 && (
        <button
          className="show-replies"
          onClick={() =>
            setVisibleCount((prev) =>
              Math.min(prev + REPLIES_CHUNK, replies.length),
            )
          }
        >
          <ChevronDown /> Показати ще{" "}
          {Math.min(REPLIES_CHUNK, hiddenRepliesCount)} відповіді
        </button>
      )}
    </div>
  );
};
