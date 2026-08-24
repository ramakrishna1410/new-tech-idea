"use client";

import { useRef } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useTaskDocuments } from "./useTaskDocuments";
import { useLocale } from "@/i18n/LocaleContext";
import { ui } from "@/i18n/ui";

export function TaskDocuments({ taskId }: { taskId: string }) {
  const { session, configured } = useAuth();
  const { t } = useLocale();
  const { files, busy, upload, remove, getSignedUrl } = useTaskDocuments(session?.user.id, taskId);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!configured) return null;

  if (!session) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">{t(ui.signInToUpload)}</p>;
  }

  async function openFile(path: string) {
    const url = await getSignedUrl(path);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-700">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {t(ui.myDocuments)}
      </p>

      {files.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {files.map((f) => (
            <li key={f.path} className="flex items-center justify-between gap-2 text-sm">
              <button
                onClick={() => openFile(f.path)}
                className="truncate text-left text-teal-700 underline hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
              >
                {f.name}
              </button>
              <button
                onClick={() => remove(f.path)}
                className="no-print flex-shrink-0 text-xs text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
              >
                {t(ui.deleteFile)}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="no-print mt-2">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="text-xs font-medium text-teal-700 hover:text-teal-800 disabled:opacity-60 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {busy ? t(ui.uploading) : t(ui.uploadDocument)}
        </button>
      </div>
    </div>
  );
}
