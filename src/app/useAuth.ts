import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { showToast } from "../data/toastNotifications";
import { setAuthors } from "../features/authSlice";
import { auth, db, googleProvider } from "../firebase/firebase";
import { accessTokenService } from "../services/accessTokenService";
import { Authors } from "../types/Author";
import { useAppDispatch } from "./hooks";
import { v4 as uuidv4 } from "uuid";

const authors = (user: any, avatarUrl: string = ""): Authors => ({
  address: "",
  avatar: avatarUrl || user.photoURL || "",
  description: "",
  display_name: user.email || "",
  email: user.email || "",
  occupation: "",
  phone: "",
  social_media: [],
  cover_image: "",
  tag: "",
  website: "",
  authors_id: user.uid,
  amount_of_following: 0,
  amount_of_followers: 0,
  amount_of_posts: 0,
});

const uploadAvatarToStorage = async (user: any): Promise<string | null> => {
  try {
    const photoURL = user.photoURL;
    if (!photoURL) return null;

    const response = await fetch(photoURL);
    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      console.warn("Not a valid image blob:", blob.type);
      return null;
    }

    const storage = getStorage();
    const ext = blob.type.split("/")[1] || "jpg";
    const filename = `${uuidv4()}.${ext}`;
    const avatarRef = ref(storage, `avatars/${filename}`);

    await uploadBytes(avatarRef, blob);
    const downloadURL = await getDownloadURL(avatarRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
};

// 💾 Зберігає автора в Firestore
const saveAuthorsToDB = async (author: Authors) => {
  try {
    const authorsRef = doc(db, "authors", author.authors_id);
    await setDoc(authorsRef, author, { merge: true });
  } catch (error) {
    showToast.error(
      `Error saving authors to Firestore: ${(error as Error).message}`,
    );
  }
};

// ✅ Головна функція ініціалізації користувача
const initializeUser = async (
  user: any,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  const authorsRef = doc(db, "authors", user.uid);
  const authorsDoc = await getDoc(authorsRef);

  if (authorsDoc.exists()) {
    const existing = authorsDoc.data() as Authors;
    dispatch(setAuthors(existing));
  } else {
    const avatarUrl = await uploadAvatarToStorage(user);
    const newAuthor = authors(user, avatarUrl ?? undefined);
    await saveAuthorsToDB(newAuthor);
    dispatch(setAuthors(newAuthor));
  }
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await initializeUser(user, dispatch);
        const token = await user.getIdToken();
        accessTokenService.save(token);
      } else {
        dispatch(setAuthors(null));
        accessTokenService.remove();
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSignup = useCallback(
    async (email: string, password: string) => {
      if (!email || !password)
        return showToast.error("Email and password are required");
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        await initializeUser(user, dispatch);
        const token = await user.getIdToken();
        accessTokenService.save(token);
        navigate("/news");
        showToast.success("Signup successful");
      } catch (error) {
        showToast.error((error as Error).message);
      }
    },
    [dispatch, navigate],
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      if (!email || !password)
        return showToast.error("Email and password are required");
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        await initializeUser(user, dispatch);
        const token = await user.getIdToken();
        accessTokenService.save(token);
        navigate("/news");
        showToast.success("Login successful");
      } catch (error) {
        showToast.error((error as Error).message);
      }
    },
    [dispatch, navigate],
  );

  const handleGoogleLogin = useCallback(async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      await initializeUser(user, dispatch);
      const token = await user.getIdToken();
      accessTokenService.save(token);
      navigate("/news");
      showToast.success("Google login successful");
    } catch (error) {
      showToast.error((error as Error).message);
    }
  }, [dispatch, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch(setAuthors(null));
      accessTokenService.remove();
      navigate("/login");
      showToast.success("Log out successful");
    } catch (error) {
      showToast.error((error as Error).message);
    }
  }, [dispatch, navigate]);

  return {
    handleSignup,
    handleLogin,
    handleGoogleLogin,
    handleLogout,
  };
};
