"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
  ReactNode,
} from "react";
import { translations, Locale, Translations } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "bn",
  t: translations.bn,
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with Bangla by default, then sync from localStorage after hydration
  const [locale, setLocale] = useState<Locale>("bn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale") as Locale;
      if (saved === "en" || saved === "bn") {
        startTransition(() => setLocale(saved));
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  function toggleLanguage() {
    setLocale((prev) => {
      const next: Locale = prev === "en" ? "bn" : "en";
      try {
        localStorage.setItem("locale", next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
