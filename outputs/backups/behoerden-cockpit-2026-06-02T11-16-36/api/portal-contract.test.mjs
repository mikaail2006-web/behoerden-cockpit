import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const openApiText = readFileSync(new URL("./portal-openapi.yaml", import.meta.url), "utf8");
const permissions = JSON.parse(readFileSync(new URL("./portal-permissions.json", import.meta.url), "utf8"));

function collectOpenApiEndpoints(text) {
  const endpoints = [];
  let currentPath = "";

  for (const line of text.split("\n")) {
    const pathMatch = line.match(/^  (\/api\/[^:]+):$/);
    if (pathMatch) {
      currentPath = pathMatch[1].replaceAll("{id}", ":id");
      continue;
    }

    const methodMatch = line.match(/^    (get|post|patch|put|delete):$/);
    if (currentPath && methodMatch) {
      endpoints.push(`${methodMatch[1].toUpperCase()} ${currentPath}`);
    }
  }

  return endpoints.sort();
}

const openApiEndpoints = collectOpenApiEndpoints(openApiText);
const permissionEndpoints = permissions.endpoints
  .map((endpoint) => `${endpoint.method} ${endpoint.path}`)
  .sort();

assert.deepEqual(permissionEndpoints, openApiEndpoints);

console.log("portal-contract tests ok");
