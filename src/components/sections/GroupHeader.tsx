import styles from './GroupHeader.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';

type GroupHeaderProps = { index: number; title: string; count: number; unit?: string; lead?: string };

/** Small numbered label for a group inside a section: number, title, a hairline and the item count, with an optional lead. */
export function GroupHeader({ index, title, count, unit = 'özellik', lead }: GroupHeaderProps) {
  return <DebugComponentLabel name="GroupHeader"><div className={styles.group}>
    <div className={styles.header}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.count}>{count} {unit}</span>
    </div>
    {lead && <p className={styles.lead}>{lead}</p>}
  </div></DebugComponentLabel>;
}
