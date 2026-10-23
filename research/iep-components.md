# IEP Component Writing & Quality Guide

This is the component-by-component reference for the tool's snippet library and compliance
checker. Sources: AZ-TAS 2025 (ADE), A.R.S. §§15-761/763/766/767, and the Missouri DESE SMART
Goal and PLAAFP rubrics (the clearest published compliance tools found). Page cites refer to
`AzTAS-IEP-2025.pdf` in `sources/ade/`.

---

## 0. Component compliance checklist

A draft is "structurally complete" in Arizona when all of these are present (as applicable):

- [ ] Student metadata, eligibility category(ies), IEP dates, meeting date/type
- [ ] PLAAFP with strengths, parent concerns, evaluation results, skill-based baseline data,
      and impact of disability on general-curriculum involvement/progress
- [ ] Measurable annual goals, each with: specific skill, baseline, target/mastery criteria,
      measurement method, and timeframe
- [ ] Benchmarks/STOs (only if alternate assessment)
- [ ] Progress reporting: how and when (at least as often as nondisabled peers)
- [ ] Services: type, frequency, duration, location, provider (for each special ed, related,
      and supplementary aid/service)
- [ ] Program modifications and supports for school personnel
- [ ] LRE explanation (extent of non-participation + why)
- [ ] Assessment participation + accommodations (state and PEA-wide; MOWR considered)
- [ ] Special factors: AT, communication, behavior, LEP, deaf/HI, blind/VI
- [ ] ESY consideration (with data, annually, by the 45-day deadline)
- [ ] Transition components if 9th grade/age 16+ (postsecondary goals, services, courses,
      graduation date)
- [ ] Transfer-of-rights statement if within one year of age 18
- [ ] Placement determination consistent with the IEP
- [ ] PWN for decisions; parent copy of the IEP
- [ ] For SLD: dyslexia diagnosis statement (A.R.S. §15-763)

---

## 1. PLAAFP — Present Levels of Academic Achievement and Functional Performance

**What it is:** A clear, current picture of the student: strengths, needs, baseline data, and the
impact of the disability on involvement and progress in the general curriculum (AzTAS 2025 p. 8;
34 C.F.R. §300.320(a)(1)).

**Required inputs:**
- Strengths of the student
- Parent concerns for enhancing their child's education
- Results of the initial or most recent evaluation
- Arizona Academic Standards, grade-level expectations, grade-level content

**Quality criteria** (adapted from the Missouri PLAAFP rubric):
1. **Skill-based, not just scores.** "Reads 42 WCPM on a grade-3 passage" beats "performs below
   grade level."
2. **Baseline data is explicit** and connects to at least one goal.
3. **Impact statement** explains how the disability affects access to/ progress in the general
   curriculum and participation with peers.
4. **All areas of need are covered** — the IEP is not limited to the eligibility label.
5. **Functional performance** (behavior, social, communication, organization, self-care,
   attention) is described where relevant.
6. **Current**: data dated within the IEP period.
7. **Strengths + needs balanced**; respectful, person-first language.

**Weak vs. strong:**
- Weak: "Jordan has ADHD. He struggles in class and doesn't finish work. He is below grade level
  in reading and math."
- Strong: "Jordan is a 9-year-old fourth grader who participates eagerly in science discussions
  and can explain ecosystems using grade-level vocabulary. On a grade-4 oral reading fluency
  probe he reads 68 WCPM (fall benchmark 100+); he has passed 3 of 10 weekly comprehension checks
  at 70% or higher. Digit fluency and math reasoning errors indicate difficulty with multi-step
  problems. Off-task behavior occurs most during independent writing (observed 6–8 times per
  30-minute block; average 11 minutes on task). ADHD-related attention and executive-function
  needs affect his ability to access grade-level writing tasks and complete assignments without
  structured supports."

**Tool implications:** free-text with prompts; structured baseline fields (measure, score, date,
source); dropdown "impact area"; auto-warn if PLAAFP has no numeric baseline or if a goal has no
matching baseline.

