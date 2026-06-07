import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the public Supabase env vars are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && anonKey);
}

function assert(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.local.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/**
 * Public (anon) client — safe for reads. Subject to Row Level Security.
 * Use this in Server Components / public catalog pages.
 */
export function getPublicClient(): SupabaseClient {
  return createClient(assert(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assert(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

/**
 * Admin (service role) client — bypasses Row Level Security.
 * SERVER ONLY. Never import this into a Client Component.
 * Used by the dashboard API routes after the admin password check passes.
 */
export function getAdminClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(assert(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assert(serviceKey, "SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}
