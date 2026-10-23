import { emptyDraft } from './store.js';

export function exemplarToDraft(e) {
  const d = emptyDraft();
  d.title = e.title || '';
  d.sourceExemplarId = e.id || null;
  d.profile.grade = e.grade != null ? String(e.grade) : '';
  d.profile.gradeBand = e.grade_band || '';
  d.profile.category = e.az_category || '';
  d.profile.secondaryCategory = e.secondary_category || '';
  d.profile.dyslexiaDiagnosis =
    e.az_category === 'Specific Learning Disability' ? (e.dyslexia_diagnosis_documented ?? null) : null;

  d.plaafp.strengths = (e.strengths || []).join('; ');
  d.plaafp.parentConcerns = e.parent_concerns || '';
  d.plaafp.evaluation = (e.evaluation_data || []).join('\n');
  d.plaafp.academic = e.plaafp?.academic || '';
  d.plaafp.functional = e.plaafp?.functional || '';
  d.plaafp.impact = e.plaafp?.impact || '';
  d.plaafp.baselines = (e.plaafp?.baselines || []).map((b) => ({ ...b }));

  d.goals = (e.goals || []).map((g) => ({
    id: crypto.randomUUID(),
    area: g.area || '',
    condition: g.condition || '',
    skill: g.skill || '',
    baseline: g.baseline || '',
    target: g.target || '',
    measurement: g.measurement || '',
    schedule: g.schedule || '',
    benchmarks: Array.isArray(e.benchmarks_or_stos) ? e.benchmarks_or_stos.join('\n') : (e.benchmarks_or_stos || '')
  }));

  d.progressReporting = e.progress_reporting || '';
  d.services = (e.services || []).map((s) => ({ id: crypto.randomUUID(), ...s }));
  d.supplementaryAids = [...(e.supplementary_aids_services || [])];
  d.accommodations = [...(e.accommodations || [])];
  d.modifications = [...(e.program_modifications || [])];
  d.personnelSupports = [...(e.personnel_supports || [])];

  d.lre = e.lre_statement || '';
  d.placement = e.placement || '';
  d.assessment = e.assessment || '';
  d.esy = e.esy || '';
  d.specialFactors.behavior = e.special_factor_behavior || '';
  d.specialFactors.communication = e.special_factor_communication || '';

  if (e.behavior_support_plan) {
    const bsp = e.behavior_support_plan;
    d.behaviorPlan.enabled = true;
    d.behaviorPlan.targetBehavior = bsp.target_behavior_operational || '';
    d.behaviorPlan.baseline = bsp.baseline || '';
    d.behaviorPlan.function = bsp.hypothesized_function || '';
    d.behaviorPlan.antecedents = [...(bsp.antecedent_strategies || [])];
    d.behaviorPlan.replacements = [...(bsp.replacement_behaviors_taught || [])];
    d.behaviorPlan.consequences = [...(bsp.consequence_strategies || [])];
    d.behaviorPlan.crisis = bsp.crisis_plan || '';
    d.behaviorPlan.monitoring = bsp.progress_monitoring || '';
    d.behaviorPlan.staff = [...(bsp.staff_responsibilities || [])];
  }

  if (e.transition && typeof e.transition === 'object') {
    d.transition.required = true;
    d.transition.postsecondaryGoals = e.transition.postsecondaryGoals || '';
    d.transition.assessments = e.transition.assessments || '';
    d.transition.services = e.transition.services || '';
    d.transition.courses = e.transition.courses || '';
    d.transition.graduationDate = e.transition.graduationDate || '';
  }
  d.transferOfRights = e.transfer_of_rights || '';
  d.notes = `Adapted from exemplar "${e.title}" (${e.id}). All content is fictional; replace with team-specific information.`;
  return d;
}
