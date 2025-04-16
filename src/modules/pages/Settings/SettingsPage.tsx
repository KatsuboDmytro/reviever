import { NavLink, Outlet } from "react-router";
import { Bookmark, Bot, Heart, Newspaper, SaveIcon } from "lucide-react";

import "./settings.scss";
import { useAppSelector } from "../../../app/hooks";

export const SettingsPage = () => {
  const { authors } = useAppSelector((state) => state.authors);

  const displayAvatar = authors?.avatar?.startsWith(
    "https://lh3.googleusercontent.com/",
  )
    ? "https://i.postimg.cc/3dPhnM8L/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg"
    : authors?.avatar || "/img/icons/account.svg";

  return (
    <section className="settings">
      <aside className="settings__navbar">
        <ul className="settings__navbar-list">
          <NavLink to="/settings" end>
            {({ isActive }) => (
              <li
                className={`settings__navbar-user ${isActive ? "active" : ""}`}
              >
                <img
                  src={displayAvatar}
                  alt={`${authors?.display_name}'s image`}
                  className="settings__navbar-user-image"
                />
                <span>{authors?.display_name}</span>
              </li>
            )}
          </NavLink>
          <li className="settings__navbar-items">
            <ul className="settings__navbar-list">
              <h3 className="settings__navbar-title">Налаштування</h3>
              <NavLink to="/settings/ai">
                {({ isActive }) => (
                  <li
                    className={`settings__navbar-item ${isActive ? "active" : ""}`}
                  >
                    <Bot />
                    <span>AI-рекомендації</span>
                  </li>
                )}
              </NavLink>
              <NavLink to="/settings/news">
                {({ isActive }) => (
                  <li
                    className={`settings__navbar-item ${isActive ? "active" : ""}`}
                  >
                    <Newspaper />
                    <span>Конструктор новин</span>
                  </li>
                )}
              </NavLink>
              <NavLink to="/settings/saved">
                {({ isActive }) => (
                  <li
                    className={`settings__navbar-item ${isActive ? "active" : ""}`}
                  >
                    <Bookmark />
                    <span>Збережені</span>
                  </li>
                )}
              </NavLink>
              <NavLink to="/settings/liked">
                {({ isActive }) => (
                  <li
                    className={`settings__navbar-item ${isActive ? "active" : ""}`}
                  >
                    <Heart />
                    <span>Вподобані</span>
                  </li>
                )}
              </NavLink>
            </ul>
          </li>
        </ul>
      </aside>
      <main className="settings__dashboard container">
        <Outlet />
      </main>
    </section>
  );
};
