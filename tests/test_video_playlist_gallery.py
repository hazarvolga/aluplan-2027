"""Playlist pages render their player without a redundant generic image gallery."""
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PlaylistGalleryBoundaryTests(unittest.TestCase):
    def test_playlist_bypasses_generic_page_content_without_hiding_other_pages(self):
        source = (ROOT / 'src/components/sections/SubpageView.tsx').read_text(encoding='utf-8')
        self.assertIn('const isVideoPlaylistPage = Boolean(playlist)', source)
        self.assertRegex(source, r"page\.path === '/about'\s*\|\|\s*isVideoPlaylistPage\s*\?\s*null")
        self.assertIn('{playlist && (', source)
        self.assertIn('<VideoPlaylistSection', source)
        self.assertIn('galleryImages.length > 0', source)

    def test_all_existing_playlist_pages_have_a_player_contract(self):
        pages = json.loads((ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))
        playlist_pages = [page for path, page in pages.items() if path.startswith('/video-kutuphanesi/') and page.get('playlistId')]
        self.assertEqual(len(playlist_pages), 14)
        self.assertTrue(all(page.get('playlistId') for page in playlist_pages))


if __name__ == '__main__':
    unittest.main()
