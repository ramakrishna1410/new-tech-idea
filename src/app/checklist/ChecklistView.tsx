"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buildChecklist, type OrderedTask } from "@/lib/buildChecklist";
import { decodeAnswers } from "@/lib/urlState";

export default function ChecklistView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("a") ?? "";
  const answers = useMemo(() => decodeAnswers(encoded), [encoded]);
  const checklist = useMemo(() => buildChecklist(answers), [answers]);
  const [done, setDone] = useState<Set<string>>(new Set());

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (checklist.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-slate-600 dark:text-slate-300">
          No answers found. <Link href="/intake" className="text-teal-700 underline dark:text-teal-400">Start the questionnaire</Link> to build your checklist.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Your checklist</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {checklist.length} step{checklist.length === 1 ? "" : "s"} based on your answers, ordered so
        each step's prerequisites come first. Bookmark or share this page's link to come back to it —
        nothing is stored on our servers.
      </p>

      {shareUrl && (
        <button
          onClick={() => navigator.clipboard?.writeText(shareUrl)}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-700 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-400"
        >
          Copy link to this checklist
        </button>
      )}

      <ol className="mt-8 flex flex-col gap-4">
        {checklist.map((task, i) => (
          <TaskCard
            key={task.id}
            index={i + 1}
            task={task}
            isDone={done.has(task.id)}
            isBlocked={task.blockedBy.some((id) => !done.has(id))}
            onToggle={() => toggleDone(task.id)}
          />
        ))}
      </ol>

      <p className="mt-10 text-sm text-slate-400 dark:text-slate-500">
        This is general guidance based on publicly available Tamil Nadu procedures and does not
        replace legal advice. Requirements and fees can vary by district — confirm with the
        relevant office before relying on this list.
      </p>
    </main>
  );
}

function TaskCard({
  index,
  task,
  isDone,
  isBlocked,
  onToggle,
}: {
  index: number;
  task: OrderedTask;
  isDone: boolean;
  isBlocked: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

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
              Step {index}
              {isBlocked && " · Waiting on an earlier step"}
            </p>
            <h3
              className={`mt-0.5 text-lg font-semibold ${
                isDone
                  ? "text-slate-500 line-through dark:text-slate-500"
                  : "text-slate-900 dark:text-slate-50"
              }`}
            >
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.office}</p>
          </button>

          {open && (
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
              <p>{task.instructions}</p>

              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">Documents needed</p>
                <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-300">
                  {task.documents.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-600 dark:text-slate-300">
                <p><span className="font-medium text-slate-800 dark:text-slate-100">Fee:</span> {task.fee}</p>
                <p><span className="font-medium text-slate-800 dark:text-slate-100">Typical timeline:</span> {task.timeline}</p>
              </div>

              {task.portalUrl && (
                <a
                  href={task.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-teal-700 underline hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Open {task.portalLabel ?? "official portal"} ↗
                </a>
              )}
            </div>
          )}

          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="mt-2 text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Show details →
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
