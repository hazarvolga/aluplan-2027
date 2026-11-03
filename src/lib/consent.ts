import { useSyncExternalStore } from 'react';

export type ConsentChoice = 'accepted' | 'rejected';
export type ConsentState = ConsentChoice | null;

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_EVENT = 'aluplan-consent-change';

let sessionChoice: ConsentState = null;

export function readConsent(): ConsentState {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : sessionChoice;
  } catch {
    return sessionChoice;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  sessionChoice = choice;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage can be blocked; sessionChoice keeps the choice for this page view.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function clearConsent(): void {
  sessionChoice = null;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage can be blocked; clearing sessionChoice still reopens the banner.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const noopSubscribe = () => () => undefined;

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

export function useConsentReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
