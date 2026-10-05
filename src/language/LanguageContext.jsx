import { createContext, useContext, useState, useEffect } from 'react';
import { translations, SUPPORTED_LANGUAGES } from './translations.js';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'addisEats.language';
const VALID_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_CODES.includes(stored) ? stored : 'eng';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  // Falls back to English, then to the raw key, so a missing translation
  // never crashes the UI or renders "undefined" — it just shows English
  // or the key itself as a visible signal something needs translating.
  function t(key) {
    return translations[lang]?.[key] ?? translations.eng[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return ctx;
}