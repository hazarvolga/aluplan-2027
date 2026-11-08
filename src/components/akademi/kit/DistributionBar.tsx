import type { CSSProperties, ReactElement } from 'react';
import type { DurationSlice } from '@/data/akademi-content';
import styles from './DistributionBar.module.css';

/** Fixed grayscale order so a slice keeps the same shade across the bar and its legend. */
const SHADE_ORDER: Record<DurationSlice['label'], number> = {
  Anlatım: 0,
  Uygulama: 1,
  Ölçme: 2,
  Bireysel: 3,
};

/**
 * Duration split as one horizontal, grayscale, segmented bar with a legend. Neutral by
 * design: the single akademi accent is reserved for wayfinding, not for data marks.
 */
export function DistributionBar({
  segments,
}: {
  segments: readonly DurationSlice[];
}): ReactElement | null {
  const total = segments.reduce((sum, slice) => sum + slice.minutes, 0);
  if (total <= 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.bar} role="img" aria-label={ariaLabel(segments, total)}>
        {segments.map((slice) => (
          <span
            key={slice.label}
            className={styles.segment}
            data-shade={SHADE_ORDER[slice.label]}
            style={{ '--seg': `${(slice.minutes / total) * 100}%` } as CSSProperties}
          />
        ))}
      </div>
      <ul className={styles.legend}>
        {segments.map((slice) => (
          <li key={slice.label} className={styles.item}>
            <span className={styles.swatch} data-shade={SHADE_ORDER[slice.label]} aria-hidden="true" />
            <span className={styles.label}>{slice.label}</span>
            <span className={styles.minutes}>{slice.minutes} dk</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ariaLabel(segments: readonly DurationSlice[], total: number): string {
  const parts = segments.map((slice) => `${slice.label} ${Math.round((slice.minutes / total) * 100)}%`);
  return `Süre dağılımı: ${parts.join(', ')}`;
}
