import { useEffect, useRef, useState } from 'react';

export function useFirstVisible() {
  const ref = useRef<HTMLElement | null>(null);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 768px)');
    const onMotionChange = () => { if (motion.matches || !desktop.matches) setHasAppeared(false); };
    motion.addEventListener('change', onMotionChange);
    desktop.addEventListener('change', onMotionChange);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        if (!motion.matches && desktop.matches) setHasAppeared(true);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onMotionChange);
      desktop.removeEventListener('change', onMotionChange);
    };
  }, []);

  const finish = () => setHasAppeared(false);
  return { ref, hasAppeared, finish };
}
