'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageRecord,
  PlaylistRecord,
  StructuredMediaGridSection,
  getAllPlaylists,
  getSearchIndex,
  TRIAL_CTA_URL,
  MAIN_QUOTE_FORM_URL,
  SUPPORT_PORTAL_URL
} from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { TrainingTabs } from './TrainingTabs';
import { WorkflowSection } from './WorkflowSection';
import { DirectoryCategoryIcon } from './DirectoryCategoryIcon';
import { FAQSection } from './FAQSection';
import { handleStructuredTabKey } from './structured-tab-key';
import { MediaDialog } from '@/components/ui/MediaDialog';


const allPlaylists = getAllPlaylists();
const playlistByUrl = new Map(allPlaylists.map((p) => [p.url, p]));
const searchIndex = getSearchIndex();

const VIDEO_LIBRARY_ITEMS: { title: string; description: string; url: string }[] = [
  {
    title: 'Allplan 2026',
    description: 'Allplan 2026 sürümü için hazırlanmış kapsamlı eğitim videoları ve yenilikler.',
    url: 'https://youtube.com/playlist?list=PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x&si=BSEJvgjsQWgbIwVe'
  },
  {
    title: 'Youtube Allplan English',
    description: 'Allplan global İngilizce içerikleri, uluslararası örnekler ve eğitimler.',
    url: 'https://www.youtube.com/@ALLPLANEnglish'
  },
  {
    title: 'Youtube Allplan Global',
    description: 'Dünya genelinden Allplan kullanıcı hikayeleri ve küresel etkinlikler.',
    url: 'https://www.youtube.com/@ALLPLANglobal'
  },
  {
    title: 'Youtube Allplan Precast',
    description: 'Prekast beton tasarımı ve üretimi üzerine özelleşmiş Almanca/İngilizce içerikler.',
    url: 'https://www.youtube.com/c/AllplanPrecast'
  },
  {
    title: 'Allplan ile Tanışın: Tüm Disiplinler İçin Temel Eğitim Videoları',
    description: 'Allplan 2024 sürümü ile gelen tüm yeniliklerin Türkçe anlatımı.',
    url: '/solutions-v2/training/video-library/hello-allplan-2024'
  },
  {
    title: 'Allplan Add On Geometry Tools',
    description: 'Topografik ve geometrik düzenleme araçları, arazi modelleme eğitimleri.',
    url: '/solutions-v2/training/video-library/addon-geometry'
  },
  {
    title: 'AX3000 - MEP & Enerji',
    description: 'Mekanik, Elektrik, Tesisat ve Enerji Kimlik Belgesi (EKB) eğitimleri.',
    url: '/solutions-v2/training/video-library/ax3000'
  },
  {
    title: 'Youtube CDS Allplan Add-On',
    description: 'CDS (Campus Delivery System) ve eklenti geliştirmeleri üzerine videolar.',
    url: '#'
  },
  {
    title: 'Allplan Road Design Workflow',
    description: 'Yol tasarımı iş akışları ve yol modülü eğitim videoları.',
    url: '/solutions-v2/training/video-library/road-design'
  },
  {
    title: 'Allplan Bridge Workflows',
    description: 'Köprü tasarımı süreçleri ve BIM entegrasyonu.',
    url: '/solutions-v2/training/video-library/bridge-workflows'
  },
  {
    title: 'Campus Tutorials (Deutsch)',
    description: 'Öğrenciler için detaylı Almanca eğitim serisi.',
    url: '/solutions-v2/training/video-library/campus-de'
  },
  {
    title: 'Campus Tutorials (English)',
    description: 'Öğrenciler için kapsamlı İngilizce eğitim serisi.',
    url: '/solutions-v2/training/video-library/campus-en'
  },
  {
    title: 'Allplan Bridge',
    description: 'Allplan Bridge modülünün genel tanıtımı ve özellikleri.',
    url: '#'
  },
  {
    title: 'Allplan Bridge Tutorials',
    description: 'Adım adım köprü modelleme ve analiz rehberleri.',
    url: '#'
  },
  {
    title: 'SDS2 Detaylandırma',
    description: 'SDS2 ürün tanıtımı ve lansman videoları.',
    url: '/solutions-v2/training/video-library/sds2-intro'
  },
  {
    title: 'Konut İnşaatı İş Akışları',
    description: 'Konut proje teslimi, tasarım ve şantiye planlama süreçleri.',
    url: '/solutions-v2/training/video-library/konut-insaati'
  },
  {
    title: 'Bridge Workflow 2022',
    description: '2022 Köprü tasarımı ve iş akışları eğitim serisi.',
    url: '/solutions-v2/training/video-library/bridge-workflow-2022'
  },
  {
    title: 'Otomatik Donatı (PythonPart)',
    description: 'Otomatik donatılandırma ve PythonPart araçları kullanımı.',
    url: '/solutions-v2/training/video-library/otomatik-donati'
  },
  {
    title: 'ALLPLAN QuickStart: Buildings',
    description: 'Allplan ile bina modellemeye hızlı başlangıç rehberi (9 Ders).',
    url: '/solutions-v2/training/video-library/quickstart-buildings'
  },
  {
    title: 'ALLPLAN for Reinforcement',
    description: 'Betonarme detaylandırma, donatı modelleme ve raporlama eğitimleri (18 Video).',
    url: '/solutions-v2/training/video-library/allplan-reinforcement'
  },
  {
    title: 'Allplan Campus Tutorials 2019-2022',
    description: 'Öğrenciler için kapsamlı Almanca eğitim serisi (2019-2022).',
    url: '/solutions-v2/training/video-library/campus-tutorials-2019-2022'
  },
  {
    title: 'ALLPLAN Pythonparts Youtube Kanalı',
    description: 'PythonParts ile parametrik obje geliştirme ve script örnekleri.',
    url: '#'
  }
];

const SECTION_LABELS: Record<string, string> = {
  products: 'ALLPLAN ÜRÜN AİLESİ',
  solutions: 'MÜHENDİSLİK VE TASARIM ÇÖZÜMLERİ',
  'solutions-v2': 'ÇÖZÜM EKOSİSTEMİ',
  training: 'ALLPLAN EĞİTİM MERKEZİ',
  'video-library': 'VİDEO EĞİTİM KÜTÜPHANESİ',
  corporate: 'ALUPLAN KURUMSAL',
  legal: 'YASAL BİLGİLENDİRME VE POLİTİKALAR',
  utility: 'SİSTEM VE ARAMA'
};

