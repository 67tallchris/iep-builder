// Shared helpers for Pages Functions. Files starting with "_" are not routed.

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...extraHeaders }
  });
}

export function randomId() {
  return crypto.randomUUID().replace(/-/g, '');
}

export function newEditToken() {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

export function nowIso() {
  return new Date().toISOString();
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
