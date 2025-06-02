import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import homeEn from "./locales/en/home.json";
import wikiEn from "./locales/en/wiki.json";
import forecastingEn from "./locales/en/forecasting.json";
import helpEn from "./locales/en/help.json";
import privacyEn from "./locales/en/privacy.json";
import commonEn from "./locales/en/common.json";

import homeRu from "./locales/ru/home.json";
import wikiRu from "./locales/ru/wiki.json";
import forecastingRu from "./locales/ru/forecasting.json";
import helpRu from "./locales/ru/help.json";
import privacyRu from "./locales/ru/privacy.json";
import commonRu from "./locales/ru/common.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: homeEn,
        wiki: wikiEn,
        forecasting: forecastingEn,
        help: helpEn,
        privacy: privacyEn,
        common: commonEn
      },
      ru: {
        home: homeRu,
        wiki: wikiRu,
        forecasting: forecastingRu,
        help: helpRu,
        privacy: privacyRu,
        common: commonRu
      },
    },
    lng: localStorage.getItem("language") || "ru",
    fallbackLng: "en",
    ns: ["home", "wiki", "forecasting", "help", "privacy", "common"],
    defaultNS: "home", 
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;