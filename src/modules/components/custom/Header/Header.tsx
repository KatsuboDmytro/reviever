import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { UserButton, useUser } from "@clerk/clerk-react";
import { ChevronDown } from "lucide-react";

import { menuContent, menuItems } from "../../../../vars";
import { BurgerMenu, MainButton } from "../../../index";
import "./header.scss";

export const Header = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<keyof typeof menuContent | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const signIn = () => navigate("/auth/sign-in");

  const getPaddingLeft = () => {
    const index = menuItems.indexOf((activeMenu as string) || "");
    if (index === -1) return 0;
    const baseOffset = 100;
    const itemWidth = 100;
    if (index === menuItems.length - 1) {
      return "auto";
    }
    return baseOffset + index * itemWidth;
  };

  return (
    <header
      className={`header ${expanded ? "expanded" : ""}`}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={`box container ${isVisible ? "visible" : "hidden"}`}>
        <div className="box__logos">
          {/* <img
            src="img/icons/burger.svg"
            alt="burger"
          /> */}
          {isSignedIn && <BurgerMenu />}
          <img src="img/icons/main.svg" alt="Reviever's main logo" />
        </div>
        {isSignedIn && (
          <nav className="box__nav">
            {menuItems.map((item) => (
              <li
                key={item}
                className="box__nav-item"
                onMouseEnter={() => {
                  setExpanded(true);
                  setActiveMenu(item as keyof typeof menuContent);
                }}
              >
                {item} <ChevronDown />
              </li>
            ))}
          </nav>
        )}
        <div className="box__actions">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <MainButton className="box__button" onClick={signIn}>
              Розпочати
            </MainButton>
          )}
        </div>
      </div>
      {expanded && activeMenu && (
        <div
          className="box__dropdown"
          style={{
            top: 100 + window.scrollY,
            paddingLeft: getPaddingLeft(),
            paddingRight: activeMenu === "Для фрілансерів" ? "50px" : "auto",
          }}
        >
          {menuContent[activeMenu].map((col, index) => (
            <div className="dropdown-column" key={index}>
              <h4>{col.title}</h4>
              {col.items.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
