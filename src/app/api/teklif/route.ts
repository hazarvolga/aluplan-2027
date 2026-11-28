import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  createRateLimiter,
  deliverQuote,
  listPendingEntries,
  readDeliveryConfig,
  removeJournalEntry,
  saveJournalEntry,
  type DeliveryConfig,
  type JournalEntry,
  type SendMail,
} from '@/lib/quote-delivery';
import { validateQuoteRequest } from '@/lib/quote-validation';
import { isQuoteFormEnabled } from '@/lib/release-flags';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;
const MAX_SOURCE_PATH_LENGTH = 200;
const REQUESTS_PER_WINDOW = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const SMTP_TIMEOUT_MS = 15_000;
const MAX_RETRIES_PER_REQUEST = 5;

const limiter = createRateLimiter(REQUESTS_PER_WINDOW, RATE_WINDOW_MS);

const reply = (status: number, body: Record<string, unknown>) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

// A browser form on this site sends an Origin that matches the Host; another site's page does not.
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function createSender(config: DeliveryConfig): SendMail {
  const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    requireTLS: true,
    auth: { user: config.smtp.user, pass: config.smtp.password },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
  return async (mail) => {
    await transport.sendMail(mail);
  };
}

// Earlier requests whose mail failed are retried whenever a new request arrives.
async function retryPending(config: DeliveryConfig, send: SendMail, skipId: string): Promise<void> {
  const pending = await listPendingEntries(config.journalDir, Date.now(), RETENTION_MS);
  for (const { id, entry } of pending.filter((item) => item.id !== skipId).slice(0, MAX_RETRIES_PER_REQUEST)) {
    try {
      await deliverQuote(entry, config, send);
      await removeJournalEntry(config.journalDir, id);
    } catch (error) {
      console.error('[teklif] retry failed', id, error instanceof Error ? error.message : error);
    }
  }
}

export async function POST(request: Request) {
  if (!isQuoteFormEnabled()) return reply(404, { error: 'not_found' });
  if (!isSameOrigin(request)) return reply(403, { error: 'forbidden' });
  if (!limiter.allow(clientKey(request), Date.now())) return reply(429, { error: 'rate_limited' });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: 'too_large' });
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'invalid_json' });
  }

  const result = validateQuoteRequest(payload);
  if (!result.ok) {
    // An automated submission gets the same answer as a real one and learns nothing.
    if (result.errors.form === 'spam') return reply(200, { ok: true });
    return reply(422, { error: 'invalid', errors: result.errors });
  }

  const config = readDeliveryConfig(process.env);
  if (!config) {
    console.error('[teklif] delivery is not configured');
    return reply(503, { error: 'not_configured' });
  }

  const sourcePath = (payload as { sourcePath?: unknown }).sourcePath;
  const entry: JournalEntry = {
    request: result.value,
    meta: {
      receivedAt: new Date().toISOString(),
      sourcePath: typeof sourcePath === 'string' ? sourcePath.slice(0, MAX_SOURCE_PATH_LENGTH) : undefined,
    },
  };

  let journalId: string;
  try {
    journalId = await saveJournalEntry(config.journalDir, entry);
  } catch (error) {
    console.error('[teklif] journal write failed', error instanceof Error ? error.message : error);
    return reply(503, { error: 'unavailable' });
  }

  // From here the request is safe on disk, so the visitor gets a success answer even if mail is delayed.
  const send = createSender(config);
  try {
    await deliverQuote(entry, config, send);
    await removeJournalEntry(config.journalDir, journalId);
  } catch (error) {
    console.error('[teklif] delivery delayed', journalId, error instanceof Error ? error.message : error);
    return reply(200, { ok: true, delayed: true });
  }

  await retryPending(config, send, journalId).catch((error) => {
    console.error('[teklif] retry pass failed', error instanceof Error ? error.message : error);
  });
  return reply(200, { ok: true });
}
