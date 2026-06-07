import { isSupabaseConfigured } from "../supabase";
import { localStore } from "./localStore";
import { supabaseStore } from "./supabaseStore";
import type { Store } from "./types";

export type { Store } from "./types";
export { StoreError } from "./types";

/**
 * The single cutover point between backends:
 * - Supabase when credentials are present (production),
 * - the local JSON file store otherwise (dev / before wiring the backend).
 */
export function getStore(): Store {
  return isSupabaseConfigured() ? supabaseStore : localStore;
}
