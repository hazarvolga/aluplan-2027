'use client';

import { AluIcon } from '@/components/ui/AluIcon';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { MediaDialog } from '@/components/ui/MediaDialog';

export interface ViewerVideo {
  youtubeId?: string;
  videoSrc?: string;
  title: string;
}

export interface ViewerImage {
  src: string;
  title: string;
}

interface MediaViewerDialogsProps {
  video: ViewerVideo | null;
  image: ViewerImage | null;
  onCloseVideo: () => void;
  onCloseImage: () => void;
}

/** Video popup and full-resolution image lightbox shared by every page with media cards. */
export function MediaViewerDialogs({ video, image, onCloseVideo, onCloseImage }: MediaViewerDialogsProps) {
  return (
    <>
      {video && (
        <MediaDialog label={video.title} onClose={onCloseVideo}>
          <div className="alu-video-modal__dialog" onClick={(e) => e.stopPropagation()}>
            <div className="alu-video-modal__header">
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-dense)' }}>
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name="circle-play" size="sm" />
                  <span>VİDEO ÖNİZLEME</span>
                </span>
                <h3 className="alu-video-modal__title">{video.title}</h3>
              </div>
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-regular)' }}>
                {video.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--secondary alu-button--sm"
                  >
                    <span>YouTube&apos;da Aç</span>
                    <AluIcon name="external-link" size="sm" />
                  </a>
                )}
                <button
                  type="button"
                  className="alu-video-modal__close"
                  data-media-dialog-close
                  aria-label="Videoyu kapat"
                  onClick={onCloseVideo}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="alu-video-modal__viewport">
              {video.videoSrc ? (
                <video
                  src={video.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <ConsentEmbed src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`} title={video.title} requested />
              )}
            </div>
          </div>
        </MediaDialog>
      )}

      {image && (
        <MediaDialog label={image.title} onClose={onCloseImage}>
          <div className="alu-video-modal__dialog alu-video-modal__dialog--image" onClick={(e) => e.stopPropagation()}>
            <div className="alu-video-modal__header">
              <h3 className="alu-video-modal__title">{image.title}</h3>
              <button
                type="button"
                className="alu-video-modal__close"
                data-media-dialog-close
                aria-label="Görseli kapat"
                onClick={onCloseImage}
              >
                ✕
              </button>
            </div>
            <div className="alu-video-modal__image-viewport">
              <img src={image.src} alt={image.title} />
            </div>
          </div>
        </MediaDialog>
      )}
    </>
  );
}
