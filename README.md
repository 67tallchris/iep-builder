# IEP Builder

A free, MIT-licensed drafting tool for **Arizona K–8 mild/moderate special education IEPs**,
running entirely on **Cloudflare** (Pages + Functions + D1).

**🔗 Live: https://iep-builder.pages.dev**
Built from the Phase 1 research packet in [`research/`](research/README.md).
Spec: [`docs/spec.md`](docs/spec.md).

> **No real student data.** Every page shows a persistent no-PII banner. Use fictional labels
> only. Drafts are aids for the IEP team, not legal advice.

## What it does

- **7-section wizard:** profile → PLAAFP → goals → services → supports/special factors →
  behavior support plan → LRE/assessment/ESY/review.
- **30 exemplar profiles** (SLD, ED, OHI/ADHD, autism, SLI, mild ID, 2e, plus 504/MTSS/CICO
  edge cases) — load one as a starting point. Served from D1 with static fallback.
- **382-snippet library** — add accommodations, supplementary aids, modifications, personnel
  supports, service types, goal frames, and BSP blocks straight into the draft.
- **Compliance checker** — Arizona rules (AZ-TAS 2025, A.R.S. §15-763 dyslexia field, SMART goal
  structure, five service dimensions, LRE/assessment/ESY, behavior plan completeness, transition
  triggers) with must-fix / review lists that link to the field.
- **`.docx` export** that opens natively in Google Docs, plus JSON export/import.
- **Cloud save + read-only share links** (D1, token-protected edits, unlisted ids).
- **BYOK AI assist** — Anthropic / OpenAI / OpenAI-compatible endpoints via a Worker proxy;
  keys stay in the browser and are never stored or logged server-side.

## Repository layout

```
src/                 Svelte 4 + Vite app (components, lib/compliance.js, lib/docx.js, lib/ai.js)
functions/           Cloudflare Pages Functions: /api/examples, /api/snippets, /api/drafts,
                     /api/ai/draft
schema.sql           D1 schema (examples, snippets, drafts)
scripts/             prepare_data.py (research → public/data + seed.sql), seed_d1.sh
research/            Phase 1 corpus: process guides, behavior guide, 30 exemplars, snippets
tests/               Node smoke tests for the compliance engine and .docx builder
docs/spec.md         Product spec + architecture + data model
```

## Local development

```bash
npm install
npm run data                     # research JSON → public/data + seed.sql
./scripts/seed_d1.sh local       # apply schema + seed to local D1
npm run build
npx wrangler pages dev dist --persist-to .wrangler/state
# → http://127.0.0.1:8789
npm test                         # compliance + docx smoke tests
```

## Deploy

```bash
./scripts/seed_d1.sh remote
npm run deploy                   # build + wrangler pages deploy dist --project-name iep-builder
```

The Pages project `iep-builder` is bound to the D1 database `iep-builder-db` via `wrangler.toml`.
The production branch is `main`; deploy with `--branch main` to publish to
`https://iep-builder.pages.dev`.

### Optional: server-side AI key

BYOK works with no server secrets. To allow server-side fallback for your own deployment:

```bash
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name iep-builder
npx wrangler pages secret put OPENAI_API_KEY --project-name iep-builder
```

## License

MIT — see [`LICENSE`](LICENSE). Public source documents retain their own terms; see
[`research/sources.md`](research/sources.md).
