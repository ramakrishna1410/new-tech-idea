"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useChecklistMembers(ownerId: string | undefined) {
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !ownerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("checklist_members")
      .select("member_email")
      .eq("checklist_owner_id", ownerId);
    setMembers((data ?? []).map((r) => r.member_email as string));
    setLoading(false);
  }, [ownerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function invite(email: string) {
    if (!supabase || !ownerId) return { error: "Not available" };
    const { error } = await supabase
      .from("checklist_members")
      .insert({ checklist_owner_id: ownerId, member_email: email.trim().toLowerCase() });
    if (!error) await refresh();
    return { error: error?.message ?? null };
  }

  async function remove(email: string) {
    if (!supabase || !ownerId) return;
    await supabase.from("checklist_members").delete().eq("checklist_owner_id", ownerId).eq("member_email", email);
    await refresh();
  }

  return { members, loading, invite, remove };
}
