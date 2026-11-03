"""The source pages preserve YouTube targets and interpret a bounded channel feed."""
from pathlib import Path
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = r'''
const fs = require('fs'), vm = require('vm'), ts = require('typescript');
function load(path) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
  const module = {exports: {}};
  vm.runInThisContext('(function(exports,require,module){'+code+'})')(module.exports, (name) => { if (name === 'server-only') return {}; throw Error(name); }, module);
  return module.exports;
}
const sources = load('src/lib/video-sources.ts'), feed = load('src/lib/youtube-feed.ts');
const entry = (i) => `<entry><yt:videoId>abc1234567${i}</yt:videoId><title>Video &amp; test ${i}</title></entry>`;
const xml = '<feed>' + Array.from({length: 20}, (_, i) => entry(i % 10)).join('') + '<entry><yt:videoId>bad</yt:videoId><title>No</title></entry></feed>';
process.stdout.write(JSON.stringify({sources:sources.VIDEO_SOURCES, bad:sources.getVideoSource('__proto__'), videos:feed.parseChannelFeed(xml)}));
'''

class VideoSourcesTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result = json.loads(subprocess.check_output(['node', '-e', SCRIPT], cwd=ROOT, text=True))

    def test_four_original_sources_are_mapped_and_untrusted_keys_rejected(self):
        data = json.loads((ROOT/'src/data/video-library.json').read_text())
        external = {item['url'] for item in data['items'] if item['url'].startswith('http')}
        self.assertEqual(external, {source['sourceUrl'] for source in self.result['sources'].values()})
        self.assertIsNone(self.result['bad'])
        self.assertEqual(len(self.result['sources']), 4)

    def test_feed_is_bounded_and_decodes_titles(self):
        videos = self.result['videos']
        self.assertEqual(len(videos), 15)
        self.assertEqual(videos[0], {'id': 'abc12345670', 'title': 'Video & test 0'})
        self.assertTrue(all(len(v['id']) == 11 for v in videos))

    def test_feed_failures_and_invalid_channel_ids_are_safe(self):
        script = r"""
const fs=require('fs'),vm=require('vm'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/lib/youtube-feed.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};vm.runInThisContext('(function(exports,require,module){'+code+'})')(mod.exports,()=>({}),mod);
let calls=0;global.fetch=async()=>{calls++;throw Error('offline')};
(async()=>{const invalid=await mod.exports.getChannelVideos('https://evil.test'); const offline=await mod.exports.getChannelVideos('UCC3gd-xmQrHOVf-m6hkV2ig'); process.stdout.write(JSON.stringify({invalid,offline,calls}))})()
"""
        result = json.loads(subprocess.check_output(['node', '-e', script], cwd=ROOT, text=True))
        self.assertEqual(result, {'invalid': [], 'offline': [], 'calls': 1})

    def test_original_sources_and_fallback_are_preserved(self):
        component = (ROOT/'src/components/sections/VideoSourcePage.tsx').read_text()
        self.assertIn('youtube-nocookie.com/embed/videoseries?list=', component)
        self.assertIn('Kanalı YouTube’da aç', component)
        self.assertIn('en fazla 15 video', component)
        self.assertIn('showFallbackDescription={false}', component)
        self.assertIn('showThumbnails={false}', component)
        self.assertIn('ConsentEmbed', component)

if __name__ == '__main__': unittest.main()
