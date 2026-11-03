import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class YouTubeFeedLimitTests(unittest.TestCase):
    def test_stream_limit_and_fallback(self):
        script = r'''
const fs=require('fs'),vm=require('vm'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/lib/youtube-feed.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};vm.runInThisContext('(function(exports,require,module){'+code+'})')(mod.exports,()=>({}),mod);
const warnings=[];console.warn=(m)=>warnings.push(m);
const id='UCC3gd-xmQrHOVf-m6hkV2ig';
const xml='<entry><yt:videoId>abc12345678</yt:videoId><title>Test</title></entry>';
(async()=>{
 global.fetch=async()=>new Response(xml); const valid=await mod.exports.getChannelVideos(id);
 global.fetch=async()=>new Response(new Uint8Array(262145)); const oversized=await mod.exports.getChannelVideos(id);
 global.fetch=async()=>new Response('error',{status:503}); const failed=await mod.exports.getChannelVideos(id);
 process.stdout.write(JSON.stringify({valid,oversized,failed,warnings}));
})()
'''
        data = json.loads(subprocess.check_output(['node', '-e', script], cwd=ROOT, text=True))
        self.assertEqual(data['valid'], [{'id': 'abc12345678', 'title': 'Test'}])
        self.assertEqual(data['oversized'], [])
        self.assertEqual(data['failed'], [])
        self.assertEqual(len(data['warnings']), 2)
        self.assertTrue(all('abc12345678' not in w for w in data['warnings']))
