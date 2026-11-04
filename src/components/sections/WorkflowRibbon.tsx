'use client';

import Link from 'next/link';
import type { StructuredWorkflowLink } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { DebugComponentLabel } from './DebugComponentLabel';

export function WorkflowRibbon({ links }: { links: readonly StructuredWorkflowLink[] }) {
  if (links.length === 0) return null;

  return (
    <DebugComponentLabel name="WorkflowRibbon">
      <section className="alu-workflow-ribbon-section" aria-label="Hızlı İş Akışı Bağlantıları">
        <div className="alu-container">
          <div className="alu-workflow-ribbon">
            {links.map((link, index) => {
              const content = (
                <>
                  <span className="alu-workflow-pill__text">{link.text}</span>
                  <span className="alu-workflow-pill__arrow"><AluIcon name="arrow-up-right" size="sm" /></span>
                </>
              );
              return link.external ? (
                <a key={`${link.href}-${index}`} href={link.href} target="_blank" rel="noopener noreferrer" className="alu-workflow-pill">{content}</a>
              ) : (
                <Link key={`${link.href}-${index}`} href={link.href} className="alu-workflow-pill">{content}</Link>
              );
            })}
          </div>
        </div>
      </section>
    </DebugComponentLabel>
  );
}
