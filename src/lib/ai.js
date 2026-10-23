// BYOK AI assist. The key lives in localStorage and is sent to our Worker proxy,
// which forwards it to the provider. It is never stored server-side or logged.

import { get } from 'svelte/store';
import { settings as settingsStore } from './store.js';

export const AI_SECTIONS = {
  plaafp: 'Present levels (PLAAFP)',
  goal: 'Annual goal',
  lre: 'LRE explanation',
  behavior: 'Behavior support plan',
  esy: 'ESY consideration',
  assessment: 'Assessment statement'
};

function profileLine(d) {
  return [
    `Grade: ${d.profile.grade || 'unknown'}`,
    `Category: ${d.profile.category || 'unknown'}`,
    d.profile.secondaryCategory ? `Secondary: ${d.profile.secondaryCategory}` : '',
    d.profile.dyslexiaDiagnosis === true ? 'Dyslexia documented: yes' : ''
  ].filter(Boolean).join('; ');
}

const SYSTEM = [
  'You are assisting an Arizona mild/moderate special education teacher draft IEP language.',
  'Write concise, professional, family-friendly special education language.',
  'Use measurable terms (baseline, target, measurement) when drafting goals.',
  'Never invent student names or identifying details; refer to "the student".',
  'Do not provide legal advice. Output only the requested draft text.'
].join(' ');

export function buildPrompt(kind, d, extra = {}) {
  const head = `Student profile: ${profileLine(d)}.`;
  switch (kind) {
    case 'plaafp':
      return `${head}\nTeacher notes: ${extra.notes || ''}\n\nDraft a PLAAFP paragraph with academic present levels, functional present levels, and an impact-of-disability statement. Include placeholders like [baseline] where data is missing.`;
    case 'goal':
      return `${head}\nPLAAFP needs: ${extra.notes || ''}\nSkill area: ${extra.area || ''}\n\nDraft ONE SMART annual IEP goal in this exact frame: "Given [condition], the student will [specific skill] from [baseline] to [target], as measured by [measurement] on [schedule], within one year." Then add one benchmark line.`;
    case 'lre':
      return `${head}\nServices: ${(d.services || []).map((s) => s.type).join('; ') || 'not yet specified'}\nTeacher notes: ${extra.notes || ''}\n\nDraft an LRE explanation that starts from the general education classroom and explains any non-participation with specific reasons.`;
    case 'behavior':
      return `${head}\nTarget behavior notes: ${extra.notes || ''}\n\nDraft a positive behavior support summary: operational definition, hypothesized function, two antecedent strategies, two replacement behaviors, one consequence strategy, and a progress-monitoring statement.`;
    case 'esy':
      return `${head}\nRegression/recoupment notes: ${extra.notes || ''}\n\nDraft an ESY consideration paragraph that uses retrospective/predictive data language and addresses the 45-day decision deadline.`;
    case 'assessment':
      return `${head}\nAccommodations: ${(d.accommodations || []).join('; ') || 'not yet specified'}\n\nDraft an assessment participation statement for AASA/AzELLA/AZSci, noting accommodations and that alternate-assessment criteria were considered but not met (unless told otherwise).`;
    default:
      return `${head}\n${extra.notes || ''}`;
  }
}

export function buildGoalJsonPrompt(d, extra = {}) {
  return [
    `Student profile: ${profileLine(d)}.`,
    `Skill area: ${extra.area || 'not specified'}.`,
    `Teacher notes: ${extra.notes || ''}`,
    '',
    'Draft ONE SMART annual IEP goal for Arizona. Return ONLY valid JSON with these string keys:',
    '{"condition": "...", "skill": "...", "baseline": "...", "target": "...", "measurement": "...", "schedule": "...", "benchmarks": "..."}',
    'Baseline and target must contain numeric data or percentages. Do not include markdown fences or commentary.'
  ].join('\n');
}

export function parseGoalJson(text) {
  const cleaned = String(text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    const keys = ['condition', 'skill', 'baseline', 'target', 'measurement', 'schedule', 'benchmarks'];
    const out = {};
    for (const k of keys) if (typeof obj[k] === 'string' && obj[k].trim()) out[k] = obj[k].trim();
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export async function generateGoal(d, extra = {}) {
  const cfg = get(settingsStore);
  const res = await fetch('/api/ai/draft', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider: cfg.provider,
      model: cfg.model,
      baseUrl: cfg.baseUrl,
      apiKey: cfg.apiKey,
      system: SYSTEM,
      prompt: buildGoalJsonPrompt(d, extra)
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `AI request failed (${res.status})`);
  const parsed = parseGoalJson(data.text || '');
  if (!parsed) throw new Error('The assistant returned an unparseable goal. Try again.');
  return parsed;
}

export async function generate(kind, d, extra = {}) {
  const cfg = get(settingsStore);
  const body = {
    provider: cfg.provider,
    model: cfg.model,
    baseUrl: cfg.baseUrl,
    apiKey: cfg.apiKey,
    system: SYSTEM,
    prompt: buildPrompt(kind, d, extra)
  };
  const res = await fetch('/api/ai/draft', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `AI request failed (${res.status})`);
  return data.text || '';
}
