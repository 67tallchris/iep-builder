# 30 Synthetic Exemplar IEPs (K–8, mild/moderate, Arizona)

**These are original, fictional composites.** No real student data, names, records, or
districts appear here. They are modeled on the structure and language patterns of the public
documents cataloged in `../sources.md` and aligned to the AZ-TAS 2025 required components.

**Purpose:** seed the tool's example library and snippet extraction. Each exemplar is a complete
drafting pattern for one profile: PLAAFP, goals with baselines/measurements, services with the
five required dimensions, accommodations, LRE, assessment, ESY, and behavior support where
relevant.

## Files

| File | Count | Contents |
|---|---|---|
| `01-sld-elementary.json` | 8 | SLD reading (decoding/dyslexia, fluency, comprehension), math (calculation, problem-solving), written expression, mixed, oral language |
| `02-sld-middle.json` | 4 | SLD comprehension, math reasoning, written expression, executive function/study skills |
| `03-behavior-elementary.json` | 6 | ED anxiety, ED disruptive behavior (BIP), ED aggression (BIP + crisis plan), OHI/ADHD inattention (BIP), OHI/ADHD executive function, ED withdrawal/depression |
| `04-behavior-middle-social.json` | 6 | ED aggression (middle), ED school avoidance (middle), OHI/ADHD organization (middle), autism social skills (elementary), autism social communication (middle), twice-exceptional (2e, middle) |
| `05-related-services-edge-cases.json` | 6 | SLI articulation (elem), SLI pragmatics (middle), mild ID (elem), Section 504 comparison (ADHD), MTSS pre-referral documentation, check-in/check-out + safety plan |

## Schema

Each exemplar is a JSON object with:

- `id`, `title`, `grade`, `grade_band`, `az_category`, `secondary_category`, `fictional: true`
- `profile_summary`, `strengths[]`, `parent_concerns`, `evaluation_data[]`
- `plaafp`: `{academic, functional, impact, baselines[]}`
- `goals[]`: `{area, condition, skill, baseline, target, measurement, schedule}`
- `benchmarks_or_stos` (null unless alternate assessment)
- `progress_reporting`
- `special_factor_behavior` (string or null)
- `services[]`: `{type, frequency, duration, location, provider}`
- `supplementary_aids_services[]`, `accommodations[]`, `program_modifications[]`,
  `personnel_supports[]`
- `lre_statement`, `placement`, `assessment`, `esy`
- `transition`, `transfer_of_rights`
- `behavior_support_plan` (null or object — see `../behavior-guide.md`)
- `source_lineage[]`, `notes`

## Fair use and sourcing

Public exemplar documents were consulted for **structure**. No sentences from those documents
were copied into these files beyond standard legal-formula phrases common to the field
(e.g., "as measured by…"). Every student profile is invented. `source_lineage` names the
public references that inspired the pattern, not copied content.

## Disclaimers

- Not legal advice; not a substitute for a district-approved IEP system or team decision-making.
- Never enter real student names or identifying information into the tool.
- Verify against the current AZ-TAS and district procedures before use.
