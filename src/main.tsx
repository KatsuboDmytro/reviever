import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";

import { App } from "./App.tsx";
import { store } from "./app/store.ts";
import {
  AIHelp,
  EditNews,
  HomePage,
  NewsConstructor,
  NewsPage,
  SettingsPage,
  SignInPage,
  SignUpPage,
  UserSetting,
  ViewPage,
} from "./modules/index.ts";
import "./styles/index.scss";
import "./styles/normalize.scss";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/settings",
        element: <SettingsPage />,
        children: [
          { path: "", element: <UserSetting /> },
          { path: "ai", element: <AIHelp /> },
          {
            path: "news",
            element: <NewsConstructor />,
          },
        ],
      },
      { path: "news/:newsId/edit", element: <EditNews /> },
      { path: "news", element: <NewsPage /> },
      { path: "news/:newsId/view", element: <ViewPage /> },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/auth/sign-up",
    element: <SignUpPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
      <ToastContainer theme="dark" />
      <RouterProvider router={router} />
      {/* </ClerkProvider> */}
    </Provider>
  </StrictMode>,
);
