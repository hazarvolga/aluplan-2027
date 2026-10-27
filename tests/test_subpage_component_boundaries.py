"""Architectural contracts for progressively splitting the large subpage renderer."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class SubpageComponentBoundaryTests(unittest.TestCase):
    def test_about_editorial_has_a_dedicated_render_boundary(self):
        component = read("src/components/sections/AboutEditorialSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertIn("import type { PageRecord }", component)
        self.assertNotIn("'use client'", component)
        for marker in [
            "alu-about-editorial",
            "Kurumsal Göstergeler",
            "Hikayemiz",
            "Değerlerimiz",
            "Ofisimiz",
            "29+",
            "500+",
            "50+",
            "10K+",
            'href="/contact"',
            'href="/references"',
            "mapEmbed.src",
            'loading="lazy"',
            'referrerPolicy="no-referrer-when-downgrade"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { AboutEditorialSection } from './AboutEditorialSection';", parent)
        self.assertIn("page.path === '/about' && <AboutEditorialSection page={page} />", parent)
        self.assertNotIn("alu-about-editorial", parent)


if __name__ == "__main__":
    unittest.main()
