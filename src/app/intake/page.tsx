"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { intakeQuestions, type AnswerKey, type AnswerValue, type Answers } from "@/data/intakeQuestions";
import { encodeAnswers } from "@/lib/urlState";
import { useLocale } from "@/i18n/LocaleContext";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { ui, format } from "@/i18n/ui";

export default function IntakePage() {
  const router = useRouter();
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const question = intakeQuestions[step];
  const isLast = step === intakeQuestions.length - 1;
  const progress = Math.round(((step + 1) / intakeQuestions.length) * 100);

  function choose(key: AnswerKey, value: AnswerValue) {
    const next = { ...answers, [key]: value };
    setAnswers(next);

    if (isLast) {
      const encoded = encodeAnswers(next);
      router.push(`/checklist?a=${encoded}`);
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <div className="mb-4 flex justify-end">
        <LanguageToggle />
      </div>

      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-teal-700 transition-all dark:bg-teal-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {format(t(ui.questionOf), { current: step + 1, total: intakeQuestions.length })}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{t(question.question)}</h2>
      {question.helpText && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t(question.helpText)}</p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => choose(question.key, opt.value)}
            className="rounded-lg border border-slate-300 px-5 py-3 text-left text-base font-medium text-slate-800 transition hover:border-teal-700 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-100 dark:hover:border-teal-400 dark:hover:bg-slate-800"
          >
            {t(opt.label)}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={goBack}
          className="mt-8 self-start text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {t(ui.back)}
        </button>
      )}
    </main>
  );
}
