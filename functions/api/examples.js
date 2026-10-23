import { json } from '../_lib.js';

export async function onRequestGet({ env, request }) {
  try {
    if (env.DB) {
      const { results } = await env.DB.prepare(
        'SELECT payload FROM examples ORDER BY sort_order'
      ).all();
      if (results?.length) {
        return json(
          { source: 'd1', count: results.length, examples: results.map((r) => JSON.parse(r.payload)) },
          200,
          { 'cache-control': 'public, max-age=300' }
        );
      }
    }
  } catch {
    // fall through to static asset
  }

  if (env.ASSETS) {
    const url = new URL(request.url);
    const asset = await env.ASSETS.fetch(new URL('/data/examples.json', url.origin));
    if (asset.ok) {
      return new Response(asset.body, {
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' }
      });
    }
  }

  return json({ error: 'Example catalog unavailable. Run scripts/seed_d1.sh or build the site.' }, 503);
}
