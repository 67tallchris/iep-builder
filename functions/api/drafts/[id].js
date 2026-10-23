import { json, nowIso, readJson } from '../../_lib.js';

async function load(env, id) {
  if (!env.DB) return null;
  return env.DB.prepare('SELECT * FROM drafts WHERE id = ?').bind(id).first();
}

function serialize(row) {
  let payload = null;
  try {
    payload = JSON.parse(row.payload);
  } catch {
    payload = null;
  }
  return {
    id: row.id,
    title: row.title,
    grade_band: row.grade_band,
    category: row.category,
    shared: !!row.shared,
    created_at: row.created_at,
    updated_at: row.updated_at,
    payload
  };
}

export async function onRequestGet({ env, params, request }) {
  const row = await load(env, params.id);
  if (!row) return json({ error: 'Draft not found' }, 404);

  const token = request.headers.get('x-edit-token');
  const isOwner = token && token === row.edit_token;
  if (!row.shared && !isOwner) return json({ error: 'Draft not found' }, 404);

  const out = serialize(row);
  if (!isOwner) {
    delete out.payload?.cloud;
  }
  return json(out, 200, { 'cache-control': 'no-store' });
}

export async function onRequestPut({ env, params, request }) {
  const row = await load(env, params.id);
  if (!row) return json({ error: 'Draft not found' }, 404);

  const token = request.headers.get('x-edit-token');
  if (!token || token !== row.edit_token) return json({ error: 'Not authorized to edit this draft' }, 403);

  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid JSON body' }, 400);

  const title = body.title ?? row.title;
  const gradeBand = body.gradeBand ?? row.grade_band;
  const category = body.category ?? row.category;
  const shared = body.shared === undefined ? row.shared : body.shared ? 1 : 0;
  const payload = body.payload ? JSON.stringify(body.payload) : row.payload;
  const now = nowIso();

  await env.DB.prepare(
    `UPDATE drafts SET title = ?, grade_band = ?, category = ?, shared = ?, payload = ?, updated_at = ? WHERE id = ?`
  )
    .bind(title, gradeBand, category, shared, payload, now, params.id)
    .run();

  return json({ id: params.id, updated_at: now, shared: !!shared });
}

export async function onRequestDelete({ env, params, request }) {
  const row = await load(env, params.id);
  if (!row) return json({ error: 'Draft not found' }, 404);

  const token = request.headers.get('x-edit-token');
  if (!token || token !== row.edit_token) return json({ error: 'Not authorized to delete this draft' }, 403);

  await env.DB.prepare('DELETE FROM drafts WHERE id = ?').bind(params.id).run();
  return json({ deleted: true });
}
