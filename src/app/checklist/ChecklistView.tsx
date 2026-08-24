"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildChecklist, type OrderedTask } from "@/lib/buildChecklist";
import { decodeAnswers } from "@/lib/urlState";
import { useSavedChecklist } from "@/lib/useSavedChecklist";
import { estimateChecklist } from "@/lib/estimateChecklist";
import { useLocale } from "@/i18n/LocaleContext";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { ui, format } from "@/i18n/ui";
import { useAuth } from "@/auth/AuthContext";
import { AuthWidget } from "@/auth/AuthWidget";
import { TaskDocuments } from "@/documents/TaskDocuments";
import { FamilySharing } from "@/sharing/FamilySharing";

export default function ChecklistView() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { session, configured } = useAuth();
  const encoded = searchParams.get("a") ?? "";
  const hasUrlAnswers = encoded.length > 0;
  const urlAnswers = useMemo(() => decodeAnswers(encoded), [encoded]);

  const usingAccount = configured && session !== null;
  const saved = useSavedChecklist(urlAnswers, hasUrlAnswers);
  const answers = usingAccount ? (saved.answers ?? {}) : urlAnswers;

  const checklist = useMemo(() => buildChecklist(answers), [answers]);
  const checklistIds = useMemo(() => new Set(checklist.map((t) => t.id)), [checklist]);
  const [localDone, setLocalDone] = useState<Set<string>>(new Set());
  const done = usingAccount ? saved.done : localDone;
  const [expandAll, setExpandAll] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // A task is blocked only by prerequisites that are both (a) still part of
  // this checklist — a prerequisite the user said they already have was
  // filtered out entirely and shouldn't block anything — and (b) not yet
  // checked off.
  function isTaskBlocked(task: OrderedTask) {
    return task.dependsOn.some((depId) => checklistIds.has(depId) && !done.has(depId));
  }

  const nextTask = checklist.find((t) => !done.has(t.id) && !isTaskBlocked(t));
  const doneCount = checklist.filter((t) => done.has(t.id)).length;
  const estimate = useMemo(() => estimateChecklist(checklist), [checklist]);
  // Populated post-mount only — reading window.location during render would
  // diverge between the static HTML and the client, causing a hydration
  // mismatch.
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);

    const resetExpand = () => setExpandAll(false);
    window.addEventListener("afterprint", resetExpand);
    return () => window.removeEventListener("afterprint", resetExpand);
  }, []);

  function toggleDone(id: string) {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);

    if (usingAccount) saved.saveDone(next);
    else setLocalDone(next);
  }

  function handlePrint() {
    setExpandAll(true);
    // Let the expanded task details render before the print dialog opens.
    setTimeout(() => window.print(), 50);
  }

  const whatsappUrl = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(format(t(ui.whatsappMessage), { url: shareUrl }))}`
    : "";

  if (usingAccount && !saved.loaded) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-4 flex justify-end">
          <LanguageToggle />
        </div>
        <p className="text-slate-500 dark:text-slate-400">{t(ui.loadingYourChecklist)}</p>
      </main>
    );
  }

  if (checklist.length === 0) {
    const [noAnswersBefore, noAnswersAfter] = t(ui.noAnswersFound).split("{link}");
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-4 flex justify-end">
          <LanguageToggle />
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          {noAnswersBefore}
          <Link href="/intake" className="text-teal-700 underline dark:text-teal-400">
            {t(ui.startQuestionnaire)}
          </Link>
          {noAnswersAfter}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <AuthWidget />
        <LanguageToggle />
      </div>

      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{t(ui.yourChecklist)}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {format(t(ui.checklistSummary), {
          count: checklist.length,
          plural: checklist.length === 1 ? "" : "s",
        })}
      </p>

      <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/60">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {format(t(ui.estimateSummary), {
            feeMin: estimate.feeMin.toLocaleString("en-IN"),
            feeMax: estimate.feeMax.toLocaleString("en-IN"),
            weeksMin: estimate.weeksMin,
            weeksMax: estimate.weeksMax,
          })}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t(ui.estimateNote)}</p>
      </div>

      {configured && !session && (
        <div className="no-print mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t(ui.signIn)}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(ui.signInHelp)}</p>
        </div>
      )}
      {usingAccount && saved.saving && (
        <p className="no-print mt-2 text-xs text-slate-400 dark:text-slate-500">{t(ui.saving)}</p>
      )}

      {usingAccount && saved.isSharedByOther && (
        <p className="no-print mt-4 rounded-lg border border-teal-200 bg-teal-50/50 p-3 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
          {t(ui.sharedChecklistNotice)}
        </p>
      )}
      {usingAccount && !saved.isSharedByOther && session && <FamilySharing ownerId={session.user.id} />}

      {shareUrl && (
        <div className="no-print mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-700 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-400"
          >
            {t(ui.copyLink)}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-700 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-400"
          >
            {t(ui.shareWhatsapp)}
          </a>
          <button
            onClick={handlePrint}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-700 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-400"
          >
            {t(ui.printPdf)}
          </button>
        </div>
      )}

      <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {format(t(ui.stepsRemaining), { done: doneCount, total: checklist.length })}
        </p>
        <button
          onClick={() => setFocusMode((f) => !f)}
          className="text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {focusMode ? t(ui.showAllSteps) : t(ui.showNextStepOnly)}
        </button>
      </div>

      {focusMode && !nextTask && (
        <p className="mt-6 rounded-lg border border-teal-200 bg-teal-50/50 p-4 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
          {t(ui.allStepsDone)}
        </p>
      )}

      <ol className="mt-4 flex flex-col gap-4">
        {(focusMode ? checklist.filter((t) => t.id === nextTask?.id) : checklist).map((task) => {
          const i = checklist.indexOf(task);
          return (
            <TaskCard
              key={task.id}
              index={i + 1}
              task={task}
              isDone={done.has(task.id)}
              isBlocked={isTaskBlocked(task)}
              forceOpen={expandAll || focusMode}
              onToggle={() => toggleDone(task.id)}
            />
          );
        })}
      </ol>

      <p className="mt-10 text-sm text-slate-400 dark:text-slate-500">{t(ui.disclaimer)}</p>
    </main>
  );
}

function TaskCard({
  index,
  task,
  isDone,
  isBlocked,
  forceOpen,
  onToggle,
}: {
  index: number;
  task: OrderedTask;
  isDone: boolean;
  isBlocked: boolean;
  forceOpen: boolean;
  onToggle: () => void;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const isOpen = open || forceOpen;

  return (
    <li
      className={`rounded-xl border p-5 transition ${
        isDone
          ? "border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/40"
          : isBlocked
            ? "border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900/60"
            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          aria-label={isDone ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
            isDone
              ? "border-teal-700 bg-teal-700 text-white dark:border-teal-500 dark:bg-teal-500"
              : "border-slate-300 text-transparent dark:border-slate-600"
          }`}
        >
          ✓
        </button>

        <div className="flex-1">
          <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {format(t(ui.step), { n: index })}
              {isBlocked && t(ui.waitingOnEarlierStep)}
            </p>
            <h3
              className={`mt-0.5 text-lg font-semibold ${
                isDone
                  ? "text-slate-500 line-through dark:text-slate-500"
                  : "text-slate-900 dark:text-slate-50"
              }`}
            >
              {t(task.title)}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(task.office)}</p>
          </button>

          {isOpen && (
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
              <p>{t(task.instructions)}</p>

              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{t(ui.documentsNeeded)}</p>
                <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-300">
                  {task.documents.map((d) => (
                    <li key={d.en}>{t(d)}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-600 dark:text-slate-300">
                <p><span className="font-medium text-slate-800 dark:text-slate-100">{t(ui.fee)}</span> {t(task.fee)}</p>
                <p><span className="font-medium text-slate-800 dark:text-slate-100">{t(ui.typicalTimeline)}</span> {t(task.timeline)}</p>
              </div>

              {task.portalUrl && (
                <a
                  href={task.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-teal-700 underline hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  {format(t(ui.openPortal), {
                    label: task.portalLabel ? t(task.portalLabel) : t(ui.officialPortalFallback),
                  })}
                </a>
              )}

              <TaskDocuments taskId={task.id} />
            </div>
          )}

          {!isOpen && (
            <button
              onClick={() => setOpen(true)}
              className="no-print mt-2 text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
            >
              {t(ui.showDetails)}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
