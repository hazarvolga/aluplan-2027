export function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  const trimmed = String(email || '').trim();
  return trimmed.length >= 5 && trimmed.length <= 254 && EMAIL_RE.test(trimmed);
}

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests = 10, windowMs = 600_000): boolean {
  const now = Date.now();
  const key = ip || 'local';
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

export const SECURE_TLS_CONFIG = {
  minVersion: 'TLSv1.2' as const,
  rejectUnauthorized: true
};
