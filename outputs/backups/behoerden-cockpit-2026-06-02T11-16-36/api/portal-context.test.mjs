import assert from "node:assert/strict";
import { createPortalContext, extractBearerToken } from "./portal-context.mjs";

const demoProfile = {
  id: "user-1",
  tenantId: "tenant-1",
  role: "bearbeiter",
  fullName: "Bearbeiter Test",
  email: "bearbeiter-test@example.de"
};

assert.equal(extractBearerToken({ authorization: "Bearer abc123" }), "abc123");
assert.equal(extractBearerToken({ Authorization: "bearer xyz" }), "xyz");
assert.equal(extractBearerToken({ authorization: "Basic abc123" }), null);
assert.equal(extractBearerToken({}), null);

const context = await createPortalContext({
  headers: { authorization: "Bearer demo-token" },
  method: "GET",
  path: "/api/cases",
  loadProfile: async (token) => {
    assert.equal(token, "demo-token");
    return demoProfile;
  }
});

assert.deepEqual(context, {
  token: "demo-token",
  userId: "user-1",
  tenantId: "tenant-1",
  role: "bearbeiter",
  fullName: "Bearbeiter Test",
  email: "bearbeiter-test@example.de"
});

await assert.rejects(
  () => createPortalContext({
    headers: {},
    method: "GET",
    path: "/api/cases",
    loadProfile: async () => demoProfile
  }),
  /Bearer Token fehlt/
);

await assert.rejects(
  () => createPortalContext({
    headers: { authorization: "Bearer demo-token" },
    method: "GET",
    path: "/api/cases",
    loadProfile: async () => ({ id: "user-1", role: "admin" })
  }),
  /Portal-Profil ist unvollstaendig/
);

await assert.rejects(
  () => createPortalContext({
    headers: { authorization: "Bearer demo-token" },
    method: "GET",
    path: "/api/audit-log",
    loadProfile: async () => ({ ...demoProfile, role: "kunde" })
  }),
  /Zugriff verweigert/
);

console.log("portal-context tests ok");
