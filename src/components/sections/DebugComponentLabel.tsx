'use client';

import { useEffect, useState } from 'react';

interface DebugComponentLabelProps {
  name: string;
  children: React.ReactNode;
}

function useDebugOverlay() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(document.documentElement.dataset.debugOverlay === '1');
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-debug-overlay'] });
    return () => observer.disconnect();
  }, []);

  return enabled;
}

if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('debug-overlay') === '1') {
      document.documentElement.dataset.debugOverlay = '1';
    }
  } catch { /* private browsing */ }

  (window as unknown as Record<string, unknown>).__debugOverlay = (on?: boolean) => {
    const next = on ?? document.documentElement.dataset.debugOverlay !== '1';
    if (next) {
      document.documentElement.dataset.debugOverlay = '1';
    } else {
      delete document.documentElement.dataset.debugOverlay;
    }
    try { localStorage.setItem('debug-overlay', next ? '1' : '0'); } catch { /* private browsing */ }
    return next ? 'Debug overlay ON' : 'Debug overlay OFF';
  };
}

export function DebugComponentLabel({ name, children }: DebugComponentLabelProps) {
  const enabled = useDebugOverlay();

  if (!enabled) return <>{children}</>;

  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999,
          background: '#f97316',
          color: '#fff',
          fontSize: '10px',
          fontFamily: 'monospace',
          fontWeight: 600,
          padding: '2px 8px',
          lineHeight: '16px',
          borderBottomRightRadius: '4px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
      <div style={{ outline: '1px solid #f9731640' }}>
        {children}
      </div>
    </div>
  );
}
