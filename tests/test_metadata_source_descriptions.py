import subprocess
import unittest
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class MetadataSourceDescriptionsTests(unittest.TestCase):
    def test_json_ld_uses_the_same_complete_description(self):
        graph = json.loads(subprocess.check_output(['node', 'tests/schema_runtime.mjs', '/faq'], cwd=ROOT, text=True))['@graph']
        page = next(item for item in graph if item.get('headline') == 'Sıkça Sorulan Sorular')
        self.assertEqual(page['description'], 'Sıkça Sorulan Sorular: Allplan lisanslama, teknik özellikler ve abonelik modelleri hakkında merak ettikleriniz. Allplan abonelik sistemi, ödeme seçenekleri ve iptal koşulları hakkında bilgiler.')

    def test_generated_cutoffs_use_complete_existing_source_text(self):
        script = """
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { metadataDescription } from './src/lib/metadata-description.ts';
const pages = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
for (const path of ['/about', '/products', '/faq', '/solutions/architecture', '/products/allplan-aec', '/products/allplan-2026', '/solutions/rebar-engineering']) {
  const page = pages[path];
  const result = metadataDescription(page);
  assert.notEqual(result, page.description, path);
  assert.ok(result.startsWith(page.description), `${path}: existing text was lost`);
  assert.ok(result.startsWith(`${page.h1}: `), path);
  const text = result.slice(page.h1.length + 2);
  const source = page.bodyNodes.filter(node => node.length > 35 && node !== page.h1).slice(0, 2).join(' ');
  assert.ok(source.startsWith(text), path);
  assert.ok(source === text || source.startsWith(text + ' '), path);
}
const verified = pages['/products/civil'];
assert.equal(metadataDescription(verified), verified.description);
const independent = {h1: 'Başlık', description: 'Başlık: ' + 'a'.repeat(155), bodyNodes: ['b'.repeat(200)]};
assert.equal(metadataDescription(independent), independent.description);
"""
        subprocess.run(['node', '--input-type=module', '-e', script], cwd=ROOT, check=True, capture_output=True, text=True)
