import assert from "node:assert/strict";
import { createSupabaseProfileLoader } from "./supabase-profile-loader.mjs";

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
    text: async () => JSON.stringify(payload)
  };
}

const calls = [];
const fetchMock = async (url, options) => {
  calls.push({ url, options });
  if (url.endsWith("/auth/v1/user")) {
    return jsonResponse({ id: "user-1", email: "kunde-test@example.de" });
  }
  if (url.includes("/rest/v1/profiles")) {
    return jsonResponse([{
      id: "user-1",
      tenant_id: "tenant-1",
      full_name: "Kunde Test",
      role: "kunde"
    }]);
  }
  return jsonResponse({ error: "not found" }, 404);
};

const loadProfile = createSupabaseProfileLoader({
  supabaseUrl: "https://abc.supabase.co/",
  anonKey: "anon-key"
}, fetchMock);

const profile = await loadProfile("access-token");

assert.deepEqual(profile, {
  id: "user-1",
  tenantId: "tenant-1",
  role: "kunde",
  fullName: "Kunde Test",
  email: "kunde-test@example.de"
});

assert.equal(calls.length, 2);
assert.equal(calls[0].url, "https://abc.supabase.co/auth/v1/user");
assert.equal(calls[0].options.headers.apikey, "anon-key");
assert.equal(calls[0].options.headers.authorization, "Bearer access-token");
assert.equal(calls[1].url, "https://abc.supabase.co/rest/v1/profiles?id=eq.user-1&select=id,tenant_id,full_name,role");

await assert.rejects(
  () => loadProfile(""),
  /Access Token fehlt/
);

assert.throws(
  () => createSupabaseProfileLoader({ supabaseUrl: "", anonKey: "" }),
  /supabaseUrl und anonKey/
);

const missingProfileLoader = createSupabaseProfileLoader(
  { supabaseUrl: "https://abc.supabase.co", anonKey: "anon-key" },
  async (url) => url.endsWith("/auth/v1/user")
    ? jsonResponse({ id: "user-1" })
    : jsonResponse([])
);

await assert.rejects(
  () => missingProfileLoader("access-token"),
  /Profil fehlt/
);

console.log("supabase-profile-loader tests ok");
