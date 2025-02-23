// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Подключаем переводы для разных языков
import enTranslation from "./locales/en/translation.json";
import ruTranslation from "./locales/ru/translation.json";

// src/i18n.js
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
    lng: localStorage.getItem('language') || 'ru', // Чтение языка из localStorage
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Следим за изменениями языка и сохраняем его в localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;



