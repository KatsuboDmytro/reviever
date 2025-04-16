import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { useAppSelector } from "../../../../app/hooks";
import { db } from "../../../../firebase/firebase";
import { getFormattedTimeAndDate } from "../../../../vars";
import { MainButton } from "../../ui/Button";
import "./commentThread.scss";
import { CommentNode } from "./components/CommentNode";
import { useAuthorsInfo } from "../../../../app/useAuthorInfo";

interface Comment {
  comment_id: string;
  parent_id: string | null;
  news_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  text: string;
  date: any;
  likes: number;
  dislikes: number;
}

interface Props {
  newsId: string;
}

export const CommentThread: React.FC<Props> = ({ newsId }) => {
  const { authors } = useAppSelector((state) => state.authors);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const userId = authors?.authors_id;
  const authorIds = comments.map((c) => c.author_id);
  const authorInfoMap = useAuthorsInfo(authorIds);

  useEffect(() => {
    if (!newsId) return;

    const q = query(collection(db, "comments"), where("news_id", "==", newsId));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        comment_id: doc.id,
      })) as Comment[];
      setComments(data);
    });

    return () => unsub();
  }, [newsId]);

  const postComment = async (parent_id: string | null = null) => {
    if (!text.trim()) return;

    await addDoc(collection(db, "comments"), {
      parent_id,
      news_id: newsId,
      author_id: userId,
      text,
      date: getFormattedTimeAndDate(),
      likes: 0,
      dislikes: 0,
    });

    setText("");
  };

  const deleteComment = async (commentId: string) => {
    await deleteDoc(doc(db, "comments", commentId));
  };

  const updateComment = async (commentId: string, newText: string) => {
    await updateDoc(doc(db, "comments", commentId), { text: newText });
  };

  // const reactToComment = async (
  //   commentId: string,
  //   type: "like" | "dislike",
  // ) => {
  //   if (!userId) return;

  //   const reactionRef = doc(db, "comments", commentId, "reactions", userId);
  //   const reactionSnap = await getDoc(reactionRef);

  //   const commentRef = doc(db, "comments", commentId);

  //   if (reactionSnap.exists()) {
  //     const currentType = reactionSnap.data().type;

  //     if (currentType === type) {
  //       await deleteDoc(reactionRef);
  //       await updateDoc(commentRef, {
  //         [type === "like" ? "likes" : "dislikes"]: increment(-1),
  //       });
  //     } else {
  //       await updateDoc(reactionRef, { type });
  //       await updateDoc(commentRef, {
  //         likes: increment(type === "like" ? 1 : -1),
  //         dislikes: increment(type === "dislike" ? 1 : -1),
  //       });
  //     }
  //   } else {
  //     await setDoc(reactionRef, { type });
  //     await updateDoc(commentRef, {
  //       [type === "like" ? "likes" : "dislikes"]: increment(1),
  //     });
  //   }
  // };

  const renderComments = (parent_id: string | null = null, level = 0) => {
    return comments
      .filter((c) => c.parent_id === parent_id)
      .sort((a, b) => b.date.seconds - a.date.seconds)
      .map((comment) => (
        <CommentNode
          key={comment.comment_id}
          comment={comment}
          level={level}
          replies={comments.filter((c) => c.parent_id === comment.comment_id)}
          postComment={postComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          // reactToComment={reactToComment}
          userId={userId!}
          authorInfo={authorInfoMap[comment.author_id]}
          authorInfoMap={authorInfoMap}
        />
      ));
  };

  return (
    <div className="comment-thread">
      <h2>Коментарі</h2>
      <div className="comment-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши коментар..."
          className="comment-input"
        />
        <MainButton onClick={() => postComment(null)} className="comment-send">
          Надіслати
        </MainButton>
      </div>
      <div>{renderComments()}</div>
    </div>
  );
};
