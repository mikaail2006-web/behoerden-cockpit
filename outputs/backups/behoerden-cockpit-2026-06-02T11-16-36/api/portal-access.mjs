import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const permissionsPath = join(currentDir, "portal-permissions.json");
const matrix = JSON.parse(readFileSync(permissionsPath, "utf8"));

function normalizePath(path) {
  return String(path || "").split("?")[0].replace(/\/+$/, "") || "/";
}

function pathMatches(pattern, actualPath) {
  const patternParts = normalizePath(pattern).split("/");
  const actualParts = normalizePath(actualPath).split("/");
  if (patternParts.length !== actualParts.length) return false;
  return patternParts.every((part, index) => part.startsWith(":") || part === actualParts[index]);
}

export function getAllowedRoles(method, path) {
  const upperMethod = String(method || "").toUpperCase();
  const endpoint = matrix.endpoints.find((item) => (
    item.method === upperMethod && pathMatches(item.path, path)
  ));
  return endpoint?.roles || [];
}

export function canAccess({ role, method, path }) {
  if (!matrix.roles.includes(role)) return false;
  return getAllowedRoles(method, path).includes(role);
}

export function assertAccess({ role, method, path }) {
  if (canAccess({ role, method, path })) return true;
  const error = new Error("Zugriff verweigert");
  error.statusCode = 403;
  error.details = { role, method, path };
  throw error;
}

export function getPermissionMatrix() {
  return matrix;
}
