import { useId } from 'react';
import styles from './EditionCards.module.css';

type Edition = { title: string; items: readonly string[] };

type EditionCardsProps = { title: string; editions: readonly Edition[] };

export function EditionCards({ title, editions }: EditionCardsProps) {
  const headingId = useId();
  return <section className={styles.section} aria-labelledby={headingId}>
    <div className={styles.heading}><p className={styles.kicker}>SÜRÜMLER</p><h2 id={headingId}>{title}</h2></div>
    <div className={styles.grid}>{editions.map(edition => <article className={styles.card} key={edition.title}>
      <h3>{edition.title}</h3><ul>{edition.items.map(item => <li key={item}>{item}</li>)}</ul>
    </article>)}</div>
  </section>;
}
