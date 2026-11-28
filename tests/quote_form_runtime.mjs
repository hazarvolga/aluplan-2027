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
const validation = evaluate('src/lib/quote-validation.ts', (request) => {
  if (request === './quote-catalog' || request === '@/lib/quote-catalog') return catalog;
  throw new Error(`Unsupported quote-validation import: ${request}`);
});

const contact = {
  fullName: 'Deneme Kullanıcı',
  email: 'deneme@example.com',
  phone: '0532 000 00 00',
  company: 'Örnek Mimarlık',
  city: 'İstanbul',
  workArea: 'ozel',
  heardFrom: ['google'],
  notes: '',
  consent: true,
  website: '',
};

const cases = {
  validAllplan: { ...contact, line: 'allplan', products: ['allplan-max', 'allplan-civil'], requestTypes: ['fiyat-teklifi'] },
  emptySubmission: {},
  unknownLine: { ...contact, line: 'does-not-exist', products: [], requestTypes: ['fiyat-teklifi'] },
  foreignProduct: { ...contact, line: 'allplan', products: ['bimflex'], requestTypes: ['fiyat-teklifi'] },
  noProducts: { ...contact, line: 'ax3000', products: [], requestTypes: ['teknik-bilgi'] },
  noRequestType: { ...contact, line: 'allplan', products: ['allplan-basic'], requestTypes: [] },
  singleProductLine: { ...contact, line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
  sds2WithJobTitle: { ...contact, line: 'sds2', products: [], requestTypes: ['teknik-bilgi'], jobTitle: 'steel-detailer' },
  sds2BadJobTitle: { ...contact, line: 'sds2', products: [], requestTypes: ['teknik-bilgi'], jobTitle: 'astronaut' },
  scalypsoNoMode: { ...contact, line: 'scalypso', products: [] },
  scalypsoTrial: { ...contact, line: 'scalypso', products: [], scalypsoMode: 'deneme' },
  bimAddonNoCustomerNumber: { ...contact, line: 'aluplan-bim-eklentisi', products: [] },
  bimAddonValid: { ...contact, line: 'aluplan-bim-eklentisi', products: [], customerNumber: 'C300 000 000 0' },
  studentMissingAck: { ...contact, line: 'ogrenci', products: [], department: 'mimarlik', workArea: 'ozel' },
  studentValid: { ...contact, line: 'ogrenci', products: [], department: 'mimarlik', documentAck: true, workArea: 'ozel' },
  badEmail: { ...contact, email: 'deneme@', line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
  badPhone: { ...contact, phone: '12ab', line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
  noConsent: { ...contact, consent: false, line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
  honeypotFilled: { ...contact, website: 'http://spam.example', line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
  noHeardFrom: { ...contact, heardFrom: [], line: 'bimflex', products: [], requestTypes: ['fiyat-teklifi'] },
};

const results = Object.fromEntries(
  Object.entries(cases).map(([name, input]) => [name, validation.validateQuoteRequest(input)]),
);

const lineIds = catalog.QUOTE_LINES.map((line) => line.id);
const productIds = catalog.QUOTE_LINES.flatMap((line) => line.products.map((product) => product.id));

console.log(
  JSON.stringify({
    results,
    lineIds,
    productIds,
    groupIds: catalog.QUOTE_GROUPS.map((group) => group.id),
    preselect: {
      line: catalog.resolvePreselection('sds2'),
      product: catalog.resolvePreselection('allplan-max'),
      unknown: catalog.resolvePreselection('nope'),
      empty: catalog.resolvePreselection(undefined),
    },
    studentDownloadUrl: catalog.STUDENT_DOWNLOAD_URL,
  }),
);
