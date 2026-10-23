#!/usr/bin/env python3
"""Build research/exemplars/index.json and research/boilerplate/snippets.json.

Reads the five exemplar JSON files, emits:
  - a flat index of all exemplars
  - a deduplicated starter snippet library grouped by IEP component

Run from the repo root:  python3 research/scripts/build_index.py
"""
import json
import glob
import os
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EX_DIR = os.path.join(ROOT, "exemplars")
BOILER_DIR = os.path.join(ROOT, "boilerplate")
os.makedirs(BOILER_DIR, exist_ok=True)


def load_exemplars():
    out = []
    for f in sorted(glob.glob(os.path.join(EX_DIR, "0*.json"))):
        data = json.load(open(f))
        for e in data["exemplars"]:
            e["_file"] = os.path.basename(f)
            out.append(e)
    return out


def build_index(exemplars):
    idx = {
        "version": "1.0",
        "generated_from": "research/exemplars/0*.json",
        "count": len(exemplars),
        "disclaimer": "Fictional, synthetic exemplars. No real student data. Not legal advice.",
        "exemplars": [
            {
                "id": e["id"],
                "title": e["title"],
                "document_type": e.get("document_type", "iep"),
                "grade": e.get("grade"),
                "grade_band": e.get("grade_band"),
                "az_category": e.get("az_category"),
                "secondary_category": e.get("secondary_category"),
                "goals": len(e.get("goals", [])),
                "has_behavior_support_plan": bool(e.get("behavior_support_plan")),
                "file": e["_file"],
            }
            for e in exemplars
        ],
    }
    with open(os.path.join(EX_DIR, "index.json"), "w") as f:
        json.dump(idx, f, indent=2)
    return idx


def snippet(component, text, category="any", grade_band="any", placeholders=None, notes=""):
    return {
        "id": f"{component.lower()}-{abs(hash(text)) % 10**8:08d}",
        "component": component,
        "category": category,
        "grade_band": grade_band,
        "text": text,
        "placeholders": placeholders or [],
        "source_lineage": ["synthesized from public exemplars and state guidance"],
        "notes": notes,
    }


def extract_list_snippets(exemplars, field, component):
    """Deduplicate strings from exemplar list fields into candidate snippets."""
    counts = Counter()
    for e in exemplars:
        for item in e.get(field, []) or []:
            if item and item.strip() and not item.lower().startswith("none"):
                counts[item.strip()] += 1
    return [snippet(component, text, notes=f"appears in {n} exemplar(s)") for text, n in counts.most_common()]


