// Client-side Arizona IEP compliance + quality checks.
// Rules are derived from research/iep-components.md (AZ-TAS 2025 + A.R.S.).

const hasText = (v) => typeof v === 'string' && v.trim().length > 0;
const hasNumeric = (v) => typeof v === 'string' && /(\d|%)/.test(v);
const hasBrackets = (v) => typeof v === 'string' && /[{}]|{{|}}/.test(v);

export function runChecks(d) {
  const checks = [];
  const add = (id, section, severity, message, ok) => checks.push({ id, section, severity, message, ok });
  const list = (id, section, severity, message, items) => {
    if (!items.length) add(id, section, severity, message, true);
    items.forEach((m, i) => add(`${id}-${i}`, section, severity, m, false));
  };

  // Profile
  add('grade', 'profile', 'fail', 'Grade level is missing.', hasText(d.profile?.grade));
  add('category', 'profile', 'fail', 'Eligibility category is missing.', hasText(d.profile?.category));
  if (d.profile?.category === 'Specific Learning Disability') {
    add('dyslexia', 'profile', 'fail',
      'SLD IEPs must state whether the student has been diagnosed with dyslexia (A.R.S. §15-763).',
      d.profile?.dyslexiaDiagnosis !== null && d.profile?.dyslexiaDiagnosis !== undefined);
  }

  // PLAAFP
  add('plaafp-academic', 'plaafp', 'fail', 'PLAAFP academic present levels are missing.', hasText(d.plaafp?.academic));
  add('plaafp-impact', 'plaafp', 'fail', 'PLAAFP impact of disability statement is missing.', hasText(d.plaafp?.impact));
  const baselines = (d.plaafp?.baselines || []).filter((b) => hasText(b.skill) || hasText(b.score));
  add('baseline-none', 'plaafp', 'fail', 'At least one PLAAFP baseline data point is required.', baselines.length > 0);
  if (baselines.length) {
    checks.push({ id: 'baseline-present', section: 'plaafp', severity: 'fail', message: 'Baseline data present.', ok: true });
    baselines.forEach((b, i) => {
      add(`baseline-${i}`, 'plaafp', 'fail', `Baseline ${i + 1} needs a skill and a score.`, hasText(b.skill) && hasText(b.score));
      add(`baseline-data-${i}`, 'plaafp', 'warn', `Baseline ${i + 1} has no numeric data — skill-based data is expected.`, hasNumeric(b.score));
    });
  }

  // Goals
  add('goals-none', 'goals', 'fail', 'At least one measurable annual goal is required.', (d.goals || []).length > 0);
  (d.goals || []).forEach((g, i) => {
    const missing = ['condition', 'skill', 'baseline', 'target', 'measurement', 'schedule']
      .filter((k) => !hasText(g[k]));
    add(`goal-${i}`, 'goals', 'fail', `Goal ${i + 1} is missing: ${missing.join(', ') || 'nothing'}.`, missing.length === 0);
    if (hasText(g.baseline) && !hasNumeric(g.baseline)) {
      add(`goal-base-${i}`, 'goals', 'warn', `Goal ${i + 1} baseline has no numeric data.`, false);
    }
    if (hasText(g.target) && !hasNumeric(g.target)) {
      add(`goal-target-${i}`, 'goals', 'warn', `Goal ${i + 1} target has no numeric mastery criterion.`, false);
    }
    if (hasBrackets(g.skill) || hasBrackets(g.target)) {
      add(`goal-brackets-${i}`, 'goals', 'warn', `Goal ${i + 1} still contains unresolved placeholder text.`, false);
    }
  });

  // Services
  add('services-none', 'services', 'fail', 'At least one service is required.', (d.services || []).length > 0);
  (d.services || []).forEach((s, i) => {
    const missing = ['type', 'frequency', 'duration', 'location', 'provider'].filter((k) => !hasText(s[k]));
    add(`service-${i}`, 'services', 'fail',
      `Service ${i + 1} is missing: ${missing.join(', ') || 'nothing'}.`,
      missing.length === 0);
  });

  // Core statements
  add('lre', 'supports', 'fail', 'LRE explanation is missing.', hasText(d.lre));
  add('placement', 'supports', 'fail', 'Placement statement is missing.', hasText(d.placement));
  add('assessment', 'review', 'fail', 'Assessment participation statement is missing.', hasText(d.assessment));
  add('esy', 'review', 'fail', 'ESY consideration is missing.', hasText(d.esy));
  add('progress', 'review', 'fail', 'Progress reporting statement is missing.', hasText(d.progressReporting));

  // Accommodation vs modification heuristic
  const wrongMods = (d.modifications || []).filter((m) =>
    /extra time|extended time|read.?aloud|preferential seating|breaks/i.test(m));
  list('mod-mismatch', 'supports', 'warn', 'Modification looks like an accommodation.',
    wrongMods.map((m) => `"${m}" looks like an accommodation, not a program modification.`));

  // Behavior plan
  if (d.behaviorPlan?.enabled) {
    add('bsp-target', 'behavior', 'fail', 'Behavior plan: target behavior is missing.', hasText(d.behaviorPlan.targetBehavior));
    add('bsp-function', 'behavior', 'fail', 'Behavior plan: hypothesized function is missing.', hasText(d.behaviorPlan.function));
    add('bsp-replacement', 'behavior', 'fail', 'Behavior plan: at least one replacement behavior is required.', (d.behaviorPlan.replacements || []).length > 0);
    add('bsp-monitoring', 'behavior', 'fail', 'Behavior plan: progress monitoring plan is missing.', hasText(d.behaviorPlan.monitoring));
    add('bsp-crisis', 'behavior', 'fail', 'Behavior plan: crisis/safety plan is missing.', hasText(d.behaviorPlan.crisis));
  }

  // Transition trigger
  const gradeNum = parseInt((d.profile?.grade || '').replace(/[^\d]/g, ''), 10);
  const transitionDue = (gradeNum >= 9) || d.transition?.required;
  if (transitionDue) {
    add('trans-psg', 'review', 'fail', 'Transition: measurable postsecondary goals are missing.', hasText(d.transition?.postsecondaryGoals));
    add('trans-services', 'review', 'fail', 'Transition: services/activities are missing.', hasText(d.transition?.services));
    add('trans-courses', 'review', 'fail', 'Transition: courses of study are missing.', hasText(d.transition?.courses));
  }

  return checks;
}

export function summarize(checks) {
  const fails = checks.filter((c) => !c.ok && c.severity === 'fail');
  const warns = checks.filter((c) => !c.ok && c.severity === 'warn');
  const passes = checks.filter((c) => c.ok);
  return { fails, warns, passes, total: checks.length };
}
