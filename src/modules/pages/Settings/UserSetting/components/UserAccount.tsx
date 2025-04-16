import { useRef, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Camera } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  updateAuthorAvatar,
  updateAuthorCoverImage,
} from "../../../../../features/authSlice";
import { db, storage } from "../../../../../firebase/firebase";
import { DEFAULT_AVATAR } from "../../../../../vars";
import { showToast } from "../../../../../data/toastNotifications";
import { doc, setDoc } from "firebase/firestore";

const DEFAULT_COVER_IMAGE = "https://i.postimg.cc/vm583vj0/cover-img.png";

export const UserAccount = () => {
  const { authors } = useAppSelector((state) => state.authors);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const displayAvatar = authors?.avatar?.startsWith(
    "https://lh3.googleusercontent.com/",
  )
    ? DEFAULT_AVATAR
    : authors?.avatar || "/img/icons/account.svg";

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || !authors) return;
    const file = event.target.files[0];

    try {
      if (authors.avatar && authors.avatar.includes("firebasestorage")) {
        const decodedURL = decodeURIComponent(
          authors.avatar.split("?")[0].split("/o/")[1],
        );
        const oldRef = ref(storage, decodedURL);
        try {
          await deleteObject(oldRef);
        } catch (err: any) {
          if (err.code !== "storage/object-not-found") {
            throw err;
          }
        }
      }

      const storagePath = `avatars/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      dispatch(updateAuthorAvatar(downloadURL));

      const updatedAuthor = { ...authors, avatar: downloadURL };
      if (!authors.authors_id) {
        showToast.error("Author ID is missing.");
        return;
      }

      const authorRef = doc(db, "authors", authors.authors_id);
      await setDoc(authorRef, updatedAuthor, { merge: true });

      showToast.success("Avatar saved successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showToast.error("Failed to upload avatar");
    }
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !authors) {
      dispatch(updateAuthorCoverImage(DEFAULT_COVER_IMAGE));
      return;
    }

    const file = event.target.files[0];

    try {
      if (
        authors.cover_image &&
        authors.cover_image.includes("firebasestorage")
      ) {
        const decodedURL = decodeURIComponent(
          authors.cover_image.split("?")[0].split("/o/")[1]
        );
        const oldRef = ref(storage, decodedURL);
        try {
          await deleteObject(oldRef);
        } catch (err: any) {
          if (err.code !== "storage/object-not-found") {
            throw err;
          }
        }
      }

      const storagePath = `covers/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      dispatch(updateAuthorCoverImage(downloadURL));

      const updatedAuthor = { ...authors, cover_image: downloadURL };
      if (!authors.authors_id) {
        showToast.error("Author ID is missing.");
        return;
      }

      const authorRef = doc(db, "authors", authors.authors_id);
      await setDoc(authorRef, updatedAuthor, { merge: true });

      showToast.success("Cover image saved successfully!");
    } catch (error) {
      console.error("Error updating cover image:", error);
      dispatch(updateAuthorCoverImage(DEFAULT_COVER_IMAGE));
      showToast.error("Failed to upload cover image. Default applied.");
    }
  };

  return (
    <aside className="user__account">
      <div className="user__top">
        <div className="user__account-cover-wrapper">
          <img
            src={authors?.cover_image || DEFAULT_COVER_IMAGE}
            alt="cover_img"
            className="user__account-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COVER_IMAGE;
              dispatch(updateAuthorCoverImage(DEFAULT_COVER_IMAGE));
            }}
          />
          <div className="cover__camera" onClick={handleCoverClick}>
            <Camera size={24} color="#fff" />
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverFileChange}
          />
        </div>

        <div
          className="user__account-avatar-wrapper"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={displayAvatar}
            alt="user"
            className="user__account-user"
            onClick={handleAvatarClick}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
              dispatch(updateAuthorAvatar(DEFAULT_AVATAR));
            }}
          />
          {isHovering && (
            <div className="user__account-camera" onClick={handleAvatarClick}>
              <Camera size={24} />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className="user__account-name">
          <h2>{authors?.display_name}</h2>
          <span>{authors?.occupation} | </span>
          <span>@{authors?.tag?.replace(/\s+/g, "_")}</span>
        </div>

        <div className="user__account-info">
          <div className="user__account-info-item">
            <span>Дописи</span>
            <span>{authors?.amount_of_posts}</span>
          </div>
          <div className="user__account-info-item">
            <span>Читачі</span>
            <span>{authors?.amount_of_followers}</span>
          </div>
          <div className="user__account-info-item">
            <span>Відстежуються</span>
            <span>{authors?.amount_of_following}</span>
          </div>
        </div>

        <div className="user__account-description">
          <h4 className="user__account-description-title">Про мене</h4>
          <p className="user__account-description-text">
            {authors?.description}
          </p>
        </div>
      </div>

      <div className="user__account-contacts">
        <span>{authors?.email}</span>
        <span>{authors?.phone}</span>
        <div className="user__account-contacts-socials">
          {authors?.social_media?.map((socialItem, index) => {
            const socialName = Object.keys(socialItem)[0];
            const socialLink = socialItem[socialName];
            return (
              <a
                href={typeof socialLink === "string" ? socialLink : "#"}
                target="_blank"
                rel="noopener noreferrer"
                key={`${socialName}-${index}`}
              >
                <img src={`/img/icons/${socialName}.svg`} alt={socialName} />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
