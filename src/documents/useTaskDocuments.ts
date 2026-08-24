import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface StoredDocument {
  name: string;
  path: string;
}

const BUCKET = "documents";

/**
 * Lists/uploads/deletes files for one task, scoped to the signed-in user's
 * own folder (`${userId}/${taskId}/...`) — enforced both by this path
 * convention and by the storage.objects RLS policy in supabase/schema.sql.
 */
export function useTaskDocuments(userId: string | undefined, taskId: string) {
  const [files, setFiles] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const folder = userId ? `${userId}/${taskId}` : null;

  const refresh = useCallback(async () => {
    if (!supabase || !folder) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.storage.from(BUCKET).list(folder);
    setFiles((data ?? []).map((f) => ({ name: f.name, path: `${folder}/${f.name}` })));
    setLoading(false);
  }, [folder]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function upload(file: File) {
    if (!supabase || !folder) return;
    setBusy(true);
    await supabase.storage.from(BUCKET).upload(`${folder}/${file.name}`, file, { upsert: true });
    setBusy(false);
    await refresh();
  }

  async function remove(path: string) {
    if (!supabase) return;
    setBusy(true);
    await supabase.storage.from(BUCKET).remove([path]);
    setBusy(false);
    await refresh();
  }

  async function getSignedUrl(path: string) {
    if (!supabase) return null;
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    return data?.signedUrl ?? null;
  }

  return { files, loading, busy, upload, remove, getSignedUrl };
}
