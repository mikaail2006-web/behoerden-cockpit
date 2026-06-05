import assert from "node:assert/strict";
import { createSupabasePortalRepository } from "./supabase-portal-repository.mjs";

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

  if (options.method === "PATCH" && url.includes("/rest/v1/cases?id=eq.case-1")) {
    assert.equal(options.headers.prefer, "return=representation");
    assert.deepEqual(JSON.parse(options.body), {
      status: "Erledigt",
      next_step: "Archivieren"
    });
    return jsonResponse([{
      id: "case-1",
      area: "EM-Rente",
      authority: "Deutsche Rentenversicherung",
      status: "Erledigt",
      priority: "medium",
      next_step: "Archivieren",
      progress: 100
    }]);
  }

  if (options.method === "PATCH" && url.includes("/rest/v1/deadlines?id=eq.deadline-1")) {
    assert.deepEqual(JSON.parse(options.body), {
      status: "Erledigt",
      due_date: "2026-06-20"
    });
    return jsonResponse([{
      id: "deadline-1",
      case_id: "case-1",
      title: "Frist pruefen",
      area: "EM-Rente",
      due_date: "2026-06-20",
      reminder_days: 7,
      status: "Erledigt",
      next_step: "Abgelegt"
    }]);
  }

  if (options.method === "PATCH" && url.includes("/rest/v1/tasks?id=eq.task-1")) {
    assert.deepEqual(JSON.parse(options.body), {
      status: "Erledigt"
    });
    return jsonResponse([{
      id: "task-1",
      case_id: "case-1",
      assigned_to: "user-1",
      title: "Nachweis pruefen",
      area: "EM-Rente",
      due_date: "2026-06-07",
      priority: "medium",
      status: "Erledigt"
    }]);
  }

  if (url.includes("/rest/v1/cases?")) {
    return jsonResponse([{
      id: "case-1",
      area: "EM-Rente",
      authority: "Deutsche Rentenversicherung",
      status: "Offen",
      priority: "medium",
      next_step: "Bescheid pruefen",
      progress: 25
    }]);
  }

  if (url.includes("/rest/v1/documents?")) {
    return jsonResponse([{
      id: "doc-1",
      case_id: "case-1",
      name: "Bescheid.pdf",
      area: "EM-Rente",
      document_type: "Bescheid",
      drive_url: "https://drive.google.com/test",
      analysis_status: "Geprueft"
    }]);
  }

  if (url.includes("/rest/v1/deadlines?")) {
    return jsonResponse([{
      id: "deadline-1",
      case_id: "case-1",
      title: "Frist pruefen",
      area: "EM-Rente",
      due_date: "2026-06-14",
      reminder_days: 7,
      status: "Offen",
      next_step: "Antwort senden"
    }]);
  }

  if (url.includes("/rest/v1/tasks?")) {
    return jsonResponse([{
      id: "task-1",
      case_id: "case-1",
      assigned_to: "user-1",
      title: "Nachweis pruefen",
      area: "EM-Rente",
      due_date: "2026-06-07",
      priority: "medium",
      status: "Offen"
    }]);
  }

  if (url.includes("/rest/v1/audit_log?")) {
    return jsonResponse([{
      id: "audit-1",
      actor_id: "user-1",
      action: "Test",
      object_type: "case",
      object_id: "case-1",
      area: "EM-Rente",
      details: "Details",
      created_at: "2026-06-01T10:00:00Z"
    }]);
  }

  return jsonResponse({ error: "not found" }, 404);
};

const repository = createSupabasePortalRepository({
  supabaseUrl: "https://abc.supabase.co/",
  anonKey: "anon-key"
}, fetchMock);

const context = { token: "access-token", tenantId: "tenant-1", role: "bearbeiter" };

assert.deepEqual(await repository.listCases(context), [{
  id: "case-1",
  area: "EM-Rente",
  authority: "Deutsche Rentenversicherung",
  status: "Offen",
  priority: "medium",
  nextStep: "Bescheid pruefen",
  progress: 25
}]);

assert.deepEqual(await repository.listDocuments(context), [{
  id: "doc-1",
  caseId: "case-1",
  name: "Bescheid.pdf",
  area: "EM-Rente",
  documentType: "Bescheid",
  driveUrl: "https://drive.google.com/test",
  analysisStatus: "Geprueft"
}]);

assert.equal((await repository.listDeadlines(context))[0].dueDate, "2026-06-14");
assert.equal((await repository.listTasks(context))[0].assignedTo, "user-1");
assert.equal((await repository.listAuditLog(context))[0].createdAt, "2026-06-01T10:00:00Z");

assert.equal((await repository.updateCase("case-1", {
  status: "Erledigt",
  nextStep: "Archivieren",
  tenantId: "darf-nicht-gesendet-werden"
}, context)).progress, 100);

assert.equal((await repository.updateDeadline("deadline-1", {
  status: "Erledigt",
  dueDate: "2026-06-20"
}, context)).dueDate, "2026-06-20");

assert.equal((await repository.updateTask("task-1", {
  status: "Erledigt"
}, context)).status, "Erledigt");

assert.equal(calls[0].url.startsWith("https://abc.supabase.co/rest/v1/cases?"), true);
assert.equal(calls[0].options.headers.apikey, "anon-key");
assert.equal(calls[0].options.headers.authorization, "Bearer access-token");

await assert.rejects(
  () => repository.listCases({}),
  /Access Token/
);

await assert.rejects(
  () => repository.updateTask("", { status: "Erledigt" }, context),
  /braucht eine ID/
);

assert.throws(
  () => createSupabasePortalRepository({ supabaseUrl: "", anonKey: "" }),
  /supabaseUrl und anonKey/
);

console.log("supabase-portal-repository tests ok");
