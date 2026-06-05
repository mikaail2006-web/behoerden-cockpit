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

export function createSupabaseProfileLoader(config, fetchImpl = globalThis.fetch) {
  assertConfig(config);

  if (typeof fetchImpl !== "function") {
    throw new TypeError("fetchImpl muss eine Funktion sein");
  }

  const supabaseUrl = trimTrailingSlash(config.supabaseUrl);
  const anonKey = config.anonKey;

  return async function loadProfile(accessToken) {
    if (!accessToken) {
      const error = new Error("Supabase Access Token fehlt");
      error.statusCode = 401;
      throw error;
    }

    const authHeaders = {
      apikey: anonKey,
      authorization: `Bearer ${accessToken}`
    };

    const user = await readJsonResponse(
      await fetchImpl(`${supabaseUrl}/auth/v1/user`, { headers: authHeaders }),
      "Supabase Auth"
    );

    if (!user?.id) {
      const error = new Error("Supabase Nutzer konnte nicht ermittelt werden");
      error.statusCode = 401;
      throw error;
    }

    const profileRows = await readJsonResponse(
      await fetchImpl(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,tenant_id,full_name,role`, {
        headers: {
          ...authHeaders,
          accept: "application/json"
        }
      }),
      "Supabase Profil"
    );

    const profile = Array.isArray(profileRows) ? profileRows[0] : null;
    if (!profile) {
      const error = new Error("Supabase Profil fehlt");
      error.statusCode = 401;
      throw error;
    }

    return {
      id: profile.id,
      tenantId: profile.tenant_id,
      role: profile.role,
      fullName: profile.full_name || "",
      email: user.email || ""
    };
  };
}
