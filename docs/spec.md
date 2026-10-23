# IEP Builder — Product Spec (Phase 3)

**Version 0.1 · Status: build in progress**
**Owner:** Chris Porter · **License:** MIT · **Hosting:** Cloudflare Pages + Functions + D1

---

## 1. Goal

Give an Arizona K–8 mild/moderate special education teacher a fast, safe way to draft a
compliant, well-written IEP from a curated exemplar + snippet library, with optional BYOK AI
assistance and one-click export to `.docx` (opens natively in Google Docs).

**Non-goals (v0.1):**
- No real student PII, ever.
- No multi-user accounts.
- No district SIS integration (Synergy/Infinite Campus/SEAS).
- No direct Google Drive API (`.docx` export covers Google Docs).
- No legal advice; drafts are aids for the IEP team.

## 2. Users and use cases

| Persona | Need |
|---|---|
| Primary: the owner (teacher candidate / mild-moderate teacher) | Build an IEP draft quickly from exemplars + snippets; check compliance before the team meeting; export to share with mentor/team. |
| Secondary: invited colleagues / reviewers | Open a shared read-only draft link and see how the tool works. |
| Future: other AZ teachers | Clone their own copy (MIT), or use a public instance with their own AI key. |

**Core use cases:**
1. Start from a blank draft and fill the wizard section by section.
2. Start from one of 30 exemplars, then adapt it (with a visible "adapted from exemplar" marker).
3. Insert reusable snippets into any section from a searchable library.
4. Ask the AI to draft/rewrite a section from short teacher notes (BYOK).
5. Run the compliance checker and fix flagged items.
6. Export `.docx`, or copy sections to the clipboard.
7. Save drafts locally; optionally save to the cloud and share a read-only link.

## 3. Information architecture

