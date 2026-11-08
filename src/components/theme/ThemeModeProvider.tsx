'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

/** Pure toggle mapping, extracted so it can be unit-tested without rendering React. */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return mode === 'dark' ? 'light' : 'dark';
}

/**
 * Owns the site-wide dark/light mode: reads/writes localStorage('aluplan-theme-mode')
 * and reflects it on <html data-mode>. Both the site shell and the akademi shell consume it,
 * so the two chrome variants always share one mode. SSR default is 'dark' (matches <html data-mode>).
 */
export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('aluplan-theme-mode');
      if (savedMode === 'light' || savedMode === 'dark') {
        setMode(savedMode);
        document.documentElement.setAttribute('data-mode', savedMode);
      } else {
        document.documentElement.setAttribute('data-mode', 'dark');
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = nextThemeMode(prev);
      document.documentElement.setAttribute('data-mode', next);
      try {
        localStorage.setItem('aluplan-theme-mode', next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return ctx;
}
