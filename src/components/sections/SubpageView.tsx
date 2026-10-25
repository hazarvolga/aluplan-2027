'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageRecord,
  PlaylistRecord,
  getAllPlaylists,
  getSearchIndex,
  TRIAL_CTA_URL,
  MAIN_QUOTE_FORM_URL
} from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

const allPlaylists = getAllPlaylists();
const searchIndex = getSearchIndex();

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

  // Contact form state (/contact)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<{ type: 'idle' | 'ok' | 'err'; msg?: string }>({ type: 'idle' });

  // Activation wizard state (/solutions-v2/connect-license/activation)
  const [actCustomerNo, setActCustomerNo] = useState('');
  const [actCompany, setActCompany] = useState('');
  const [actFullName, setActFullName] = useState('');
  const [actEmail, setActEmail] = useState('');
  const [actPhone, setActPhone] = useState('');
  const [actLicenseKey, setActLicenseKey] = useState('');
  const [actStatus, setActStatus] = useState<{ type: 'idle' | 'ok' | 'err'; msg?: string }>({ type: 'idle' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus({ type: 'idle' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setContactStatus({ type: 'err', msg: data.error || 'Mesaj gönderilemedi.' });
      } else {
        setContactStatus({ type: 'ok', msg: `Mesajınız alındı. Kayıt no: ${data.referenceId}` });
      }
    } catch {
      setContactStatus({ type: 'err', msg: 'Sunucu bağlantı hatası oluştu.' });
    }
  };

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActStatus({ type: 'idle' });
    try {
      const res = await fetch('/api/send-activation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerNumber: actCustomerNo,
          companyName: actCompany,
          fullName: actFullName,
          email: actEmail,
          phone: actPhone,
          productKey: actLicenseKey
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setActStatus({ type: 'err', msg: data.error || 'Deklarasyon formu gönderilemedi.' });
      } else {
        setActStatus({ type: 'ok', msg: `Deklarasyon kaydınız alındı. Referans: ${data.referenceId}` });
      }
    } catch {
      setActStatus({ type: 'err', msg: 'Sunucu bağlantı hatası oluştu.' });
    }
  };

  const isLegalPage = page.section === 'legal';
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

  // Deduplicate page images by src while preserving order
  const uniqueImages = React.useMemo(() => {
    const seen = new Set<string>();
    const list: { src: string; alt: string }[] = [];
    for (const img of page.images || []) {
      if (!img.src || seen.has(img.src)) continue;
      seen.add(img.src);
      list.push(img);
    }
    return list;
  }, [page.images]);

  const heroImage = !isLegalPage && uniqueImages.length > 0 ? uniqueImages[0] : null;
  const contentImages = heroImage ? uniqueImages.slice(1) : uniqueImages;
  const pageVideos = page.videos || [];

  // Split sections into Featured Split Rows (up to 4 sections with matched images) and Spec Grid sections
  const maxFeaturedRows = !isLegalPage ? Math.min(page.sections.length, contentImages.length, 4) : 0;
  const featuredSections = page.sections.slice(0, maxFeaturedRows);
  const gridSections = page.sections.slice(maxFeaturedRows);
  const gridImages = contentImages.slice(maxFeaturedRows);

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

            {!isLegalPage && (
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

      {/* Special Interactive View: Video Playlist (/solutions-v2/training/video-library/[playlistId]) */}
      {playlist && (
        <section className="preview-section" aria-labelledby="playlist-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="preview-section-heading">
              <div className="alu-stack">
                <span className="preview-kicker">EĞİTİM OYNATMA LİSTESİ · {playlist.count} VİDEO</span>
                <h2 id="playlist-heading" className="alu-h1">
                  {playlist.title}
                </h2>
                {playlist.subtitle && <p className="alu-body">{playlist.subtitle}</p>}
              </div>
              <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions-v2/training/video-library">
                <span>Tüm Eğitim Serileri</span>
                <AluIcon name="arrow-right" size="sm" />
              </Link>
            </div>

            {activeVideoId && (
              <div className="alu-hero-monitor" style={{ padding: 'var(--space-inset-md)' }}>
                <div className="alu-hero-monitor__header">
                  <span className="alu-hero-monitor__status">
                    <span className="alu-hero-monitor__dot" />
                    <span>ŞU AN OYNATILIYOR: {playlist.videos.find((v) => v.id === activeVideoId)?.title || playlist.title}</span>
                  </span>
                  <span className="alu-caption">ALLPLAN VİDEO AKADEMİ</span>
                </div>
                <div style={{ position: 'relative', aspectRatio: '16 / 9', width: '100%' }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideoId}`}
                    title={playlist.videos.find((v) => v.id === activeVideoId)?.title || playlist.title}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="alu-video-grid">
              {playlist.videos.map((vid, idx) => {
                const isSelected = vid.id === activeVideoId;
                return (
                  <article
                    key={`${vid.id}-${idx}`}
                    className={`alu-product-card${isSelected ? ' alu-product-card--highlighted' : ''}`}
                  >
                    <button
                      type="button"
                      className="alu-card__media alu-card__media--video"
                      onClick={() => setActiveVideoId(vid.id)}
                      aria-label={`${vid.title} videosunu oynat`}
                      style={{ border: 0 }}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                      />
                      <span className="alu-video-play-badge">
                        <AluIcon name="play" size="md" />
                      </span>
                    </button>
                    <div className="alu-product-card__body">
                      <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                        <span className="alu-badge alu-badge--accent">Bölüm {idx + 1}</span>
                        {vid.duration && <span className="alu-caption">{vid.duration}</span>}
                      </div>
                      <h3 className="alu-card__title" style={{ fontSize: 'var(--type-h4-size)' }}>
                        {vid.title}
                      </h3>
                      {vid.description && <p className="alu-body-sm">{vid.description}</p>}
                    </div>
                    <div className="alu-product-card__footer" style={{ justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        className="alu-button alu-button--secondary alu-button--sm"
                        onClick={() => setActiveVideoId(vid.id)}
                      >
                        <AluIcon name="play" size="sm" />
                        <span>{isSelected ? 'Oynatılıyor' : 'Burada İzle'}</span>
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="alu-link alu-link--standalone"
                      >
                        <span>YouTube</span>
                        <AluIcon name="external-link" size="sm" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Special Interactive View: Video Library Hub (/solutions-v2/training/video-library) */}
      {page.path === '/solutions-v2/training/video-library' && (
        <section className="preview-section" aria-labelledby="all-playlists-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="alu-stack">
              <span className="preview-kicker">14 EĞİTİM SERİSİ · 216 TEKNİK VİDEO</span>
              <h2 id="all-playlists-heading" className="alu-h1">
                Tüm Eğitim Oynatma Listeleri
              </h2>
            </div>
            <div className="alu-products-showcase">
              {allPlaylists.map((pl, idx) => {
                const firstVidId = pl.videos?.[0]?.id;
                return (
                  <article key={pl.id} className="alu-product-card">
                    {firstVidId && (
                      <Link href={pl.url} className="alu-product-card__media">
                        <img
                          src={`https://i.ytimg.com/vi/${firstVidId}/hqdefault.jpg`}
                          alt={pl.title}
                          loading="lazy"
                        />
                        <span className="alu-product-card__tier">0{idx + 1}</span>
                        <span className="alu-video-play-badge">
                          <AluIcon name="play" size="md" />
                        </span>
                      </Link>
                    )}
                    <div className="alu-product-card__body">
                      <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                        <span className="alu-badge alu-badge--accent">
                          <AluIcon name="video" size="sm" />
                          <span>{pl.count} Video</span>
                        </span>
                      </div>
                      <h3 className="alu-card__title">{pl.title}</h3>
                      {pl.subtitle && <p className="alu-body-sm">{pl.subtitle}</p>}
                    </div>
                    <div className="alu-product-card__footer">
                      <Link className="alu-link alu-link--standalone" href={pl.url}>
                        <span>Seriyi Aç ({pl.count} Video)</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </Link>
                    </div>
                  </article>
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

      {/* Special Interactive View: Contact Form (/contact) */}
      {page.path === '/contact' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="contact-form-heading">
          <div className="alu-container alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))' }}>
            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">DOĞRUDAN İLETİŞİM</span>
              <h2 id="contact-form-heading" className="alu-h2">
                İletişim ve Danışmanlık Formu
              </h2>
              <form className="alu-stack" onSubmit={handleContactSubmit}>
                <label className="alu-stack" style={{ gap: '0.25rem' }}>
                  <span className="alu-label">Adınız Soyadınız *</span>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    className="alu-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </label>
                <label className="alu-stack" style={{ gap: '0.25rem' }}>
                  <span className="alu-label">E-posta Adresiniz *</span>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    className="alu-input"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </label>
                <label className="alu-stack" style={{ gap: '0.25rem' }}>
                  <span className="alu-label">Telefon Numaranız</span>
                  <input
                    type="tel"
                    maxLength={40}
                    className="alu-input"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </label>
                <label className="alu-stack" style={{ gap: '0.25rem' }}>
                  <span className="alu-label">Konu *</span>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    className="alu-input"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                  />
                </label>
                <label className="alu-stack" style={{ gap: '0.25rem' }}>
                  <span className="alu-label">Mesajınız *</span>
                  <textarea
                    rows={4}
                    required
                    maxLength={2000}
                    className="alu-input"
                    style={{ height: 'auto', paddingBlock: '0.5rem' }}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </label>
                {contactStatus.type === 'ok' && (
                  <p className="alu-badge alu-badge--accent" role="status">
                    {contactStatus.msg}
                  </p>
                )}
                {contactStatus.type === 'err' && (
                  <p className="alu-caption" role="alert" style={{ color: 'var(--status-danger-fg)' }}>
                    {contactStatus.msg}
                  </p>
                )}
                <button type="submit" className="alu-button alu-button--primary alu-button--lg">
                  <span>Mesajı Gönder</span>
                  <AluIcon name="arrow-right" size="sm" />
                </button>
              </form>
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

      {/* Special Interactive View: License Activation Wizard (/solutions-v2/connect-license/activation) */}
      {page.path === '/solutions-v2/connect-license/activation' && (
        <section className="preview-section preview-section--subtle" aria-labelledby="activation-form-heading">
          <div className="alu-container">
            <div className="alu-service-card alu-stack">
              <span className="preview-kicker">LİSANS AKTİVASYON SİHİRBAZI</span>
              <h2 id="activation-form-heading" className="alu-h2">
                ALLPLAN Lisans Deklarasyon ve Aktivasyon Formu
              </h2>
              <form className="alu-stack" onSubmit={handleActivationSubmit}>
                <div className="alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Müşteri Numarası *</span>
                    <input
                      type="text"
                      required
                      maxLength={64}
                      className="alu-input"
                      value={actCustomerNo}
                      onChange={(e) => setActCustomerNo(e.target.value)}
                    />
                  </label>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Firma / Kurum Adı *</span>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      className="alu-input"
                      value={actCompany}
                      onChange={(e) => setActCompany(e.target.value)}
                    />
                  </label>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Yetkili Ad Soyad *</span>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      className="alu-input"
                      value={actFullName}
                      onChange={(e) => setActFullName(e.target.value)}
                    />
                  </label>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Kurumsal E-posta *</span>
                    <input
                      type="email"
                      required
                      maxLength={254}
                      className="alu-input"
                      value={actEmail}
                      onChange={(e) => setActEmail(e.target.value)}
                    />
                  </label>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Telefon *</span>
                    <input
                      type="tel"
                      required
                      maxLength={40}
                      className="alu-input"
                      value={actPhone}
                      onChange={(e) => setActPhone(e.target.value)}
                    />
                  </label>
                  <label className="alu-stack" style={{ gap: '0.25rem' }}>
                    <span className="alu-label">Lisans / Ürün Anahtarı (Product Key) *</span>
                    <input
                      type="text"
                      required
                      maxLength={128}
                      className="alu-input"
                      value={actLicenseKey}
                      onChange={(e) => setActLicenseKey(e.target.value)}
                    />
                  </label>
                </div>
                {actStatus.type === 'ok' && (
                  <p className="alu-badge alu-badge--accent" role="status">
                    {actStatus.msg}
                  </p>
                )}
                {actStatus.type === 'err' && (
                  <p className="alu-caption" role="alert" style={{ color: 'var(--status-danger-fg)' }}>
                    {actStatus.msg}
                  </p>
                )}
                <div className="alu-cluster">
                  <button type="submit" className="alu-button alu-button--primary alu-button--md">
                    <span>Deklarasyonu Gönder</span>
                    <AluIcon name="arrow-right" size="sm" />
                  </button>
                  <a
                    href="/docs/Declaration_Allplan_2021-06-01.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--secondary alu-button--md"
                  >
                    <AluIcon name="file-text" size="sm" />
                    <span>Örnek Deklarasyon Belgesi (PDF)</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Preserved Native MP4 Videos (e.g., ALLPLAN Bridge 5 feature videos, Architecture & Steel header videos) */}
      {pageVideos.length > 0 && (
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

      {/* Preserved Structured Content Sections — Alternating Split Showcases + Architectural Spec Grid */}
      <section className="preview-section" aria-label="Sayfa içeriği">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          {/* Part A: Alternating Split Feature Rows (when images exist) */}
          {featuredSections.length > 0 && (
            <div className="alu-feature-rows">
              {featuredSections.map((sec, idx) => {
                const secImg = contentImages[idx];
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
                      <span className="preview-kicker">0{idx + 1} · ÖNE ÇIKAN ÖZELLİK</span>
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

          {/* Part B: Architectural Specification Grid (Remaining Sections) */}
          {gridSections.length > 0 && (
            <div
              className="alu-spec-grid"
              style={isLegalPage ? { gridTemplateColumns: '1fr' } : undefined}
            >
              {gridSections.map((sec, idx) => {
                const globalIdx = maxFeaturedRows + idx + 1;
                const numLabel = globalIdx < 10 ? `0${globalIdx}` : `${globalIdx}`;
                return (
                  <article key={`spec-${sec.heading}-${idx}`} className="alu-spec-card">
                    <div className="alu-spec-card__header">
                      <span className="alu-spec-card__num">{numLabel}</span>
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

          {/* Remaining Visual Assets Gallery (ensuring 100% of page.images are displayed) */}
          {!isLegalPage && gridImages.length > 0 && (
            <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
              <div className="alu-stack">
                <span className="preview-kicker">TEKNİK GÖRSEL GALERİ ({gridImages.length} GÖRSEL)</span>
                <h2 className="alu-h2">Modül, Ekran Görüntüleri ve Uygulama Detayları</h2>
              </div>
              <div className="alu-gallery-grid">
                {gridImages.map((img, gIdx) => (
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
          {page.contentLinks && page.contentLinks.length > 0 && (
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
