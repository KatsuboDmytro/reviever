import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { News } from "../types/News";

export interface ActionState {
  newsInfo: News;
}

const initialState: ActionState = {
  newsInfo: {
    title: "",
    unchangeable: { date: "", author_id: "" },
    content: [], 
    hashtags: [],
    isPublished: false,
    news_preview: "",
  },
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNewsInfo: (
      state: ActionState,
      action: PayloadAction<News>,
    ) => {
      state.newsInfo = action.payload;
    },
    setFormData: (
      state: ActionState,
      action: PayloadAction<any>,
    ) => {
      state.newsInfo = action.payload;
    },
  },
});

export const { setNewsInfo, setFormData } = newsSlice.actions;

export default newsSlice.reducer;
