import type { CSSProperties } from 'react';
import styles from './MetricCards.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';
type Metric = { value: string; label: string; description: string; source?: string };
export function MetricCards({ items }: { items: readonly Metric[] }) {
  return <DebugComponentLabel name="MetricCards"><div className={`alu-hero-metrics ${styles.grid}`} style={{"--metric-columns": Math.min(items.length, 4)} as CSSProperties}>{items.map((item, index)=><div className="alu-hero-metrics__item" key={`${item.label}-${index}`}><span className="alu-hero-metrics__value">{item.value}</span><h3 className="alu-hero-metrics__label" style={{margin:0}}>{item.label}</h3><p className="alu-body-sm" style={{margin:'var(--space-application-jsx-tight) 0 0 0'}}>{item.description}</p>{item.source && <p className="alu-body-sm">{item.source}</p>}</div>)}</div></DebugComponentLabel>;
}
