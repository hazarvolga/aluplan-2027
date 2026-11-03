'use client';

import { useState } from 'react';
import { MediaDialog } from '@/components/ui/MediaDialog';
import styles from './AllplanMaxPreviewPage.module.css';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';

export function AllplanMaxVideo({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);

  return <>
    <button type="button" className={styles.videoTrigger} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${title} videosunu izleyin`}>
      Videoyu izleyin <span aria-hidden="true">▶</span>
    </button>
    {open && <MediaDialog label={`${title} videosu`} onClose={() => setOpen(false)}>
      <div className="alu-video-modal__dialog">
        <div className="alu-video-modal__header">
          <h3 className="alu-video-modal__title">{title}</h3>
          <button type="button" className="alu-video-modal__close" data-media-dialog-close aria-label="Videoyu kapat" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="alu-video-modal__viewport">
          <ConsentEmbed src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={`${title} videosu`} requested />
        </div>
      </div>
    </MediaDialog>}
  </>;
}
