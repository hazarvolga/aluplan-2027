import { useId, type ReactNode } from 'react';

type SheetMeta = { company: string; title: string; number: string; revision: string; date: string; scale: string };

export function DimensionLine({ label }: { label: string }) {
  return <div className="dimension"><span className="dimension-tick" aria-hidden="true"/><span>{label}</span><span className="dimension-tick" aria-hidden="true"/></div>;
}

export function SectionMarker({ number, label, sheet, headingId }: { number: string; label: string; sheet: string; headingId: string }) {
  return <div className="section-marker"><span className="section-marker-number" aria-hidden="true">{number}</span><div><span className="technical">{sheet}</span><h2 id={headingId}>{label}</h2></div></div>;
}

export function DetailCallout({ number, sheet, href, label }: { number: string; sheet: string; href: string; label: string }) {
  return <a className="detail-callout" href={href}><span className="detail-circle" aria-hidden="true"><span>{number}</span><span>{sheet}</span></span><span>{label}</span><span className="callout-arrow" aria-hidden="true">↗</span></a>;
}

export function HatchPattern() {
  const id = useId();
  return <svg className="hatch" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse"><path d="M-3 3 3-3 M0 12 12 0 M9 15 15 9"/></pattern></defs><rect width="400" height="200" fill={`url(#${id})`}/></svg>;
}

export function AxisGrid({ children }: { children?: ReactNode }) {
  return <div className="axis-grid"><div className="axis-labels" aria-hidden="true">{['A', 'B', 'C', 'D'].map(x=><span key={x}>{x}</span>)}</div><div className="axis-grid-body">{children}</div><div className="axis-labels axis-labels-bottom" aria-hidden="true">{['1', '2', '3', '4'].map(x=><span key={x}>{x}</span>)}</div></div>;
}

export function NorthArrow() {
  return <svg className="north-arrow" viewBox="0 0 40 80" aria-hidden="true"><text x="20" y="12" textAnchor="middle">K</text><path d="m20 24-9 28 9-7 9 7Z"/><path d="M20 24v49"/></svg>;
}

export function ScaleBar({ label }: { label: string }) {
  return <div className="scale-bar"><svg viewBox="0 0 160 18" aria-hidden="true"><path d="M0 2v14m40-14v14m40-14v14m80-14v14M0 10h160"/><path className="scale-fill" d="M0 5h40v5H0zm80 0h40v5H80z"/></svg><span className="technical">{label}</span></div>;
}

export function AxonometricDrawing() {
  return <svg className="axonometric" viewBox="0 0 700 560" aria-hidden="true">
    <g className="drawing-context"><path d="m24 417 327 132 326-170-325-130Z"/><path d="M20 464 665 128M44 190l621 251M135 100v427M568 110v390"/></g>
    <g className="drawing-structure">
      <path d="m112 375 225 90 246-128-225-90Z"/>
      <path d="m112 279 225 90 246-128-225-90Z"/>
      <path d="m112 183 225 90L583 145 358 55Z"/>
      <path d="M112 183v192m225-102v192m246-320v192M358 55v192"/>
      <path d="m187 213 75 30v192m150-300 82 33v192m-82-225v192M187 309l225-117m-150 147L494 222M187 405l225-117m-150 147L494 318"/>
      <path d="m112 183 225 90 246-128M337 273v192" className="drawing-heavy"/>
      <path d="m112 375 225 90 246-128" className="drawing-accent"/>
    </g>
    <g className="drawing-dimensions"><path d="m85 407 250 100 278-145M78 398l14 18m235 82 14 18m264-164 14 18"/><path d="M80 183v192m-8-192h16m-16 192h16"/></g>
    <g className="drawing-nodes"><circle cx="112" cy="375" r="4"/><circle cx="337" cy="465" r="4"/><circle cx="583" cy="337" r="4"/></g>
  </svg>;
}

export function TitleBlock({ meta }: { meta: SheetMeta }) {
  return <dl className="title-block"><div className="title-block-main"><dt>Firma / Pafta adı</dt><dd>{meta.company}<span>{meta.title}</span></dd></div><div><dt>Pafta no</dt><dd>{meta.number}</dd></div><div><dt>Revizyon</dt><dd>{meta.revision}</dd></div><div><dt>Tarih</dt><dd>{meta.date}</dd></div><div><dt>Ölçek</dt><dd>{meta.scale}</dd></div><div><dt>Durum</dt><dd>Tasarım örneği</dd></div></dl>;
}

export function SheetIndex({ items }: { items: readonly { id: string; number: string; label: string }[] }) {
  return <nav aria-label="Bileşen paftaları" className="sheet-index">{items.map(item=><a href={`#${item.id}`} key={item.id}><span className="technical">{item.number}</span><span>{item.label}</span><span aria-hidden="true">↘</span></a>)}</nav>;
}

export function DetailDisclosure({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <details className="detail-disclosure" id={id}><summary><span className="technical" aria-hidden="true">{number}</span><span>{title}</span><span className="disclosure-toggle" aria-hidden="true">+</span></summary><div className="disclosure-content">{children}</div></details>;
}
