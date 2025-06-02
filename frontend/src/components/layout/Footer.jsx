import { Link } from "react-router-dom";
import { Sun, Moon, Globe, Github } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import createI18nText from "../../i18n/createI18nText";


const I18nNamespace = "common";
const I18nText = createI18nText(I18nNamespace);

export default function Footer() {
  // useTranslation(I18nNamespace);
  const { t, i18n } = useTranslation(I18nNamespace);
  const { theme, toggleTheme } = useTheme();
  const languageMenuRef = useRef(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");

  useEffect(() => {
    // Проверяем сохранённый язык
    const savedLanguage = localStorage.getItem("language") || "ru";
    setSelectedLanguage(savedLanguage === "ru" ? "Русский" : "English");
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const changeLanguage = (language, langCode) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setLanguageMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer className={`
      ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-200 text-gray-900"} 
      py-6 mt-16 font-mono shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.1)] z-1 relative
    `} >
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-start items-center space-x-6">
      {/* Переключатель темы */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className={`
            flex items-center space-x-2 p-2 rounded-md transition-all
            ${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-300 text-black hover:bg-[#B7BCC5]"}
          `}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          <span className="text-sm">{theme === "dark" ? t("footer.dark") : t("footer.light") }</span>
        </button>
      </div>

      {/* Переключатель языка */}
      <div className="flex items-center space-x-2 relative" ref={languageMenuRef}>
        <button
          onClick={toggleLanguageMenu}
          className={`
            flex items-center space-x-2 p-2 rounded-md transition-all
            ${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-300 text-black hover:bg-[#B7BCC5]"}
          `}
          aria-label="Change language"
        >
          <Globe size={20} />
          <span className="text-sm">{selectedLanguage}</span>
        </button>

        {languageMenuOpen && (
          <div className={`
            absolute top-8 left-0 p-2 rounded-md shadow-lg
            ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"}
          `}>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => changeLanguage("Русский", "ru")}
                  className={`
                    w-full text-left py-2 px-4 transition-all
                    ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-400"}
                  `}
                >
                  Русский
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage("English", "en")}
                  className={`
                    w-full text-left py-2 px-4 transition-all
                    ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-400"}
                  `}
                >
                  English
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>

    <div className={`
      border-t my-6
      ${theme === "dark" ? "border-gray-700" : "border-gray-400"}
    `}></div>
  </div>

  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {/* Контактная информация */}
      <div>
        <h3 className="text-xl font-semibold mb-3">
          <I18nText textKey={"footer.contacts"}/>
        </h3>
        <ul>
          <li>
            <p>
              Email:{" "}
              <a href="mailto:info@predictify.com" className={`
                transition-all
                ${theme === "dark" ? "hover:text-gray-400" : "hover:text-gray-600"}
              `}>
                project.predictify@proton.me
              </a>
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        {/* Полезные ссылки */}
        <h3 className="text-xl font-semibold mb-3">
          <I18nText textKey={"footer.helpful-links"}/>
        </h3>
        <ul>
          <li>
            <Link to="/privacy" className={`
              transition-all
              ${theme === "dark" ? "hover:text-gray-400" : "hover:text-gray-600"}
            `}>
              <I18nText textKey={"footer.privacy"}/>
            </Link>
          </li>
          <li>
            <Link to="/help" className={`
              transition-all
              ${theme === "dark" ? "hover:text-gray-400" : "hover:text-gray-600"}
            `}>
              <I18nText textKey={"footer.help"}/>
            </Link>
          </li>
        </ul>
      </div>

      {/* Социальные сети */}
      <div>
        <h3 className="text-xl font-semibold mb-3">
          <I18nText textKey={"footer.social"}/>
        </h3>
        <ul>
          <li>
             <a
                href="https://github.com/gbaka/Predictify"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center mb-2 transition-all
                  ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}
                `}
              >
                <Github size={20} className="mr-2" />
                GitHub
              </a>
          </li>
        </ul>
      </div>
    </div>

    <div className={`
      border-t mt-8 pt-4 text-center text-sm
      ${theme === "dark" ? "border-gray-700" : "border-gray-400"}
    `}>
      <p>&copy; {new Date().getFullYear()} Predictify. {t("footer.rights")}</p>
    </div>
  </div>
</footer>
  );
}
