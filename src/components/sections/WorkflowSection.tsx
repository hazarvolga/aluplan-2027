'use client';

import type { StructuredWorkflowTabsSection } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import { WorkFlowTabs } from './WorkFlowTabs';

export function WorkflowSection({ content, onVideo, onImage }: {
  content: StructuredWorkflowTabsSection;
  onVideo: (video: { youtubeId?: string; videoSrc?: string; title: string }) => void;
  onImage: (image: { src: string; title: string }) => void;
}) {
  if (content.categories.length === 0) return null;
  return (
    <section className="preview-section preview-section--subtle" aria-label={content.title}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <SectionHeader kicker={content.kicker} title={content.title} lead={content.subtitle} />
        <WorkFlowTabs content={content} onVideo={onVideo} onImage={onImage} />
      </div>
    </section>
  );
}
