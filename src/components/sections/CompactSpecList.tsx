import styles from './CompactSpecList.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';

export function CompactSpecList({ items }: { items: readonly string[] }) {
  return <DebugComponentLabel name="CompactSpecList"><ul className={styles.list} role="list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></DebugComponentLabel>;
}
