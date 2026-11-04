import { useSyncExternalStore } from 'react';
import { blockCloudflareAnalytics } from '@/lib/cloudflare-analytics';

export type ConsentChoice = 'accepted' | 'rejected';
export type ConsentState = ConsentChoice | null;
export const GA_MEASUREMENT_ID = 'G-DQYT0D9MQ5';

export function setGoogleAnalyticsDisabled(disabled: boolean): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled;
}

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_EVENT = 'aluplan-consent-change';
const WITHDRAWAL_PENDING_KEY = 'aluplan-consent-withdrawal-pending';
const FAILED_WITHDRAWAL = 'withdrawal-not-persisted';

let sessionChoice: ConsentState = null;
let sessionOverride = false;
let remoteWithdrawalPending = false;
let consentChannel: BroadcastChannel | null = null;

function warnUnpersistedChoice(networkBlocked: boolean): void {
  const detail = networkBlocked
    ? 'Analitik durduruldu ve bu sekmedeki bağlantılar geçici olarak engellendi.'
    : 'Tercihiniz yalnızca bu sekmede geçerli olabilir.';
  window.alert(`Çerez tercihiniz bu tarayıcıda kaydedilemedi. ${detail} Diğer sekmelerde ve sonraki ziyaretlerde tercih korunamayabilir. Tarayıcı depolama izinlerini kontrol edin.`);
}

function getConsentChannel(): BroadcastChannel | null {
  if (consentChannel) return consentChannel;
  try {
    if (typeof window.BroadcastChannel !== 'function') return null;
    consentChannel = new window.BroadcastChannel('aluplan-consent');
    consentChannel.addEventListener('message', (event: MessageEvent) => {
      if (event.data !== FAILED_WITHDRAWAL) return;
      setGoogleAnalyticsDisabled(true);
      const networkBlocked = blockCloudflareAnalytics();
      sessionChoice = null;
      sessionOverride = true;
      remoteWithdrawalPending = true;
      markWithdrawalPending(true);
      window.dispatchEvent(new Event(CONSENT_EVENT));
      warnUnpersistedChoice(networkBlocked);
    });
    return consentChannel;
  } catch {
    return null;
  }
}

function notifyFailedWithdrawal(): void {
  try {
    getConsentChannel()?.postMessage(FAILED_WITHDRAWAL);
  } catch {
    // Some browsers do not support cross-tab notification. This tab remains blocked.
  }
}

export function readConsent(): ConsentState {
  if (sessionOverride) return sessionChoice;
  try {
    if (window.sessionStorage.getItem(WITHDRAWAL_PENDING_KEY) === '1') return null;
  } catch {
    // Storage may be disabled; continue to read the primary choice.
  }
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return sessionChoice;
  }
}

function markWithdrawalPending(pending: boolean): void {
  try {
    if (pending) window.sessionStorage.setItem(WITHDRAWAL_PENDING_KEY, '1');
    else window.sessionStorage.removeItem(WITHDRAWAL_PENDING_KEY);
  } catch {
    // The current document stays blocked if neither store can persist a withdrawal.
  }
}

export function writeConsent(choice: ConsentChoice): void {
  if (choice !== 'accepted') setGoogleAnalyticsDisabled(true);
  const mustReload = choice !== 'accepted' && blockCloudflareAnalytics();
  sessionChoice = choice;
  let persisted = false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    sessionOverride = false;
    persisted = window.localStorage.getItem(CONSENT_STORAGE_KEY) === choice;
    if (!persisted) sessionOverride = true;
  } catch {
    // Storage can be blocked; sessionChoice keeps the choice for this page view.
    sessionOverride = true;
  }
  if (choice !== 'accepted' || persisted) markWithdrawalPending(!persisted);
  if (persisted) remoteWithdrawalPending = false;
  if (choice !== 'accepted' && !persisted) notifyFailedWithdrawal();
  window.dispatchEvent(new Event(CONSENT_EVENT));
  if (mustReload && persisted) window.location.reload();
  if (!persisted) warnUnpersistedChoice(mustReload);
}

export function clearConsent(): void {
  setGoogleAnalyticsDisabled(true);
  const mustReload = blockCloudflareAnalytics();
  sessionChoice = null;
  let persisted = false;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    sessionOverride = false;
    persisted = window.localStorage.getItem(CONSENT_STORAGE_KEY) === null;
    if (!persisted) sessionOverride = true;
  } catch {
    // Storage can be blocked; clearing sessionChoice still reopens the banner.
    sessionOverride = true;
  }
  markWithdrawalPending(!persisted);
  if (persisted) remoteWithdrawalPending = false;
  if (!persisted) notifyFailedWithdrawal();
  window.dispatchEvent(new Event(CONSENT_EVENT));
  if (mustReload && persisted) window.location.reload();
  if (!persisted) warnUnpersistedChoice(mustReload);
}

function subscribe(onChange: () => void): () => void {
  getConsentChannel();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
    if (remoteWithdrawalPending) return;
    let current: string | null = null;
    try {
      if (event.storageArea !== window.localStorage) return;
      // Storage events can arrive after a later choice was saved in another tab.
      current = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      // A read failure cannot establish acceptance; fail closed.
    }
    if (current !== 'accepted') setGoogleAnalyticsDisabled(true);
    const mustReload = current !== 'accepted' && blockCloudflareAnalytics();
    sessionOverride = false;
    sessionChoice = current === 'accepted' || current === 'rejected' ? current : null;
    onChange();
    if (mustReload) window.location.reload();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

const noopSubscribe = () => () => undefined;

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

export function useConsentReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
