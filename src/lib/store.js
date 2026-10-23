import { writable, get } from 'svelte/store';

const DRAFT_KEY = 'iep-builder-draft-v1';
const SETTINGS_KEY = 'iep-builder-settings-v1';

export function emptyDraft() {
  return {
    version: 1,
    id: null,
    title: '',
    sourceExemplarId: null,
    updatedAt: '',
    cloud: null,
    profile: {
      studentLabel: 'Student',
      grade: '',
      gradeBand: '',
      category: '',
      secondaryCategory: '',
      dyslexiaDiagnosis: null,
      meetingDate: '',
      iepStart: '',
      iepEnd: ''
    },
    plaafp: {
      strengths: '',
      parentConcerns: '',
      evaluation: '',
      academic: '',
      functional: '',
      impact: '',
      baselines: [{ skill: '', measure: '', score: '', date: '' }]
    },
    goals: [],
    progressReporting: '',
    services: [],
    supplementaryAids: [],
    accommodations: [],
    modifications: [],
    personnelSupports: [],
    lre: '',
    placement: '',
    assessment: '',
    esy: '',
    specialFactors: { at: '', communication: '', behavior: '', lep: '', deafHI: '', blindVI: '' },
    behaviorPlan: {
      enabled: false,
      targetBehavior: '',
      baseline: '',
      function: '',
      antecedents: [],
      replacements: [],
      consequences: [],
      crisis: '',
      monitoring: '',
      staff: []
    },
    transition: {
      required: false,
      postsecondaryGoals: '',
      assessments: '',
      services: '',
      courses: '',
      graduationDate: ''
    },
    transferOfRights: '',
    notes: ''
  };
}

export function newGoal() {
  return {
    id: crypto.randomUUID(),
    area: '',
    condition: '',
    skill: '',
    baseline: '',
    target: '',
    measurement: '',
    schedule: '',
    benchmarks: ''
  };
}

export function newService() {
  return { id: crypto.randomUUID(), type: '', frequency: '', duration: '', location: '', provider: '' };
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const draft = writable(loadJson(DRAFT_KEY, emptyDraft()));

export function updateDraft(mutator) {
  draft.update((d) => {
    const next = structuredClone(d);
    mutator(next);
    next.updatedAt = new Date().toISOString();
    return next;
  });
}

export function replaceDraft(next) {
  draft.set(next);
}

export function resetDraft() {
  replaceDraft(emptyDraft());
}

draft.subscribe((d) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* storage full or unavailable */
  }
});

export const DEFAULT_SETTINGS = {
  provider: 'anthropic',
  model: 'claude-sonnet-4-5',
  apiKey: '',
  baseUrl: ''
};

export const settings = writable(loadJson(SETTINGS_KEY, DEFAULT_SETTINGS));
settings.subscribe((s) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
});

export const MODEL_PRESETS = {
  anthropic: ['claude-sonnet-4-5', 'claude-haiku-4-5', 'claude-opus-4-1'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1'],
  'openai-compatible': ['custom-model']
};

export function getDraft() {
  return get(draft);
}
