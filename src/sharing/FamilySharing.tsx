"use client";

import { useState } from "react";
import { useChecklistMembers } from "@/lib/useChecklistMembers";
import { useLocale } from "@/i18n/LocaleContext";
import { ui } from "@/i18n/ui";

export function FamilySharing({ ownerId }: { ownerId: string }) {
  const { t } = useLocale();
  const { members, invite, remove } = useChecklistMembers(ownerId);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError(null);
    const { error: inviteError } = await invite(email);
    setSending(false);
    if (inviteError) setError(inviteError);
    else setEmail("");
  }

  return (
    <div className="no-print mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t(ui.familySharingTitle)}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(ui.familySharingHelp)}</p>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(ui.emailPlaceholder)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-700 hover:text-teal-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-400"
        >
          {t(ui.inviteButton)}
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {members.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {t(ui.sharedWith)}
          </p>
          <ul className="mt-1 flex flex-col gap-1">
            {members.map((m) => (
              <li key={m} className="flex items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="truncate">{m}</span>
                <button
                  onClick={() => remove(m)}
                  className="flex-shrink-0 text-xs text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                >
                  {t(ui.removeMember)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
