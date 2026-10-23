# Annotated Source Bibliography

All files referenced here are saved under `research/sources/` (PDFs plus extracted `.txt`).
Retrieval notes are included because several Arizona sources sit behind bot protection.

---

## A. Primary Arizona sources

### A1. AZ-TAS: Process for Developing Individualized Education Programs (November 2025)
- **File:** `sources/ade/AzTAS-IEP-2025.pdf` (28 pages, 8,039 words)
- **Publisher:** Arizona Department of Education — Exceptional Student Services (ADE/ESS)
- **Original:** `https://www.azed.gov/sites/default/files/2025/11/IEP%20AzTAS%202025.pdf`
- **Retrieved via:** Wayback Machine (`web.archive.org/web/20260314061839id_/...`) — ADE blocks direct fetches.
- **Why it matters:** This is *the* current Arizona process guide. It was updated November 2025 to
  reflect the November 2024 State Board rule changes and reorganization of IEP components.
  It is the basis for `az-process-guide.md` and `iep-components.md`.
- **Key content:** required components table (federal/state/A.A.C. crosswalk), PLAAFP guidance,
  measurable annual goals, benchmarks/STOs, progress reporting, services (frequency/duration/type/
  location/provider), program modifications vs accommodations, LRE, assessment accommodations,
  transition, transfer of rights, special factors, ESY, placement, review, meetings, excusal,
  consensus, parent participation, transfers.

### A2. AZ-TAS: Process for Developing IEPs (August 2017) — historical
- **File:** `sources/ade/AzTAS-IEP-2017.pdf` (47 pages)
- **Why it matters:** Useful diff against 2025; confirms the 30-day rule after eligibility and
  older component language. Not used as current guidance.

### A3. Arizona Revised Statutes §15-761 — Definitions
- **URL:** `https://www.azleg.gov/ars/15/00761.htm` (verified accessible)
- **Key content:** defines "multidisciplinary evaluation team" (MET), "individualized education
  program team", "intellectual disability", "mild intellectual disability", and the full child-
  with-a-disability category list (autism; developmental delay; emotional disability; hearing
  impairment; other health impairments; specific learning disability; mild/moderate/severe
  intellectual disability; multiple disabilities; multiple disabilities with severe sensory
  impairment; orthopedic impairment; preschool severe delay; speech/language impairment;
  traumatic brain injury; visual impairment). Also the determinant-factor exclusions
  (lack of appropriate reading/math instruction; English language difference).

### A4. A.R.S. §15-763 — Plan for providing special education
- **URL:** `https://www.azleg.gov/ars/15/00763.htm`
- **Key Arizona quirk:** For a student found eligible under SLD, **the IEP must indicate whether
  the pupil has been diagnosed with dyslexia.** This is a hard AZ-specific compliance item for
  every SLD IEP and must be a field in the tool.

### A5. A.R.S. §15-766 — Evaluation for placement
- **URL:** `https://www.azleg.gov/ars/15/00766.htm`
- **Key content:** initial evaluation **within 60 days after receiving parental consent**;
  reevaluation not more than once a year (unless agreed) and **at least every three years**;
  parent option to consent or refuse initial evaluation; due process hearing procedures.

### A6. A.R.S. §15-767 — Annual goals; notification
- **URL:** `https://www.azleg.gov/ars/15/00767.htm`
- **Key content:** parents must be notified of progress toward annual goals as provided in the IEP.

### A7. A.R.S. §15-105 — Use of restraint and seclusion
- **URL:** `https://www.azleg.gov/ars/15/00105.htm`
- **Key content:** imminent-danger standard; continuous visual monitoring; trained staff; no
  breathing obstruction; same-day parent notice (within 24 hours if not same day); written
  documentation; **repeated use triggers a review that includes whether the pupil requires an FBA**;
  law-enforcement summons follows the same reporting; definitions of restraint and seclusion.
  Applies to all pupils, and is directly relevant to behavioral IEPs and safety plans.

### A8. AZ-TAS Dyslexia Handbook (2018)
- **File:** `sources/ade/AZ-TAS-Dyslexia-Handbook.pdf` (~1.2 MB)
- **Original:** `https://www.azed.gov/sites/default/files/2018/04/AZ-TAS%20Dyslexia%20Handbook_0.pdf`
- **Why it matters:** Arizona's statutory dyslexia handbook (A.R.S. §15-704). Warning signs,
  identification guidance, instruction, and resources. Informs the SLD/reading exemplars and the
  dyslexia-diagnosis field required by §15-763.

### A9. AZ-TAS: Speech-Language Services in Arizona's Schools (April 2023)
- **File:** `sources/ade/AZ-TAS-Speech-Language-2023.pdf` (2.4 MB)
- **Why it matters:** Current Arizona guidance on SLI eligibility, service delivery, dismissal.
  Note its explicit caution that service-delivery guidelines are not eligibility criteria.
  Informs the SLI exemplars.

### A10. ADE Other Health Impairment (OHI) guidance
- **Files:** `sources/ade/Behavior-Supports-SEAP.pdf`, `sources/ade/MTBS-Training-2020.pdf`
- **Why they matter:** Arizona behavior-support framing (multi-tier behavior supports, SEAP
  behavior supports). Used for the behavior guide and OHI/ED supports.

