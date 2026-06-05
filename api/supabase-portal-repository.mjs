function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function assertConfig(config) {
  if (!config?.supabaseUrl || !config?.anonKey) {
    throw new TypeError("supabaseUrl und anonKey sind Pflicht");
  }
}

async function readJsonResponse(response, label) {
  if (!response.ok) {
    const error = new Error(`${label} fehlgeschlagen`);
    error.statusCode = response.status;
    error.details = await response.text().catch(() => "");
    throw error;
  }

  return response.json();
}

function createHeaders({ anonKey, token }) {
  return {
    apikey: anonKey,
    authorization: `Bearer ${token}`,
    accept: "application/json"
  };
}

function mapCase(row) {
  return {
    id: row.id,
    area: row.area,
    authority: row.authority || "",
    status: row.status,
    priority: row.priority,
    nextStep: row.next_step || "",
    progress: row.progress
  };
}

function mapDocument(row) {
  return {
    id: row.id,
    caseId: row.case_id || "",
    name: row.name,
    area: row.area,
    documentType: row.document_type || "",
    driveUrl: row.drive_url || "",
    analysisStatus: row.analysis_status
  };
}

function mapDeadline(row) {
  return {
    id: row.id,
    caseId: row.case_id || "",
    title: row.title,
    area: row.area,
    dueDate: row.due_date,
    reminderDays: row.reminder_days,
    status: row.status,
    nextStep: row.next_step || ""
  };
}

function mapTask(row) {
  return {
    id: row.id,
    caseId: row.case_id || "",
    assignedTo: row.assigned_to || "",
    title: row.title,
    area: row.area,
    dueDate: row.due_date || "",
    priority: row.priority,
    status: row.status
  };
}

function mapAuditLog(row) {
  return {
    id: row.id,
    actorId: row.actor_id || "",
    action: row.action,
    objectType: row.object_type,
    objectId: row.object_id || "",
    area: row.area || "",
    details: row.details || "",
    createdAt: row.created_at
  };
}

function pickDefined(source, mapping) {
  return Object.entries(mapping).reduce((payload, [fromKey, toKey]) => {
    if (source?.[fromKey] !== undefined) {
      payload[toKey] = source[fromKey];
    }
    return payload;
  }, {});
}

export function createSupabasePortalRepository(config, fetchImpl = globalThis.fetch) {
  assertConfig(config);

  if (typeof fetchImpl !== "function") {
    throw new TypeError("fetchImpl muss eine Funktion sein");
  }

  const supabaseUrl = trimTrailingSlash(config.supabaseUrl);
  const anonKey = config.anonKey;

  async function list(path, context, mapper) {
    if (!context?.token) {
      const error = new Error("Portal-Kontext braucht Access Token");
      error.statusCode = 401;
      throw error;
    }

    const rows = await readJsonResponse(
      await fetchImpl(`${supabaseUrl}/rest/v1/${path}`, {
        headers: createHeaders({ anonKey, token: context.token })
      }),
      `Supabase ${path}`
    );

    return Array.isArray(rows) ? rows.map(mapper) : [];
  }

  async function patchOne({ table, id, context, payload, mapper, label }) {
    if (!context?.token) {
      const error = new Error("Portal-Kontext braucht Access Token");
      error.statusCode = 401;
      throw error;
    }

    if (!id) {
      throw new TypeError(`${label} braucht eine ID`);
    }

    const rows = await readJsonResponse(
      await fetchImpl(`${supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`, {
        method: "PATCH",
        headers: {
          ...createHeaders({ anonKey, token: context.token }),
          "content-type": "application/json",
          prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      }),
      `Supabase ${label}`
    );

    return Array.isArray(rows) && rows[0] ? mapper(rows[0]) : null;
  }

  return {
    listCases: (context) => list("cases?select=id,area,authority,status,priority,next_step,progress&order=updated_at.desc", context, mapCase),
    listDocuments: (context) => list("documents?select=id,case_id,name,area,document_type,drive_url,analysis_status&order=uploaded_at.desc", context, mapDocument),
    listDeadlines: (context) => list("deadlines?select=id,case_id,title,area,due_date,reminder_days,status,next_step&order=due_date.asc", context, mapDeadline),
    listTasks: (context) => list("tasks?select=id,case_id,assigned_to,title,area,due_date,priority,status&order=due_date.asc", context, mapTask),
    listAuditLog: (context) => list("audit_log?select=id,actor_id,action,object_type,object_id,area,details,created_at&order=created_at.desc", context, mapAuditLog),
    updateCase: (id, input, context) => patchOne({
      table: "cases",
      id,
      context,
      payload: pickDefined(input, {
        area: "area",
        authority: "authority",
        status: "status",
        priority: "priority",
        nextStep: "next_step",
        progress: "progress"
      }),
      mapper: mapCase,
      label: "case update"
    }),
    updateDeadline: (id, input, context) => patchOne({
      table: "deadlines",
      id,
      context,
      payload: pickDefined(input, {
        title: "title",
        dueDate: "due_date",
        reminderDays: "reminder_days",
        status: "status",
        nextStep: "next_step"
      }),
      mapper: mapDeadline,
      label: "deadline update"
    }),
    updateTask: (id, input, context) => patchOne({
      table: "tasks",
      id,
      context,
      payload: pickDefined(input, {
        title: "title",
        dueDate: "due_date",
        priority: "priority",
        status: "status"
      }),
      mapper: mapTask,
      label: "task update"
    })
  };
}
