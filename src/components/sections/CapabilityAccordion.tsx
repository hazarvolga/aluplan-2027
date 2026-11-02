'use client';
import { useId, useState } from 'react';
import styles from './CapabilityAccordion.module.css';

type Capability = { title: string; description: string; image: string; alt: string };
export function CapabilityAccordion({ items }: { items: readonly Capability[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const active = selected < items.length ? selected : 0;
  if (!items.length) return null;
  return <div className={styles.layout}>
    <div className={styles.list}>{items.map((item, index) => <div className={styles.item} key={item.title}>
      <h3><button type="button" id={`${id}-button-${index}`} aria-expanded={active === index} aria-disabled={active === index} aria-controls={`${id}-panel-${index}`} onClick={() => setSelected(index)}>{item.title}<span aria-hidden="true">{active === index ? '−' : '+'}</span></button></h3>
      <div id={`${id}-panel-${index}`} role="region" aria-labelledby={`${id}-button-${index}`} hidden={active !== index}><p>{item.description}</p></div>
    </div>)}</div>
    <img className={styles.image} src={items[active].image} alt={items[active].alt} width={1536} height={864} />
  </div>;
}
