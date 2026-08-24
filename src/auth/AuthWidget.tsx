"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { ui, format } from "@/i18n/ui";

export function AuthWidget() {
  const { session, loading, configured, signInWithEmail, signOut } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!configured || loading) return null;

  if (session) {
    return (
      <div className="no-print flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span>{format(t(ui.signedInAs), { email: session.user.email ?? "" })}</span>
        <button
          onClick={() => signOut()}
          className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {t(ui.signOut)}
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError(null);
    const { error: signInError } = await signInWithEmail(email);
    setSending(false);
    if (signInError) setError(signInError);
    else setSent(true);
  }

  if (sent) {
    return <p className="no-print text-sm text-teal-700 dark:text-teal-400">{t(ui.checkYourEmail)}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="no-print flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
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
          {t(ui.sendMagicLink)}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}
