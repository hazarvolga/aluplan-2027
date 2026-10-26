// Compatibility entry point. The Python implementation is the sole data producer.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('./generate_site_data.py', import.meta.url));
const result = spawnSync('python3', [script], { stdio: 'inherit' });
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status ?? 1);
