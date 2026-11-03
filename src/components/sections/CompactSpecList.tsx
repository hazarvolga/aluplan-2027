import styles from './CompactSpecList.module.css';

export function CompactSpecList({ items }: { items: readonly string[] }) {
  return <ul className={styles.list} role="list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}
