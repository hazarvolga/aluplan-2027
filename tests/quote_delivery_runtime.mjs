import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const nodeRequire = createRequire(import.meta.url);

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
const delivery = evaluate('src/lib/quote-delivery.ts', (request) => {
  if (request === './quote-mail') return mail;
  if (request.startsWith('node:')) return nodeRequire(request);
  throw new Error(`Unsupported quote-delivery import: ${request}`);
});

const request = {
  line: 'allplan',
  products: ['allplan-max'],
  requestTypes: ['fiyat-teklifi'],
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
  heardFrom: ['google'],
  notes: '',
  consent: true,
};
const meta = { receivedAt: '2026-11-28T09:30:00.000Z', sourcePath: '/teklif' };
const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse('2026-11-28T10:00:00.000Z');

const fullEnv = {
  QUOTE_SMTP_HOST: 'mail.example.test',
  QUOTE_SMTP_USER: 'teklif@example.test',
  QUOTE_SMTP_PASSWORD: 'not-a-real-secret',
  QUOTE_MAIL_FROM: 'teklif@example.test',
  QUOTE_MAIL_TO: 'a@example.test, b@example.test ,',
  QUOTE_JOURNAL_DIR: '/data/quotes',
};

async function run() {
  const config = delivery.readDeliveryConfig(fullEnv);
  const configs = {
    full: { ...config, smtp: { ...config.smtp, password: config.smtp.password ? '[set]' : '' } },
    missingPassword: delivery.readDeliveryConfig({ ...fullEnv, QUOTE_SMTP_PASSWORD: '' }),
    noRecipients: delivery.readDeliveryConfig({ ...fullEnv, QUOTE_MAIL_TO: ' , ' }),
    customerMailOn: delivery.readDeliveryConfig({ ...fullEnv, QUOTE_SEND_CUSTOMER_MAIL: '1' }).sendCustomerMail,
  };

  const limiter = delivery.createRateLimiter(2, 60_000);
  const rate = [limiter.allow('ip-a', 0), limiter.allow('ip-a', 1_000), limiter.allow('ip-a', 2_000), limiter.allow('ip-b', 2_000), limiter.allow('ip-a', 61_500)];

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quote-journal-'));
  const id = await delivery.saveJournalEntry(dir, { request, meta });
  const afterSave = fs.readdirSync(dir);
  const stored = JSON.parse(fs.readFileSync(path.join(dir, afterSave[0]), 'utf8'));
  await delivery.saveJournalEntry(dir, { request, meta: { ...meta, receivedAt: new Date(now - 40 * DAY).toISOString() } });
  const pending = await delivery.listPendingEntries(dir, now, 30 * DAY);
  const afterPurge = fs.readdirSync(dir).length;
  await delivery.removeJournalEntry(dir, id);
  const afterRemove = fs.readdirSync(dir).length;
  const missingDir = await delivery.listPendingEntries(path.join(dir, 'missing'), now, 30 * DAY);
  fs.rmSync(dir, { recursive: true, force: true });

  const sent = [];
  const send = async (message) => { sent.push(message); };
  await delivery.deliverQuote({ request, meta }, { ...config, sendCustomerMail: false }, send);
  const staffOnly = sent.length;
  await delivery.deliverQuote({ request, meta }, { ...config, sendCustomerMail: true }, send);
  let failure = null;
  try {
    await delivery.deliverQuote({ request, meta }, config, async () => { throw new Error('smtp down'); });
  } catch (error) {
    failure = error.message;
  }

  console.log(
    JSON.stringify({
      configs,
      rate,
      journal: { idIsSafe: /^[A-Za-z0-9_-]+$/.test(id), afterSave: afterSave.length, storedName: stored.request.fullName, pending: pending.length, afterPurge, afterRemove, missingDir },
      mails: { staffOnly, total: sent.length, staff: { ...sent[0], html: undefined, text: undefined }, customer: { ...sent[2], html: undefined, text: undefined } },
      failure,
    }),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
