import { ChangeEvent, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks";
import { setAuthors } from "../../../../../../features/authSlice";

const getSocialMediaName = (url: string): string => {
  if (url.includes("t.me")) return "Telegram";
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("youtube.com")) return "YouTube";
  return "Other";
};

export const SocialMediaInput = () => {
  const dispatch = useAppDispatch();
  const { authors } = useAppSelector((state) => state.authors);
  const [socialLink, setSocialLink] = useState("");
  const [socialMedia, setSocialMedia] = useState<{ [key: string]: string }[]>(
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSocialLink(e.target.value);
  };

  const handleAdd = () => {
    if (!socialLink || !authors) return;
    const socialName = getSocialMediaName(socialLink);
    const updatedList = [
      ...(Array.isArray(authors.social_media) ? authors.social_media : []),
      { [socialName]: socialLink },
    ];
    
    setSocialMedia(updatedList);
    dispatch(setAuthors({ ...authors, social_media: updatedList }));
    setSocialLink("");
  };

  const handleRemove = (index: number) => {
    if (!authors) return;
    const updatedList = socialMedia.filter((_, i) => i !== index);

    setSocialMedia(updatedList);
    dispatch(setAuthors({ ...authors, social_media: updatedList }));
  };

  useEffect(() => {
    if (Array.isArray(authors?.social_media)) {
      setSocialMedia(authors.social_media);
    } else {
      setSocialMedia([]);
    }
  }, [authors]);

  return (
    <div className="user__form-group">
      <label htmlFor="social">Соціальні мережі</label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="url"
          id="social"
          name="social_media"
          value={socialLink}
          onChange={handleChange}
          placeholder="https://facebook.com/yourprofile"
        />
        <button
          type="button"
          onClick={handleAdd}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "5px 10px",
          }}
        >
          +
        </button>
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Array.isArray(socialMedia) &&
          socialMedia.map((item, index) => {
            const socialName = Object.keys(item)[0];
            return (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div>
                  <span>{socialName}: </span>
                  <a
                    href={item[socialName]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item[socialName]}
                  </a>
                </div>
                <button
                  type="button"
                  style={{
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    padding: "5px 10px",
                  }}
                  onClick={() => handleRemove(index)}
                >
                  -
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
