// .docx export — opens natively in Google Docs.
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle
} from 'docx';

const DISCLAIMER =
  'DRAFT FOR IEP TEAM REVIEW — This document was produced with a drafting aid and is not legal advice. ' +
  'It contains no real student data. The IEP team and public education agency remain responsible for compliance.';

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text: text || '', ...(opts.run || {}) })]
  });
}

function h(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function bullet(text) {
  return new Paragraph({ text: text || '', bullet: { level: 0 }, spacing: { after: 60 } });
}

function labelValue(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || '—' })
    ]
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text: text || '', bold: opts.bold || false, size: opts.size })] })]
  });
}

function table(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((t) => cell(t, { bold: true })) }),
      ...rows.map((r) => new TableRow({ children: r.map((c) => cell(c)) }))
    ]
  });
}

export function buildDoc(d) {
  const children = [];
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'INDIVIDUALIZED EDUCATION PROGRAM (DRAFT)', bold: true, size: 32 })]
  }));
  children.push(p(DISCLAIMER, { run: { italics: true, size: 18 } }));

  children.push(h('Student and Meeting Information', HeadingLevel.HEADING_1));
  children.push(labelValue('Student label', d.profile.studentLabel || 'Student'));
  children.push(labelValue('Grade', d.profile.grade));
  children.push(labelValue('Eligibility category', d.profile.category + (d.profile.secondaryCategory ? ` / ${d.profile.secondaryCategory}` : '')));
  if (d.profile.category === 'Specific Learning Disability') {
    children.push(labelValue('Dyslexia diagnosis documented', d.profile.dyslexiaDiagnosis === true ? 'Yes' : d.profile.dyslexiaDiagnosis === false ? 'No' : 'Not answered'));
  }
  children.push(labelValue('IEP dates', [d.profile.iepStart, d.profile.iepEnd].filter(Boolean).join(' – ')));

  children.push(h('Present Levels of Academic Achievement and Functional Performance (PLAAFP)', HeadingLevel.HEADING_1));
  if (d.plaafp.strengths) children.push(p('Strengths: ' + d.plaafp.strengths));
  if (d.plaafp.parentConcerns) children.push(p('Parent concerns: ' + d.plaafp.parentConcerns));
  if (d.plaafp.evaluation) children.push(p('Evaluation results: ' + d.plaafp.evaluation));
  if (d.plaafp.academic) children.push(p('Academic: ' + d.plaafp.academic));
  if (d.plaafp.functional) children.push(p('Functional: ' + d.plaafp.functional));
  if (d.plaafp.impact) children.push(p('Impact of disability: ' + d.plaafp.impact));
  const baselines = (d.plaafp.baselines || []).filter((b) => b.skill || b.score);
  if (baselines.length) {
    children.push(p('Baseline data', { run: { bold: true } }));
    children.push(table(['Skill', 'Measure', 'Score', 'Date'],
      baselines.map((b) => [b.skill, b.measure, b.score, b.date])));
  }

  children.push(h('Measurable Annual Goals', HeadingLevel.HEADING_1));
  const goals = d.goals || [];
  if (!goals.length) children.push(p('—'));
  goals.forEach((g, i) => {
    children.push(p(`Goal ${i + 1}${g.area ? ' — ' + g.area : ''}`, { run: { bold: true } }));
    if (g.condition) children.push(p('Given: ' + g.condition));
    if (g.skill) children.push(p('Skill: ' + g.skill));
    children.push(p(`Baseline: ${g.baseline || '—'}  |  Target: ${g.target || '—'}`));
    children.push(p(`Measurement: ${g.measurement || '—'}  |  Schedule: ${g.schedule || '—'}`));
    if (g.benchmarks) children.push(p('Benchmarks/short-term objectives: ' + g.benchmarks));
  });
  if (d.progressReporting) children.push(p('Progress reporting: ' + d.progressReporting));

  children.push(h('Special Education, Related Services, Supplementary Aids', HeadingLevel.HEADING_1));
  const services = d.services || [];
  if (services.length) {
    children.push(table(['Service', 'Frequency', 'Duration', 'Location', 'Provider'],
      services.map((s) => [s.type, s.frequency, s.duration, s.location, s.provider])));
  } else {
    children.push(p('—'));
  }

  const supplementaryAids = d.supplementaryAids || [];
  const accommodations = d.accommodations || [];
  const modifications = d.modifications || [];
  const personnelSupports = d.personnelSupports || [];
  if (supplementaryAids.length) {
    children.push(p('Supplementary aids and services', { run: { bold: true } }));
    supplementaryAids.forEach((x) => children.push(bullet(x)));
  }
  if (accommodations.length) {
    children.push(p('Accommodations', { run: { bold: true } }));
    accommodations.forEach((x) => children.push(bullet(x)));
  }
  if (modifications.length) {
    children.push(p('Program modifications', { run: { bold: true } }));
    modifications.forEach((x) => children.push(bullet(x)));
  }
  if (personnelSupports.length) {
    children.push(p('Supports for school personnel', { run: { bold: true } }));
    personnelSupports.forEach((x) => children.push(bullet(x)));
  }

  const sf = d.specialFactors || {};
  const sfItems = [
    ['Assistive technology', sf.at], ['Communication', sf.communication], ['Behavior', sf.behavior],
    ['Limited English proficiency', sf.lep], ['Deaf/hearing impaired', sf.deafHI], ['Blind/visually impaired', sf.blindVI]
  ].filter(([, v]) => v);
  if (sfItems.length) {
    children.push(h('Special Factors Considered', HeadingLevel.HEADING_1));
    sfItems.forEach(([k, v]) => children.push(p(`${k}: ${v}`)));
  }

  if (d.behaviorPlan?.enabled) {
    children.push(h('Behavior Support Plan', HeadingLevel.HEADING_1));
    children.push(p('Target behavior: ' + d.behaviorPlan.targetBehavior));
    children.push(p('Baseline: ' + d.behaviorPlan.baseline));
    children.push(p('Hypothesized function: ' + d.behaviorPlan.function));
    const group = (title, items) => {
      if (!items?.length) return;
      children.push(p(title, { run: { bold: true } }));
      items.forEach((x) => children.push(bullet(x)));
    };
    group('Antecedent/prevention strategies', d.behaviorPlan.antecedents);
    group('Replacement behaviors taught', d.behaviorPlan.replacements);
    group('Consequence strategies', d.behaviorPlan.consequences);
    if (d.behaviorPlan.crisis) children.push(p('Crisis/safety plan: ' + d.behaviorPlan.crisis));
    if (d.behaviorPlan.monitoring) children.push(p('Progress monitoring: ' + d.behaviorPlan.monitoring));
    group('Staff responsibilities', d.behaviorPlan.staff);
  }

  children.push(h('LRE, Placement, Assessment, ESY', HeadingLevel.HEADING_1));
  children.push(p('LRE: ' + (d.lre || '—')));
  children.push(p('Placement: ' + (d.placement || '—')));
  children.push(p('Assessment: ' + (d.assessment || '—')));
  children.push(p('ESY: ' + (d.esy || '—')));

  if (d.transition?.required || parseInt((d.profile.grade || '').replace(/[^\d]/g, ''), 10) >= 9) {
    children.push(h('Postsecondary Transition', HeadingLevel.HEADING_1));
    children.push(p('Postsecondary goals: ' + d.transition.postsecondaryGoals));
    children.push(p('Transition assessments: ' + d.transition.assessments));
    children.push(p('Services/activities: ' + d.transition.services));
    children.push(p('Courses of study: ' + d.transition.courses));
    children.push(p('Anticipated graduation date: ' + d.transition.graduationDate));
  }
  if (d.transferOfRights) children.push(p('Transfer of rights: ' + d.transferOfRights));
  if (d.notes) {
    children.push(h('Notes', HeadingLevel.HEADING_2));
    children.push(p(d.notes));
  }

  return new Document({
    sections: [{ properties: {}, children }]
  });
}

export async function exportDocx(d) {
  const doc = buildDoc(d);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safe = (d.title || 'iep-draft').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  a.href = url;
  a.download = `${safe}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
