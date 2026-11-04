import { useId } from 'react';
import { AluIcon, type AluIconName } from '@/components/ui/AluIcon';
import styles from './EditionCards.module.css';
import { SectionHeader } from './SectionHeader';
import { GroupHeader } from './GroupHeader';
import { DebugComponentLabel } from './DebugComponentLabel';

type EditionItem = string | { title: string; text: string };
type Edition = { title: string; items?: readonly EditionItem[]; description?: string; itemsLabel?: string; label?: string; icon?: AluIconName; image?: { src: string; alt: string }; link?: { href: string; label: string } };

type EditionCardsProps = { title: string; editions: readonly Edition[]; kicker?: string; lead?: string; variant?: 'grid' | 'cards' | 'steps' | 'icons'; group?: { index: number; unit?: string } };

const stepNumber = (index: number) => String(index + 1).padStart(2, '0');
const friloEditionImages = new Set([
  'frilo-concept', 'frilo-professional-concrete', 'frilo-professional-steel',
  'frilo-professional-timber', 'frilo-ultimate', 'frilo-geotechnics-concept',
  'frilo-geotechnics-professional-pit', 'frilo-geotechnics-professional-retaining',
  'frilo-geotechnics-ultimate', 'frilo-geotechnics-soil-mechanics',
]);

function friloEditionSrcSet(src: string) {
  const match = /^\/assets\/previews\/frilo\/editions\/([^/]+)\.jpg$/.exec(src);
  if (!match || !friloEditionImages.has(match[1])) return undefined;
  const base = `/assets/optimized/frilo/editions/${match[1]}`;
  return `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
}

export function EditionCards({ title, editions, kicker = 'SÜRÜMLER', lead, variant = 'grid', group }: EditionCardsProps) {
  const headingId = useId();
  const gridClass = variant === 'grid' ? styles.grid : `${styles.grid} ${styles[variant]}`;
  return <DebugComponentLabel name="EditionCards"><section className={group ? `${styles.section} ${styles.grouped}` : styles.section} aria-labelledby={group ? undefined : headingId} aria-label={group ? title : undefined}>
    <div className={styles.heading}>{group
      ? <GroupHeader index={group.index} title={title} count={editions.length} unit={group.unit} lead={lead} />
      : <SectionHeader kicker={kicker} title={title} lead={lead} id={headingId} />}</div>
    <div className={gridClass} data-variant={variant}>{editions.map((edition, index) => <article className={styles.card} key={edition.title}>
      {variant === 'steps' && <p className={styles.stepLabel}><span className={styles.stepNumber} aria-hidden="true">{stepNumber(index)}</span>{edition.label}</p>}
      {variant === 'icons' && edition.icon && <span className={styles.iconChip}><AluIcon name={edition.icon} size="lg" /></span>}
      {variant === 'cards' && edition.image && <picture>
        {friloEditionSrcSet(edition.image.src) && <source type="image/webp" srcSet={friloEditionSrcSet(edition.image.src)} sizes="(max-width: 48rem) 100vw, 50vw" />}
        <img className={styles.cardImage} src={edition.image.src} alt={edition.image.alt} width="1200" height="1200" loading="lazy" />
      </picture>}
      <h3>{edition.title}</h3>
      {edition.description && <p>{edition.description}</p>}
      {edition.items && edition.itemsLabel && <p className={styles.itemsLabel}>{edition.itemsLabel}</p>}
      {edition.items && <ul>{edition.items.map(item => typeof item === 'string'
        ? <li key={item}>{item}</li>
        : <li key={item.title}><strong>{item.title}</strong> {item.text}</li>)}</ul>}
      {edition.link && <a className={styles.cardLink} href={edition.link.href} target="_blank" rel="noopener noreferrer" aria-label={`${edition.link.label.replace(' ↗', '')}: ${edition.title} (yeni sekmede açılır)`}>{edition.link.label}</a>}
    </article>)}</div>
  </section></DebugComponentLabel>;
}
