// Node smoke test for the compliance engine and .docx builder.
// Run: node tests/engine.test.mjs
import { runChecks, summarize } from '../src/lib/compliance.js';
import { buildDoc } from '../src/lib/docx.js';
import { Packer } from 'docx';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const bad = {
  profile: { grade: '', category: 'Specific Learning Disability', dyslexiaDiagnosis: null },
  plaafp: { academic: '', impact: '', baselines: [{}] },
  goals: [{ condition: '', skill: 'Improve reading skills', baseline: 'Below grade level', target: 'Improve', measurement: '', schedule: '' }],
  services: [{ type: 'Reading', frequency: '', duration: '', location: '', provider: '' }],
  modifications: ['Extended time on tests'],
  behaviorPlan: { enabled: false },
  transition: {}
};

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    failures++;
    console.error('FAIL:', msg);
  } else {
    console.log('pass:', msg);
  }
}

const s1 = summarize(runChecks(bad));
assert(s1.fails.length >= 10, `incomplete draft produces fails (got ${s1.fails.length})`);
assert(s1.warns.some((w) => w.message.includes('accommodation')), 'flags accommodation-looking modification');
assert(s1.warns.some((w) => w.message.includes('baseline')), 'flags vague goal baseline');
assert(runChecks(bad).some((c) => c.id === 'dyslexia' && !c.ok), 'requires dyslexia answer for SLD');

const good = structuredClone(bad);
good.profile.grade = '3';
good.profile.dyslexiaDiagnosis = true;
good.plaafp.academic = 'Reads 28 WCPM';
good.plaafp.impact = 'Impacts access to text';
good.plaafp.baselines = [{ skill: 'Decoding', measure: 'CBM', score: '42%', date: 'fall' }];
good.goals = [{
  condition: 'given decodable text', skill: 'decode vowel teams', baseline: '42% accuracy',
  target: '90% accuracy', measurement: 'weekly probes', schedule: 'weekly'
}];
good.services = [{ type: 'SDI reading', frequency: '5x/week', duration: '45 min', location: 'Resource', provider: 'SPED teacher' }];
good.modifications = [];
good.lre = 'included all day except SDI';
good.placement = 'general ed';
good.assessment = 'AASA with accommodations';
good.esy = 'considered; no ESY';
good.progressReporting = 'every 9 weeks';

const s2 = summarize(runChecks(good));
assert(s2.fails.length === 0, `complete draft has no failures (got ${s2.fails.length})`);

const doc = buildDoc({ ...good, title: 'Test', specialFactors: {}, behaviorPlan: { enabled: false } });
const buf = await Packer.toBuffer(doc);
const out = path.join(os.tmpdir(), 'iep-test.docx');
fs.writeFileSync(out, buf);
assert(buf.length > 5000, `docx generated (${buf.length} bytes)`);
assert(buf.slice(0, 2).toString() === 'PK', 'docx is a valid zip container');

console.log(failures ? `\n${failures} assertion(s) failed` : '\nAll assertions passed');
process.exit(failures ? 1 : 0);
