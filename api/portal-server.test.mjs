import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./portal-server.example.mjs", import.meta.url), "utf8");

assert.equal(source.includes("validatePortalEnv"), true);
assert.equal(source.includes("createPortalContext"), true);
assert.equal(source.includes("createSupabaseProfileLoader"), true);
assert.equal(source.includes("createSupabasePortalRepository"), true);
assert.equal(source.includes("demoLists"), true);
assert.equal(source.includes("function sendError"), true);
assert.equal(source.includes("bad_request"), true);
assert.equal(source.includes("server_error"), true);
assert.equal(source.includes("url.pathname === \"/api/cases\""), true);
assert.equal(source.includes("url.pathname === \"/api/audit-log\""), true);
assert.equal(source.includes("readJsonBody"), true);
assert.equal(source.includes("repositoryMethod: \"updateCase\""), true);
assert.equal(source.includes("repositoryMethod: \"updateDeadline\""), true);
assert.equal(source.includes("repositoryMethod: \"updateTask\""), true);
assert.equal(source.includes("Authorization: Bearer <supabase-access-token>"), true);
assert.equal(source.includes("process.env.PORTAL_ALLOWED_ORIGIN"), true);
assert.equal(source.includes("mode: envStatus.ok ? \"configured\" : \"demo\""), true);
assert.equal(source.includes("url.pathname === \"/api/health\""), true);

console.log("portal-server tests ok");
