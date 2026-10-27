import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const sourcePath = path.join(root, 'src/components/sections/structured-tab-key.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;
const moduleRecord = { exports: {} };
new Function('exports', 'module', output)(moduleRecord.exports, moduleRecord);
const { handleStructuredTabKey } = moduleRecord.exports;

const run = (key, index, count, vertical = false) => {
  const focused = [];
  const selected = [];
  const tabs = Array.from({ length: count }, (_, tabIndex) => ({
    focus: () => focused.push(tabIndex)
  }));
  let prevented = false;
  handleStructuredTabKey(
    {
      key,
      preventDefault: () => {
        prevented = true;
      },
      currentTarget: {
        parentElement: {
          querySelectorAll: () => tabs
        }
      }
    },
    index,
    count,
    (nextIndex) => selected.push(nextIndex),
    vertical
  );
  return { key, selected, focused, prevented };
};

process.stdout.write(JSON.stringify({
  horizontal: [
    run('ArrowRight', 2, 3),
    run('ArrowLeft', 0, 3),
    run('Home', 2, 3),
    run('End', 0, 3),
    run('Enter', 1, 3)
  ],
  vertical: [
    run('ArrowDown', 2, 3, true),
    run('ArrowUp', 0, 3, true)
  ],
  empty: run('ArrowRight', 0, 0)
}));
