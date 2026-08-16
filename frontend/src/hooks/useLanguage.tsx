import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANGUAGE,
  getCopy,
  loadLanguage,
  saveLanguage,
  type Language,
  type UiCopy,
} from "../lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: UiCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadLanguage);

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.lang = language === "tr" ? "tr" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      copy: getCopy(language),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => undefined,
      copy: getCopy(DEFAULT_LANGUAGE),
    };
  }
  return context;
}

export function useCopy(): UiCopy {
  return useLanguage().copy;
}
