import styles from './GroupHeader.module.css';

type GroupHeaderProps = { index: number; title: string; count: number };

/** Small numbered label for a group inside a section: number, title, a hairline and the item count. */
export function GroupHeader({ index, title, count }: GroupHeaderProps) {
  return <div className={styles.header}>
    <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <h3 className={styles.title}>{title}</h3>
    <span className={styles.rule} aria-hidden="true" />
    <span className={styles.count}>{count} özellik</span>
  </div>;
}
