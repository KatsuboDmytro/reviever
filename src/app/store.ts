import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import newsReducer from '../features/newsSlice';
import authorsReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    authors: authorsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
/* eslint-enable @typescript-eslint/indent */