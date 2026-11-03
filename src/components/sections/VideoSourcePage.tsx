'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PlaylistRecord } from '@/lib/site-data';
import type { ChannelVideo } from '@/lib/youtube-feed';
import { CompactPageHero } from './CompactPageHero';
import { VideoPlaylistSection } from './VideoPlaylistSection';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { PageEndConversion } from './PageEndConversion';
import { getPageEndConversion } from './page-end-conversion-policy';

interface Props { title: string; description: string; sourceUrl: string; playlistId?: string; videos: ChannelVideo[] }
export function VideoSourcePage({ title, description, sourceUrl, playlistId, videos }: Props) {
  const conversion = getPageEndConversion({ path: '/video-kutuphanesi/kaynak', section: 'solutions-v2' });
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id ?? '');
  const playlist: PlaylistRecord = { id: sourceUrl, key: sourceUrl, url: sourceUrl, title: 'Son videolar', subtitle: 'Kanalın en son yayınladığı en fazla 15 video gösterilir.', count: videos.length, videos };
  return <>
    <CompactPageHero crumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Video Kütüphanesi', href: '/video-kutuphanesi' }, { label: title }]} kicker="VİDEO KÜTÜPHANESİ" title={title} lead={description}>
      <a className="alu-button alu-button--secondary alu-button--md" href={sourceUrl} target="_blank" rel="noopener noreferrer">YouTube’da aç ↗</a>
    </CompactPageHero>
    {playlistId ? <section className="preview-section" aria-label="Oynatma listesi"><div className="alu-container alu-stack">
      <p className="alu-body">Oynatma listesini bu sayfada izleyebilir veya YouTube’da açabilirsiniz.</p>
      <div className="alu-playlist-player-card__viewport"><ConsentEmbed src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`} title={`${title} oynatma listesi`} fill /></div>
      <Link className="alu-link" href="/video-kutuphanesi">Video Kütüphanesine Dön</Link>
    </div></section> : videos.length ? <VideoPlaylistSection playlist={playlist} activeVideoId={activeVideoId} onVideoChange={setActiveVideoId} videoLabel="Video" itemPrefix="Video" playlistKicker={`SON VİDEOLAR · ${videos.length} VİDEO`} showFallbackDescription={false} showThumbnails={false} /> : <section className="preview-section"><div className="alu-container alu-stack"><h2 className="alu-h2">Son videolara şu anda ulaşılamıyor</h2><p>Liste geçici olarak yüklenemedi. Kanalı YouTube’da açarak videolara ulaşabilirsiniz.</p><a className="alu-button alu-button--secondary alu-button--md" href={sourceUrl} target="_blank" rel="noopener noreferrer">Kanalı YouTube’da aç ↗</a></div></section>}
    {conversion && <PageEndConversion model={conversion} />}
  </>;
}
