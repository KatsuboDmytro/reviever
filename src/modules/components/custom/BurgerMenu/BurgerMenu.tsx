import React, { useEffect, useState } from "react";

import { menuContent, menuItems } from "../../../../vars";
import "./burgerMenu.scss";

type MenuItem = {
  title: string;
  items: string[];
};

type MenuContent = {
  [key: string]: MenuItem[];
};

export const BurgerMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("overflow-hidden", !menuOpen);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen) {
        const menuContainer = document.getElementById("menu-container");
        if (menuContainer && !menuContainer.contains(event.target as Node)) {
          setMenuOpen(false);
          document.body.classList.remove("overflow-hidden");
        }
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div id="menu-container">
      <div id="menu-wrapper" onClick={toggleMenu}>
        <div id="hamburger-menu" className={menuOpen ? "open" : ""}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <ul className={`menu-list accordion ${menuOpen ? "active" : ""}`}>
        {menuItems.map((menuItem, index) => (
          <li
            key={menuItem}
            id={`nav${index + 1}`}
            className={`toggle accordion-toggle ${activeAccordion === `nav${index + 1}` ? "active-tab" : ""}`}
            onClick={() => toggleAccordion(`nav${index + 1}`)}
          >
            <span
              className={
                activeAccordion === `nav${index + 1}`
                  ? "icon-minus"
                  : "icon-plus"
              }
            ></span>
            <a
              className={`menu-link ${activeAccordion === `nav${index + 1}` ? "active" : ""}`}
              href="#"
            >
              {menuItem}
            </a>
            {menuContent[menuItem as keyof MenuContent] && (
              <ul
                className={`menu-submenu accordion-content ${activeAccordion === `nav${index + 1}` ? "open" : ""}`}
              >
                {menuContent[menuItem as keyof MenuContent].map((submenu) => (
                  <li key={submenu.title} className="submenu-box">
                    <a className="head" href="#">
                      {submenu.title}
                    </a>
                    <ul>
                      {submenu.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="subhead-box">
                          <a className="subhead" href="#">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
