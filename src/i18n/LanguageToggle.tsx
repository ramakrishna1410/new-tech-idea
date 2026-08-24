"use client";

import { useLocale } from "./LocaleContext";
import { ui } from "./ui";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className={`no-print flex items-center gap-2 text-sm ${className}`}>
      <span className="text-slate-400 dark:text-slate-500">{t(ui.languageToggleLabel)}:</span>
      <div className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setLocale("en")}
          className={`px-3 py-1 font-medium transition ${
            locale === "en"
              ? "bg-teal-700 text-white dark:bg-teal-600"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLocale("ta")}
          className={`px-3 py-1 font-medium transition ${
            locale === "ta"
              ? "bg-teal-700 text-white dark:bg-teal-600"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}
