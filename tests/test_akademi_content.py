"""The akademi content model: per-module JSON (committed), validated by a stdlib
Python validator. No YAML/zod dependency; the JSON is the single source of truth."""

from pathlib import Path
import importlib.util
import json
import re
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "src/data/akademi-content"
VALIDATOR = ROOT / "scripts/validate_akademi_content.py"


def _load_validator():
    spec = importlib.util.spec_from_file_location("validate_akademi_content", VALIDATOR)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

REQUIRED = ("code", "slug", "title", "levelSlug", "hours", "outcomes", "sessionFlow",
            "durationSplit", "runningProjectStep")
DURATION_LABELS = {"Anlatım", "Uygulama", "Ölçme", "Bireysel"}
EXPECTED_CODES = {"M1", "M2", "M3", "M4", "M4B", "M3B", "M5", "M6", "M7", "M8", "M9", "M10"}
LEVEL_SLUGS = {"temel", "orta", "ileri", "uzman"}


def modules():
    for path in sorted(CONTENT_DIR.glob("*.json")):
        yield path, json.loads(path.read_text(encoding="utf-8"))


class AkademiContentTests(unittest.TestCase):
    def test_validator_is_stdlib_only(self):
        src = VALIDATOR.read_text(encoding="utf-8")
        self.assertNotRegex(src, r"import\s+yaml")
        self.assertNotRegex(src, r"import\s+zod")

    def test_all_twelve_modules_present(self):
        codes = {m["code"] for _, m in modules()}
        self.assertEqual(codes, EXPECTED_CODES)

    def test_every_module_has_required_fields(self):
        for path, m in modules():
            with self.subTest(file=path.name):
                for field in REQUIRED:
                    self.assertIn(field, m)
                self.assertIn(m["levelSlug"], LEVEL_SLUGS)
                self.assertTrue(m["outcomes"], "outcomes non-empty")
                for o in m["outcomes"]:
                    self.assertTrue({"text", "bloom", "code"} <= set(o))
                self.assertTrue(m["sessionFlow"], "sessionFlow non-empty")
                labels = {s["label"] for s in m["durationSplit"]}
                self.assertTrue(labels <= DURATION_LABELS, f"bad duration labels: {labels}")

    def test_slugs_are_unique_within_level(self):
        seen = {}
        for path, m in modules():
            key = (m["levelSlug"], m["slug"])
            self.assertNotIn(key, seen, f"duplicate slug {key} in {path.name} and {seen.get(key)}")
            seen[key] = path.name

    def test_outcome_codes_are_unique_within_a_module(self):
        for path, m in modules():
            with self.subTest(file=path.name):
                codes = [o["code"] for o in m["outcomes"] if o.get("code")]
                self.assertEqual(len(codes), len(set(codes)),
                                 f"{path.name}: duplicate outcome codes {codes}")

    def test_ileri_modules_declare_a_track(self):
        for path, m in modules():
            if m["levelSlug"] == "ileri":
                with self.subTest(file=path.name):
                    self.assertTrue(m.get("trackTitle"), f"{path.name}: ileri module needs a trackTitle")

    def test_validator_rejects_quiz_without_exactly_one_correct_option(self):
        mod = _load_validator()
        bad = {
            "quiz": [
                {"id": "Q1", "prompt": "x?", "explanation": "e",
                 "options": [{"text": "a", "correct": True}, {"text": "b", "correct": True}]},
            ],
        }
        errors = []
        mod.validate_quiz(Path("BAD.json"), bad, errors)
        self.assertTrue(any("exactly one correct" in e for e in errors), errors)

    def test_validator_accepts_a_well_formed_quiz(self):
        mod = _load_validator()
        ok = {
            "quiz": [
                {"id": "Q1", "prompt": "x?", "explanation": "e",
                 "options": [{"text": "a", "correct": True}, {"text": "b", "correct": False},
                             {"text": "c", "correct": False}, {"text": "d", "correct": False}]},
            ],
        }
        errors = []
        mod.validate_quiz(Path("OK.json"), ok, errors)
        self.assertEqual(errors, [])

    def test_validator_passes_on_the_content(self):
        result = subprocess.run([sys.executable, str(VALIDATOR)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
