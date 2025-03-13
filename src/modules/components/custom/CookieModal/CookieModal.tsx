import React, { useState } from "react";

import "./cookieModal.scss";

export const CookieModal: React.FC = () => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
  };
  const handleDecline = () => {
    setVisible(false);
  };

  const handleSettings = () => {
    alert("Налаштування cookie");
  };

  if (!visible) return null;

  return (
    <div className="cookie-modal">
      <p className="cookie-text">
        Ми використовуємо файли cookie для надання, покращення, захисту та
        просування наших послуг. Перегляньте нашу{" "}
        <span className="cookie-links">
          <a href="/privacy-policy">Політику конфіденційності</a>
        </span>{" "}
        та{" "}
        <span className="cookie-links">
          <a href="/faq">Поширені запитання щодо політики конфіденційності</a>
        </span>
        , щоб отримати докладнішу інформацію. Ви можете керувати особистими
        вподобаннями, зокрема параметром «Не продавати й не передавати мої
        особисті дані третім сторонам», за допомогою розташованої нижче кнопки
        «Налаштувати файли cookie».
      </p>
      <div className="cookie-buttons">
        <button className="settings" onClick={handleSettings}>
          Налаштувати файли cookie
        </button>
        <button className="decline" onClick={handleDecline}>
          Відхилити
        </button>
        <button className="accept" onClick={handleAccept}>
          Прийняти
        </button>
      </div>
    </div>
  );
};
