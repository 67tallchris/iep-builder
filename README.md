# IEP Builder

A free, MIT-licensed drafting tool for **Arizona K–8 mild/moderate special education IEPs**,
built to run entirely on **Cloudflare** (Pages + Workers/Functions + D1 + R2 + KV + Vectorize).

**Status: Phase 1 — Research complete, awaiting owner review (Phase 2 gate).**
No application code exists yet. The research packet is in [`research/`](research/README.md).

## What this will do

- Build IEP drafts from a structured wizard: student profile → eligibility → PLAAFP → goals →
  services → accommodations → review → export.
- Pull from a vetted snippet library (PLAAFP stems, goal frames, accommodations, behavior
  supports) and 30 exemplar profiles for SLD, ED, OHI/ADHD, autism, SLI, and mild ID.
- Check drafts against Arizona compliance items (AZ-TAS 2025 components, SMART goal rubric,
  SDI/dyslexia documentation, ESY deadlines, service dimensions, special factors).
- Export to **`.docx`** for one-click Google Docs import; optional Drive API later.
- Offer **BYOK AI assist** (Anthropic / OpenAI / OpenCode key), proxied through a Worker —
  keys are never shipped to other visitors.

## What it will never do

- Store real student names or identifying information. Every page shows a **no-PII banner**.
- Replace the IEP team's judgment or district-approved systems. Drafts are aids, not legal advice.
- Auto-finalize AI language. All generated text is labeled as a draft for team review.

## Repository layout

```
research/
  README.md              Phase 1 packet overview + review checklist
  sources.md             Annotated bibliography
  az-process-guide.md    Arizona process, timelines, team rules
  iep-components.md      Component writing/quality guide + compliance checklist
  behavior-guide.md      FBA, BSP/BIP, crisis planning, A.R.S. §15-105
  exemplars/             30 synthetic K–8 exemplar profiles (JSON) + index.json
  boilerplate/           snippets.json — starter snippet library
  sources/               Downloaded public corpus (ADE, states, PBIS)
  scripts/build_index.py Regenerates index.json and snippets.json
```

## Local research tooling

```bash
python3 research/scripts/build_index.py
```

Regenerates `research/exemplars/index.json` and `research/boilerplate/snippets.json` from the
exemplar files.

## License

MIT — see [`LICENSE`](LICENSE). Public source documents retain their own terms; see
[`research/sources.md`](research/sources.md).
