import { useId } from 'react';
import { AluIcon, type AluIconName } from '@/components/ui/AluIcon';
import styles from './EditionCards.module.css';
import { SectionHeader } from './SectionHeader';

type EditionItem = string | { title: string; text: string };
type Edition = { title: string; items?: readonly EditionItem[]; description?: string; itemsLabel?: string; label?: string; icon?: AluIconName };

type EditionCardsProps = { title: string; editions: readonly Edition[]; kicker?: string; lead?: string; variant?: 'grid' | 'steps' | 'icons' };

const stepNumber = (index: number) => String(index + 1).padStart(2, '0');

export function EditionCards({ title, editions, kicker = 'SÜRÜMLER', lead, variant = 'grid' }: EditionCardsProps) {
  const headingId = useId();
  const gridClass = variant === 'grid' ? styles.grid : `${styles.grid} ${styles[variant]}`;
  return <section className={styles.section} aria-labelledby={headingId}>
    <div className={styles.heading}><SectionHeader kicker={kicker} title={title} lead={lead} id={headingId} /></div>
    <div className={gridClass} data-variant={variant}>{editions.map((edition, index) => <article className={styles.card} key={edition.title}>
      {variant === 'steps' && <p className={styles.stepLabel}><span className={styles.stepNumber} aria-hidden="true">{stepNumber(index)}</span>{edition.label}</p>}
      {variant === 'icons' && edition.icon && <span className={styles.iconChip}><AluIcon name={edition.icon} /></span>}
      <h3>{edition.title}</h3>
      {edition.description && <p>{edition.description}</p>}
      {edition.items && edition.itemsLabel && <p className={styles.itemsLabel}>{edition.itemsLabel}</p>}
      {edition.items && <ul>{edition.items.map(item => typeof item === 'string'
        ? <li key={item}>{item}</li>
        : <li key={item.title}><strong>{item.title}</strong> {item.text}</li>)}</ul>}
    </article>)}</div>
  </section>;
}
