import { json, randomId, newEditToken, nowIso, readJson } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body?.payload) return json({ error: 'payload is required' }, 400);
  if (!env.DB) return json({ error: 'D1 binding is not configured' }, 503);

  const id = randomId();
  const editToken = newEditToken();
  const now = nowIso();

  await env.DB.prepare(
    `INSERT INTO drafts (id, title, grade_band, category, payload, edit_token, shared, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`
  )
    .bind(id, body.title || '', body.gradeBand || '', body.category || '', JSON.stringify(body.payload), editToken, now, now)
    .run();

  return json({ id, editToken, created_at: now }, 201);
}

export async function onRequestGet() {
  // Drafts are unlisted; listing is deliberately not supported.
  return json({ error: 'List not supported. Access drafts by id.' }, 405);
}
