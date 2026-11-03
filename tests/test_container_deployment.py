from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class ContainerDeploymentTests(unittest.TestCase):
    def test_dockerfile_uses_standalone_nonroot_and_explicit_interface(self):
        text = (ROOT / 'Dockerfile').read_text()
        self.assertIn('node:24', text)
        self.assertIn('corepack prepare pnpm@10.24.0', text)
        self.assertIn('--frozen-lockfile', text)
        self.assertIn('.next/standalone', text)
        self.assertIn('.next/static', text)
        self.assertIn('0.0.0.0', text)
        self.assertIn('USER node', text)
        self.assertIn('ALUPLAN_BLOCK_INDEXING', text)
        self.assertIn('ALUPLAN_SHOW_2027', text)
        self.assertIn("output: 'standalone'", (ROOT / 'next.config.mjs').read_text())

    def test_health_handler_is_uncached_and_has_no_secrets(self):
        text = (ROOT / 'src/app/health/route.ts').read_text()
        self.assertIn("'Cache-Control': 'no-store'", text)
        self.assertIn('Response.json', text)
        self.assertNotIn('process.env', text)

    def test_dockerignore_excludes_local_sensitive_artifacts(self):
        text = (ROOT / '.dockerignore').read_text()
        for item in ('.env*', 'node_modules', '.next', '.git', '.claude', '.superpowers'):
            self.assertIn(item, text)
