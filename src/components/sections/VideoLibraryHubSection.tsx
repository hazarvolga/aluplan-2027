import Link from 'next/link';
import { getAllPlaylists, getVideoLibraryData } from '@/lib/playlist-data';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { AluIcon } from '@/components/ui/AluIcon';
import { CompactPageHero } from './CompactPageHero';
import styles from './VideoLibraryHubSection.module.css';
import { videoSourceForUrl } from '@/lib/video-sources';

const allPlaylists = getAllPlaylists();
const playlistByUrl = new Map(allPlaylists.map((playlist) => [playlist.url, playlist]));
const videoLibrary = getVideoLibraryData();
const ACTION_LABEL = 'İzleme Listesini İncele';

export function VideoLibraryHubSection() {
  const crumbs = [
    { label: 'Ana Sayfa', href: '/' },
    ...(isReleaseContentEnabled() ? [{ label: 'Kaynaklar', href: '/kaynaklar' }] : []),
    { label: videoLibrary.hero.title }
  ];

  return (
    <div className={styles.page}>
      <CompactPageHero crumbs={crumbs} kicker={videoLibrary.hero.kicker} title={videoLibrary.hero.title} lead={videoLibrary.hero.lead} />
      <div>
        <section className={styles.band} aria-labelledby="video-channel-heading">
          <div className="alu-container">
            <div className={styles.banner}>
              <div className={styles.bannerText}>
                <p className={styles.badge}>{videoLibrary.subscribe.badge}</p>
                <h2 id="video-channel-heading" className={styles.bannerTitle}>{videoLibrary.subscribe.title}</h2>
                <p className={styles.text}>{videoLibrary.subscribe.description}</p>
              </div>
              <a className="alu-button alu-button--primary alu-button--md" href={videoLibrary.subscribe.href} target="_blank" rel="noopener noreferrer">
                <AluIcon name="youtube" size="sm" />
                <span>{videoLibrary.subscribe.label}</span>
                <span className="alu-visually-hidden"> (yeni sekmede açılır)</span>
                <AluIcon name="external-link" size="sm" />
              </a>
            </div>
          </div>
        </section>

        <section className={styles.band} aria-labelledby="all-playlists-heading">
          <div className="alu-container">
            <h2 id="all-playlists-heading" className={styles.groupTitle}>{videoLibrary.title}</h2>
            <p className={`${styles.text} ${styles.sectionLead}`}>{videoLibrary.description}</p>
            <ul className={styles.tiles}>
              {videoLibrary.items.map((item, idx) => {
                const sourceKey = videoSourceForUrl(item.url);
                const effectiveUrl = sourceKey ? `/video-kutuphanesi/kaynak/${sourceKey}` : item.url;
                const isInternal = effectiveUrl.startsWith('/');
                const isExternal = item.url.startsWith('http');
                const hasDestination = item.url !== '#';
                const matchedPlaylist = isInternal ? playlistByUrl.get(item.url) : undefined;

                return (
                  <li key={`${item.title}-${idx}`} className={styles.tile}>
                    <div className={styles.tileHead}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <span className={hasDestination ? styles.icon : styles.iconMuted} aria-hidden="true">
                        <AluIcon name="youtube" size="md" />
                      </span>
                    </div>
                    <p className={styles.text}>{item.description}</p>
                    {hasDestination && (
                      <div className={styles.tileFoot}>
                        {matchedPlaylist && <span className={styles.count}>{`${matchedPlaylist.count} Video`}</span>}
                        {isInternal ? (
                          <Link href={effectiveUrl} className={`alu-link alu-link--standalone ${styles.action}`} aria-label={`${ACTION_LABEL}: ${item.title}`}>
                            <span>{ACTION_LABEL}</span>
                            <AluIcon name="arrow-right" size="sm" />
                          </Link>
                        ) : (
                          <a
                            href={item.url}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className={`alu-link alu-link--standalone ${styles.action}`}
                            aria-label={`${ACTION_LABEL}: ${item.title}`}
                          >
                            <span>{ACTION_LABEL}</span>
                            <span className="alu-visually-hidden"> (yeni sekmede açılır)</span>
                            <AluIcon name="external-link" size="sm" />
                          </a>
                        )}
                        {sourceKey && <a href={item.url} target="_blank" rel="noopener noreferrer" className="alu-link alu-link--standalone" aria-label={`YouTube’da aç: ${item.title} (yeni sekmede açılır)`}>YouTube’da aç ↗</a>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
