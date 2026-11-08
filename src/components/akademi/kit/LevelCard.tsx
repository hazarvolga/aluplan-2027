import type { ReactElement } from 'react';
import Link from 'next/link';
import type { ContentLevel, ContentModule } from '@/data/akademi-content';
import styles from './LevelCard.module.css';

function totalHours(modules: readonly ContentModule[]): number {
  return modules.reduce((sum, module) => sum + module.hours, 0);
}

function levelHours(level: ContentLevel): number {
  if (level.modules) return totalHours(level.modules);
  if (level.tracks) return totalHours(level.tracks[0]?.modules ?? []);
  return 0;
}

function unitCount(level: ContentLevel): number {
  if (level.modules) return level.modules.length;
  if (level.tracks) return level.tracks.length;
  return 0;
}

/** Level card: big mono number, role label, title, two stats, CTA. `active` adds the accent. */
export function LevelCard({
  level,
  active = false,
}: {
  level: ContentLevel;
  active?: boolean;
}): ReactElement {
  return (
    <article className={`${styles.card} ${active ? styles.active : ''}`}>
      <div className={styles.top}>
        <span className={styles.no}>{String(level.number).padStart(2, '0')}</span>
        <span className={styles.x}>/ 04</span>
      </div>
      <p className={styles.label}>{level.role} · {level.shared ? 'Ortak çekirdek' : 'Disiplin kolları'}</p>
      <h3 className={styles.title}>{level.title}</h3>
      <p className={styles.summary}>{level.summary}</p>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statN}>{levelHours(level)}</span>
          <span className={styles.statLabel}>{level.shared ? 'saat' : 'saat/kol'}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statN}>{unitCount(level)}</span>
          <span className={styles.statLabel}>{level.shared ? 'modül' : 'kol'}</span>
        </div>
      </div>
      <Link className={styles.cta} href={`/akademi/${level.slug}`}>
        Seviye {level.number} detayı →
      </Link>
    </article>
  );
}
