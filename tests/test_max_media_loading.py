"""Allplan Max media downloads nothing heavy until a visitor reaches or plays it."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CLIP = ROOT / "src/components/sections/AllplanMaxFeatureClip.tsx"
PAGE = ROOT / "src/components/sections/AllplanMaxPreviewPage.tsx"


class MaxMediaLoadingTests(unittest.TestCase):
    def test_clip_defers_source_until_visible(self):
        source = CLIP.read_text(encoding="utf-8")
        self.assertIn("IntersectionObserver", source)
        self.assertIn("{visible && <video", source)
        self.assertIn("src={`${src}#t=0.1`}", source)

    def test_clip_shows_first_frame_when_it_cannot_autoplay(self):
        source = CLIP.read_text(encoding="utf-8")
        self.assertIn("preload={visible && !canAutoplay ? 'metadata' : 'none'}", source)
        self.assertNotIn("<source", source)

    def test_clip_autoplays_only_on_wide_screens_without_reduced_motion(self):
        source = CLIP.read_text(encoding="utf-8")
        self.assertIn("(min-width: 768px) and (prefers-reduced-motion: no-preference)", source)
        self.assertNotIn("autoPlay", source)

    def test_feature_clips_have_matching_local_posters(self):
        page = PAGE.read_text(encoding="utf-8")
        features = re.findall(r"clip: '([^']+\.mp4)', poster: '([^']+)'", page)
        self.assertEqual(len(features), 3)
        for clip, poster in features:
            with self.subTest(clip=clip):
                self.assertEqual(Path(clip).stem, Path(poster).stem)
                asset = ROOT / 'public/assets/previews/allplan-max' / poster
                self.assertTrue(asset.is_file())
                self.assertGreater(asset.stat().st_size, 0)
        self.assertIn('poster={poster}', CLIP.read_text(encoding='utf-8'))

    def test_intro_video_loads_on_demand_with_poster(self):
        video = re.search(r"<video[^>]*Allplan Max|<video[^>]*ALLPLAN Max[^>]*>", PAGE.read_text(encoding="utf-8"))
        self.assertIsNotNone(video)
        tag = video.group(0)
        self.assertIn('preload="none"', tag)
        self.assertIn('poster="/assets/previews/home-2027/allplan-max-generated-v2.jpg"', tag)


if __name__ == "__main__":
    unittest.main()
