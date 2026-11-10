'use client';

import { useEffect, useState, type ReactElement } from 'react';
import type { OgrenmeYolu } from '@/data/akademi-mufredat-haritasi';
import styles from './AkademiOgrenmeYollari.module.css';

const DONE_PREFIX = 'akademi-lesson-done-';

/**
 * Rol bazlı sıralı öğrenme yolları. İlerleme bu tarayıcının localStorage'ındaki
 * ders tamamlama işaretlerinden (akademi-lesson-done-<slug>) hesaplanır; backend yok.
 */
export function AkademiOgrenmeYollari({
  yollar,
  baseHref = '/akademi',
}: {
  yollar: readonly OgrenmeYolu[];
  baseHref?: string;
}): ReactElement {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const map: Record<string, boolean> = {};
    try {
      for (const yol of yollar) {
        for (const lesson of yol.lessons) {
          if (window.localStorage.getItem(DONE_PREFIX + lesson.slug) === '1') map[lesson.slug] = true;
        }
      }
    } catch {
      // Private window or blocked storage: progress just shows as not started.
    }
    setDone(map);
    setHydrated(true);
  }, [yollar]);

  return (
    <ul className={styles.paths}>
      {yollar.map((yol) => {
        const total = yol.lessons.length;
        const completed = yol.lessons.filter((lesson) => done[lesson.slug]).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return (
          <li key={yol.role} className={styles.path}>
            <div className={styles.pathHead}>
              <span className={styles.pathRole}>{yol.roleName}</span>
              <span className={styles.pathMeta}>{total} ders · {yol.moduleCodes.length} modül</span>
            </div>
            <p className={styles.chain}>
              {yol.moduleCodes.map((code, i) => (
                <span key={code}>{code}{i < yol.moduleCodes.length - 1 ? ' → ' : ''}</span>
              ))}
            </p>
            <div
              className={styles.progress}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={hydrated ? pct : 0}
              aria-label={`${yol.roleName} yolu ilerlemesi`}
            >
              <div className={styles.progressBar} style={{ width: `${hydrated ? pct : 0}%` }} />
            </div>
            <div className={styles.pathFoot}>
              <span className={styles.pathPct}>
                {hydrated ? `${completed}/${total} ders · %${pct}` : `${total} ders`}
              </span>
              <a className={styles.pathCta} href={`${baseHref}?rol=${yol.role}#katalog`}>
                Rolün modüllerini gör →
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
