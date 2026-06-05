import { createServer } from "node:http";
import { assertAccess, getPermissionMatrix } from "./portal-access.mjs";
import { createPortalContext } from "./portal-context.mjs";
import { validatePortalEnv } from "./portal-env.mjs";
import { createSupabasePortalRepository } from "./supabase-portal-repository.mjs";
import { createSupabaseProfileLoader } from "./supabase-profile-loader.mjs";

const PORT = Number(process.env.PORT || 4190);
const envStatus = validatePortalEnv();
const loadSupabaseProfile = envStatus.ok
  ? createSupabaseProfileLoader({
    supabaseUrl: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
  })
  : null;
const repository = envStatus.ok
  ? createSupabasePortalRepository({
    supabaseUrl: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
  })
  : null;

const demoLists = {
  cases: [{
    id: "demo-case",
    area: "EM-Rente",
    authority: "Deutsche Rentenversicherung",
    status: "Offen",
    priority: "medium",
    nextStep: "Bescheid pruefen",
    progress: 25
  }],
  documents: [{
    id: "demo-document",
    caseId: "demo-case",
    name: "2026-06-01_EM-Rente_Testbescheid.pdf",
    area: "EM-Rente",
    documentType: "Bescheid",
    driveUrl: "",
    analysisStatus: "Demo"
  }],
  deadlines: [{
    id: "demo-deadline",
    caseId: "demo-case",
    title: "Bescheid Frist pruefen",
    area: "EM-Rente",
    dueDate: "2026-06-14",
    reminderDays: 7,
    status: "Offen",
    nextStep: "Antwort vorbereiten"
  }],
  tasks: [{
    id: "demo-task",
    caseId: "demo-case",
    assignedTo: "demo-user",
    title: "Nachweis pruefen",
    area: "EM-Rente",
    dueDate: "2026-06-07",
    priority: "medium",
    status: "Offen"
  }],
  auditLog: [{
    id: "demo-audit",
    actorId: "demo-user",
    action: "Demo geladen",
    objectType: "case",
    objectId: "demo-case",
    area: "EM-Rente",
    details: "Lokale Portal-Demo ohne echte Daten.",
    createdAt: "2026-06-01T10:00:00Z"
  }]
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": process.env.PORTAL_ALLOWED_ORIGIN || "http://127.0.0.1:4173",
    "access-control-allow-headers": "authorization, content-type, x-demo-role",
    "access-control-allow-methods": "GET, POST, PATCH, OPTIONS"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  sendJson(res, statusCode, {
    error: statusCode === 400
      ? "bad_request"
      : statusCode === 401
        ? "unauthorized"
        : statusCode === 403
          ? "forbidden"
          : statusCode === 404
            ? "not_found"
            : "server_error",
    message: error.message || "Unerwarteter Serverfehler",
    details: error.details
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    const error = new Error("JSON Body ist ungueltig");
    error.statusCode = 400;
    throw error;
  }
}

function getRole(req) {
  return req.headers["x-demo-role"] || "kunde";
}

async function getListPayload(context, listName, repositoryMethod) {
  if (repository && context.token) {
    return repository[repositoryMethod](context);
  }

  return demoLists[listName] || [];
}

async function getUpdatePayload({ context, listName, repositoryMethod, id, input }) {
  if (repository && context.token) {
    return repository[repositoryMethod](id, input, context);
  }

  const item = (demoLists[listName] || []).find((entry) => entry.id === id);
  if (!item) {
    const error = new Error("Demo-Datensatz nicht gefunden");
    error.statusCode = 404;
    throw error;
  }

  return { ...item, ...input };
}

async function getRequestContext(req, url) {
  if (loadSupabaseProfile && req.headers.authorization) {
    return createPortalContext({
      headers: req.headers,
      method: req.method,
      path: url.pathname,
      loadProfile: loadSupabaseProfile
    });
  }

  const role = getRole(req);
  assertAccess({ role, method: req.method, path: url.pathname });
  return {
    token: "",
    userId: "demo-user",
    tenantId: "demo-tenant",
    fullName: "Murat Kocyigit",
    email: "",
    role
  };
}

async function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  let context;

  try {
    context = await getRequestContext(req, url);
  } catch (error) {
    sendError(res, error);
    return;
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/me") {
      sendJson(res, 200, {
        id: context.userId,
        tenantId: context.tenantId,
        fullName: context.fullName,
        email: context.email,
        role: context.role,
        mode: envStatus.ok ? "configured" : "demo"
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        mode: envStatus.ok ? "configured" : "demo",
        service: "behoerden-cockpit-portal-api"
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/permissions") {
      sendJson(res, 200, getPermissionMatrix());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/cases") {
      sendJson(res, 200, await getListPayload(context, "cases", "listCases"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/documents") {
      sendJson(res, 200, await getListPayload(context, "documents", "listDocuments"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/deadlines") {
      sendJson(res, 200, await getListPayload(context, "deadlines", "listDeadlines"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/tasks") {
      sendJson(res, 200, await getListPayload(context, "tasks", "listTasks"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/audit-log") {
      sendJson(res, 200, await getListPayload(context, "auditLog", "listAuditLog"));
      return;
    }

    const caseMatch = url.pathname.match(/^\/api\/cases\/([^/]+)$/);
    if (req.method === "PATCH" && caseMatch) {
      sendJson(res, 200, await getUpdatePayload({
        context,
        listName: "cases",
        repositoryMethod: "updateCase",
        id: caseMatch[1],
        input: await readJsonBody(req)
      }));
      return;
    }

    const deadlineMatch = url.pathname.match(/^\/api\/deadlines\/([^/]+)$/);
    if (req.method === "PATCH" && deadlineMatch) {
      sendJson(res, 200, await getUpdatePayload({
        context,
        listName: "deadlines",
        repositoryMethod: "updateDeadline",
        id: deadlineMatch[1],
        input: await readJsonBody(req)
      }));
      return;
    }

    const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (req.method === "PATCH" && taskMatch) {
      sendJson(res, 200, await getUpdatePayload({
        context,
        listName: "tasks",
        repositoryMethod: "updateTask",
        id: taskMatch[1],
        input: await readJsonBody(req)
      }));
      return;
    }

    sendJson(res, 200, {
      ok: true,
      role: context.role,
      tenantId: context.tenantId,
      method: req.method,
      path: url.pathname,
      message: "Demo-Endpunkt erlaubt. Produktive Datenlogik wird hier spaeter angebunden."
    });
  } catch (error) {
    sendError(res, error);
  }
}

createServer(handleRequest).listen(PORT, "127.0.0.1", () => {
  console.log(`Portal API Beispiel laeuft auf http://127.0.0.1:${PORT}`);
  console.log("Demo-Rolle per Header setzen: x-demo-role: admin|bearbeiter|kunde");
  console.log("Bei vollstaendiger Env kann Authorization: Bearer <supabase-access-token> genutzt werden.");
  if (envStatus.ok) {
    console.log("Portal-Umgebung: vollstaendig konfiguriert");
  } else {
    console.log("Portal-Umgebung: Demo-Modus");
    console.log(`Fehlend: ${envStatus.missing.join(", ") || "-"}`);
    console.log(`Platzhalter: ${envStatus.placeholders.join(", ") || "-"}`);
  }
});
