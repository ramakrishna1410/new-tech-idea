"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { ui } from "@/i18n/ui";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-8 flex justify-end">
        <LanguageToggle />
      </div>
      <p className="text-sm font-medium text-teal-700 dark:text-teal-400">{t(ui.tagline)}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        {t(ui.heroTitle)}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{t(ui.heroBody)}</p>
      <div className="mt-8">
        <Link
          href="/intake"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-medium text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {t(ui.startButton)}
        </Link>
      </div>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{t(ui.heroFootnote)}</p>
    </main>
  );
}
