// Thin wrappers around the Cloudflare Pages Functions API.

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export function fetchCatalog() {
  return jsonFetch('/api/examples');
}

export function fetchSnippets() {
  return jsonFetch('/api/snippets');
}

export function saveDraft(draft) {
  const payload = {
    title: draft.title,
    gradeBand: draft.profile.gradeBand,
    category: draft.profile.category,
    payload: draft
  };
  return jsonFetch('/api/drafts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function updateDraft(draft) {
  return jsonFetch(`/api/drafts/${draft.cloud.id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-edit-token': draft.cloud.editToken
    },
    body: JSON.stringify({
      title: draft.title,
      gradeBand: draft.profile.gradeBand,
      category: draft.profile.category,
      shared: !!draft.cloud.shared,
      payload: draft
    })
  });
}

export function fetchDraft(id) {
  return jsonFetch(`/api/drafts/${id}`);
}

export function setShared(id, editToken, shared) {
  return jsonFetch(`/api/drafts/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', 'x-edit-token': editToken },
    body: JSON.stringify({ shared })
  });
}
