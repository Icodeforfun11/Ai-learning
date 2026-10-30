import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser Supabase client, or null when Supabase isn't configured (the app then stores data locally). */
export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
export const supabaseConfigured = !!supabase;
