'use client';

import { useRef, type ReactNode } from 'react';
import { useSignatureReveal } from './useSignatureReveal';

/** A <ul> whose <li> children reveal with a subtle staggered motion on mount. */
export function RevealList({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  useSignatureReveal(ref);
  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
