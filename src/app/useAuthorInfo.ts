import { useEffect, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/firebase";

export interface AuthorInfo {
  display_name: string;
  avatar: string;
}

export const useAuthorsInfo = (authorIds: string[]) => {
  const [authorInfoMap, setAuthorInfoMap] = useState<
    Record<string, AuthorInfo>
  >({});

  useEffect(() => {
    if (authorIds.length === 0) return;

    const uniqueIds = Array.from(new Set(authorIds));
    const unsubscribes = uniqueIds.map((authorId) => {
      const ref = doc(db, "authors", authorId);

      return onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setAuthorInfoMap((prev) => ({
            ...prev,
            [authorId]: docSnap.data() as AuthorInfo,
          }));
        }
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [authorIds]);

  return authorInfoMap;
};
