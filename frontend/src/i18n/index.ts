import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    // Map regional codes like "en-US" or "vi-VN" to "en" / "vi"
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // Use a saved choice first, otherwise fall back to the browser language
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "xinchao-lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
