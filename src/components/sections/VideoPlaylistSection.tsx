'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import type { PlaylistRecord } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { SectionHeader } from './SectionHeader';

interface VideoPlaylistSectionProps {
  playlist: PlaylistRecord;
  activeVideoId: string;
  onVideoChange: (videoId: string) => void;
  videoLabel?: string;
  showFallbackDescription?: boolean;
  playlistKicker?: string;
  itemPrefix?: string;
  showThumbnails?: boolean;
}

export function VideoPlaylistSection({
  playlist,
  activeVideoId,
  onVideoChange,
  videoLabel = 'Video Ders',
  showFallbackDescription = true,
  playlistKicker,
  itemPrefix = 'Bölüm',
  showThumbnails = true
}: VideoPlaylistSectionProps): ReactElement {
  const currentVideo =
    playlist.videos.find((video) => video.id === activeVideoId) || playlist.videos[0];
  const currentIdx = Math.max(
    0,
    playlist.videos.findIndex((video) => video.id === currentVideo?.id)
  );

  return (
    <section className="preview-section" aria-labelledby="playlist-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="preview-section-heading">
          <SectionHeader kicker={playlistKicker ?? `VİDEO EĞİTİM SERİSİ · ${playlist.count} VİDEO`} title={playlist.title} lead={playlist.subtitle || undefined} id="playlist-heading" />
          <Link className="alu-button alu-button--secondary alu-button--md" href="/video-kutuphanesi">
            <span>Video Kütüphanesine Dön</span>
            <AluIcon name="arrow-right" size="sm" />
          </Link>
        </div>

        <div className="alu-playlist-stage">
          <div className="alu-playlist-stage__main">
            {currentVideo && (
              <div className="alu-playlist-player-card">
                <div className="alu-playlist-player-card__viewport">
                  <ConsentEmbed src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}`} title={currentVideo.title} fill />
                </div>
                <div className="alu-playlist-player-card__body">
                  <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                    <span className="alu-badge alu-badge--accent">
                      <AluIcon name="circle-play" size="sm" />
                      <span>{itemPrefix} {currentIdx + 1} / {playlist.videos.length}</span>
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="alu-link alu-link--standalone"
                    >
                      <span>YouTube&apos;da Aç</span>
                      <AluIcon name="external-link" size="sm" />
                    </a>
                  </div>
                  <h3 className="alu-playlist-player-card__title">
                    <span className="alu-playlist-player-card__icon">
                      <AluIcon name="video" size="md" />
                    </span>
                    <span>{currentVideo.title}</span>
                  </h3>
                  {(currentVideo.description || showFallbackDescription) && <p className="alu-body" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {currentVideo.description || `Bu eğitim videosunda ${currentVideo.title} konusu detaylı olarak incelenmektedir. Allplan eğitim serisinin sunduğu yenilikleri keşfedin.`}
                  </p>}
                </div>
              </div>
            )}
          </div>

          <aside className="alu-playlist-sidebar" aria-label="Oynatma listesi videoları">
            <div className="alu-playlist-sidebar__header">
              <span className="alu-playlist-sidebar__title">
                <AluIcon name="video" size="sm" />
                <span>Oynatma Listesi</span>
              </span>
              <span className="alu-playlist-sidebar__counter">
                {currentIdx + 1} / {playlist.videos.length}
              </span>
            </div>

            <div className="alu-playlist-sidebar__list">
              {playlist.videos.map((video, videoIndex) => {
                const isSelected = video.id === currentVideo?.id;
                return (
                  <button
                    key={`${video.id}-${videoIndex}`}
                    type="button"
                    onClick={() => onVideoChange(video.id)}
                    className={`alu-playlist-item${
                      isSelected ? ' alu-playlist-item--active' : ''
                    }`}
                  >
                    <div className="alu-playlist-item__thumb">
                      {showThumbnails ? <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                      /> : <AluIcon name="video" size="md" />}
                      {isSelected && (
                        <div className="alu-playlist-item__playing">
                          <span className="alu-playlist-item__playing-badge">
                            <AluIcon name="circle-play" size="sm" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="alu-playlist-item__info">
                      <span className="alu-playlist-item__name">
                        {videoIndex + 1}. {video.title}
                      </span>
                      <span className="alu-playlist-item__meta">
                        {videoLabel}{video.duration ? ` · ${video.duration}` : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
