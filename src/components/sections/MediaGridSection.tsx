'use client';

import type { ReactElement } from 'react';

import type { StructuredMediaGridSection } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import { GroupHeader } from './GroupHeader';
import { FuncsGridCars } from './FuncsGridCars';
import { DebugComponentLabel } from './DebugComponentLabel';

interface MediaVideoRequest {
  youtubeId: string;
  title: string;
}

interface MediaImageRequest {
  src: string;
  title: string;
}

interface MediaGridSectionProps {
  grid: StructuredMediaGridSection;
  itemKeyPrefix: string;
  onVideo: (video: MediaVideoRequest) => void;
  onImage: (image: MediaImageRequest) => void;
  /** Renders the title as a numbered group label under a parent section heading. */
  group?: { index: number; unit?: string };
}

export function MediaGridSection({
  grid,
  itemKeyPrefix,
  onVideo,
  onImage,
  group
}: MediaGridSectionProps): ReactElement {
  return (
    <section className={group ? 'preview-section preview-section--group' : 'preview-section'} aria-label={grid.title}>
      <div className="alu-container alu-stack" style={{ gap: group ? 'var(--space-stack-md)' : 'var(--space-stack-xl)' }}>
        {group
          ? <GroupHeader index={group.index} title={grid.title} count={grid.items.length} unit={group.unit} lead={grid.subtitle} />
          : <SectionHeader kicker={grid.kicker} title={grid.title} lead={grid.subtitle} />}

        <DebugComponentLabel name="FuncsGridCars"><FuncsGridCars grid={grid} itemKeyPrefix={itemKeyPrefix} onVideo={onVideo} onImage={onImage} /></DebugComponentLabel>
      </div>
    </section>
  );
}
