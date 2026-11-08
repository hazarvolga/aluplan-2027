#!/usr/bin/env python3
"""Validate the akademi module content JSON (stdlib only — no YAML/zod).

Each src/data/akademi-content/<code>.json must match the content schema. Exits 1
on the first batch of errors so authoring mistakes fail `pnpm test`.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src/data/akademi-content"

LEVEL_SLUGS = {"temel", "orta", "ileri", "uzman"}
DURATION_LABELS = {"Anlatım", "Uygulama", "Ölçme", "Bireysel"}
EXPECTED_CODES = {"M1", "M2", "M3", "M4", "M4B", "M3B", "M5", "M6", "M7", "M8", "M9", "M10"}


def err(errors, path, msg):
    errors.append(f"{path.name}: {msg}")


def validate_module(path, data, errors):
    for field in ("code", "slug", "title", "levelSlug", "hours", "summary",
                  "format", "prerequisite", "outcomes", "sessionFlow",
                  "durationSplit", "runningProjectStep"):
        if field not in data:
            err(errors, path, f"missing field '{field}'")
    if data.get("levelSlug") not in LEVEL_SLUGS:
        err(errors, path, f"levelSlug not in {LEVEL_SLUGS}: {data.get('levelSlug')!r}")
    if not isinstance(data.get("hours"), int) or data.get("hours", 0) <= 0:
        err(errors, path, "hours must be a positive int")
    if not isinstance(data.get("slug"), str) or not data.get("slug"):
        err(errors, path, "slug must be a non-empty string")

    if data.get("levelSlug") == "ileri" and not data.get("trackTitle"):
        err(errors, path, "ileri module must declare a trackTitle")

    outcomes = data.get("outcomes") or []
    if not outcomes:
        err(errors, path, "outcomes must be non-empty")
    outcome_codes = []
    for i, o in enumerate(outcomes):
        if not {"text", "bloom", "code"} <= set(o or {}):
            err(errors, path, f"outcome[{i}] needs text/bloom/code")
        code = (o or {}).get("code")
        if code:
            outcome_codes.append(code)
    if len(outcome_codes) != len(set(outcome_codes)):
        err(errors, path, f"duplicate outcome codes within module: {outcome_codes}")

    flow = data.get("sessionFlow") or []
    if not flow:
        err(errors, path, "sessionFlow must be non-empty")
    for i, s in enumerate(flow):
        if not {"time", "phase", "instructor", "participant"} <= set(s or {}):
            err(errors, path, f"sessionFlow[{i}] needs time/phase/instructor/participant")

    split = data.get("durationSplit") or []
    if not split:
        err(errors, path, "durationSplit must be non-empty")
    for i, d in enumerate(split):
        if (d or {}).get("label") not in DURATION_LABELS:
            err(errors, path, f"durationSplit[{i}] label not in {DURATION_LABELS}")
        if not isinstance((d or {}).get("minutes"), int) or (d or {}).get("minutes", 0) <= 0:
            err(errors, path, f"durationSplit[{i}] minutes must be a positive int")

    validate_quiz(path, data, errors)
    validate_body(path, data, errors)


def validate_quiz(path, data, errors):
    """Validate the optional interactive quiz: each question needs id/prompt/
    explanation and multiple-choice options with exactly one correct."""
    quiz = data.get("quiz")
    if quiz is None:
        return
    if not quiz:
        err(errors, path, "quiz, when present, must be non-empty")
        return
    seen_ids = set()
    for i, q in enumerate(quiz):
        q = q or {}
        for field in ("id", "prompt", "explanation", "options"):
            if field not in q:
                err(errors, path, f"quiz[{i}] missing '{field}'")
        qid = q.get("id")
        if qid in seen_ids:
            err(errors, path, f"quiz[{i}] duplicate id {qid!r}")
        seen_ids.add(qid)
        options = q.get("options") or []
        if len(options) < 3:
            err(errors, path, f"quiz[{i}] needs at least 3 options")
        correct = [o for o in options if (o or {}).get("correct") is True]
        if len(correct) != 1:
            err(errors, path, f"quiz[{i}] must have exactly one correct option (got {len(correct)})")
        for j, o in enumerate(options):
            if not isinstance((o or {}).get("text"), str) or not (o or {}).get("text"):
                err(errors, path, f"quiz[{i}].options[{j}] needs non-empty text")


def validate_body(path, data, errors):
    """Validate the optional lesson-body fields when present."""
    steps = data.get("applicationSteps")
    if steps is not None:
        if not steps:
            err(errors, path, "applicationSteps, when present, must be non-empty")
        for i, s in enumerate(steps):
            if not isinstance((s or {}).get("step"), str) or not (s or {}).get("step"):
                err(errors, path, f"applicationSteps[{i}] needs non-empty step")
    mistakes = data.get("commonMistakes")
    if mistakes is not None:
        for i, m in enumerate(mistakes):
            if not {"mistake", "symptom", "fix"} <= set(m or {}):
                err(errors, path, f"commonMistakes[{i}] needs mistake/symptom/fix")
    diff = data.get("differentiation")
    if diff is not None and not {"fast", "support"} <= set(diff or {}):
        err(errors, path, "differentiation needs fast/support")


def main():
    if not CONTENT_DIR.is_dir():
        print(f"missing content dir {CONTENT_DIR}", file=sys.stderr)
        return 1
    errors = []
    codes, slugs = {}, {}
    for path in sorted(CONTENT_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            err(errors, path, f"invalid JSON: {exc}")
            continue
        validate_module(path, data, errors)
        code = data.get("code")
        if code in codes:
            err(errors, path, f"duplicate code {code} (also {codes[code]})")
        codes[code] = path.name
        key = (data.get("levelSlug"), data.get("slug"))
        if key in slugs:
            err(errors, path, f"duplicate slug {key} (also {slugs[key]})")
        slugs[key] = path.name

    present = set(codes)
    if present != EXPECTED_CODES:
        errors.append(f"codes {sorted(present)} != expected {sorted(EXPECTED_CODES)}")

    if errors:
        print("akademi content INVALID:")
        for e in errors:
            print("  -", e)
        return 1
    print(f"akademi content OK ({len(codes)} modules)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
