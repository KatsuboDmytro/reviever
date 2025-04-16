import { ChangeEvent, FormEvent, useState } from "react";

import { doc, setDoc } from "firebase/firestore";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { showToast } from "../../../../../data/toastNotifications";
import { setAuthors } from "../../../../../features/authSlice";
import { db } from "../../../../../firebase/firebase";
import { Authors } from "../../../../../types/Author";
import { FullWidthButton } from "../../../../components/ui/Button";
import { SocialMediaInput } from "./SocialMediaInput/SocialMediaInput";

export const UserInfo = () => {
  const dispatch = useAppDispatch();
  const { authors } = useAppSelector((state) => state.authors);

  const [formData, setFormData] = useState<Authors>({
    ...authors!,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(setAuthors({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.authors_id) {
        showToast.error("Author ID is missing.");
      }

      const authorsRef = doc(db, "authors", formData.authors_id);
      await setDoc(authorsRef, authors, { merge: true });

      showToast.success("Author data saved successfully!");
    } catch (error) {
      showToast.error(
        `Failed to save author data: ${(error as Error).message}`,
      );
      console.error("Error saving author data:", error);
    }
  };

  return (
    <aside className="user__info">
      <h1>Загальна інформація</h1>
      <form className="user__form" onSubmit={handleSubmit}>
        <div className="user__form-group">
          <label htmlFor="displayName">Відображуване ім'я</label>
          <input
            type="text"
            id="displayName"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="user__form-group">
          <label htmlFor="tag">Тег</label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
          />
        </div>

        <div className="user__form-group">
          <label htmlFor="email">Пошта для зв'язку</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="user__form-group">
          <label htmlFor="phone">Телефон (опціонально)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="user__form-group">
          <label htmlFor="occupation">Рід зайнятості</label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="user__form-group">
          <label htmlFor="address">Адреса (опціонально)</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <SocialMediaInput />

        <div className="user__form-group">
          <label htmlFor="website">Веб-сайт/портфоліо</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="user__form-area">
          <label htmlFor="description">Опис (до 200 символів)</label>
          <textarea
            id="description"
            name="description"
            maxLength={200}
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <FullWidthButton type="submit">Зберегти</FullWidthButton>
      </form>
    </aside>
  );
};
