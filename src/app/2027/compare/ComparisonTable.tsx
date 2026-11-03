'use client';
import { Fragment, useEffect, useId, useState } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import { groups } from './data';
import { descriptions } from './descriptions';
import styles from './page.module.css';

type Edition = { name: string; href: string };
const label = {included:'Dâhil', none:'—', optional:'İsteğe bağlı'};
export function ComparisonTable({ editions }: { editions: readonly Edition[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const id = useId();
  const active = hovered ?? focused ?? pinned;
  useEffect(() => {
    if (active === null) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHovered(null); setFocused(null); setPinned(null);
        if (document.activeElement instanceof HTMLElement && document.activeElement.closest('[data-comparison-info]')) document.activeElement.blur();
      }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [active]);
  return <div className={styles.scroll} role="region" aria-label="Sürüm karşılaştırma tablosu" tabIndex={0}>
    <table className={styles.table}><caption className={styles.srOnly}>ALLPLAN 2027 sürümlerine göre özellikler</caption><thead><tr><th scope="col">Özellik</th>{editions.map(e=><th scope="col" key={e.name}><span>ALLPLAN</span><strong>{e.name}</strong><a href={e.href}>Sürümü incele ↗</a></th>)}</tr></thead><tbody>
    {groups.map((group, groupIndex) => {const offset=groups.slice(0,groupIndex).reduce((n,item)=>n+item.rows.length,0);return <Fragment key={group.title}><tr className={styles.group}><th colSpan={5}>{group.title}</th></tr>{group.rows.map((row,rowIndex)=>{const index=offset+rowIndex;const visible=active===index;return <tr key={row.name}><th scope="row"><div className={styles.featureName}><span>{row.name}</span><div className={`${styles.info} ${index >= descriptions.length-4 ? styles.infoUp : ''}`} data-comparison-info onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(index); }} onPointerLeave={e => { if (e.pointerType === 'mouse') setHovered(null); }}><button type="button" aria-label={`${row.name} hakkında bilgi`} aria-describedby={visible ? `${id}-${index}` : undefined} aria-controls={visible ? `${id}-${index}` : undefined} aria-expanded={visible} onFocus={() => setFocused(index)} onBlur={() => { setFocused(null); setPinned(null); }} onClick={e => { if (pinned === index) { setPinned(null); setFocused(null); setHovered(null); e.currentTarget.blur(); } else { setPinned(index); } }}><AluIcon name="info" size="sm" /></button>{visible && <div id={`${id}-${index}`} role="tooltip" className={styles.tooltip}>{descriptions[index]}</div>}</div></div></th>{row.values.map((value,i)=><td key={i}>{value==='optional'?<span className={styles.optional}>{label[value]}</span>:<><span className={value==='included'?styles.yes:styles.no} aria-hidden="true">{value==='included'?'✓':label[value]}</span><span className="alu-visually-hidden">{value==='included'?label[value]:'Kaynakta işaret yok'}</span></>}</td>)}</tr>})}</Fragment>})}
    </tbody></table>
  </div>;
}
