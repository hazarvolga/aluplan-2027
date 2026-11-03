import { useId } from 'react';
import styles from './EditionCards.module.css';
import { SectionHeader } from './SectionHeader';

type EditionItem = string | { title: string; text: string };
type Edition = { title: string; items?: readonly EditionItem[]; description?: string; itemsLabel?: string };

type EditionCardsProps = { title: string; editions: readonly Edition[]; kicker?: string; lead?: string };

export function EditionCards({ title, editions, kicker = 'SÜRÜMLER', lead }: EditionCardsProps) {
  const headingId = useId();
  return <section className={styles.section} aria-labelledby={headingId}>
    <div className={styles.heading}><SectionHeader kicker={kicker} title={title} lead={lead} id={headingId} /></div>
    <div className={styles.grid}>{editions.map(edition => <article className={styles.card} key={edition.title}>
      <h3>{edition.title}</h3>
      {edition.description && <p>{edition.description}</p>}
      {edition.items && edition.itemsLabel && <p className={styles.itemsLabel}>{edition.itemsLabel}</p>}
      {edition.items && <ul>{edition.items.map(item => typeof item === 'string'
        ? <li key={item}>{item}</li>
        : <li key={item.title}><strong>{item.title}</strong> {item.text}</li>)}</ul>}
    </article>)}</div>
  </section>;
}
