'use client';

import { useEffect, type RefObject } from 'react';

/**
 * One-shot, subtle reveal of a container's direct children on mount. GSAP is loaded
 * lazily via dynamic import, so it never enters the initial bundle. No-op (content stays
 * visible) under prefers-reduced-motion or if GSAP fails to load.
 */
export function useSignatureReveal(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    import('gsap')
      .then(({ gsap }) => {
        if (cancelled || !ref.current) return;
        const targets = Array.from(ref.current.children);
        if (targets.length === 0) return;
        ctx = gsap.context(() => {
          gsap.from(targets, {
            opacity: 0,
            y: 12,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.06,
          });
        }, ref.current);
      })
      .catch(() => {
        // GSAP unavailable: leave content in its final, visible state.
      });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [ref]);
}
