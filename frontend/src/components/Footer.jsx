import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Globe } from "lucide-react";  
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();  // Используем i18n для смены языка
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Русский');  // Состояние для текущего языка

  useEffect(() => {
    // При загрузке компонента проверяем язык в localStorage
    const savedLanguage = localStorage.getItem('language') || 'ru';  // Если языка нет, по умолчанию русский
    if (savedLanguage === 'ru') {
      setSelectedLanguage('Русский');
      i18n.changeLanguage('ru');
    } else {
      setSelectedLanguage('Английский');
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const toggleTheme = () => {
    // Переключаем тему
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);  // Обновляем состояние для переключения иконки
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen); // Переключаем видимость меню языков
  };

  const changeLanguage = (language, langCode) => {
    setSelectedLanguage(language);  // Обновляем выбранный язык
    i18n.changeLanguage(langCode);  // Переключаем язык в i18next
    localStorage.setItem('language', langCode);  // Сохраняем язык в localStorage
    setLanguageMenuOpen(false);  // Закрыть меню после выбора языка
  };

  return (
    <footer className="bg-gray-800 text-white py-8 mt-16 font-mono">
      {/* Верхняя часть футера (смена темы и языка) */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-start items-center space-x-6">
          {/* Блок для смены темы */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 bg-gray-700 text-white hover:bg-gray-600 p-2 rounded-md transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm">
                {isDarkMode ? "Темная" : "Светлая"}
              </span>
            </button>
          </div>

          {/* Блок для смены языка */}
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center space-x-2 bg-gray-700 text-white hover:bg-gray-600 p-2 rounded-md transition-all"
              aria-label="Change language"
            >
              <Globe size={20} />
              <span className="text-sm">{selectedLanguage}</span>{" "}
              {/* Отображаем текущий язык */}
            </button>

            {/* Выпадающий список языков */}
            {languageMenuOpen && (
              <div className="absolute top-8 left-0 bg-gray-700 text-white p-2 rounded-md shadow-lg">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => changeLanguage("Русский", "ru")}
                      className="w-full text-left py-2 px-4 hover:bg-gray-600"
                    >
                      Русский
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage("Английский", "en")}
                      className="w-full text-left py-2 px-4 hover:bg-gray-600"
                    >
                      Английский
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Черта для разделения */}
        <div className="border-t border-gray-700 my-6"></div>
      </div>

      {/* Нижняя часть футера */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Контактная информация */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Контакты</h3>
            <ul>
              <li>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@predictify.com"
                    className="hover:text-gray-400"
                  >
                    info@predictify.com
                  </a>
                </p>
              </li>
              <li>
                <p>Телефон: +1 (800) 123-4567</p>
              </li>
              <li>
                <p>Адрес: ул. Примерная, 123, Москва</p>
                <p>{t("welcome")}</p>
              </li>
            </ul>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Полезные ссылки</h3>
            <ul>
              <li>
                <Link to="/privacy" className="hover:text-gray-400">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-400">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gray-400">
                  Помощь
                </Link>
              </li>
            </ul>
          </div>

          {/* Социальные сети и GitHub */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Социальные сети</h3>
            <div className="mb-4">
              <a
                href="https://Telegram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all block mb-2"
              >
                <i>Telegram</i>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all block mb-2"
              >
                <i>GitHub</i>
              </a>
              <a
                href="https://vk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all block mb-2"
              >
                <i>Vk</i>
              </a>
              
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Predictify. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
