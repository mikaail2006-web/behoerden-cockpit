import assert from "node:assert/strict";
import { assertPortalEnv, validatePortalEnv } from "./portal-env.mjs";

const validEnv = {
  SUPABASE_URL: "https://abc.supabase.co",
  SUPABASE_ANON_KEY: "public-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "server-only-key",
  SUPABASE_STORAGE_BUCKET: "behoerden-documents",
  PORTAL_ALLOWED_ORIGIN: "http://127.0.0.1:4173",
  N8N_DOCUMENT_UPLOAD_URL: "https://n8n.mkd-office.de/webhook/document-check"
};

assert.equal(validatePortalEnv(validEnv).ok, true);
assert.deepEqual(validatePortalEnv({}).missing, [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_STORAGE_BUCKET",
  "PORTAL_ALLOWED_ORIGIN"
]);

assert.equal(validatePortalEnv({
  ...validEnv,
  SUPABASE_URL: "https://dein-projekt.supabase.co"
}).ok, false);

assert.doesNotThrow(() => assertPortalEnv(validEnv));
assert.throws(() => assertPortalEnv({}), /Portal-Umgebung/);

console.log("portal-env tests ok");
