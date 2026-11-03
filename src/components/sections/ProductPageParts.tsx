import type { ReactNode } from 'react';
import { EditionCards } from './EditionCards';
import page from './ProductPage.module.css';

type EditionCardsProps = Parameters<typeof EditionCards>[0];

/** Tab strip with in-page anchors, shown under the editions of a product page. */
export function ProductTabNav({ label, links }: { label: string; links: readonly { href: string; label: string }[] }) {
  return <div className={page.navigationSection}><nav className={`alu-container ${page.tabList}`} aria-label={label}>{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div>;
}

/** Full-width band that holds one EditionCards block. */
export function ProductEditionsBand({ id, className, ...cards }: EditionCardsProps & { id?: string; className?: string }) {
  return <div id={id} className={className ? `${page.editionsSection} ${className}` : page.editionsSection}><div className="alu-container"><EditionCards {...cards} /></div></div>;
}

/** Section with a kicker and a heading; `labelledBy` links the section to its heading id. */
export function ProductContentSection({ id, kicker, title, labelledBy, children }: { id?: string; kicker: string; title: string; labelledBy?: string; children: ReactNode }) {
  return <section id={id} className={page.contentSection} aria-labelledby={labelledBy}><p className={page.kicker}>{kicker}</p><h2 id={labelledBy}>{title}</h2>{children}</section>;
}

/** Question and answer list. `accordionClasses` adds the shared accordion classes some pages use. */
export function ProductFaq({ id, kicker, items, accordionClasses = false }: { id: string; kicker: string; items: readonly (readonly string[])[]; accordionClasses?: boolean }) {
  return <section id={id} className={`${page.contentSection} ${page.faq}`}><p className={page.kicker}>{kicker}</p><h2>Sık sorulan sorular</h2>{items.map(([question, answer]) => accordionClasses
    ? <details className="alu-accordion__item" key={question}><summary className="alu-accordion__trigger">{question}</summary><p>{answer}</p></details>
    : <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>;
}
