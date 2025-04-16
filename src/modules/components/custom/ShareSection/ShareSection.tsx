import { useState } from "react";
import {
  FaTelegramPlane,
  FaTwitter,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import "./shareSection.scss";

export const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="view__share">
      <span className="view__share-label">Поділитись:</span>

      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Поділитись у Telegram"
      >
        <FaTelegramPlane />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Поділитись у Twitter"
      >
        <FaTwitter />
      </a>

      <a
        href={`https://www.instagram.com/`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>

      <button onClick={handleCopy} aria-label="Скопіювати посилання">
        <FaLink />
      </button>

      {copied && <span className="view__share-copied">Посилання скопійовано!</span>}
    </div>
  );
};
