import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const PORT = 4291;
const baseUrl = `http://127.0.0.1:${PORT}`;

function startServer() {
  const child = spawn(process.execPath, ["api/portal-server.example.mjs"], {
    env: {
      ...process.env,
      PORT: String(PORT),
      SUPABASE_URL: "",
      SUPABASE_ANON_KEY: "",
      SUPABASE_STORAGE_BUCKET: "",
      PORTAL_ALLOWED_ORIGIN: "http://127.0.0.1:4173"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stderrText = "";
  child.stderr.on("data", (chunk) => {
    child.stderrText += chunk.toString("utf8");
  });
  return child;
}

async function waitForServer(server) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      if (server.stderrText.includes("listen EPERM")) {
        console.log("portal-server smoke tests skipped: localhost listen not permitted in this sandbox");
        return false;
      }
      throw new Error(`Portal-Demo ist beim Start beendet: ${server.stderrText}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        headers: { "x-demo-role": "kunde" }
      });
      if (response.ok) return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Portal-Demo wurde nicht rechtzeitig erreichbar");
}

async function readJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  return {
    status: response.status,
    body: await response.json()
  };
}

const server = startServer();

try {
  const canSmokeTest = await waitForServer(server);
  if (!canSmokeTest) {
    process.exit(0);
  }

  const health = await readJson("/api/health", {
    headers: { "x-demo-role": "kunde" }
  });
  assert.equal(health.status, 200);
  assert.equal(health.body.ok, true);
  assert.equal(health.body.mode, "demo");

  const cases = await readJson("/api/cases", {
    headers: { "x-demo-role": "bearbeiter" }
  });
  assert.equal(cases.status, 200);
  assert.equal(cases.body[0].id, "demo-case");

  const blockedPermissions = await readJson("/api/permissions", {
    headers: { "x-demo-role": "kunde" }
  });
  assert.equal(blockedPermissions.status, 403);
  assert.equal(blockedPermissions.body.error, "forbidden");

  const patchTask = await readJson("/api/tasks/demo-task", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-demo-role": "kunde"
    },
    body: JSON.stringify({ status: "Erledigt" })
  });
  assert.equal(patchTask.status, 200);
  assert.equal(patchTask.body.status, "Erledigt");

  const badJson = await readJson("/api/tasks/demo-task", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-demo-role": "kunde"
    },
    body: "{ungueltig"
  });
  assert.equal(badJson.status, 400);
  assert.equal(badJson.body.error, "bad_request");
} finally {
  server.kill("SIGTERM");
}

console.log("portal-server smoke tests ok");
