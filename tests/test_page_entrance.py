"""Hero entrance line is decorative, full width, and motion-aware."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PageEntranceTests(unittest.TestCase):
    def test_hero_line_is_shared_at_hero_boundaries(self):
        for name in ('HomepageMaxPreviewHero.tsx', 'HomepageView.tsx', 'SubpageHeroSection.tsx', 'ProductHero.tsx', 'CompactPageHero.tsx', 'ScalypsoPageContent.tsx', 'ScalypsoModeler.tsx', 'ScalypsoSubpage.tsx'):
            with self.subTest(component=name):
                self.assertIn('<HeroBottomLine />', (ROOT / 'src/components/sections' / name).read_text())
        shell = (ROOT / 'src/components/shell/SiteShell.tsx').read_text()
        self.assertNotIn('<PageEntrance />', shell)

    def test_line_is_full_width_and_accessible_without_animation(self):
        component = ROOT / 'src/components/sections/HeroBottomLine.tsx'
        css_path = ROOT / 'src/components/sections/HeroBottomLine.module.css'
        self.assertTrue(component.exists())
        self.assertTrue(css_path.exists())
        text, css = component.read_text(), css_path.read_text()
        self.assertIn('aria-hidden="true"', text)
        self.assertIn('key={pathname}', text)
        self.assertIn('width: 100%', css)
        self.assertIn('bottom: 0', css)
        self.assertIn('prefers-reduced-motion: no-preference', css)
        self.assertIn('min-width: 768px', css)
        self.assertIn('pointer-events: none', css)

    def test_homepage_does_not_repeat_interior_accent(self):
        hero = (ROOT / 'src/components/sections/HomepageMaxPreviewHero.tsx').read_text()
        self.assertNotIn('styles.accentLine', hero)


if __name__ == '__main__':
    unittest.main()
