import Link from 'next/link';
import { getAllPlaylists, getVideoLibraryData } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

const allPlaylists = getAllPlaylists();
const playlistByUrl = new Map(allPlaylists.map((playlist) => [playlist.url, playlist]));
const videoLibrary = getVideoLibraryData();

export function VideoLibraryHubSection() {
  return (
    <section className="preview-section" aria-labelledby="all-playlists-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-regular)' }}>
          <span className="preview-kicker">{videoLibrary.kicker}</span>
          <h2 id="all-playlists-heading" className="alu-h1">
            {videoLibrary.title}
          </h2>
          <p className="alu-body preview-meta" style={{ maxWidth: 'var(--container-application-meta)' }}>
            {videoLibrary.description}
          </p>
        </div>

        <div className="alu-yt-banner">
          <div className="alu-yt-banner__watermark" aria-hidden="true">
            <AluIcon name="youtube" size="lg" />
          </div>
          <div className="alu-yt-banner__content">
            <div className="alu-yt-banner__badge">
              <span className="alu-yt-banner__badge-icon">
                <AluIcon name="youtube" size="sm" />
              </span>
              <span>{videoLibrary.subscribe.badge}</span>
            </div>
            <h3 className="alu-yt-banner__title">
              {videoLibrary.subscribe.title}
            </h3>
            <p className="alu-yt-banner__desc">
              {videoLibrary.subscribe.description}
            </p>
          </div>
          <div className="alu-yt-banner__action">
            <a
              href={videoLibrary.subscribe.href}
              target="_blank"
              rel="noopener noreferrer"
              className="alu-yt-subscribe-btn"
            >
              <AluIcon name="youtube" size="md" />
              <span>{videoLibrary.subscribe.label}</span>
            </a>
          </div>
        </div>

        <div className="alu-yt-grid">
          {videoLibrary.items.map((item, idx) => {
            const isInternal = item.url.startsWith('/solutions-v2');
            const isExternal = item.url.startsWith('http');
            const matchedPlaylist = isInternal ? playlistByUrl.get(item.url) : undefined;
            const cardClassName = `alu-yt-card${
              isInternal ? ' alu-yt-card--internal' : ''
            }`;

            const cardInner = (
              <>
                <div className="alu-yt-card__top">
                  <div className="alu-yt-card__icon">
                    <AluIcon name="youtube" size="lg" />
                  </div>
                  {matchedPlaylist && (
                    <span className="alu-yt-card__count">
                      {matchedPlaylist.count} Video
                    </span>
                  )}
                </div>

                <h3 className="alu-yt-card__title">{item.title}</h3>

                <p className="alu-yt-card__desc">{item.description}</p>

                <div className="alu-yt-card__footer">
                  <span>İzleme Listesini İncele</span>
                  <AluIcon name="external-link" size="sm" />
                </div>

                <div className="alu-yt-card__watermark" aria-hidden="true">
                  <AluIcon name="circle-play" size="lg" />
                </div>
              </>
            );

            if (isInternal) {
              return (
                <Link key={`${item.title}-${idx}`} href={item.url} className={cardClassName}>
                  {cardInner}
                </Link>
              );
            }

            return (
              <a
                key={`${item.title}-${idx}`}
                href={item.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={cardClassName}
              >
                {cardInner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
