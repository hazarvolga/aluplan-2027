import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokens } from './token-engine.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'tokens/tokens.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'components/responsive.template.css'), 'utf8');
const result = buildTokens(tokens, { responsiveTemplate: template });
if (result.errors.length) throw new Error(result.errors.join('\n'));
for (const [name, text] of Object.entries(result.files)) {
  const target = path.join(root, name);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== text) throw new Error(`Token drift: ${name}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
}
console.log(JSON.stringify(result.stats));