### A11. ADE checklists and forms
- **Files:** `sources/ade/IEP-Checklist.pdf`, `sources/ade/Parent-IEP-Input-Form.pdf`,
  `sources/ade/Annual-IEP-Goals-MPGs.pdf`, `sources/ade/IEP-scenario-2023.pdf`
- **Why they matter:** The checklist and parent input form are candidate feature models for the
  tool ("Parent input" intake, pre-meeting completeness check). The MPG document shows Arizona's
  own worked examples of aligning annual goals to measurable postsecondary goals. The scenario is
  a PWN training example.

---

## B. Full example IEPs (public)

These are vendor- or state-published exemplars. They are copyrighted by their publishers; we use
them as structural references only and do not republish them. Our `exemplars/` files are original
syntheses.

| File | State | Student profile | What it teaches |
|---|---|---|---|
| `sources/pdfs/Arizona-IEP-Example.pdf` | AZ | OHI (ADHD), grade 11, transition-age | The Arizona-style full form: eligibility header, PLAAFP, services grid, LRE, assessment, transition. Note: high-school/transition focus, so not representative of K–8. |
| `sources/pdfs/Arkansas-IEP-Example.pdf` | AR | SLD basic reading + visual impairment, grade 4/5 | Elementary SLD reading PLAAFP and goals; dual eligibility handling. |
| `sources/pdfs/Mississippi-IEP-Example-1.pdf` | MS | SLD, grade 9 | 16-page full IEP with goal detail; secondary example. |
| `sources/pdfs/Missouri-IEP-Example.pdf` | MO | Grade 8 | Middle-school structure, services grid, transition eligibility discussion. |
| `sources/pdfs/Texas-IEP-Example.pdf` | TX | Autism (primary), kindergarten | Early-elementary autism PLAAFP, eligibility/determinant-factor language. |
| `sources/states/MO-example-iep-A.pdf` | MO | Intellectual disability (Down syndrome), 17 | Adult-life/transition PLAAFP and functional goals. |
| `sources/states/MO-example-iep-B.pdf` | MO | Multiple disabilities (ID + cerebral palsy), grade 10 | Complex needs; AT and related services integration. |
| `sources/states/MO-example-iep-C.pdf` | MO | Learning disability | SLD goal-writing and PLAAFP model. |

**Gap noted:** public full exemplars skew secondary/transition. This is precisely why the 30
exemplars in `exemplars/` are synthesized for K–8 mild/moderate profiles.

---

## C. Quality tools and rubrics

| File | Source | Use |
|---|---|---|
| `sources/states/MO-smart-goal-rubric.pdf` | Missouri DESE | Compliance rubric for Specific/Measurable/Attainable/Results-oriented/Time-bound goals, with non-examples. Directly reusable as the tool's goal-quality checker logic. |
| `sources/states/MO-plaafp-rubric.pdf` | Missouri DESE | PLAAFP quality rubric: baseline data, skill-based description, impact of disability, alignment to goals. |
| `sources/states/MO-goal-example.pdf` | Missouri DESE | Worked example of goal + objective + progress report formatting. |
| `sources/ade/IEP-Checklist.pdf` | ADE | Pre-meeting completeness checklist. |

---

## D. Behavioral sources (FBA/BIP)

| File | Source | Use |
|---|---|---|
| `sources/behavior/PBIS-Basic-FBA-to-BSP-TrainerManual.pdf` | Center on PBIS | The definitive basic FBA→BSP workflow for **mild to moderate** behavior: interviews, observations, function hypothesis, critical features of behavior support plans, team process. Basis for `behavior-guide.md`. |
| `sources/behavior/PBIS-Tier3-Brief-FBA-Guide.pdf` | Center on PBIS | Brief (Tier 3) FBA procedures for students needing targeted support. |
| `sources/ade/MTBS-Training-2020.pdf` | ADE | Arizona multi-tier behavior supports framing. |
| A.R.S. §15-105 | Arizona Legislature | Restraint/seclusion reporting and the FBA-review trigger. |

---

## E. Access and retrieval notes

- **ADE (`azed.gov`, `apps.azsos.gov`) returns 403 to non-browser clients.** Direct downloads
  fail; archived mirror URLs work: `https://web.archive.org/web/<timestamp>id_/<original-url>`.
  Re-check ADE for newer versions before build; use the AzTAS 2025 as the baseline.
- **Search engines (DDG, Mojeek, Bing) rate-limit/captcha automated queries.** Source discovery
  relied on direct known URLs, site sitemaps, and the Wayback CDX index.
- **The Internet Archive went briefly offline during this session.** Most ADE files were already
  retrieved; any missing ones (school behavioral health guide, some scenario docs) can be retried.
- **AZLII/Cornell render A.A.C. R7-2-401 client-side and could not be harvested.** The statutes
  above plus the AzTAS 2025 carry the operationally relevant content. For the exact A.A.C. text,
  obtain the official chapter PDF from the Secretary of State or a district compliance officer.

## F. License and use notes

- **State documents** (ADE, Missouri DESE) are public records; retain attribution and do not imply
  state endorsement of this tool.
- **SpedTrack PDFs** are publicly accessible but remain vendor-copyrighted; used as references only.
- **Center on PBIS** materials are freely available for educational use with attribution.
- **Our 30 exemplars are original fictional work** released with the project under MIT (the
  research packet text itself can be MIT too; quoted source language is not included at length).
