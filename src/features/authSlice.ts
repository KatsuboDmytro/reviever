import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { showToast } from "../data/toastNotifications";
import { db } from "../firebase/firebase";
import { Authors } from "../types/Author";
import { setNewsInfo } from "./newsSlice";

export interface ActionState {
  authors: Authors | null;
}

const loadStateFromLocalStorage = (): ActionState => {
  const authors = JSON.parse(localStorage.getItem("authors") || "null");

  return { authors };
};

const saveStateToLocalStorage = (state: ActionState) => {
  localStorage.setItem("authors", JSON.stringify(state.authors));
};

const initialState: ActionState = loadStateFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthors: (state: ActionState, action: PayloadAction<Authors | null>) => {
      state.authors = action.payload;
      saveStateToLocalStorage(state);
    },
    updateAuthorAvatar: (state, action: PayloadAction<string>) => {
      if (state.authors) {
        state.authors.avatar = action.payload;
      }
      saveStateToLocalStorage(state);
    },
    updateAuthorCoverImage: (state, action: PayloadAction<string>) => {
      if (state.authors) {
        state.authors.cover_image = action.payload;
      }
      saveStateToLocalStorage(state);
    },
    init: (state: ActionState) => {
      const loadedState = loadStateFromLocalStorage();
      state.authors = loadedState.authors;
    },
  },
});

export const { setAuthors, updateAuthorAvatar, updateAuthorCoverImage } =
  authSlice.actions;

export default authSlice.reducer;
