import assert from "node:assert/strict";
import { canAccess, getAllowedRoles } from "./portal-access.mjs";

assert.deepEqual(getAllowedRoles("GET", "/api/me"), ["admin", "bearbeiter", "kunde"]);
assert.deepEqual(getAllowedRoles("GET", "/api/health"), ["admin", "bearbeiter", "kunde"]);
assert.deepEqual(getAllowedRoles("GET", "/api/permissions"), ["admin", "bearbeiter"]);
assert.deepEqual(getAllowedRoles("PATCH", "/api/cases/123"), ["admin", "bearbeiter"]);

assert.equal(canAccess({ role: "admin", method: "POST", path: "/api/cases" }), true);
assert.equal(canAccess({ role: "kunde", method: "GET", path: "/api/health" }), true);
assert.equal(canAccess({ role: "bearbeiter", method: "PATCH", path: "/api/deadlines/abc" }), true);
assert.equal(canAccess({ role: "kunde", method: "POST", path: "/api/documents/upload" }), true);
assert.equal(canAccess({ role: "kunde", method: "PATCH", path: "/api/deadlines/abc" }), false);
assert.equal(canAccess({ role: "kunde", method: "GET", path: "/api/audit-log" }), false);
assert.equal(canAccess({ role: "kunde", method: "GET", path: "/api/permissions" }), false);
assert.equal(canAccess({ role: "unbekannt", method: "GET", path: "/api/me" }), false);
assert.equal(canAccess({ role: "admin", method: "DELETE", path: "/api/cases/123" }), false);

console.log("portal-access tests ok");
