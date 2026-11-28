import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function transpile(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: relativePath,
  }).outputText;
}

function evaluate(relativePath, requireModule) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', transpile(relativePath))(requireModule, module, module.exports);
  return module.exports;
}

const catalog = evaluate('src/lib/quote-catalog.ts', () => {
  throw new Error('quote-catalog must not import modules');
});
const mail = evaluate('src/lib/quote-mail.ts', (request) => {
  if (request === './quote-catalog') return catalog;
  throw new Error(`Unsupported quote-mail import: ${request}`);
});

const base = {
  requestTypes: [],
  jobTitle: '',
  scalypsoMode: '',
  customerNumber: '',
  department: '',
  documentAck: false,
  fullName: 'Deneme Kullanıcı',
  email: 'deneme@example.com',
  phone: '05320000000',
  company: 'Örnek Mimarlık',
  city: 'İstanbul',
  workArea: 'ozel',
  heardFrom: ['google', 'referans'],
  notes: '',
  consent: true,
};

const requests = {
  allplan: { ...base, line: 'allplan', products: ['allplan-max', 'allplan-civil'], requestTypes: ['fiyat-teklifi'] },
  hostile: {
    ...base,
    line: 'bimflex',
    products: ['bimflex'],
    requestTypes: ['teknik-bilgi'],
    company: 'A & B <b>Yapı</b>',
    notes: '<script>alert(1)</script>\nİkinci satır',
  },
  student: {
    ...base,
    line: 'ogrenci',
    products: ['allplan-ogrenci-surumu'],
    department: 'mimarlik',
    documentAck: true,
    company: 'Örnek Üniversitesi',
    workArea: 'ogrenci',
  },
};

const meta = { receivedAt: '2026-11-28T09:30:00.000Z', sourcePath: '/teklif?urun=allplan-max' };

console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(requests).map(([name, request]) => [
        name,
        { staff: mail.buildStaffMail(request, meta), customer: mail.buildCustomerMail(request) },
      ]),
    ),
  ),
);
