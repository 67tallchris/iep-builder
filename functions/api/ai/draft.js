import { json, readJson } from '../../_lib.js';

const MAX_PROMPT = 20000;

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return json({ error: 'prompt is required' }, 400);
  }
  if (body.prompt.length > MAX_PROMPT) {
    return json({ error: 'prompt is too long' }, 413);
  }

  const provider = body.provider || 'anthropic';
  const model = body.model || (provider === 'anthropic' ? 'claude-sonnet-4-5' : 'gpt-4o-mini');
  const system = body.system || 'You are a helpful special education drafting assistant.';
  const apiKey = body.apiKey || (provider === 'anthropic' ? env.ANTHROPIC_API_KEY : env.OPENAI_API_KEY);

  if (!apiKey) {
    return json({ error: 'No API key. Open Settings and add your provider key.' }, 400);
  }

  try {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1200,
          system,
          messages: [{ role: 'user', content: body.prompt }]
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return json({ error: data?.error?.message || 'Anthropic request failed' }, 502);
      }
      const text = (data.content || []).map((c) => c.text || '').join('').trim();
      return json({ text, provider, model });
    }

    // OpenAI and OpenAI-compatible endpoints.
    const base = (body.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: body.prompt }
        ]
      })
    });
    const data = await res.json();
    if (!res.ok) {
      return json({ error: data?.error?.message || 'Provider request failed' }, 502);
    }
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    return json({ text, provider, model });
  } catch (e) {
    return json({ error: 'Upstream request failed: ' + (e.message || String(e)) }, 502);
  }
}
