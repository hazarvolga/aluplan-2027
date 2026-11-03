import { useId } from 'react';
import styles from './EditionCards.module.css';

type EditionItem = string | { title: string; text: string };
type Edition = { title: string; items?: readonly EditionItem[]; description?: string };

type EditionCardsProps = { title: string; editions: readonly Edition[]; kicker?: string };

export function EditionCards({ title, editions, kicker = 'SÜRÜMLER' }: EditionCardsProps) {
  const headingId = useId();
  return <section className={styles.section} aria-labelledby={headingId}>
    <div className={styles.heading}><p className={styles.kicker}>{kicker}</p><h2 id={headingId}>{title}</h2></div>
    <div className={styles.grid}>{editions.map(edition => <article className={styles.card} key={edition.title}>
      <h3>{edition.title}</h3>
      {edition.description && <p>{edition.description}</p>}
      {edition.items && <ul>{edition.items.map(item => typeof item === 'string'
        ? <li key={item}>{item}</li>
        : <li key={item.title}><strong>{item.title}</strong> {item.text}</li>)}</ul>}
    </article>)}</div>
  </section>;
}