Single-page app with a wizard of sections and two side panels:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ IEP Builder     [⚠ No real student data]      New · Save · Share · ⚙ Settings│
├───────────────┬──────────────────────────────────────────────┬──────────────┤
│ LEFT PANEL    │ MAIN — DRAFT WIZARD                         │ RIGHT PANEL  │
│               │                                             │              │
│ ▸ Exemplars   │  1 Profile      5 Supports                  │ Compliance   │
│   30 profiles │  2 PLAAFP       6 Behavior plan             │ ✓ pass 12    │
│   filtered by │  3 Goals        7 LRE & placement           │ ⚠ warn 3     │
│   category &  │  4 Services     8 Assessment & ESY          │ ✕ fail 2     │
│   grade band  │                 9 Review & export           │              │
│ ▸ Snippets    │                                             │ [Fix list]   │
│   by component│  (sections as expandable cards)             │              │
└───────────────┴──────────────────────────────────────────────┴──────────────┘
```

Mobile: panels collapse into drawers; wizard stays single-column.

## 4. Draft data model (client + D1 payload)

```jsonc
{
  "version": 1,
  "id": null,                       // assigned on cloud save
  "title": "",
  "sourceExemplarId": null,
  "updatedAt": "",
  "profile": {
    "studentLabel": "Student", "grade": "", "gradeBand": "",
    "category": "", "secondaryCategory": "", "dyslexiaDiagnosis": null,
    "meetingDate": "", "iepStart": "", "iepEnd": ""
  },
  "plaafp": {
    "strengths": "", "parentConcerns": "", "evaluation": "",
    "academic": "", "functional": "", "impact": "",
    "baselines": [ { "skill": "", "measure": "", "score": "", "date": "" } ]
  },
  "goals": [ { "id": "", "area": "", "condition": "", "skill": "",
               "baseline": "", "target": "", "measurement": "", "schedule": "",
               "benchmarks": "" } ],
  "progressReporting": "",
  "services": [ { "id": "", "type": "", "frequency": "", "duration": "",
                  "location": "", "provider": "" } ],
  "supplementaryAids": [], "accommodations": [], "modifications": [],
  "personnelSupports": [],
  "lre": "", "placement": "", "assessment": "", "esy": "",
  "specialFactors": { "at": "", "communication": "", "behavior": "",
                      "lep": "", "deafHI": "", "blindVI": "" },
  "behaviorPlan": {
    "enabled": false, "targetBehavior": "", "baseline": "", "function": "",
    "antecedents": [], "replacements": [], "consequences": [],
    "crisis": "", "monitoring": "", "staff": []
  },
  "transition": { "required": false, "postsecondaryGoals": "", "assessments": "",
                  "services": "", "courses": "", "graduationDate": "" },
  "transferOfRights": "",
  "notes": ""
}
```

## 5. Backend (Cloudflare)

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | version/host check |
| `/api/examples` | GET | exemplar catalog (D1, asset fallback) |
| `/api/snippets` | GET | snippet library (D1, asset fallback) |
| `/api/drafts` | POST | create cloud draft → `{id, editToken}` |
| `/api/drafts/:id` | GET | public read (shared or owner by token) |
| `/api/drafts/:id` | PUT | update (requires `x-edit-token`) |
| `/api/drafts/:id` | DELETE | delete (requires token) |
| `/api/ai/draft` | POST | BYOK AI proxy (Anthropic / OpenAI / OpenAI-compatible) |

**D1 schema:** `examples`, `snippets`, `drafts` (payload as JSON text). Schema in `schema.sql`,
seed generated by `scripts/prepare_data.py` + `scripts/seed_d1.sh`.

**Privacy:** drafts are not indexed or listed; ids are random UUIDs; `shared=1` only when the
owner explicitly shares. No analytics, no cookies for tracking. Keys are never stored server-side.

**AI proxy:** request `{provider, model, baseUrl?, system, prompt, apiKey?}`; if no `apiKey`,
falls back to `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` env secret (owner's own deployment).
Prompt size capped; keys never logged.

## 6. Compliance checker (client-side rules)

| Rule | Severity |
|---|---|
| Grade, grade band, eligibility category present | fail |
| SLD → dyslexia diagnosis field answered (A.R.S. §15-763) | fail |
| ≥1 goal; each goal has condition, skill, baseline, target, measurement, schedule | fail |
| Goal baseline/target look numeric or percentage-based | warn |
| ≥1 service; each service has type, frequency, duration, location, provider | fail |
| LRE statement present | fail |
| Assessment statement present | fail |
| ESY consideration present | fail |
| Behavior plan enabled → function, replacement behaviors, monitoring, crisis plan present | fail |
| Transition required (grade ≥ 9 or age ≥ 16) → postsecondary goals + services + courses present | fail |
| Duplicated baseline text across goals | warn |
| Modification list item looks like an accommodation ("extra time", "extended time") | warn |
| Draft modified after exemplar load but still contains exemplar-specific student label | warn |

The panel shows pass/warn/fail counts and a clickable fix list that scrolls to the field.

## 7. Export

- **`.docx`** built with the `docx` npm package, browser-side (`Packer.toBlob`).
- Structure mirrors AZ-TAS components: header block, PLAAFP, goals table, services table,
  supports, LRE/assessment/ESY, behavior plan, transition, footer disclaimer + no-PII notice.
- Also export/import draft JSON, and copy-to-clipboard per section.

## 8. Accessibility and UX

- Semantic headings and labels; keyboard navigable; visible focus; WCAG AA color contrast.
- No-PII banner persistent on every view.
- Autosave to `localStorage`; unsaved indicator; "New" asks before discarding.
- Read-only share view with "Copy to my drafts".

## 9. Security notes (MVP)

- Cloud draft access requires the unguessable id; edit/delete require the one-time `editToken`
  kept in the browser. Shared drafts are read-only.
- Assistant keys live in browser settings only; transmitted per request over HTTPS to our proxy.
- No PII means the blast radius of a leaked draft is a fictional/blank template, not a student
  record. This is a deliberate architectural constraint and must be re-reviewed before any
  change that would allow real student data.

## 10. Build / deploy

```bash
npm run data          # research JSON → public/data + seed.sql
npm run build         # vite build → dist/
npm run pages:dev     # local Pages + Functions + local D1
npm run deploy        # vite build + wrangler pages deploy
```

Pages project: `iep-builder` · D1: `iep-builder-db` · Custom domain: TBD
(e.g. `iep.notallorder.com`).
