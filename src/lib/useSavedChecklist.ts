"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Answers } from "@/data/intakeQuestions";

interface SavedChecklistState {
  /** True once the initial DB read (or the "not signed in" no-op) has settled. */
  loaded: boolean;
  /** null when there is nothing saved yet for this account. */
  answers: Answers | null;
  done: Set<string>;
  saveDone: (done: Set<string>) => void;
  saving: boolean;
}

/**
 * Mirrors a signed-in user's checklist answers and completed-task state to
 * Supabase so it's available on any device. Arriving with `a=` in the URL
 * (i.e. just finished the intake flow) always overwrites the saved
 * checklist — that's a deliberate "start fresh" action, not a merge.
 * Arriving without it loads whatever was last saved.
 */
export function useSavedChecklist(urlAnswers: Answers, hasUrlAnswers: boolean): SavedChecklistState {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [loaded, setLoaded] = useState(false);
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [done, setDoneState] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId || !supabase) {
      setLoaded(true);
      setAnswers(null);
      setDoneState(new Set());
      return;
    }

    let cancelled = false;
    setLoaded(false);

    (async () => {
      if (hasUrlAnswers) {
        await supabase!.from("checklists").upsert({ user_id: userId, answers: urlAnswers, done: [] });
        if (!cancelled) {
          setAnswers(urlAnswers);
          setDoneState(new Set());
          setLoaded(true);
        }
        return;
      }

      const { data } = await supabase!
        .from("checklists")
        .select("answers, done")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;
      setAnswers((data?.answers as Answers | undefined) ?? null);
      setDoneState(new Set((data?.done as string[] | undefined) ?? []));
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, hasUrlAnswers, urlAnswers]);

  const saveDone = useCallback(
    (nextDone: Set<string>) => {
      setDoneState(nextDone);
      if (!userId || !supabase) return;

      setSaving(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase!.from("checklists").update({ done: [...nextDone] }).eq("user_id", userId);
        setSaving(false);
      }, 600);
    },
    [userId],
  );

  return { loaded, answers, done, saveDone, saving };
}
