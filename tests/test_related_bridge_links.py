import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class RelatedBridgeLinkTests(unittest.TestCase):
    def test_original_links_are_available_only_on_related_pages(self):
        script = """
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { relatedBridgeLinks } from './src/lib/related-links.ts';
const pages = JSON.parse(fs.readFileSync('./src/data/pages.json', 'utf8'));
assert.deepEqual(relatedBridgeLinks(pages['/solutions/bridge-design']).map(x => x.href), ['/solutions/modeling-of-precast-girder-bridges', '/solutions/features-allplan-bridge']);
assert.deepEqual(relatedBridgeLinks(pages['/products/civil']).map(x => x.href), ['/solutions/modeling-of-precast-girder-bridges']);
assert.deepEqual(relatedBridgeLinks(pages['/solutions']), []);
"""
        subprocess.run(['node', '--input-type=module', '-e', script], cwd=ROOT, check=True, capture_output=True, text=True)
