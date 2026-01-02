// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.js";
import taTranslation from "../locales/ta.js";

const savedLanguage = localStorage.getItem("language") || "en";

// Immediately apply class (prevents flash)
if (typeof document !== "undefined") {
  if (savedLanguage === "ta") {
    document.body.classList.add("tamil-mode");
  } else {
    document.body.classList.remove("tamil-mode");
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ta: { translation: taTranslation }
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Language change event listener
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  if (lng === "ta") {
    document.body.classList.add("tamil-mode");
  } else {
    document.body.classList.remove("tamil-mode");
  }
});

export default i18n;