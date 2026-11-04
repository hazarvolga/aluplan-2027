import hashlib
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FontReuseTests(unittest.TestCase):
    def test_plex_sans_subsets_are_identical_and_share_one_url(self):
        source = (ROOT / 'design-system/tokens/fonts.css').read_text()
        generated = (ROOT / 'src/styles/globals.css').read_text()
        for subset in ('latin', 'latin-ext'):
            hashes = []
            for weight in (400, 500, 600):
                filename = f'IBMPlexSans-{weight}-normal-{subset}.woff2'
                original = (ROOT / 'design-system/assets/fonts' / filename).read_bytes()
                public = (ROOT / 'public/assets/fonts' / filename).read_bytes()
                self.assertEqual(original, public, filename)
                hashes.append(hashlib.sha256(original).hexdigest())
                for css in (source, generated):
                    rules = re.findall(r"@font-face\{font-family:'IBM Plex Sans';[^}]+\}", css)
                    face = [r for r in rules if f'font-weight:{weight};' in r and f'normal-{subset}.woff2' in r]
                    self.assertEqual(len(face), 1, f'{weight} {subset}')
                    self.assertIn(f'IBMPlexSans-400-normal-{subset}.woff2', face[0])
                    expected = 'U+0000-00FF' if subset == 'latin' else 'U+0100-02BA'
                    self.assertIn(f'unicode-range:{expected}', face[0])
                    self.assertIn('font-display:swap', face[0])
            self.assertEqual(len(set(hashes)), 1, subset)
