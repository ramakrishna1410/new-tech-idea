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
  /** True when viewing a checklist shared by someone else (read/check-off only, not the owner). */
  isSharedByOther: boolean;
}

/**
 * Mirrors a signed-in user's checklist answers and completed-task state to
 * Supabase so it's available on any device, and resolves family sharing:
 * if this user was invited (see checklist_members) to someone else's
 * checklist and doesn't have their own, they see and check off that shared
 * one instead.
 *
 * Arriving with `a=` in the URL (i.e. just finished the intake flow) always
 * makes this user the owner of a fresh checklist of their own — a
 * deliberate "start fresh" action, not a merge, and not something that
 * silently takes over a checklist they were only a member of.
 */
export function useSavedChecklist(urlAnswers: Answers, hasUrlAnswers: boolean): SavedChecklistState {
  const { session } = useAuth();
  const userId = session?.user.id;
  const userEmail = session?.user.email;
  const [loaded, setLoaded] = useState(false);
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [done, setDoneState] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId || !supabase) {
      setLoaded(true);
      setAnswers(null);
      setDoneState(new Set());
      setOwnerId(null);
      return;
    }

    let cancelled = false;
    setLoaded(false);

    (async () => {
      if (hasUrlAnswers) {
        await supabase!.from("checklists").upsert({ user_id: userId, answers: urlAnswers, done: [] });
        if (!cancelled) {
          setOwnerId(userId);
          setAnswers(urlAnswers);
          setDoneState(new Set());
          setLoaded(true);
        }
        return;
      }

      const { data: ownRow } = await supabase!
        .from("checklists")
        .select("answers, done")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (ownRow) {
        setOwnerId(userId);
        setAnswers(ownRow.answers as Answers);
        setDoneState(new Set((ownRow.done as string[] | undefined) ?? []));
        setLoaded(true);
        return;
      }

      // No checklist of their own — see if they were invited onto a family
      // member's shared checklist.
      const { data: membership } = userEmail
        ? await supabase!
            .from("checklist_members")
            .select("checklist_owner_id")
            .eq("member_email", userEmail)
            .limit(1)
            .maybeSingle()
        : { data: null };

      if (cancelled) return;

      if (!membership) {
        setOwnerId(null);
        setAnswers(null);
        setDoneState(new Set());
        setLoaded(true);
        return;
      }

      const sharedOwnerId = membership.checklist_owner_id as string;
      const { data: sharedRow } = await supabase!
        .from("checklists")
        .select("answers, done")
        .eq("user_id", sharedOwnerId)
        .maybeSingle();

      if (cancelled) return;
      setOwnerId(sharedOwnerId);
      setAnswers((sharedRow?.answers as Answers | undefined) ?? null);
      setDoneState(new Set((sharedRow?.done as string[] | undefined) ?? []));
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, userEmail, hasUrlAnswers, urlAnswers]);

  const saveDone = useCallback(
    (nextDone: Set<string>) => {
      setDoneState(nextDone);
      if (!ownerId || !supabase) return;

      setSaving(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase!.from("checklists").update({ done: [...nextDone] }).eq("user_id", ownerId);
        setSaving(false);
      }, 600);
    },
    [ownerId],
  );

  return { loaded, answers, done, saveDone, saving, isSharedByOther: ownerId !== null && ownerId !== userId };
}