export function SubpageView({
  page,
  playlist
}: {
  page: PageRecord;
  playlist?: PlaylistRecord | null;
}) {
  const [activeVideoId, setActiveVideoId] = useState<string>(
    playlist?.videos?.[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

  // Structured Layout interactive states (Popup VideoModal, Image Lightbox, Workflow Tabs)
  const [activeModalVideo, setActiveModalVideo] = useState<{
    youtubeId?: string;
    videoSrc?: string;
    title: string;
  } | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [activeRefCatId, setActiveRefCatId] = useState<string>('all');
  const [refSearchQuery, setRefSearchQuery] = useState<string>('');


  const isLegalPage = page.section === 'legal';
  const isVideoLibraryHub = page.path === '/solutions-v2/training/video-library';
  const isVideoPlaylistPage = Boolean(playlist);
  const filteredResults = searchQuery.trim()
    ? searchIndex.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.seoTitle.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
        );
      })
    : searchIndex;

  // Separate high-resolution photos from small icon assets (52x52 / 128x128 PNGs)
  const photoImages = React.useMemo(() => {
    const seen = new Set<string>();
    const list: { src: string; alt: string }[] = [];
    for (const img of page.images || []) {
      if (!img.src || img.isIcon || seen.has(img.src)) continue;
      seen.add(img.src);
      list.push(img);
    }
    return list;
  }, [page.images]);

  const heroImage = !isLegalPage && photoImages.length > 0 ? photoImages[0] : null;
  const pageVideos = page.videos || [];

  // Partition sections into:
  // 1) Stat sections (with sec.statValue, e.g. 50% DAHA KESİN)
  // 2) Photo-backed feature sections (with sec.image, rendered as Alternating Split Rows)
  // 3) Benefit / Spec sections (with optional 48x48 sec.iconSrc badge or text specifications)
  const statSections = page.sections.filter((s) => Boolean(s.statValue));
  const featuredSections =
    !isLegalPage && !isVideoLibraryHub && !isVideoPlaylistPage
      ? page.sections.filter((s) => Boolean(s.image) && !s.statValue)
      : [];
  const specSections =
    !isVideoLibraryHub && !isVideoPlaylistPage
      ? page.sections.filter((s) => !s.statValue && (!s.image || isLegalPage))
      : [];

  const usedPhotoSrcs = new Set<string>();
  if (heroImage) usedPhotoSrcs.add(heroImage.src);
  for (const s of featuredSections) {
    if (s.image?.src) usedPhotoSrcs.add(s.image.src);
  }
  const galleryImages = photoImages.filter((im) => !usedPhotoSrcs.has(im.src));

  const sectionBadgeLabel = SECTION_LABELS[page.section] || page.eyebrow;

  return (
    <>
      {/* Subpage Hero Stage */}
      <section className="alu-subpage-hero" aria-labelledby="page-h1">
        {heroImage && (
          <div
            className="alu-subpage-hero__bg"
            style={{ backgroundImage: `url(${heroImage.src})` }}
            aria-hidden="true"
          />
        )}
        <div className="alu-subpage-hero__scrim" aria-hidden="true" />

        <div
          className={`alu-container alu-subpage-hero__inner ${heroImage ? 'alu-subpage-hero__grid' : 'alu-stack'}`}
          style={{ gap: 'var(--space-stack-xl)' }}
        >
          <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
            <nav aria-label="Sayfa konumu (Breadcrumb)">
              <ol className="alu-breadcrumb">
                {page.breadcrumbs.map((crumb, idx) => (
                  <li key={crumb.href + idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    {idx > 0 && <AluIcon name="chevron-right" size="sm" />}
                    {idx < page.breadcrumbs.length - 1 ? (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                      <span aria-current="page" style={{ color: 'var(--text-primary)' }}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="alu-cluster">
              <span className="alu-badge alu-badge--accent">
                <AluIcon name="layers" size="sm" />
                <span>{sectionBadgeLabel}</span>
              </span>
              <span className="alu-badge">ALLPLAN TÜRKİYE</span>
            </div>

            <h1 id="page-h1" className="alu-display" style={{ margin: 0 }}>
              {page.h1}
            </h1>

            <p className="alu-body-lg preview-meta" style={{ margin: 0 }}>
              {page.description}
            </p>

            {!isLegalPage && page.path !== '/about' && (
              <div className="alu-cluster" style={{ marginTop: 'var(--space-stack-sm)' }}>
                <a
                  href={MAIN_QUOTE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-button alu-button--primary alu-button--lg"
                >
                  <span>Teklif Talep Formu</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
                <a
                  href={TRIAL_CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-button alu-button--secondary alu-button--lg"
                >
                  <span>Ücretsiz Deneme</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
                {page.path.startsWith('/products') && (
                  <a
                    href="/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--ghost alu-button--md"
                  >
                    <AluIcon name="file-text" size="sm" />
                    <span>Paket Karşılaştırma PDF</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {heroImage && (
            <figure className="alu-subpage-hero__media">
              <div className="alu-subpage-hero__media-frame">
                <img src={heroImage.src} alt={heroImage.alt || page.h1} />
              </div>
              {heroImage.alt && (
                <figcaption className="alu-subpage-hero__caption">
                  <AluIcon name="sparkles" size="sm" />
                  <span>{heroImage.alt}</span>
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      {/* Subpage Animated/Verified Metrics Bar (when statSections exist on non-structuredLayout pages) */}
      {!page.structuredLayout && statSections.length > 0 && (
        <section className="preview-section preview-section--subtle" aria-label="Performans ve Verimlilik Göstergeleri">
          <div className="alu-container">
            <div className="alu-hero-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(statSections.length, 4)}, minmax(0, 1fr))` }}>
              {statSections.map((st) => (
                <div key={st.heading} className="alu-hero-metrics__item">
                  <span className="alu-hero-metrics__value">{st.statValue}</span>
                  <h2 className="alu-hero-metrics__label" style={{ margin: 0 }}>
                    {st.heading}
                  </h2>
                  {st.items.map((desc, dIdx) => (
                    <p key={dIdx} className="alu-body-sm" style={{ margin: '0.25rem 0 0 0' }}>
                      {desc}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Interactive View: Video Playlist (/solutions-v2/training/video-library/[playlistId]) */}
      {playlist && (
        <section className="preview-section" aria-labelledby="playlist-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="preview-section-heading">
              <div className="alu-stack">
                <span className="preview-kicker">VİDEO EĞİTİM SERİSİ · {playlist.count} VİDEO</span>
                <h2 id="playlist-heading" className="alu-h1">
                  {playlist.title}
                </h2>
                {playlist.subtitle && <p className="alu-body preview-meta">{playlist.subtitle}</p>}
              </div>
              <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions-v2/training/video-library">
                <span>Video Kütüphanesine Dön</span>
                <AluIcon name="arrow-right" size="sm" />
              </Link>
            </div>

            {(() => {
              const currentVideo =
                playlist.videos.find((v) => v.id === activeVideoId) || playlist.videos[0];
              const currentIdx = Math.max(
                0,
                playlist.videos.findIndex((v) => v.id === currentVideo?.id)
              );

              return (
                <div className="alu-playlist-stage">
                  {/* Left (2/3): Main Video Player Area */}
                  <div className="alu-playlist-stage__main">
                    {currentVideo && (
                      <div className="alu-playlist-player-card">
                        <div className="alu-playlist-player-card__viewport">
                          <iframe
                            src={`https://www.youtube.com/embed/${currentVideo.id}`}
                            title={currentVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="alu-playlist-player-card__body">
                          <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                            <span className="alu-badge alu-badge--accent">
                              <AluIcon name="circle-play" size="sm" />
                              <span>Bölüm {currentIdx + 1} / {playlist.videos.length}</span>
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
                          <p className="alu-body" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            {currentVideo.description ||
                              `Bu eğitim videosunda ${currentVideo.title} konusu detaylı olarak incelenmektedir. Allplan eğitim serisinin sunduğu yenilikleri keşfedin.`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right (1/3): Sticky Scrollable Playlist Sidebar */}
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
                      {playlist.videos.map((vid, idx) => {
                        const isSelected = vid.id === currentVideo?.id;
                        return (
                          <button
                            key={`${vid.id}-${idx}`}
                            type="button"
                            onClick={() => setActiveVideoId(vid.id)}
                            className={`alu-playlist-item${
                              isSelected ? ' alu-playlist-item--active' : ''
                            }`}
                          >
                            <div className="alu-playlist-item__thumb">
                              <img
                                src={`https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`}
                                alt={vid.title}
                                loading="lazy"
                              />
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
                                {idx + 1}. {vid.title}
                              </span>
                              <span className="alu-playlist-item__meta">
                                Video Ders{vid.duration ? ` · ${vid.duration}` : ''}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Special Interactive View: Video Library Hub (/solutions-v2/training/video-library) */}
      {page.path === '/solutions-v2/training/video-library' && (
        <section className="preview-section" aria-labelledby="all-playlists-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="alu-stack" style={{ gap: '0.5rem' }}>
              <span className="preview-kicker">GÖRSEL EĞİTİM · VİDEO KÜTÜPHANESİ</span>
              <h2 id="all-playlists-heading" className="alu-h1">
                Önerilen Oynatma Listeleri ve Kanallar
              </h2>
              <p className="alu-body preview-meta" style={{ maxWidth: '58ch' }}>
                Sizin için derlediğimiz en popüler ve faydalı video kaynak liste ve kanalları.
              </p>
            </div>

            {/* YouTube Subscribe Banner (1:1 with live site) */}
            <div className="alu-yt-banner">
              <div className="alu-yt-banner__watermark" aria-hidden="true">
                <AluIcon name="youtube" size="lg" />
              </div>
              <div className="alu-yt-banner__content">
                <div className="alu-yt-banner__badge">
                  <span className="alu-yt-banner__badge-icon">
                    <AluIcon name="youtube" size="sm" />
                  </span>
                  <span>Resmi Kanal</span>
                </div>
                <h3 className="alu-yt-banner__title">
                  Allplan Türkiye YouTube Kanalına Abone Olun
                </h3>
                <p className="alu-yt-banner__desc">
                  En yeni eğitim videoları, ipuçları, webinar kayıtları ve sektörel gelişmelerden anında haberdar olmak için kanalımıza abone olmayı unutmayın.
                </p>
              </div>
              <div className="alu-yt-banner__action">
                <a
                  href="https://www.youtube.com/@AllplanTurkey?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-yt-subscribe-btn"
                >
                  <AluIcon name="youtube" size="md" />
                  <span>ABONE OL</span>
                </a>
              </div>
            </div>

            {/* 22 Playlist & Channel Cards Grid (1:1 with live site) */}
            <div className="alu-yt-grid">
              {VIDEO_LIBRARY_ITEMS.map((item, idx) => {
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
      )}

      {/* Special Interactive View: Search Page (/search) */}
      {page.path === '/search' && (
        <section className="preview-section" aria-labelledby="search-page-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
            <h2 id="search-page-heading" className="alu-h2">
              Tüm Sayfa, Ürün ve Çözümlerde Ara ({filteredResults.length} sonuç)
            </h2>
            <input
              type="search"
              className="alu-input"
              placeholder="Anahtar kelime girin (örn. ALLPLAN 2026, AX3000, BIMFlex, Köprü, Prekast)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="alu-services-grid">
              {filteredResults.map((item) => (
                <article key={item.path} className="alu-service-card">
                  <span className="alu-card__eyebrow">{item.section.toUpperCase()}</span>
                  <div className="alu-card__body">
                    <h3 className="alu-card__title">{item.title}</h3>
                    <p className="alu-body-sm">{item.description}</p>
                  </div>
                  <div className="alu-card__footer">
                    <Link className="alu-link alu-link--standalone" href={item.path}>
                      <span>Sayfaya Git</span>
                      <AluIcon name="arrow-right" size="sm" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.path === '/solutions-v2/training' && page.structuredLayout?.trainingTabs && (
        <TrainingTabs content={page.structuredLayout.trainingTabs} />
      )}

      {page.path === '/solutions-v2/training' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="training-request-heading">
          <div className="alu-container alu-stack">
            <h2 id="training-request-heading" className="alu-h2">Eğitim Talebi</h2>
            <p className="alu-body">Eğitim ihtiyacınızı mevcut talep formumuz üzerinden paylaşabilirsiniz.</p>
            <div className="alu-cluster">
              <a href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer" className="alu-button alu-button--primary alu-button--md">
                <span>Eğitim Talep Formunu Aç</span>
                <AluIcon name="external-link" size="sm" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Contact requests use the shared Microsoft form; direct channels stay available */}
      {page.path === '/contact' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="contact-form-heading">
          <div className="alu-container alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))' }}>
            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">DOĞRUDAN İLETİŞİM</span>
              <h2 id="contact-form-heading" className="alu-h2">
                İletişim ve Danışmanlık Talepleri
              </h2>
              <p className="alu-body">
                Teklif, ürün bilgisi ve eğitim taleplerinizi ortak Microsoft Forms üzerinden iletebilirsiniz.
                Doğrudan iletişim için e-posta ve telefon kanallarımızı kullanabilirsiniz.
              </p>
              <a href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer" className="alu-button alu-button--primary alu-button--lg">
                <span>Talep Formunu Aç</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              <a href="mailto:info@aluplan.com.tr" className="alu-link">info@aluplan.com.tr</a>
            </div>

            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">MERKEZ OFİS & DESTEK</span>
              <h2 className="alu-h2">Merkez Ofis ve Doğrudan Erişim</h2>
              <p className="alu-body">
                Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul
              </p>
              <ul className="alu-stack" style={{ listStyle: 'none', padding: 0, margin: 0, gap: '0.75rem' }}>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Santral / Ofis</span>
                    <a className="alu-link" href="tel:+902162258441">(+90) 216 225 84 41</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Satış & Danışmanlık 1</span>
                    <a className="alu-link" href="tel:+905432119442">(+90) 543 211 94 42</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Satış & Danışmanlık 2</span>
                    <a className="alu-link" href="tel:+905494997379">(+90) 549 499 73 79</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="mail" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Kurumsal E-posta</span>
                    <a className="alu-link" href="mailto:info@aluplan.com.tr">info@aluplan.com.tr</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="life-buoy" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Teknik Destek Portalı</span>
                    <a className="alu-link" href="https://allplan.net.tr/tr" target="_blank" rel="noopener noreferrer">
                      allplan.net.tr/tr ↗
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Special Corporate Editorial Profile View (/about) */}
      {page.path === '/about' && (() => {
        const storySection = page.sections.find((s) => s.heading === 'Hikayemiz');
        const storyParagraphs = storySection?.items ?? [
          "Aluplan Program Sistemleri, 1995 yılından bu yana Türkiye'de ALLPLAN yazılımlarının tek yetkili distribütörü olarak hizmet vermektedir. Kurulduğumuz günden bu yana, mimari, mühendislik ve inşaat sektörünün dijital dönüşümüne öncülük ediyoruz.",
          "ALLPLAN'ın güçlü BIM çözümlerini Türkiye pazarına sunarak, binlerce projenin başarıyla tamamlanmasına katkıda bulunduk. Mimari tasarımdan yapısal analize, köprü mühendisliğinden prekast üretime kadar geniş bir yelpazede profesyonel yazılım çözümleri ve danışmanlık hizmetleri sunuyoruz.",
          "Deneyimli ve sertifikalı uzman kadromuzla, müşterilerimize sadece yazılım tedarik etmekle kalmıyor, aynı zamanda kapsamlı eğitim, teknik destek ve proje danışmanlığı hizmetleriyle yanlarında oluyoruz. İstanbul Ataşehir'deki merkez ofisimizden Türkiye genelindeki kamu kurumlarına, üniversitelere, mimarlık ve mühendislik ofislerine, inşaat firmalarına hizmet veriyoruz."
        ];

        const corporateMetrics = [
          { value: '29+', label: 'Yıllık Tecrübe', meta: '1995’ten Beri Türkiye Distribütörü' },
          { value: '500+', label: 'Aktif Müşteri', meta: 'Kamu, Kurumsal & Mühendislik Ofisleri' },
          { value: '50+', label: 'Uzman Kadro', meta: 'BIM Danışmanlığı & Teknik Destek' },
          { value: '10K+', label: 'Tamamlanan Proje', meta: 'Üstyapı, Köprü, Altyapı & Prekast' }
        ];

        const corporateValues = [
          {
            num: 'I',
            icon: 'target',
            title: 'Misyonumuz',
            description:
              page.sections.find((s) => s.heading === 'Misyonumuz')?.items[0] ??
              "Türkiye'de BIM teknolojilerinin yaygınlaşması ve mimari/mühendislik projelerinin dijital dönüşümüne öncülük etmek."
          },
          {
            num: 'II',
            icon: 'users',
            title: 'Müşteri Odaklılık',
            description:
              page.sections.find((s) => s.heading === 'Müşteri Odaklılık')?.items[0] ??
              'Müşterilerimizin başarısı bizim başarımızdır. Profesyonel destek ve danışmanlık hizmetimizle her zaman yanınızdayız.'
          },
          {
            num: 'III',
            icon: 'award',
            title: 'Kalite ve Uzmanlık',
            description:
              page.sections.find((s) => s.heading === 'Kalite ve Uzmanlık')?.items[0] ??
              'Sertifikalı uzman kadromuz ve sürekli eğitimlerimizle sektörün en kaliteli hizmetini sunuyoruz.'
          },
          {
            num: 'IV',
            icon: 'trending-up',
            title: 'Sürekli İnovasyon',
            description:
              page.sections.find((s) => s.heading === 'Sürekli İnovasyon')?.items[0] ??
              'Teknolojinin nabzını tutarak, en güncel çözümleri müşterilerimize sunmak için çalışıyoruz.'
          }
        ];

        const mapEmbed = page.embeds?.[0];

        return (
          <div className="alu-about-editorial">
            {/* 1. Corporate Key Metrics Ledger */}
            <section className="alu-about-metrics-band" aria-label="Kurumsal Göstergeler">
              <div className="alu-container">
                <div className="alu-about-metrics">
                  {corporateMetrics.map((m) => (
                    <div key={m.label} className="alu-about-metric">
                      <span className="alu-about-metric__value">{m.value}</span>
                      <span className="alu-about-metric__label">{m.label}</span>
                      <span className="alu-about-metric__meta">{m.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Asymmetric Editorial Story ("Hikayemiz") */}
            <section className="preview-section" aria-labelledby="about-story-heading">
              <div className="alu-container">
                <div className="alu-about-story">
                  <aside className="alu-about-story__aside">
                    <span className="preview-kicker">KURUMSAL PROFİL · 1995’TEN BUGÜNE</span>
                    <h2 id="about-story-heading" className="alu-h1" style={{ margin: 0 }}>
                      Hikayemiz
                    </h2>
                    <blockquote className="alu-about-quote">
                      “Türkiye’de mimari, mühendislik ve altyapı projelerinin BIM tabanlı dijital dönüşümüne 1995 yılından bu yana kesintisiz liderlik ediyoruz.”
                    </blockquote>

                    <dl className="alu-about-chronicle">
                      <div className="alu-about-chronicle__item">
                        <dt>1995</dt>
                        <dd>Aluplan Program Sistemleri kuruldu ve ALLPLAN Türkiye yetkili distribütörlüğü başladı.</dd>
                      </div>
                      <div className="alu-about-chronicle__item">
                        <dt>AEC &amp; INFRA</dt>
                        <dd>Mimari, yapısal mühendislik, köprü ve prekast disiplinlerinde uçtan uca BIM ekosistemi.</dd>
                      </div>
                      <div className="alu-about-chronicle__item">
                        <dt>ATAŞEHİR HQ</dt>
                        <dd>İstanbul merkez ofisimizden kamu kurumları, üniversiteler ve mühendislik ofislerine ulusal destek.</dd>
                      </div>
                    </dl>
                  </aside>

                  <div className="alu-about-story__prose">
                    {storyParagraphs.map((para, idx) => (
                      <p
                        key={idx}
                        className={idx === 0 ? 'alu-about-story__lead' : 'alu-about-story__paragraph'}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Corporate Values Manifesto ("Değerlerimiz") */}
            <section className="preview-section preview-section--subtle" aria-labelledby="about-values-heading">
              <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                <div className="alu-about-section-head">
                  <div>
                    <span className="preview-kicker">KURUMSAL İLKELER</span>
                    <h2 id="about-values-heading" className="alu-h1" style={{ margin: '0.35rem 0 0 0' }}>
                      Değerlerimiz
                    </h2>
                  </div>
                  <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: '42ch' }}>
                    Çalışmalarımızı şekillendiren temel ilkelerimiz
                  </p>
                </div>

                <div className="alu-about-values">
                  {corporateValues.map((val) => (
                    <article key={val.title} className="alu-about-value-item">
                      <div className="alu-about-value-item__top">
                        <span className="alu-about-value-item__roman">{val.num}</span>
                        <span className="alu-about-value-item__icon" aria-hidden="true">
                          <DirectoryCategoryIcon name={val.icon} />
                        </span>
                      </div>
                      <h3 className="alu-about-value-item__title">{val.title}</h3>
                      <p className="alu-about-value-item__desc">{val.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Headquarters & Interactive Map ("Ofisimiz") */}
            <section className="preview-section" aria-labelledby="about-office-heading">
              <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                <div className="alu-about-section-head">
                  <div>
                    <span className="preview-kicker">MERKEZ OFİS &amp; LOKASYON</span>
                    <h2 id="about-office-heading" className="alu-h1" style={{ margin: '0.35rem 0 0 0' }}>
                      Ofisimiz
                    </h2>
                  </div>
                  <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: '48ch' }}>
                    İstanbul Ataşehir&apos;deki modern ofisimizden Türkiye geneline hizmet veriyoruz
                  </p>
                </div>

                <div className="alu-about-office">
                  <div className="alu-about-office__info">
                    <div className="alu-about-office__block">
                      <span className="alu-about-office__eyebrow">ADRES</span>
                      <h3 className="alu-h3" style={{ margin: '0.25rem 0 0.5rem 0' }}>
                        Adres
                      </h3>
                      <p className="alu-body" style={{ margin: 0, lineHeight: 1.65 }}>
                        Quick Tower – Workinton
                        <br />
                        İçerenköy Mah. Topçu İbrahim Sok.
                        <br />
                        8/10D No: 5
                        <br />
                        34752 Ataşehir / İstanbul
                      </p>
                    </div>

                    <div className="alu-about-office__divider" />

                    <div className="alu-about-office__block">
                      <span className="alu-about-office__eyebrow">DOĞRUDAN ERİŞİM</span>
                      <h3 className="alu-h3" style={{ margin: '0.25rem 0 0.75rem 0' }}>
                        İletişim
                      </h3>
                      <dl className="alu-about-office__contact-list">
                        <div>
                          <dt>Telefon:</dt>
                          <dd>
                            <a className="alu-link" href="tel:+902162258441">
                              (+90) 216 225 84 41
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt>Email:</dt>
                          <dd>
                            <a className="alu-link" href="mailto:info@aluplan.com.tr">
                              info@aluplan.com.tr
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt>Çalışma Saatleri:</dt>
                          <dd>Pazartesi - Cuma: 09:00 - 18:00</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="alu-cluster" style={{ gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <Link className="alu-button alu-button--primary alu-button--sm" href="/contact">
                        <span>İletişim Sayfasına Git</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </Link>
                      <Link className="alu-button alu-button--secondary alu-button--sm" href="/references">
                        <span>Referanslarımızı İncele</span>
                      </Link>
                    </div>
                  </div>

                  {mapEmbed && (
                    <div className="alu-about-office__map">
                      <iframe
                        src={mapEmbed.src}
                        title={mapEmbed.title || 'Aluplan Ofis Konumu'}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      })()}

      {/* License declarations remain separate from sales requests */}
      {page.path === '/solutions-v2/connect-license/activation' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="activation-form-heading">
          <div className="alu-container">
            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">LİSANS AKTİVASYONU</span>
              <h2 id="activation-form-heading" className="alu-h2">
                ALLPLAN Lisans Deklarasyon ve Aktivasyon
              </h2>
              <p className="alu-body">
                Bu sayfadan çevrimiçi deklarasyon gönderimi yapılmamaktadır.
                Lisans aktivasyonu ve deklarasyon işlemleri için Aluplan ile iletişime geçebilirsiniz.
              </p>
              <div className="alu-cluster">
                <a href="/docs/Declaration_Allplan_2021-06-01.pdf" target="_blank" rel="noopener noreferrer" className="alu-button alu-button--secondary alu-button--md">
                  <AluIcon name="file-text" size="sm" />
                  <span>Örnek Deklarasyon Belgesi (PDF)</span>
                </a>
                <a href={SUPPORT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="alu-button alu-button--primary alu-button--md">
                  <span>Destek Merkezine Git</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
                <a href="mailto:info@aluplan.com.tr" className="alu-link">info@aluplan.com.tr</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Preserved Native MP4 Videos (only when not already paired inside structuredLayout.splitCallouts) */}
      {pageVideos.length > 0 && !page.structuredLayout?.splitCallouts?.some((c) => Boolean(c.videoSrc)) && (
        <section className="preview-section preview-section--subtle" aria-label="Sayfa videoları">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
            <div className="alu-stack">
              <span className="preview-kicker">TEKNİK VİDEO GÖSTERİMLERİ</span>
              <h2 className="alu-h1">Uygulama ve İş Akışı Videoları</h2>
            </div>
            <div className="alu-products-showcase">
              {pageVideos.map((vid, vIdx) => (
                <article key={`${vid.src}-${vIdx}`} className="alu-product-card">
                  <div className="alu-product-card__media" style={{ aspectRatio: '16 / 9' }}>
                    <video
                      src={vid.src}
                      poster={vid.poster || undefined}
                      controls
                      preload="metadata"
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  {vid.title && (
                    <div className="alu-product-card__body">
                      <span className="alu-card__eyebrow">0{vIdx + 1} · VİDEO GÖSTERİMİ</span>
                      <h3 className="alu-card__title" style={{ fontSize: 'var(--type-h4-size)' }}>
                        {vid.title}
                      </h3>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Structured Page Layout (Live-Site 1:1 Section Architecture for Product & Solution Pages) */}
      {page.structuredLayout && !page.structuredLayout.trainingTabs ? (
        <div className="alu-structured-page">
          {(() => {
            const sl = page.structuredLayout!;

            const renderMediaGrid = (grid: StructuredMediaGridSection, keyPrefix: string) => {
              const cols = grid.columns || 3;
              return (
                <section key={keyPrefix} className="preview-section" aria-label={grid.title}>
                  <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                    <div className="alu-section-header-center">
                      {grid.kicker && <span className="preview-kicker">{grid.kicker}</span>}
                      <h2 className="alu-h1" style={{ margin: 0 }}>
                        {grid.title}
                      </h2>
                      {grid.subtitle && (
                        <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: '68ch' }}>
                          {grid.subtitle}
                        </p>
                      )}
                    </div>

                    <div className={`alu-media-grid alu-media-grid--cols-${cols}`}>
                      {grid.items.map((item, idx) => {
                        const hasVideo = Boolean(item.youtubeId);
                        const resolvedThumbSrc =
                          item.imageSrc ||
                          (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '');
                        const hasImage = Boolean(resolvedThumbSrc);
                        return (
                          <article
                            key={`${keyPrefix}-${item.title}-${idx}`}
                            className={`alu-media-card${hasVideo ? ' alu-media-card--video' : ''}`}
                          >
                            {hasImage && (
                              <div
                                className="alu-media-card__thumb"
                                role={hasVideo || hasImage ? 'button' : undefined}
                                tabIndex={hasVideo || hasImage ? 0 : undefined}
                                aria-label={
                                  hasVideo
                                    ? `${item.title} videosunu pop-up pencerede oynat`
                                    : `${item.title} görselini büyüt`
                                }
                                onClick={() => {
                                  if (item.youtubeId) {
                                    setActiveModalVideo({ youtubeId: item.youtubeId, title: item.title });
                                  } else if (resolvedThumbSrc) {
                                    setActiveLightboxImage({ src: resolvedThumbSrc, title: item.title });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    if (item.youtubeId) {
                                      setActiveModalVideo({ youtubeId: item.youtubeId, title: item.title });
                                    } else if (resolvedThumbSrc) {
                                      setActiveLightboxImage({ src: resolvedThumbSrc, title: item.title });
                                    }
                                  }
                                }}
                              >
                                <img src={resolvedThumbSrc} alt={item.title} loading="lazy" />
                                <div className="alu-media-card__scrim" aria-hidden="true" />
                                {hasVideo ? (
                                  <>
                                    <span className="alu-media-card__video-badge">
                                      <AluIcon name="video" size="sm" />
                                      <span>VİDEO</span>
                                    </span>
                                    <span className="alu-media-card__play" aria-hidden="true">
                                      <span className="alu-media-card__play-circle">
                                        <AluIcon name="circle-play" size="lg" />
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="alu-media-card__zoom-hint" aria-hidden="true">
                                    <AluIcon name="sparkles" size="sm" />
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="alu-media-card__body">
                              {(item.badge || item.subtitle) && (
                                <div className="alu-media-card__meta">
                                  {item.badge && (
                                    <span className="alu-badge alu-badge--accent">{item.badge}</span>
                                  )}
                                  {item.subtitle && (
                                    <span className="alu-media-card__subtitle">{item.subtitle}</span>
                                  )}
                                </div>
                              )}

                              <h3 className="alu-media-card__title">{item.title}</h3>

                              {item.description && (
                                <p className="alu-media-card__desc">{item.description}</p>
                              )}

                              {item.bullets && item.bullets.length > 0 && (
                                <ul className="alu-media-card__bullets">
                                  {item.bullets.map((b, bIdx) => (
                                    <li key={bIdx}>
                                      <AluIcon name="check" size="sm" />
                                      <span>{b.replace(/^•\s*/, '')}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {(hasVideo || item.href) && (
                                <div className="alu-media-card__footer">
                                  {hasVideo ? (
                                    <button
                                      type="button"
                                      className="alu-media-card__video-btn"
                                      onClick={() =>
                                        setActiveModalVideo({
                                          youtubeId: item.youtubeId!,
                                          title: item.title
                                        })
                                      }
                                    >
                                      <AluIcon name="circle-play" size="sm" />
                                      <span>{item.ctaText || 'Videoyu İzle'}</span>
                                    </button>
                                  ) : item.href ? (
                                    item.external ? (
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="alu-link alu-link--standalone"
                                      >
                                        <span>{item.ctaText || 'Detayları İncele'}</span>
                                        <AluIcon name="external-link" size="sm" />
                                      </a>
                                    ) : (
                                      <Link href={item.href} className="alu-link alu-link--standalone">
                                        <span>{item.ctaText || 'Detayları İncele'}</span>
                                        <AluIcon name="arrow-right" size="sm" />
                                      </Link>
                                    )
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            };

            return (
              <>
                {/* 1. Post-Hero Intro + Embedded Video (e.g., "ALLPLAN Ultimate Nedir?" + YouTube Video) */}
                {sl.intro && (
                  <section className="preview-section" aria-label={sl.intro.title}>
                    <div className="alu-container">
                      <div
                        className={`alu-intro-split${
                          sl.intro.videoEmbedUrl ? '' : ' alu-intro-split--single'
                        }`}
                      >
                        <div className="alu-intro-split__content">
                          {sl.intro.kicker && (
                            <span className="preview-kicker">{sl.intro.kicker}</span>
                          )}
                          <h2 className="alu-h1" style={{ margin: 0 }}>
                            {sl.intro.title}
                          </h2>
                          {sl.intro.paragraphs?.map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex} className="alu-body">{paragraph}</p>
                          ))}
                          {sl.intro.bullets.length > 0 && (
                            <ul className="alu-intro-split__bullets">
                              {sl.intro.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="alu-intro-split__bullet">
                                  <span className="alu-intro-split__bullet-icon">
                                    <AluIcon name="check" size="sm" />
                                  </span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {sl.intro.videoEmbedUrl && (
                          <div className="alu-intro-split__media">
                            <div className="alu-intro-split__video-frame">
                              <iframe
                                src={sl.intro.videoEmbedUrl}
                                title={sl.intro.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* 2. Workflow Links Ribbon (Sürümleri Görüntüle, Tasarım için İş Akışları, etc.) */}
                {sl.workflowLinks && sl.workflowLinks.length > 0 && (
                  <section className="alu-workflow-ribbon-section" aria-label="Hızlı İş Akışı Bağlantıları">
                    <div className="alu-container">
                      <div className="alu-workflow-ribbon">
                        {sl.workflowLinks.map((wlink, wIdx) => {
                          const pillContent = (
                            <>
                              <span
                                className="alu-workflow-pill__dot"
                                style={{ background: wlink.color || 'var(--accent-primary)' }}
                              />
                              <span className="alu-workflow-pill__text">{wlink.text}</span>
                              <span className="alu-workflow-pill__arrow">
                                <AluIcon name="arrow-right" size="sm" />
                              </span>
                            </>
                          );
                          return wlink.external ? (
                            <a
                              key={`${wlink.href}-${wIdx}`}
                              href={wlink.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="alu-workflow-pill"
                            >
                              {pillContent}
                            </a>
                          ) : (
                            <Link
                              key={`${wlink.href}-${wIdx}`}
                              href={wlink.href}
                              className="alu-workflow-pill"
                            >
                              {pillContent}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}

                {/* 3. Solution Performance Stats & Challenges (when present on solution pages) */}
                {sl.stats && sl.stats.length > 0 && (
                  <section className="preview-section preview-section--subtle" aria-label="Performans Göstergeleri">
                    <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                      <div
                        className="alu-hero-metrics"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(sl.stats.length, 4)}, minmax(0, 1fr))`
                        }}
                      >
                        {sl.stats.map((st, idx) => (
                          <div key={`${st.label}-${idx}`} className="alu-hero-metrics__item">
                            <span className="alu-hero-metrics__value">{st.value}</span>
                            <h3 className="alu-hero-metrics__label" style={{ margin: 0 }}>
                              {st.label}
                            </h3>
                            <p className="alu-body-sm" style={{ margin: '0.25rem 0 0 0' }}>
                              {st.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {sl.challenges && sl.challenges.length > 0 && (
                        <div className="alu-challenges-band">
                          <div className="alu-challenges-band__header">
                            <span className="preview-kicker">/ SEKTÖREL ZORLUKLAR</span>
                            <h3 className="alu-h3" style={{ margin: 0 }}>
                              Günümüz Projelerinde Karşılaşılan Temel Zorluklar
                            </h3>
                          </div>
                          <div className="alu-challenges-grid">
                            {sl.challenges.map((ch, cIdx) => (
                              <div key={cIdx} className="alu-challenge-card">
                                <span className="alu-challenge-card__num">0{cIdx + 1}</span>
                                <p className="alu-body-sm" style={{ margin: 0 }}>
                                  {ch}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 3b. Primary Split Callouts / InfoMediaTwoColumn Paired Text + Video/Image Sections */}
                {sl.splitCallouts &&
                  sl.splitCallouts
                    .filter(
                      (callout) =>
                        callout.title !== 'Lisans ve Gereksinimler' &&
                        !callout.title.includes('SCIA Engineer')
                    )
                    .map((callout, cIdx) => {
                      const hasYt = Boolean(callout.youtubeId);
                      const hasMp4 = Boolean(callout.videoSrc);
                      const hasVideo = hasYt || hasMp4;
                      const thumbSrc =
                        callout.imageSrc ||
                        (callout.youtubeId
                          ? `https://img.youtube.com/vi/${callout.youtubeId}/hqdefault.jpg`
                          : '');
                      const isReversed = callout.reverse ?? cIdx % 2 === 1;
                      const paragraphs =
                        callout.paragraphs && callout.paragraphs.length > 0
                          ? callout.paragraphs
                          : callout.description
                          ? [callout.description]
                          : [];

                      return (
                        <section
                          key={`callout-top-${callout.title}-${cIdx}`}
                          className="preview-section preview-section--subtle"
                          aria-label={callout.title}
                        >
                          <div className="alu-container">
                            <div
                              className={`alu-scia-callout${
                                isReversed ? ' alu-scia-callout--reverse' : ''
                              }`}
                            >
                              <div
                                className={`alu-scia-callout__media${
                                  hasVideo || thumbSrc ? ' alu-scia-callout__media--interactive' : ''
                                }`}
                                role={hasVideo || thumbSrc ? 'button' : undefined}
                                tabIndex={hasVideo || thumbSrc ? 0 : undefined}
                                aria-label={
                                  hasVideo
                                    ? `${callout.title} videosunu pop-up pencerede oynat`
                                    : `${callout.title} görselini büyüt`
                                }
                                onClick={() => {
                                  if (callout.youtubeId) {
                                    setActiveModalVideo({
                                      youtubeId: callout.youtubeId,
                                      title: callout.title
                                    });
                                  } else if (callout.videoSrc) {
                                    setActiveModalVideo({
                                      videoSrc: callout.videoSrc,
                                      title: callout.title
                                    });
                                  } else if (thumbSrc) {
                                    setActiveLightboxImage({
                                      src: thumbSrc,
                                      title: callout.title
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    if (callout.youtubeId) {
                                      setActiveModalVideo({
                                        youtubeId: callout.youtubeId,
                                        title: callout.title
                                      });
                                    } else if (callout.videoSrc) {
                                      setActiveModalVideo({
                                        videoSrc: callout.videoSrc,
                                        title: callout.title
                                      });
                                    } else if (thumbSrc) {
                                      setActiveLightboxImage({
                                        src: thumbSrc,
                                        title: callout.title
                                      });
                                    }
                                  }
                                }}
                              >
                                {hasMp4 && callout.videoSrc ? (
                                  <video
                                    src={callout.videoSrc}
                                    poster={callout.imageSrc || undefined}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  />
                                ) : thumbSrc ? (
                                  <img src={thumbSrc} alt={callout.title} loading="lazy" />
                                ) : null}

                                <div className="alu-media-card__scrim" aria-hidden="true" />

                                {hasVideo ? (
                                  <>
                                    <span className="alu-media-card__video-badge">
                                      <AluIcon name="video" size="sm" />
                                      <span>POPUP VİDEO</span>
                                    </span>
                                    <span className="alu-media-card__play" aria-hidden="true">
                                      <span className="alu-media-card__play-circle">
                                        <AluIcon name="circle-play" size="lg" />
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="alu-media-card__zoom-hint" aria-hidden="true">
                                    <AluIcon name="sparkles" size="sm" />
                                  </span>
                                )}
                              </div>

                              <div className="alu-scia-callout__content">
                                {callout.kicker && (
                                  <span className="preview-kicker">{callout.kicker}</span>
                                )}
                                <h2 className="alu-h2" style={{ margin: 0 }}>
                                  {callout.title}
                                </h2>
                                {callout.lead && (
                                  <p className="alu-scia-callout__lead">{callout.lead}</p>
                                )}
                                {callout.subheading && (
                                  <h3 className="alu-h4" style={{ margin: 0, color: 'var(--accent-fg)' }}>
                                    {callout.subheading}
                                  </h3>
                                )}
                                {paragraphs.map((para, pIdx) => (
                                  <p key={pIdx} className="alu-body" style={{ margin: 0 }}>
                                    {para}
                                  </p>
                                ))}
                                {callout.bullets && callout.bullets.length > 0 && (
                                  <ul className="alu-media-card__bullets" style={{ marginTop: '0.25rem' }}>
                                    {callout.bullets.map((b, bIdx) => (
                                      <li key={bIdx}>
                                        <AluIcon name="check" size="sm" />
                                        <span>{b.replace(/^•\s*/, '')}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="alu-cluster" style={{ marginTop: '0.5rem' }}>
                                  {hasVideo && (
                                    <button
                                      type="button"
                                      className="alu-button alu-button--primary alu-button--md"
                                      onClick={() => {
                                        if (callout.youtubeId) {
                                          setActiveModalVideo({
                                            youtubeId: callout.youtubeId,
                                            title: callout.title
                                          });
                                        } else if (callout.videoSrc) {
                                          setActiveModalVideo({
                                            videoSrc: callout.videoSrc,
                                            title: callout.title
                                          });
                                        }
                                      }}
                                    >
                                      <AluIcon name="circle-play" size="sm" />
                                      <span>Videoyu İzle</span>
                                    </button>
                                  )}
                                  {callout.ctaHref && (
                                    <a
                                      href={callout.ctaHref}
                                      target={callout.external ? '_blank' : undefined}
                                      rel={callout.external ? 'noopener noreferrer' : undefined}
                                      className="alu-button alu-button--secondary alu-button--md"
                                    >
                                      <span>{callout.ctaText || 'Detayları İnceleyin'}</span>
                                      <AluIcon name="external-link" size="sm" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })}

                {/* 4. Benefits / Reasons Icon Card Grid (e.g., "ALLPLAN Ultimate'in Faydaları" — 12 icon cards) */}
                {sl.benefits && sl.benefits.items.length > 0 && (
                  <section className="preview-section preview-section--subtle" aria-label={sl.benefits.title}>
                    <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                      <div className="alu-section-header-center">
                        {sl.benefits.kicker && (
                          <span className="preview-kicker">{sl.benefits.kicker}</span>
                        )}
                        <h2 className="alu-h1" style={{ margin: 0 }}>
                          {sl.benefits.title}
                        </h2>
                      </div>

                      <div
                        className={`alu-benefits-grid${
                          sl.benefits.items.length >= 12 || sl.benefits.items.length === 8
                            ? ' alu-benefits-grid--cols-4'
                            : ' alu-benefits-grid--cols-3'
                        }`}
                      >
                        {sl.benefits.items.map((bItem, bIdx) => (
                          <article key={`${bItem.title}-${bIdx}`} className="alu-benefit-card">
                            <div className="alu-benefit-card__top">
                              <div className="alu-benefit-card__titles">
                                {bItem.subtitle && (
                                  <span className="alu-benefit-card__subtitle">{bItem.subtitle}</span>
                                )}
                                <h3 className="alu-benefit-card__title">{bItem.title}</h3>
                              </div>
                              {bItem.iconSrc && (
                                <span className="alu-benefit-icon" aria-hidden="true">
                                  <img src={bItem.iconSrc} alt="" loading="lazy" />
                                </span>
                              )}
                            </div>
                            <p className="alu-benefit-card__desc">{bItem.description}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* 5. Core Features Image & Popup Video Grid ("Fonksiyonellik Hızlı Bakış") */}
                {sl.coreFeatures &&
                  sl.coreFeatures.items.length > 0 &&
                  renderMediaGrid(sl.coreFeatures, 'core-features')}

                {/* 6. Interactive Multi-Tab Workflows (WorkflowTabsTemplate / RegulaTabs) */}
                {sl.workflowTabs && (
                  <WorkflowSection
                    content={sl.workflowTabs}
                    onVideo={setActiveModalVideo}
                    onImage={setActiveLightboxImage}
                  />
                )}

                {/* 7. Extra Media Grids (ALLPLAN Bulut Hizmetleri, Satın Alınabilir Seçenekler, Kaydedilmiş Webinarlar, etc.) */}
                {sl.extraGrids &&
                  sl.extraGrids.map((eGrid, gIdx) =>
                    renderMediaGrid(eGrid, `extra-grid-${gIdx}`)
                  )}

                {/* 8. Bottom Split Callouts (Lisans ve Gereksinimler / SCIA Engineer Concept Sürümü) */}
                {sl.splitCallouts &&
                  sl.splitCallouts
                    .filter(
                      (callout) =>
                        callout.title === 'Lisans ve Gereksinimler' ||
                        callout.title.includes('SCIA Engineer')
                    )
                    .map((callout, cIdx) => {
                      const hasYt = Boolean(callout.youtubeId);
                      const hasMp4 = Boolean(callout.videoSrc);
                      const hasVideo = hasYt || hasMp4;
                      const thumbSrc =
                        callout.imageSrc ||
                        (callout.youtubeId
                          ? `https://img.youtube.com/vi/${callout.youtubeId}/hqdefault.jpg`
                          : '');
                      const isReversed = callout.reverse ?? cIdx % 2 === 1;
                      const paragraphs =
                        callout.paragraphs && callout.paragraphs.length > 0
                          ? callout.paragraphs
                          : callout.description
                          ? [callout.description]
                          : [];

                      return (
                        <section
                          key={`callout-bottom-${callout.title}-${cIdx}`}
                          className="preview-section preview-section--subtle"
                          aria-label={callout.title}
                        >
                          <div className="alu-container">
                            <div
                              className={`alu-scia-callout${
                                isReversed ? ' alu-scia-callout--reverse' : ''
                              }`}
                            >
                              <div
                                className={`alu-scia-callout__media${
                                  hasVideo || thumbSrc ? ' alu-scia-callout__media--interactive' : ''
                                }`}
                                role={hasVideo || thumbSrc ? 'button' : undefined}
                                tabIndex={hasVideo || thumbSrc ? 0 : undefined}
                                aria-label={
                                  hasVideo
                                    ? `${callout.title} videosunu pop-up pencerede oynat`
                                    : `${callout.title} görselini büyüt`
                                }
                                onClick={() => {
                                  if (callout.youtubeId) {
                                    setActiveModalVideo({
                                      youtubeId: callout.youtubeId,
                                      title: callout.title
                                    });
                                  } else if (callout.videoSrc) {
                                    setActiveModalVideo({
                                      videoSrc: callout.videoSrc,
                                      title: callout.title
                                    });
                                  } else if (thumbSrc) {
                                    setActiveLightboxImage({
                                      src: thumbSrc,
                                      title: callout.title
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    if (callout.youtubeId) {
                                      setActiveModalVideo({
                                        youtubeId: callout.youtubeId,
                                        title: callout.title
                                      });
                                    } else if (callout.videoSrc) {
                                      setActiveModalVideo({
                                        videoSrc: callout.videoSrc,
                                        title: callout.title
                                      });
                                    } else if (thumbSrc) {
                                      setActiveLightboxImage({
                                        src: thumbSrc,
                                        title: callout.title
                                      });
                                    }
                                  }
                                }}
                              >
                                {hasMp4 && callout.videoSrc ? (
                                  <video
                                    src={callout.videoSrc}
                                    poster={callout.imageSrc || undefined}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  />
                                ) : thumbSrc ? (
                                  <img src={thumbSrc} alt={callout.title} loading="lazy" />
                                ) : null}

                                <div className="alu-media-card__scrim" aria-hidden="true" />

                                {hasVideo ? (
                                  <>
                                    <span className="alu-media-card__video-badge">
                                      <AluIcon name="video" size="sm" />
                                      <span>POPUP VİDEO</span>
                                    </span>
                                    <span className="alu-media-card__play" aria-hidden="true">
                                      <span className="alu-media-card__play-circle">
                                        <AluIcon name="circle-play" size="lg" />
                                      </span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="alu-media-card__zoom-hint" aria-hidden="true">
                                    <AluIcon name="sparkles" size="sm" />
                                  </span>
                                )}
                              </div>

                              <div className="alu-scia-callout__content">
                                {callout.kicker && (
                                  <span className="preview-kicker">{callout.kicker}</span>
                                )}
                                <h2 className="alu-h2" style={{ margin: 0 }}>
                                  {callout.title}
                                </h2>
                                {callout.lead && (
                                  <p className="alu-scia-callout__lead">{callout.lead}</p>
                                )}
                                {callout.subheading && (
                                  <h3 className="alu-h4" style={{ margin: 0, color: 'var(--accent-fg)' }}>
                                    {callout.subheading}
                                  </h3>
                                )}
                                {paragraphs.map((para, pIdx) => (
                                  <p key={pIdx} className="alu-body" style={{ margin: 0 }}>
                                    {para}
                                  </p>
                                ))}
                                {callout.bullets && callout.bullets.length > 0 && (
                                  <ul className="alu-media-card__bullets" style={{ marginTop: '0.25rem' }}>
                                    {callout.bullets.map((b, bIdx) => (
                                      <li key={bIdx}>
                                        <AluIcon name="check" size="sm" />
                                        <span>{b.replace(/^•\s*/, '')}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="alu-cluster" style={{ marginTop: '0.5rem' }}>
                                  {hasVideo && (
                                    <button
                                      type="button"
                                      className="alu-button alu-button--primary alu-button--md"
                                      onClick={() => {
                                        if (callout.youtubeId) {
                                          setActiveModalVideo({
                                            youtubeId: callout.youtubeId,
                                            title: callout.title
                                          });
                                        } else if (callout.videoSrc) {
                                          setActiveModalVideo({
                                            videoSrc: callout.videoSrc,
                                            title: callout.title
                                          });
                                        }
                                      }}
                                    >
                                      <AluIcon name="circle-play" size="sm" />
                                      <span>Videoyu İzle</span>
                                    </button>
                                  )}
                                  {callout.ctaHref && (
                                    <a
                                      href={callout.ctaHref}
                                      target={callout.external ? '_blank' : undefined}
                                      rel={callout.external ? 'noopener noreferrer' : undefined}
                                      className="alu-button alu-button--secondary alu-button--md"
                                    >
                                      <span>{callout.ctaText || 'Detayları İnceleyin'}</span>
                                      <AluIcon name="external-link" size="sm" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      );
                    })}

                {/* 9. FAQ Accordion (SSS - ALLPLAN Ultimate / SSS - ALLPLAN Civil) */}
                {sl.faq && sl.faq.items.length > 0 && (
                  <section className="preview-section preview-section--subtle" aria-label={sl.faq.title}>
                    <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
                      <div className="alu-section-header-center">
                        <span className="preview-kicker">/ SIKÇA SORULAN SORULAR</span>
                        <h2 className="alu-h1" style={{ margin: 0 }}>
                          {sl.faq.title}
                        </h2>
                      </div>
                      <div className="alu-faq-list">
                        {sl.faq.items.map((fItem, fIdx) => (
                          <details
                            key={`${fItem.question}-${fIdx}`}
                            className="alu-faq-item"
                            open={fIdx === 0}
                          >
                            <summary className="alu-faq-item__summary">
                              <span>{fItem.question}</span>
                              <span className="alu-faq-item__chevron" aria-hidden="true">
                                <AluIcon name="chevron-down" size="sm" />
                              </span>
                            </summary>
                            <div className="alu-faq-item__answer">
                              {fItem.answer.split('\n\n').map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* 10. Interactive References Directory (/references — 10-Tab Category Filter + 3-Col Reference Card Grid) */}
                {sl.referencesDirectory && (() => {
                  const refDir = sl.referencesDirectory!;
                  const q = refSearchQuery.trim().toLowerCase();
                  const filteredRefs = refDir.items.filter((item) => {
                    const matchesCategory =
                      activeRefCatId === 'all' || item.category === activeRefCatId;
                    const matchesSearch =
                      !q ||
                      item.name.toLowerCase().includes(q) ||
                      item.category.toLowerCase().includes(q);
                    return matchesCategory && matchesSearch;
                  });
                  const activeCatObj =
                    refDir.categories.find((c) => c.id === activeRefCatId) ||
                    refDir.categories[0];

                  return (
                    <section
                      className="preview-section"
                      aria-label={refDir.title}
                    >
                      <div
                        className="alu-container alu-stack"
                        style={{ gap: 'var(--space-stack-xl)' }}
                      >
                        <div className="alu-section-header-center">
                          {refDir.kicker && (
                            <span className="preview-kicker">{refDir.kicker}</span>
                          )}
                          <h2 className="alu-h1" style={{ margin: 0 }}>
                            {refDir.title}
                          </h2>
                          {refDir.subtitle && (
                            <p
                              className="alu-body preview-meta"
                              style={{ margin: 0, maxWidth: '72ch' }}
                            >
                              {refDir.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Sticky 10-Tab Category Filter Bar + Live Search */}
                        <div className="alu-ref-controls">
                          <div
                            className="alu-ref-tabs"
                            role="tablist"
                            aria-label="Referans Kategorileri"
                          >
                            {refDir.categories.map((cat) => {
                              const isActive = cat.id === activeRefCatId;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  role="tab"
                                  aria-selected={isActive}
                                  className={`alu-ref-tab${
                                    isActive ? ' alu-ref-tab--active' : ''
                                  }`}
                                  onClick={() => setActiveRefCatId(cat.id)}
                                >
                                  <span className="alu-ref-tab__icon">
                                    <DirectoryCategoryIcon name={cat.iconName} />
                                  </span>
                                  <span className="alu-ref-tab__label">{cat.label}</span>
                                  <span className="alu-ref-tab__count">{cat.count}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="alu-ref-toolbar">
                            <div className="alu-ref-search">
                              <AluIcon name="search" size="sm" />
                              <input
                                type="search"
                                value={refSearchQuery}
                                onChange={(e) => setRefSearchQuery(e.target.value)}
                                placeholder="Referans kurum, firma veya üniversite ara..."
                                aria-label="Referans kurum ara"
                                className="alu-ref-search__input"
                              />
                              {refSearchQuery && (
                                <button
                                  type="button"
                                  className="alu-ref-search__clear"
                                  onClick={() => setRefSearchQuery('')}
                                  aria-label="Aramayı temizle"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <div className="alu-ref-status">
                              <span className="alu-badge alu-badge--accent">
                                {activeCatObj?.label || 'Tümü'}
                              </span>
                              <span className="alu-caption">
                                Toplam <strong>{filteredRefs.length}</strong> referans gösteriliyor
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3-Column Reference Company Card Grid */}
                        {filteredRefs.length > 0 ? (
                          <div className="alu-ref-grid" role="tabpanel">
                            {filteredRefs.map((item, rIdx) => (
                              <article
                                key={`${item.category}-${item.name}-${rIdx}`}
                                className="alu-ref-card"
                              >
                                <div className="alu-ref-card__icon" aria-hidden="true">
                                  <DirectoryCategoryIcon name={item.iconName} />
                                </div>
                                <div className="alu-ref-card__body">
                                  <h3 className="alu-ref-card__name">{item.name}</h3>
                                  <span className="alu-ref-card__cat">{item.category}</span>
                                </div>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="alu-service-card alu-stack" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                            <p className="alu-h3" style={{ margin: 0 }}>
                              Arama kriterlerinize uygun referans bulunamadı.
                            </p>
                            <div>
                              <button
                                type="button"
                                className="alu-button alu-button--secondary alu-button--sm"
                                onClick={() => {
                                  setActiveRefCatId('all');
                                  setRefSearchQuery('');
                                }}
                              >
                                Tüm Referansları Göster ({refDir.items.length})
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })()}

                <FAQSection faqDirectory={sl.faqDirectory} />

                {/* Preserved Page Links, Downloads & Actions */}
                {page.contentLinks && page.contentLinks.length > 0 && (
                  <section className="preview-section" aria-label="İlgili Bağlantılar ve Dokümanlar">
                    <div className="alu-container">
                      <div className="alu-techspecs-banner" style={{ padding: 'var(--space-inset-lg)' }}>
                        <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
                          <span className="preview-kicker">İLGİLİ BAĞLANTILAR, MODÜLLER VE DOKÜMANLAR</span>
                          <h2 className="alu-h3" style={{ margin: 0 }}>
                            Bu Sayfayla İlgili Hızlı Geçişler ve İndirmeler
                          </h2>
                          <div className="alu-cluster" style={{ gap: '0.625rem' }}>
                            {page.contentLinks.map((lnk, lIdx) =>
                              lnk.external ? (
                                <a
                                  key={`${lnk.href}-${lIdx}`}
                                  href={lnk.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="alu-button alu-button--secondary alu-button--sm"
                                >
                                  <span>{lnk.text}</span>
                                  <AluIcon name="external-link" size="sm" />
                                </a>
                              ) : (
                                <Link
                                  key={`${lnk.href}-${lIdx}`}
                                  href={lnk.href}
                                  className="alu-button alu-button--secondary alu-button--sm"
                                >
                                  <span>{lnk.text}</span>
                                  <AluIcon name="arrow-right" size="sm" />
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            );
          })()}
        </div>
      ) : page.path === '/about' ? null : (
        /* Preserved Structured Content Sections — Benefit/Spec Grid + Alternating Photo Showcases */
        <section className="preview-section" aria-label="Sayfa içeriği">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            {/* Part A: Benefit & Specification Cards (with native 48x48 icon badge when sec.iconSrc exists) */}
            {specSections.length > 0 && (
              <div
                className="alu-spec-grid"
                style={isLegalPage ? { gridTemplateColumns: '1fr' } : undefined}
              >
                {specSections.map((sec, idx) => {
                  const globalIdx = idx + 1;
                  const numLabel = globalIdx < 10 ? `0${globalIdx}` : `${globalIdx}`;
                  return (
                    <article key={`spec-${sec.heading}-${idx}`} className="alu-spec-card">
                      <div className="alu-spec-card__header">
                        <div className="alu-cluster" style={{ gap: '0.75rem' }}>
                          {sec.iconSrc && (
                            <span className="alu-benefit-icon">
                              <img src={sec.iconSrc} alt="" loading="lazy" />
                            </span>
                          )}
                          <span className="alu-spec-card__num">{numLabel}</span>
                        </div>
                        <span className="alu-card__eyebrow">{sectionBadgeLabel}</span>
                      </div>
                      {sec.level === 2 ? (
                        <h2 className="alu-h3" style={{ margin: 0 }}>
                          {sec.heading}
                        </h2>
                      ) : sec.level === 3 ? (
                        <h3 className="alu-h4" style={{ margin: 0 }}>
                          {sec.heading}
                        </h3>
                      ) : (
                        <h4 className="alu-h4" style={{ margin: 0 }}>
                          {sec.heading}
                        </h4>
                      )}
                      <div className="alu-stack" style={{ gap: '0.625rem' }}>
                        {sec.items.map((paragraph, pIdx) => (
                          <p key={pIdx} className="alu-body-sm" style={{ margin: 0 }}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Part B: Alternating Split Feature Rows (ONLY for high-resolution photos, NEVER icons) */}
            {featuredSections.length > 0 && (
              <div className="alu-feature-rows">
                {featuredSections.map((sec, idx) => {
                  const secImg = sec.image!;
                  const isReversed = idx % 2 === 1;
                  return (
                    <article
                      key={`feat-${sec.heading}-${idx}`}
                      className={`alu-feature-row${isReversed ? ' alu-feature-row--reverse' : ''}`}
                    >
                      <div className="alu-feature-row__media">
                        <img src={secImg.src} alt={secImg.alt || sec.heading} loading="lazy" />
                        <span className="alu-feature-row__index">0{idx + 1}</span>
                      </div>
                      <div className="alu-feature-row__content">
                        <span className="preview-kicker">0{idx + 1} · İŞ AKIŞI VE ÖZELLİK</span>
                        {sec.level === 2 ? (
                          <h2 className="alu-h2" style={{ margin: 0 }}>
                            {sec.heading}
                          </h2>
                        ) : (
                          <h3 className="alu-h2" style={{ margin: 0 }}>
                            {sec.heading}
                          </h3>
                        )}
                        <div className="alu-stack" style={{ gap: '0.75rem' }}>
                          {sec.items.map((paragraph, pIdx) => (
                            <p key={pIdx} className="alu-body" style={{ margin: 0 }}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Interactive States / Tabs captured during Phase 0 dynamic audit */}
            {page.interactiveStates && page.interactiveStates.length > 0 && (
              <div className="alu-module-tabs" aria-label="Detaylı Modül ve Sekme İçerikleri">
                <div className="alu-stack">
                  <span className="preview-kicker">ETKİLEŞİMLİ TEKNİK DETAYLAR</span>
                  <h2 className="alu-h2">Detaylı Modül ve İş Akışı Sekmeleri</h2>
                </div>

                <div className="alu-service-pills" role="tablist">
                  {page.interactiveStates.map((st, sIdx) => (
                    <button
                      key={`${st.label}-${sIdx}`}
                      type="button"
                      role="tab"
                      aria-selected={activeTabIdx === sIdx}
                      className={`alu-service-pill${activeTabIdx === sIdx ? ' alu-service-pill--active' : ''}`}
                      onClick={() => setActiveTabIdx(sIdx)}
                    >
                      <span>{st.label}</span>
                      <span className="alu-service-pill__count">{st.texts.length}</span>
                    </button>
                  ))}
                </div>

                {page.interactiveStates[activeTabIdx] && (
                  <div className="alu-module-tabs__panel">
                    <div className="alu-cluster" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 className="alu-h3">{page.interactiveStates[activeTabIdx].label}</h3>
                      <span className="alu-badge alu-badge--accent">
                        {page.interactiveStates[activeTabIdx].texts.length} Teknik Madde
                      </span>
                    </div>
                    <div className="alu-spec-grid">
                      {page.interactiveStates[activeTabIdx].texts.map((txt, tIdx) => (
                        <div key={tIdx} className="alu-role-stage__feature">
                          <span className="alu-role-stage__feature-num">
                            {tIdx + 1 < 10 ? `0${tIdx + 1}` : tIdx + 1}
                          </span>
                          <p className="alu-body-sm" style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {txt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Remaining High-Resolution Visual Assets Gallery (excluding small icons) */}
            {!isLegalPage && galleryImages.length > 0 && (
              <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
                <div className="alu-stack">
                  <span className="preview-kicker">TEKNİK GÖRSEL GALERİ ({galleryImages.length} GÖRSEL)</span>
                  <h2 className="alu-h2">Modül, Ekran Görüntüleri ve Uygulama Detayları</h2>
                </div>
                <div className="alu-gallery-grid">
                  {galleryImages.map((img, gIdx) => (
                    <figure key={`${img.src}-${gIdx}`} className="alu-product-card alu-gallery-card">
                      <div className="alu-product-card__media">
                        <img src={img.src} alt={img.alt || page.h1} loading="lazy" />
                        <span className="alu-product-card__tier">
                          {gIdx + 1 < 10 ? `0${gIdx + 1}` : gIdx + 1}
                        </span>
                      </div>
                      {img.alt && (
                        <figcaption className="alu-caption" style={{ padding: '0.75rem 1rem' }}>
                          {img.alt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Preserved Embedded Media */}
            {page.embeds && page.embeds.length > 0 && !playlist && (
              <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
                <span className="preview-kicker">MULTİMEDYA VE VİDEO</span>
                <h2 className="alu-h2">Video ve Sunum Kayıtları</h2>
                <div className="alu-grid">
                  {page.embeds.map((emb, eIdx) => (
                    <div key={`${emb.src}-${eIdx}`} className="alu-hero-monitor" style={{ padding: 'var(--space-inset-sm)' }}>
                      <div style={{ position: 'relative', aspectRatio: '16 / 9', width: '100%' }}>
                        <iframe
                          src={emb.src}
                          title={emb.title || page.h1}
                          style={{ width: '100%', height: '100%', border: 0 }}
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preserved Page Links, Downloads & Actions */}
            {page.contentLinks && page.contentLinks.length > 0 && !isVideoLibraryHub && !isVideoPlaylistPage && (
              <div className="alu-techspecs-banner" style={{ padding: 'var(--space-inset-lg)' }}>
                <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
                  <span className="preview-kicker">İLGİLİ BAĞLANTILAR, MODÜLLER VE DOKÜMANLAR</span>
                  <h2 className="alu-h3" style={{ margin: 0 }}>
                    Bu Sayfayla İlgili Hızlı Geçişler ve İndirmeler
                  </h2>
                  <div className="alu-cluster" style={{ gap: '0.625rem' }}>
                    {page.contentLinks.map((lnk, lIdx) =>
                      lnk.external ? (
                        <a
                          key={`${lnk.href}-${lIdx}`}
                          href={lnk.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alu-button alu-button--secondary alu-button--sm"
                        >
                          <span>{lnk.text}</span>
                          <AluIcon name="external-link" size="sm" />
                        </a>
                      ) : (
                        <Link
                          key={`${lnk.href}-${lIdx}`}
                          href={lnk.href}
                          className="alu-button alu-button--secondary alu-button--sm"
                        >
                          <span>{lnk.text}</span>
                          <AluIcon name="arrow-right" size="sm" />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Global Video Popup Modal (Cinema Overlay for 91+ Product & Solution Video Cards) */}
      {activeModalVideo && (
        <MediaDialog label={activeModalVideo.title} onClose={() => setActiveModalVideo(null)}>
          <div
            className="alu-video-modal__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alu-video-modal__header">
              <div className="alu-cluster" style={{ gap: '0.625rem' }}>
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name="circle-play" size="sm" />
                  <span>VİDEO ÖNİZLEME</span>
                </span>
                <h3 className="alu-video-modal__title">{activeModalVideo.title}</h3>
              </div>
              <div className="alu-cluster" style={{ gap: '0.5rem' }}>
                {activeModalVideo.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
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
                  onClick={() => setActiveModalVideo(null)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="alu-video-modal__viewport">
              {activeModalVideo.videoSrc ? (
                <video
                  src={activeModalVideo.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${activeModalVideo.youtubeId}?autoplay=1`}
                  title={activeModalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </MediaDialog>
      )}

      {/* Global Image Lightbox Modal (Full-Resolution Screenshot Inspector) */}
      {activeLightboxImage && (
        <MediaDialog label={activeLightboxImage.title} onClose={() => setActiveLightboxImage(null)}>
          <div
            className="alu-video-modal__dialog alu-video-modal__dialog--image"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alu-video-modal__header">
              <h3 className="alu-video-modal__title">{activeLightboxImage.title}</h3>
              <button
                type="button"
                className="alu-video-modal__close"
                data-media-dialog-close
                aria-label="Görseli kapat"
                onClick={() => setActiveLightboxImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="alu-video-modal__image-viewport">
              <img src={activeLightboxImage.src} alt={activeLightboxImage.title} />
            </div>
          </div>
        </MediaDialog>
      )}

      {/* Global Trial Callout Band (Aligned with 25.10.2026 User Decision: Direct to allplan.com/trial-or-subscription/) */}
      {!isLegalPage && (
        <section className="alu-trial-banner" aria-labelledby="global-trial-heading">
          <div className="alu-container">
            <div className="alu-trial-banner__inner">
              <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
                <div className="alu-cluster">
                  <span className="alu-badge alu-badge--accent">
                    <AluIcon name="sparkles" size="sm" />
                    <span>ALLPLAN 2026 DENEME VE ABONELİK</span>
                  </span>
                </div>
                <h2 id="global-trial-heading" className="alu-h1">
                  DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM
                </h2>
                <p className="alu-body-lg">
                  ALLPLAN&apos;ın tam sürümünü ALLPLAN resmî deneme ve abonelik sayfası üzerinden ücretsiz ve yükümlülük altına girmeden test edin. Yazılımı indirin ve tüm avantajları deneyimleyin.
                </p>
                <div className="alu-cluster">
                  <a
                    href={TRIAL_CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--primary alu-button--lg"
                  >
                    <span>Ücretsiz Deneme (ALLPLAN Resmî Sayfası)</span>
                    <AluIcon name="external-link" size="sm" />
                  </a>
                  <a
                    href={MAIN_QUOTE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--secondary alu-button--lg"
                  >
                    <span>Teklif Talep Formu</span>
                    <AluIcon name="external-link" size="sm" />
                  </a>
                </div>
              </div>

              <div className="alu-trial-banner__benefits">
                <h3 className="alu-h3">ALLPLAN&apos;ı ücretsiz deneyin</h3>
                <div className="alu-stack" style={{ gap: '0.75rem' }}>
                  <div className="alu-role-stage__feature">
                    <span className="alu-role-stage__feature-num">01</span>
                    <span className="alu-role-stage__feature-text">
                      Tek bir platformda disiplinler arası AEC ekip çalışması
                    </span>
                  </div>
                  <div className="alu-role-stage__feature">
                    <span className="alu-role-stage__feature-num">02</span>
                    <span className="alu-role-stage__feature-text">
                      Malzeme ve inşaat yöntemlerinin üstün koordinasyonu
                    </span>
                  </div>
                  <div className="alu-role-stage__feature">
                    <span className="alu-role-stage__feature-num">03</span>
                    <span className="alu-role-stage__feature-text">
                      Gelişmiş BIM iş akışları ve gerçek zamanlı bulut iş birliği
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
