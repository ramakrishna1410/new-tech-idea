import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * `null` when the app is built without Supabase configured (e.g. a local
 * checkout without the env vars set) — every caller must handle that case
 * so the app degrades to the anonymous, URL-only flow instead of crashing.
 */
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
