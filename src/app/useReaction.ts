import { useCallback, useEffect, useState } from "react";

import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

type ReactionType = "like" | "dislike";
type CollectionType = "comments" | "news";

export const useReaction = (
  collectionName: CollectionType,
  itemId: string,
  userId: string | null,
) => {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemRef = doc(db, collectionName, itemId);
  const reactionRef = doc(
    db,
    collectionName,
    itemId,
    "reactions",
    userId || "unknown",
  );

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const [reactionSnap, itemSnap] = await Promise.all([
        getDoc(reactionRef),
        getDoc(itemRef),
      ]);

      if (reactionSnap.exists()) {
        const type = reactionSnap.data().type as ReactionType;
        setUserReaction(type);
      } else {
        setUserReaction(null);
      }

      if (itemSnap.exists()) {
        const data = itemSnap.data();
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
      }
    } catch (error) {
      console.error(
        `Failed to fetch reactions for ${collectionName} ${itemId}:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [userId, itemId, collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const react = useCallback(
    async (type: ReactionType) => {
      if (!userId || loading) return;
      setLoading(true);

      try {
        const reactionSnap = await getDoc(reactionRef);

        if (reactionSnap.exists()) {
          const currentType = reactionSnap.data().type;
          if (currentType === type) {
            await deleteDoc(reactionRef);
            await updateDoc(itemRef, {
              [type === "like" ? "likes" : "dislikes"]: increment(-1),
            });
            setUserReaction(null);
            type === "like"
              ? setLikes((prev) => prev - 1)
              : setDislikes((prev) => prev - 1);
          } else {
            await updateDoc(reactionRef, { type });
            await updateDoc(itemRef, {
              likes: increment(type === "like" ? 1 : -1),
              dislikes: increment(type === "dislike" ? 1 : -1),
            });
            setUserReaction(type);
            type === "like"
              ? (setLikes((prev) => prev + 1), setDislikes((prev) => prev - 1))
              : (setLikes((prev) => prev - 1), setDislikes((prev) => prev + 1));
          }
        } else {
          await setDoc(reactionRef, { type });
          await updateDoc(itemRef, {
            [type === "like" ? "likes" : "dislikes"]: increment(1),
          });
          setUserReaction(type);
          type === "like"
            ? setLikes((prev) => prev + 1)
            : setDislikes((prev) => prev + 1);
        }
      } catch (error) {
        console.error(
          `Failed to update reaction for ${collectionName} ${itemId}:`,
          error,
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, loading, itemId, collectionName],
  );

  return {
    likes,
    dislikes,
    userReaction,
    loading,
    react,
  };
};