---

## 2. Measurable annual goals

**What they are:** Statements of the skills the team wants the student to attain by the end of the
IEP year, tied directly to PLAAFP needs and enabling progress in the general curriculum
(AzTAS 2025 p. 9; 34 C.F.R. §300.320(a)(2)).

**SMART compliance test** (Missouri DESE rubric, `sources/states/MO-smart-goal-rubric.pdf`):
- **S**pecific to one skill or targeted behavior — not "improve reading."
- **M**easurable — baseline + mastery criterion + method any provider can replicate.
- **A**ttainable — reasonable given the student's rate of progress and the IEP duration.
- **R**esults-oriented — states the behavior/outcome, not the activity.
- **T**ime-bound — achievable within the IEP year.

**Canonical goal frame:**
> Given [condition/context], [student] will [specific observable skill/behavior] from [baseline]
> to [target/mastery criterion], as measured by [tool/procedure] on [frequency/schedule], by
> [date or within one year].

**Examples:**
- Reading: "Given a grade-3 decodable passage, Student will read words with vowel teams and
  r-controlled patterns accurately, increasing from 55% to 90% accuracy across 3 consecutive
  probes, as measured by weekly curriculum-based measures, within one year."
- Math: "Given one-step word problems with whole numbers, Student will select the correct
  operation, write the equation, and solve, increasing from 2/10 to 8/10 problems correctly
  across 3 of 4 weekly probes, within one year."
- Behavior: "When frustrated during independent work, Student will use a taught self-regulation
  strategy (deep breath + request a break card) instead of leaving the area, increasing from
  1/10 opportunities to 8/10 opportunities per day, as measured by daily teacher tallies, across
  4 consecutive weeks by the end of the IEP year."

**Warnings the checker should raise:**
- No baseline or no mastery criterion
- Vague skill ("improve reading skills")
- Goal names a grade level but no skill
- Measurement left to a norm-referenced test only, with no progress-monitoring plan
- Behavior goal that targets compliance only, without a replacement skill

---

## 3. Benchmarks / short-term objectives

- **Required only** for students who qualify for the alternate assessment (AzTAS 2025 p. 10).
- Intermediate steps that break the annual goal into a task analysis; each is measurable.
- For all other students they are optional, but useful for long-term goals; if written, keep them
  aligned to the parent goal.

---

## 4. Progress reporting

- Describe **how** progress is measured and **when** parents will be notified — typically at
  least as often as nondisabled peers (Arizona practice: each 9-week period with report cards)
  (AzTAS 2025 p. 10; A.R.S. §15-767).
- Reports should include **actual data**, not just descriptors, and show rate of progress enough
  for a reader to judge whether the student is on target.
- Tool should let the team pick a schedule and generate a progress-report template per goal.

---

## 5. Services: special education, related services, supplementary aids

For every service, capture all five dimensions (AzTAS 2025 pp. 11–12):
1. **Type** — specially designed instruction (SDI), related service, or supplementary aid/service
2. **Frequency** — e.g., 4 times/week
3. **Duration** — e.g., 30 minutes/session
4. **Location** — resource room, general classroom, therapy room, etc.
5. **Provider** — SPED teacher, speech-language pathologist, OT, counselor, etc.

Definitions:
- **SDI**: adapting content, methodology, or delivery to address unique disability-related needs
  and ensure access to the general curriculum.
- **Related services**: transportation, OT, PT, speech, counseling, nursing, audiology,
  interpreting, orientation/mobility, etc., needed to benefit from special education.
- **Supplementary aids/services**: supports in general ed classes, extracurricular and
  nonacademic settings enabling education with nondisabled peers (e.g., modified assignments,
  instructional aids, adult cues).

**Quality criteria:** specific enough that any reader knows what will happen; services address
*all* PLAAFP needs, not only the eligibility label; service minutes consistent with goals and
goals-like work; if a general education teacher delivers SDI, document why and how special
education personnel are involved in planning/monitoring.

