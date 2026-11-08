"""The akademi signature motion uses GSAP only via dynamic import (kept out of the initial
bundle) and respects prefers-reduced-motion."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiMotionTests(unittest.TestCase):
    def test_gsap_is_imported_dynamically_only(self):
        src = read("src/components/akademi/motion/useSignatureReveal.ts")
        self.assertIn("import('gsap')", src)
        # No static gsap import that would pull it into the initial bundle.
        self.assertNotRegex(src, r"import\s+[^;]*\bfrom\s+['\"]gsap['\"]")

    def test_motion_respects_reduced_motion(self):
        src = read("src/components/akademi/motion/useSignatureReveal.ts")
        self.assertIn("prefers-reduced-motion", src)
        self.assertIn("matchMedia", src)

    def test_gsap_is_a_dependency(self):
        import json
        pkg = json.loads(read("package.json"))
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        self.assertIn("gsap", deps)


if __name__ == "__main__":
    unittest.main()
