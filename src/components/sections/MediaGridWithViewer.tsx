'use client';

import { useState } from 'react';
import type { StructuredMediaGridSection } from '@/lib/site-data';
import { MediaGridSection } from './MediaGridSection';
import { MediaViewerDialogs } from './MediaViewerDialogs';
import type { ViewerImage, ViewerVideo } from './MediaViewerDialogs';

/** A media grid that brings its own video popup and image lightbox, for pages that are not SubpageView. */
export function MediaGridWithViewer({ grid, itemKeyPrefix, group }: { grid: StructuredMediaGridSection; itemKeyPrefix: string; group?: { index: number } }) {
  const [video, setVideo] = useState<ViewerVideo | null>(null);
  const [image, setImage] = useState<ViewerImage | null>(null);

  return (
    <>
      <MediaGridSection grid={grid} itemKeyPrefix={itemKeyPrefix} onVideo={setVideo} onImage={setImage} group={group} />
      <MediaViewerDialogs video={video} image={image} onCloseVideo={() => setVideo(null)} onCloseImage={() => setImage(null)} />
    </>
  );
}
