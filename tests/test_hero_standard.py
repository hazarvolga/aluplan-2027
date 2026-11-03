"""Subpage heroes follow the compact standard: h1 at the page scale, compact spacing, no repeated title in the lead."""

from pathlib import Path
from html.parser import HTMLParser
import json
import os
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / ".next/server/app"


def hero_lead(title: str, description: str) -> str:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/lib/hero-lead.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        f"process.stdout.write(JSON.stringify(m.exports.heroLead({json.dumps(title)}, {json.dumps(description)})));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


class HeroLeadTests(unittest.TestCase):
    def test_a_repeated_title_prefix_is_dropped(self):
        self.assertEqual(hero_lead("KVKK Aydınlatma Metni", "KVKK Aydınlatma Metni: Kişisel Verilerin İşlenmesine İlişkin Metin"), "Kişisel Verilerin İşlenmesine İlişkin Metin")

    def test_prefix_match_ignores_case(self):
        self.assertEqual(hero_lead("Gizlilik Politikası", "GİZLİLİK POLİTİKASI: Bilgileriniz korunur"), "Bilgileriniz korunur")

    def test_other_descriptions_are_left_as_they_are(self):
        self.assertEqual(hero_lead("Hakkımızda", "1995'ten beri Türkiye'de."), "1995'ten beri Türkiye'de.")
        self.assertEqual(hero_lead("Başlık", "Başlık: "), "Başlık: ")
        self.assertEqual(hero_lead("Başlık", "Başlık"), "Başlık")


class HeroSourceTests(unittest.TestCase):
    def setUp(self):
        self.component = (ROOT / "src/components/sections/SubpageHeroSection.tsx").read_text(encoding="utf-8")
        self.css = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")

    def test_h1_uses_the_page_scale_and_the_lead_is_de_duplicated(self):
        self.assertIn('className="alu-h1"', self.component)
        self.assertNotIn("alu-display", self.component)
        self.assertIn("heroLead(page.h1, page.description)", self.component)

    def test_actions_use_the_standard_button_size(self):
        self.assertNotIn("alu-button--lg", self.component)

    def test_hero_spacing_matches_the_compact_hero(self):
        rule = re.search(r"\n\.alu-subpage-hero \{(.*?)\n\}", self.css, re.S).group(1)
        self.assertIn("padding-block: var(--space-stack-lg) var(--space-stack-xl);", rule)
        self.assertNotIn("subpage-hero-padding", rule)


class _Hero(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.on = 0
        self.depth = 0
        self.mode = None
        self.h1 = ""
        self.lead = ""

    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class", "")
        if tag == "section" and "alu-subpage-hero" in cls:
            self.on, self.depth = 1, 0
        if self.on:
            self.depth += 1
            if tag == "h1":
                self.mode = "h1"
            elif tag == "p" and "alu-body-lg" in cls:
                self.mode = "lead"

    def handle_endtag(self, tag):
        if self.on:
            self.depth -= 1
            if tag in ("h1", "p"):
                self.mode = None
            if self.depth <= 0:
                self.on = 0

    def handle_data(self, data):
        if self.on and self.mode == "h1":
            self.h1 += data
        if self.on and self.mode == "lead":
            self.lead += data


class HeroRenderTests(unittest.TestCase):
    def test_no_built_subpage_hero_repeats_its_title_in_the_lead(self):
        if not (APP / "index.html").is_file():
            self.skipTest("build output missing")
        checked, repeated = 0, []
        for base, _, files in os.walk(APP):
            for name in files:
                path = Path(base) / name
                if name.endswith(".html") and "/preview/" not in str(path) and "/_" not in str(path):
                    html = re.sub(r"<script.*?</script>", "", path.read_text(encoding="utf-8"), flags=re.S)
                    parser = _Hero()
                    parser.feed(html)
                    if not parser.h1:
                        continue
                    checked += 1
                    title, lead = " ".join(parser.h1.split()), " ".join(parser.lead.split())
                    if lead.lower().startswith(title.lower() + ":") and len(lead) > len(title) + 2:
                        repeated.append(str(path.relative_to(APP)))
        self.assertGreater(checked, 80)
        self.assertEqual(repeated, [])


if __name__ == "__main__":
    unittest.main()