def build_snippets(exemplars):
    snippets = []

    # Curated structural stems (the language patterns the tool will fill).
    curated = [
        ("PLAAFP_stem", "{{student}} is a {{grade}}-grade student who {{strength}}. On a {{measure}}, {{student}} scores {{baseline}} (benchmark {{benchmark}}).", "any", "any", ["{{student}}", "{{grade}}", "{{strength}}", "{{measure}}", "{{baseline}}", "{{benchmark}}"]),
        ("PLAAFP_impact", "{{disability}} needs affect {{student}}'s ability to access grade-level {{subject}} instruction and to demonstrate learning without {{support}}, requiring {{service}}.", "any", "any", ["{{disability}}", "{{student}}", "{{subject}}", "{{support}}", "{{service}}"]),
        ("goal_frame", "Given {{condition}}, {{student}} will {{skill}} from {{baseline}} to {{target}}, as measured by {{measurement}}, on {{schedule}}, within one year.", "any", "any", ["{{condition}}", "{{student}}", "{{skill}}", "{{baseline}}", "{{target}}", "{{measurement}}", "{{schedule}}"]),
        ("progress_reporting", "Progress reports with current data will be provided every 9 weeks, concurrent with report cards, using {{measurement}}.", "any", "any", ["{{measurement}}"]),
        ("lre_pullout", "The student participates in the general education classroom for the full day except during scheduled {{service}}. Pull-out instruction is necessary because {{reason}}; the student returns to general education for all content instruction with {{supports}}.", "any", "any", ["{{service}}", "{{reason}}", "{{supports}}"]),
        ("assessment_default", "Participates in AASA and district assessments with accommodations ({{accommodations}}). No alternate assessment.", "any", "any", ["{{accommodations}}"]),
        ("assessment_alternate", "The team will review Alternate Assessment Eligibility Determination criteria; if eligible, benchmarks/short-term objectives are required for each annual goal.", "any", "any", []),
        ("esy_considered_no", "Team considered ESY. No documented regression/recoupment data support ESY at this time; parents will receive practice materials. Decision documented by the 45-day deadline.", "any", "any", []),
        ("esy_regression", "Team considered ESY. The student showed regression in {{skill}} over {{break}} with slow recoupment; ESY {{service}}, {{frequency}} for {{duration}} for 5 weeks is recommended. Decision documented by the 45-day deadline.", "any", "any", ["{{skill}}", "{{break}}", "{{service}}", "{{frequency}}", "{{duration}}"]),
        ("special_factor_behavior", "Behavior impedes the student's learning or the learning of others. Positive behavioral interventions and supports are included, with progress monitoring described in the behavior support plan.", "any", "any", []),
        ("special_factor_at", "The team considered assistive technology. {{student}} requires {{tool}} for {{purpose}}; staff and student training is included as a personnel support.", "any", "any", ["{{student}}", "{{tool}}", "{{purpose}}"]),
        ("special_factor_lep", "The team considered limited English proficiency. {{student}} receives ELD services and the IEP integrates language supports with {{service}}.", "any", "any", ["{{student}}", "{{service}}"]),
        ("transfer_of_rights", "Beginning not less than one year before the student turns 18, the IEP includes a statement that the student has been informed of rights, if any, that will transfer at the age of majority. (Include when within one year of 18.)", "any", "any", []),
        ("transition_placeholder", "Beginning with the first IEP in effect when the student completes 9th grade or reaches age 16 (whichever is first), include measurable postsecondary goals (training/education, employment; independent living if appropriate), transition assessments, services/activities, specific courses of study, and the anticipated graduation date.", "any", "any", []),
        ("behavior_antecedent_stem", "Prevention strategy: {{strategy}} to reduce the likelihood of the behavior and increase access to instruction.", "behavior", "any", ["{{strategy}}"]),
        ("behavior_replacement_stem", "Replacement skill: teach and practice {{skill}} to serve the same function as the target behavior.", "behavior", "any", ["{{skill}}"]),
        ("behavior_consequence_stem", "Consequence strategy: immediately reinforce the replacement behavior with {{reinforcer}}; respond to the target behavior with {{response}} while avoiding reinforcement of the function.", "behavior", "any", ["{{reinforcer}}", "{{response}}"]),
        ("crisis_plan_stem", "Crisis plan: use de-escalation first ({{deescalation}}). Restraint/seclusion only if imminent danger of bodily harm and less restrictive interventions appear insufficient, with continuous monitoring, trained staff, immediate release when danger ends, same-day parent notice, and written documentation per A.R.S. §15-105.", "behavior", "any", ["{{deescalation}}"]),
        ("dyslexia_statement", "The student has been diagnosed with dyslexia; this is documented in the IEP as required for specific learning disability eligibility in Arizona (A.R.S. §15-763).", "compliance", "any", []),
    ]
    for component, text, category, band, placeholders in curated:
        snippets.append(snippet(component, text, category, band, placeholders))

    # Extracted language from the exemplar set.
    snippets += extract_list_snippets(exemplars, "accommodations", "accommodation")
    snippets += extract_list_snippets(exemplars, "supplementary_aids_services", "supplementary_aid")
    snippets += extract_list_snippets(exemplars, "program_modifications", "program_modification")
    snippets += extract_list_snippets(exemplars, "personnel_supports", "personnel_support")

    # Service types (deduplicated).
    svc = Counter()
    for e in exemplars:
        for s in e.get("services", []) or []:
            t = s.get("type", "").strip()
            if t:
                svc[t] += 1
    for text, n in svc.most_common():
        snippets.append(snippet("service_type", text, notes=f"appears in {n} exemplar(s)"))

    payload = {
        "version": "0.1",
        "disclaimer": "Starter snippets synthesized for drafting practice. Not legal advice. Verify district language before use.",
        "count": len(snippets),
        "snippets": snippets,
    }
    with open(os.path.join(BOILER_DIR, "snippets.json"), "w") as f:
        json.dump(payload, f, indent=2)
    return payload


if __name__ == "__main__":
    ex = load_exemplars()
    idx = build_index(ex)
    snip = build_snippets(ex)
    print(f"index.json: {idx['count']} exemplars")
    print(f"snippets.json: {snip['count']} snippets")
    by_comp = Counter(s["component"] for s in snip["snippets"])
    for c, n in by_comp.most_common():
        print(f"  {c}: {n}")
