'use client';

import { useEffect } from 'react';
import styles from './DebugComponentLabel.module.css';

const STORAGE_KEY = 'debug-overlay';

type DebugWindow = Window & { __debugOverlay?: (on?: boolean) => string };

function setOverlay(enabled: boolean) {
  if (enabled) document.documentElement.dataset.debugOverlay = '1';
  else delete document.documentElement.dataset.debugOverlay;
}

/** Install the same console command on every page, including pages without labels. */
export function DebugOverlayController() {
  useEffect(() => {
    try { setOverlay(localStorage.getItem(STORAGE_KEY) === '1'); } catch { /* Storage can be unavailable. */ }

    const toggle = (on?: boolean) => {
      const next = on ?? document.documentElement.dataset.debugOverlay !== '1';
      setOverlay(next);
      try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* Keep the current tab usable. */ }
      return next ? 'Debug overlay ON' : 'Debug overlay OFF';
    };
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setOverlay(event.newValue === '1');
    };
    (window as DebugWindow).__debugOverlay = toggle;
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('storage', sync);
      if ((window as DebugWindow).__debugOverlay === toggle) delete (window as DebugWindow).__debugOverlay;
    };
  }, []);
  return null;
}

export function DebugComponentLabel({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label} data-debug-label={name} aria-hidden="true" />
      {children}
    </div>
  );
}
