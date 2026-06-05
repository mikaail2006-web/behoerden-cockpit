const requiredKeys = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_STORAGE_BUCKET",
  "PORTAL_ALLOWED_ORIGIN"
];

const serverOnlyKeys = [
  "SUPABASE_SERVICE_ROLE_KEY"
];

export function validatePortalEnv(env = process.env) {
  const missing = requiredKeys.filter((key) => !env[key]);
  const placeholders = Object.entries(env)
    .filter(([key, value]) => key.startsWith("SUPABASE_") || key.startsWith("N8N_") || key.startsWith("PORTAL_"))
    .filter(([, value]) => /DEIN_|dein-|NUR_SERVERSEITIG|example/.test(String(value || "")))
    .map(([key]) => key);

  return {
    ok: missing.length === 0 && placeholders.length === 0,
    missing,
    placeholders,
    serverOnlyKeys
  };
}

export function assertPortalEnv(env = process.env) {
  const result = validatePortalEnv(env);
  if (result.ok) return result;

  const error = new Error("Portal-Umgebung ist nicht vollstaendig konfiguriert");
  error.details = result;
  throw error;
}
