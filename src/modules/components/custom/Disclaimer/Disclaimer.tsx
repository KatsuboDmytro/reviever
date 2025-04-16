import { FormEvent, useState } from "react";

import emailjs from "@emailjs/browser";

import "./disclaimer.scss";

interface DisclaimerProps {
  authorMail: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ authorMail }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleToggle = () => {
    setShowForm((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const templateParams = {
      message,
      to_email: `support@reviever.tech, ${authorMail}`,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY,
      )
      .then(() => {
        setStatus("success");
        setMessage("");
        setTimeout(() => setStatus("idle"), 3000);
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setStatus("error");
      });
  };

  return (
    <div className="disclaimer">
      <p>
        <strong>Увага!</strong> Контент створюється за допомогою штучного
        інтелекту та проходить модерацію журналістами. Споживайте інформацію
        відповідально. Якщо ви помітили недостовірні дані — повідомте про це
        редакції або автору.
      </p>

      <button className="disclaimer__btn" onClick={handleToggle}>
        Повідомити редакцію
      </button>

      {showForm && (
        <form className="disclaimer__form" onSubmit={handleSubmit}>
          <label htmlFor="message">Ваше повідомлення:</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Опишіть, яку саме інформацію ви вважаєте неправдивою..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <input
            type="submit"
            value="Надіслати"
            disabled={status === "sending"}
          />
          {status === "success" && (
            <span className="success">Повідомлення надіслано ✅</span>
          )}
          {status === "error" && (
            <span className="error">Сталася помилка при надсиланні ❌</span>
          )}
        </form>
      )}
    </div>
  );
};
