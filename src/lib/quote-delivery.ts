// Server-side delivery of a validated quote request. The route keeps the request on disk
// until the mail server accepts it, so an outage delays a request instead of losing it.
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildCustomerMail, buildStaffMail, type QuoteMailMeta } from './quote-mail';
import type { QuoteRequest } from './quote-validation';

export interface DeliveryConfig {
  smtp: { host: string; port: number; user: string; password: string };
  from: string;
  recipients: string[];
  journalDir: string;
  sendCustomerMail: boolean;
}

export interface JournalEntry {
  request: QuoteRequest;
  meta: QuoteMailMeta;
}

export interface OutgoingMail {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type SendMail = (mail: OutgoingMail) => Promise<void>;

const DEFAULT_SMTP_PORT = 587;
const DEFAULT_JOURNAL_DIR = '/data/quote-journal';
const SENDER_NAME = 'Aluplan Teklif Formu';
const ENTRY_SUFFIX = '.json';
const SAFE_ID = /^[A-Za-z0-9_-]+$/;

type Env = Record<string, string | undefined>;
const value = (env: Env, key: string): string => (env[key] ?? '').trim();

/** Returns null when a required setting is missing, so the route can refuse instead of half-working. */
export function readDeliveryConfig(env: Env): DeliveryConfig | null {
  const host = value(env, 'QUOTE_SMTP_HOST');
  const user = value(env, 'QUOTE_SMTP_USER');
  const password = env.QUOTE_SMTP_PASSWORD ?? '';
  const from = value(env, 'QUOTE_MAIL_FROM');
  const recipients = value(env, 'QUOTE_MAIL_TO')
    .split(',')
    .map((address) => address.trim())
    .filter((address) => address !== '');
  if (!host || !user || !password || !from || recipients.length === 0) return null;

  const port = Number.parseInt(value(env, 'QUOTE_SMTP_PORT'), 10);
  return {
    smtp: { host, port: Number.isInteger(port) && port > 0 ? port : DEFAULT_SMTP_PORT, user, password },
    from,
    recipients,
    journalDir: value(env, 'QUOTE_JOURNAL_DIR') || DEFAULT_JOURNAL_DIR,
    sendCustomerMail: value(env, 'QUOTE_SEND_CUSTOMER_MAIL') === '1',
  };
}

export interface RateLimiter {
  allow: (key: string, now: number) => boolean;
}

/** Fixed-window counter held in memory: enough for one container and a low-volume form. */
export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const windows = new Map<string, { startedAt: number; count: number }>();
  return {
    allow(key, now) {
      const current = windows.get(key);
      if (!current || now - current.startedAt >= windowMs) {
        windows.set(key, { startedAt: now, count: 1 });
        return true;
      }
      if (current.count >= limit) return false;
      windows.set(key, { ...current, count: current.count + 1 });
      return true;
    },
  };
}

const entryPath = (dir: string, id: string): string => path.join(dir, `${id}${ENTRY_SUFFIX}`);

export async function saveJournalEntry(dir: string, entry: JournalEntry): Promise<string> {
  await mkdir(dir, { recursive: true });
  const id = randomUUID();
  // "wx" fails instead of overwriting; mode 600 keeps personal data readable by the app user only.
  await writeFile(entryPath(dir, id), JSON.stringify(entry), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  return id;
}

export async function removeJournalEntry(dir: string, id: string): Promise<void> {
  if (!SAFE_ID.test(id)) throw new Error('Invalid journal entry id');
  await unlink(entryPath(dir, id));
}

/** Lists entries still waiting for delivery and deletes the ones past the retention window. */
export async function listPendingEntries(
  dir: string,
  now: number,
  maxAgeMs: number,
): Promise<Array<{ id: string; entry: JournalEntry }>> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  const ids = names.filter((name) => name.endsWith(ENTRY_SUFFIX)).map((name) => name.slice(0, -ENTRY_SUFFIX.length));
  const loaded = await Promise.all(
    ids.filter((id) => SAFE_ID.test(id)).map(async (id) => {
      const entry = JSON.parse(await readFile(entryPath(dir, id), 'utf8')) as JournalEntry;
      const receivedAt = Date.parse(entry.meta?.receivedAt ?? '');
      const isExpired = Number.isNaN(receivedAt) || now - receivedAt > maxAgeMs;
      if (isExpired) await unlink(entryPath(dir, id));
      return isExpired ? null : { id, entry };
    }),
  );
  return loaded.filter((item): item is { id: string; entry: JournalEntry } => item !== null);
}

/** Sends the staff mail first: it is the one that must arrive. Any failure reaches the caller. */
export async function deliverQuote(entry: JournalEntry, config: DeliveryConfig, send: SendMail): Promise<void> {
  const sender = `${SENDER_NAME} <${config.from}>`;
  const staff = buildStaffMail(entry.request, entry.meta);
  await send({ from: sender, to: config.recipients, subject: staff.subject, html: staff.html, text: staff.text, replyTo: staff.replyTo });
  if (!config.sendCustomerMail) return;
  const customer = buildCustomerMail(entry.request);
  await send({ from: sender, to: [entry.request.email], subject: customer.subject, html: customer.html, text: customer.text });
}
