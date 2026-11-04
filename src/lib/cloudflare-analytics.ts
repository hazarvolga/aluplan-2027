const BEACON_URL = 'https://static.cloudflareinsights.com/beacon.min.js';
const CONSENT_KEY = 'cookie-consent';

let started = false;
let blocked = false;

export function hasWritableAcceptance(): boolean {
  try {
    if (window.sessionStorage.getItem('aluplan-consent-withdrawal-pending') === '1') return false;
    if (window.localStorage.getItem(CONSENT_KEY) !== 'accepted') return false;
    const probe = `__aluplan_consent_probe_${Math.random().toString(36).slice(2)}__`;
    window.localStorage.setItem(probe, '1');
    const writable = window.localStorage.getItem(probe) === '1';
    window.localStorage.removeItem(probe);
    return writable && window.localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

function recheckAcceptance(): void {
  if (!blocked && !hasWritableAcceptance() && blockCloudflareAnalytics()) {
    window.location.reload();
  }
}

// The identifier is public, but accepting only Cloudflare's expected format avoids
// inserting arbitrary values into a third-party script attribute.
export function startCloudflareAnalytics(token: string | undefined, accepted: boolean): void {
  if (!accepted || started || blocked || !token || !/^[a-f0-9]{32}$/i.test(token)) return;
  // An ephemeral acceptance cannot safely survive a reload. Only enable the
  // beacon when the persisted consent can also be written and later withdrawn.
  if (!hasWritableAcceptance()) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = BEACON_URL;
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  started = true;
  window.addEventListener('focus', recheckAcceptance);
  document.addEventListener('visibilitychange', recheckAcceptance);
  document.head.appendChild(script);
}

// Removing a script cannot unregister its listeners. Tighten this document's
// CSP before reloading, so its remaining listeners cannot send new beacons.
export function blockCloudflareAnalytics(): boolean {
  if (!started || blocked) return false;
  blocked = true;
  const policy = document.createElement('meta');
  policy.httpEquiv = 'Content-Security-Policy';
  policy.content = "connect-src 'none'";
  document.head.appendChild(policy);
  return true;
}
