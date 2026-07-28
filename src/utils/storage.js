import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY = "presupuesto:state";
const STATE_ROW_ID = "default";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function remoteGet() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_state")
    .select("state")
    .eq("id", STATE_ROW_ID)
    .maybeSingle();
  if (error || data?.state == null) return null;
  return typeof data.state === "string" ? data.state : JSON.stringify(data.state);
}

async function remoteSet(value) {
  if (!supabase) return;
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    return;
  }
  await supabase.from("app_state").upsert({
    id: STATE_ROW_ID,
    state: parsed,
    updated_at: new Date().toISOString(),
  });
}

export const storage = {
  async get(key, _shared) {
    if (key !== STORAGE_KEY) return null;
    try {
      const remote = await remoteGet();
      if (remote) return { value: remote };
    } catch {
      // continuar con localStorage
    }
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? { value: local } : null;
    } catch {
      return null;
    }
  },

  async set(key, value, _shared) {
    if (key !== STORAGE_KEY) return;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignorar
    }
    try {
      await remoteSet(value);
    } catch {
      // fallback silencioso
    }
  },
};
