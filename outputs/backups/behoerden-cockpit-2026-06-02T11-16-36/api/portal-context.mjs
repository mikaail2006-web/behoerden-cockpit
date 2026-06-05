import { assertAccess } from "./portal-access.mjs";

export function extractBearerToken(headers = {}) {
  const authorization = headers.authorization || headers.Authorization || "";
  const match = String(authorization).match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function createPortalContext({ headers = {}, method, path, loadProfile }) {
  if (typeof loadProfile !== "function") {
    throw new TypeError("loadProfile muss eine Funktion sein");
  }

  const token = extractBearerToken(headers);
  if (!token) {
    const error = new Error("Authorization Bearer Token fehlt");
    error.statusCode = 401;
    throw error;
  }

  const profile = await loadProfile(token);
  if (!profile?.id || !profile?.tenantId || !profile?.role) {
    const error = new Error("Portal-Profil ist unvollstaendig");
    error.statusCode = 401;
    error.details = { hasProfile: Boolean(profile) };
    throw error;
  }

  assertAccess({ role: profile.role, method, path });

  return {
    token,
    userId: profile.id,
    tenantId: profile.tenantId,
    role: profile.role,
    fullName: profile.fullName || "",
    email: profile.email || ""
  };
}
