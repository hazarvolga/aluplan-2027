"""The module detail page renders the lesson body (steps, mistakes, differentiation) and an
interactive self-assessment quiz whose results live only in the browser's localStorage."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "src/data/akademi-content"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiQuizComponentTests(unittest.TestCase):
    def test_quiz_is_a_client_component_with_guarded_storage(self):
        src = read("src/components/akademi/AkademiQuiz.tsx")
        self.assertIn("'use client'", src)
        self.assertIn("localStorage", src)
        # Storage access is wrapped so private windows / blocked storage don't crash the quiz.
        self.assertIn("try {", src)
        self.assertIn("catch", src)
        self.assertIn("QuizQuestion", src)

    def test_quiz_reveals_correct_answer_and_explanation(self):
        src = read("src/components/akademi/AkademiQuiz.tsx")
        self.assertIn("explanation", src)
        self.assertIn("correct", src)

    def test_quiz_css_uses_tokens_not_literal_colors(self):
        css = read("src/components/akademi/AkademiQuiz.module.css")
        self.assertNotRegex(css, r"#[0-9a-fA-F]{3,8}\b")
        self.assertNotRegex(css, r"\brg?ba?\(")


class AkademiModuleLessonRenderTests(unittest.TestCase):
    def test_detail_renders_lesson_body_and_quiz(self):
        src = read("src/components/sections/AkademiModuleDetail.tsx")
        for token in ("applicationSteps", "commonMistakes", "differentiation",
                      "AkademiQuiz", "module.quiz"):
            with self.subTest(token=token):
                self.assertIn(token, src)

    def test_detail_sections_are_conditional(self):
        # Each lesson-body section renders only when its data is present.
        src = read("src/components/sections/AkademiModuleDetail.tsx")
        self.assertIn("module.applicationSteps && module.applicationSteps.length > 0", src)
        self.assertIn("module.quiz && module.quiz.length > 0", src)


class AkademiLessonContentTests(unittest.TestCase):
    def modules(self):
        for path in sorted(CONTENT_DIR.glob("*.json")):
            yield path, json.loads(path.read_text(encoding="utf-8"))

    def test_every_module_has_application_steps_mistakes_and_quiz(self):
        for path, m in self.modules():
            with self.subTest(file=path.name):
                self.assertTrue(m.get("applicationSteps"), "applicationSteps present")
                self.assertTrue(m.get("commonMistakes"), "commonMistakes present")
                self.assertTrue(m.get("differentiation"), "differentiation present")
                self.assertTrue(m.get("quiz"), "quiz present")

    def test_every_quiz_question_has_one_correct_option(self):
        for path, m in self.modules():
            for q in m.get("quiz") or []:
                with self.subTest(file=path.name, q=q.get("id")):
                    correct = [o for o in q["options"] if o.get("correct")]
                    self.assertEqual(len(correct), 1, f"{q.get('id')}: one correct option")
                    self.assertGreaterEqual(len(q["options"]), 3)

    def test_quiz_outcome_codes_reference_real_outcomes(self):
        for path, m in self.modules():
            valid = {o["code"] for o in m["outcomes"] if o.get("code")}
            for q in m.get("quiz") or []:
                code = q.get("outcomeCode")
                if code:
                    with self.subTest(file=path.name, q=q.get("id")):
                        self.assertIn(code, valid, f"{q.get('id')}: outcomeCode {code} not a module outcome")


if __name__ == "__main__":
    unittest.main()
