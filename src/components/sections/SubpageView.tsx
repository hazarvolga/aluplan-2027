'use client';

import React, { useState } from 'react';
import {
  PageRecord,
  PlaylistRecord,
  MAIN_QUOTE_FORM_URL,
  SUPPORT_PORTAL_URL,
  getSiteIdentity,
  getSolutionCatalog,
  getSolutionHub
} from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { TrainingTabs } from './TrainingTabs';
import { AboutEditorialSection } from './AboutEditorialSection';
import { VideoLibraryHubSection } from './VideoLibraryHubSection';
import { VideoPlaylistSection } from './VideoPlaylistSection';
import { SearchPageSection } from './SearchPageSection';
import { SubpageHeroSection } from './SubpageHeroSection';
import { getSubpageHeroPresentation } from './subpage-hero-presentation';
import { StructuredPageLayoutSection } from './StructuredPageLayoutSection';
import { SolutionHubSection } from './SolutionHubSection';
import { SolutionCatalogSection } from './SolutionCatalogSection';
import { PageEndConversion } from './PageEndConversion';
import { getPageEndConversion } from './page-end-conversion-policy';
import { handleStructuredTabKey } from './structured-tab-key';
import { MediaDialog } from '@/components/ui/MediaDialog';
import { ContactMap } from './ContactMap';

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

const siteIdentity = getSiteIdentity();
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
  const solutionHub = getSolutionHub(page.path);
  const solutionCatalog = page.path === '/solutions' ? getSolutionCatalog() : null;
  const pageEndConversion = getPageEndConversion(page);
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
  const heroPresentation = getSubpageHeroPresentation(page.path, heroImage?.src || null);
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
    !isVideoLibraryHub && !isVideoPlaylistPage && !solutionHub && !solutionCatalog
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
      <SubpageHeroSection
        page={page}
        heroImage={heroImage}
        presentation={heroPresentation.presentation}
        background={heroPresentation.background}
        familyId={heroPresentation.familyId}
        assetKind={heroPresentation.assetKind}
        sectionBadgeLabel={sectionBadgeLabel}
        isLegalPage={isLegalPage}
      />

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
                    <p key={dIdx} className="alu-body-sm" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
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
        <VideoPlaylistSection
          playlist={playlist}
          activeVideoId={activeVideoId}
          onVideoChange={setActiveVideoId}
        />
      )}

      {/* Special Interactive View: Video Library Hub (/solutions-v2/training/video-library) */}
      {isVideoLibraryHub && <VideoLibraryHubSection />}

      {/* Special Interactive View: Search Page (/search) */}
      {page.path === '/search' && (
        <SearchPageSection
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />
      )}

      {page.path === '/solutions-v2/training' && page.structuredLayout?.trainingTabs && (
        <TrainingTabs content={page.structuredLayout.trainingTabs} />
      )}

      {/* Contact requests use the shared Microsoft form; direct channels stay available */}
      {page.path === '/contact' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="contact-form-heading">
          <div className="alu-container alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, var(--layout-application-content-column-min-width)), 1fr))' }}>
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
              <a href={`mailto:${siteIdentity.email}`} className="alu-link">{siteIdentity.email}</a>
            </div>

            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">MERKEZ OFİS & DESTEK</span>
              <h2 className="alu-h2">Merkez Ofis ve Doğrudan Erişim</h2>
              <p className="alu-body">
                {siteIdentity.displayAddress}
              </p>
              <ul className="alu-stack" style={{ listStyle: 'none', padding: 0, margin: 0, gap: 'var(--space-application-jsx-comfortable)' }}>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Santral / Ofis</span>
                    <a className="alu-link" href={`tel:${siteIdentity.phoneLinks[0]}`}>{siteIdentity.displayPhones[0]}</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Satış & Danışmanlık 1</span>
                    <a className="alu-link" href={`tel:${siteIdentity.phoneLinks[1]}`}>{siteIdentity.displayPhones[1]}</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="phone" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Satış & Danışmanlık 2</span>
                    <a className="alu-link" href={`tel:${siteIdentity.phoneLinks[2]}`}>{siteIdentity.displayPhones[2]}</a>
                  </div>
                </li>
                <li className="alu-cluster">
                  <span className="alu-support-card__icon">
                    <AluIcon name="mail" size="sm" />
                  </span>
                  <div>
                    <span className="alu-caption" style={{ display: 'block' }}>Kurumsal E-posta</span>
                    <a className="alu-link" href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a>
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
      {page.path === '/about' && <AboutEditorialSection page={page} />}
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

      {/* Solution catalog and category hubs use their explicit typed navigation contract. */}
      {solutionCatalog ? (
        <SolutionCatalogSection directory={solutionCatalog} />
      ) : solutionHub ? (
        <SolutionHubSection hub={solutionHub} />
      ) : page.structuredLayout && !page.structuredLayout.trainingTabs ? (
        <StructuredPageLayoutSection
          layout={page.structuredLayout}
          pagePath={page.path}
          activeReferenceCategoryId={activeRefCatId}
          referenceSearchQuery={refSearchQuery}
          onReferenceCategoryChange={setActiveRefCatId}
          onReferenceSearchQueryChange={setRefSearchQuery}
          onVideo={setActiveModalVideo}
          onImage={setActiveLightboxImage}
        />
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
                        <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
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
                      <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-dense)' }}>
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
                        <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
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
                      id={`module-tab-${sIdx}`}
                      role="tab"
                      aria-selected={activeTabIdx === sIdx}
                      aria-controls="module-panel"
                      tabIndex={activeTabIdx === sIdx ? 0 : -1}
                      className={`alu-service-pill${activeTabIdx === sIdx ? ' alu-service-pill--active' : ''}`}
                      onClick={() => setActiveTabIdx(sIdx)}
                      onKeyDown={(event) => handleStructuredTabKey(
                        event,
                        sIdx,
                        page.interactiveStates!.length,
                        setActiveTabIdx
                      )}
                    >
                      <span>{st.label}</span>
                      <span className="alu-service-pill__count">{st.texts.length}</span>
                    </button>
                  ))}
                </div>

                {page.interactiveStates[activeTabIdx] && (
                  <div
                    id="module-panel"
                    className="alu-module-tabs__panel"
                    role="tabpanel"
                    aria-labelledby={`module-tab-${activeTabIdx}`}
                  >
                    <div className="alu-cluster" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-application-jsx-section)' }}>
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
                        <figcaption className="alu-caption" style={{ padding: 'var(--space-application-jsx-comfortable) var(--space-application-jsx-section)' }}>
                          {img.alt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Preserved Embedded Media */}
            {page.path === '/contact' && page.embeds?.map((embed, index) => (
              <ContactMap key={`${embed.src}-${index}`} src={embed.src} title={embed.title || 'Aluplan konumu'} />
            ))}
            {page.path !== '/contact' && page.embeds && page.embeds.length > 0 && !playlist && (
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

          </div>
        </section>
      )}

      {pageEndConversion && <PageEndConversion model={pageEndConversion} />}

      {/* Global Video Popup Modal (Cinema Overlay for 91+ Product & Solution Video Cards) */}
      {activeModalVideo && (
        <MediaDialog label={activeModalVideo.title} onClose={() => setActiveModalVideo(null)}>
          <div
            className="alu-video-modal__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alu-video-modal__header">
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-dense)' }}>
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name="circle-play" size="sm" />
                  <span>VİDEO ÖNİZLEME</span>
                </span>
                <h3 className="alu-video-modal__title">{activeModalVideo.title}</h3>
              </div>
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-regular)' }}>
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

    </>
  );
}