---

## 6. Program modifications vs. accommodations vs. personnel supports

| Type | What it changes | Example |
|---|---|---|
| Accommodation | *How* the student accesses/ demonstrates learning; does **not** change content level or criteria | Extended time; read-aloud directions; word bank; preferential seating |
| Program modification | *What* the student is expected to learn or demonstrate | Reduced content for mastery; modified grading scale; modified curriculum |
| Personnel support | What staff need to implement the IEP | Training on the student's AAC device; behavior consultation; aide training |

**Tool implication:** separate pick-lists for the three; warn when a "modification" is actually an
accommodation or when a change to content/grade-level standards is not documented.

---

## 7. LRE explanation

- State the extent to which the student will not participate with nondisabled peers and give the
  specific reasons the services cannot be delivered in the general education classroom
  (AzTAS 2025 pp. 13–14; 34 C.F.R. §§300.114–300.116).
- If fully included, a simple statement confirming full participation is sufficient.
- Placement is decided after goals/services and must begin from the general classroom.
- Consider and document potential harmful effects of the placement.

---

## 8. Assessment accommodations

- All students participate in state/PEA-wide assessments (AASA, AzELLA, AZSci; MOWR screening
  in grade 3) (AzTAS 2025 p. 14).
- Order of decisions: no accommodations → standard accommodations → (only if criteria met)
  alternate assessment (MSAA/Alt-ELPA) with benchmarks/STOs.
- Accommodations must be used in daily instruction as well as assessment, and must not invalidate
  results; **nonstandard accommodations cannot be used on state tests** even if in the IEP for
  classroom use.
- Note MOWR and the third-grade retention/reading requirements for elementary profiles.

---

## 9. Special factors

Teams must consider and document (AzTAS 2025 pp. 20–21):
- **Assistive technology (AT)** devices/services — low to high tech
- **Communication needs**, including direct communication with peers/staff
- **Behavior** that impedes the student's learning or that of others — develop **positive
  behavioral interventions and supports** and identify progress monitoring (see `behavior-guide.md`)
- **Limited English proficiency** and how it relates to the IEP
- **Deaf/hearing impaired** language/communication needs, including direct instruction in the
  student's mode
- **Blind/visually impaired** Braille instruction/use unless determined inappropriate

**Tool implication:** special-factor prompts should appear automatically based on category/
profile selections, and empty special-factor sections should be flagged before export.

---

## 10. ESY

- Consider annually for **all** students; eligibility determined individually, no category limits
  (AzTAS 2025 p. 22).
- Use regression/recoupment data (retrospective) and predictive data.
- Decision deadline: **no later than 45 days before the last day of school.**
- Document the data and rationale either way.

---

## 11. Transition (if applicable)

- Postsecondary goals (training/education + employment; independent living if appropriate)
- Age-appropriate transition assessments underpin the goals
- Coordinated services/activities across instruction, related services, community experiences,
  employment, adult living, daily living
- Specific courses of study aligned to the plan (not "elective"), anticipated graduation date,
  student invitation, outside-agency invitation with consent

---

## 12. Placement and PWN

- Placement must be consistent with the IEP, in the LRE, and documented after services.
- PWN documents the proposal/refusal, reasons, options considered, and evaluation sources.
- Best practice: provide a draft IEP to parents before the meeting (AzTAS 2025 p. 26).

---

## 13. What this means for the data model

Each component above becomes a section in the draft schema. The compliance checker runs against:
required-field presence, SMART goal structure, baseline↔goal links, service-dimension
completeness, special-factor completeness, SLD dyslexia field, ESY section presence, timeline
warnings (annual review, ESY deadline), and LRE explanation consistency.

The snippet library should store reusable language by component, category, grade band, and
measurement type, each snippet tagged with: source lineage (synthesized from public exhibits),
reading level, and "fill-in" placeholders `{{student}}`, `{{baseline}}`, `{{target}}`.
