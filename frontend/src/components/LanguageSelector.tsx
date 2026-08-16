import { useLanguage } from "../hooks/useLanguage";
import type { Language } from "../lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage, copy } = useLanguage();

  function select(next: Language) {
    if (next === language) return;
    setLanguage(next);
  }

  const buttonClass = (active: boolean) =>
    `min-h-9 min-w-9 rounded-lg px-2.5 text-xs font-medium tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
      active
        ? "bg-slate-800 text-white"
        : "text-slate-500 hover:text-slate-300"
    }`;

  return (
    <div
      role="group"
      aria-label={copy.chrome.languageGroupLabel}
      className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-0.5"
    >
      <button
        type="button"
        className={buttonClass(language === "en")}
        aria-pressed={language === "en"}
        onClick={() => select("en")}
      >
        {copy.chrome.englishShort}
      </button>
      <button
        type="button"
        className={buttonClass(language === "tr")}
        aria-pressed={language === "tr"}
        onClick={() => select("tr")}
      >
        {copy.chrome.turkishShort}
      </button>
    </div>
  );
}
