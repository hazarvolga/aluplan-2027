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

  return (
    <>
      {/* Subpage Hero */}
      <section className="alu-page-hero" aria-labelledby="page-h1">
        <div className={`alu-container ${heroImage ? 'alu-subpage-hero__grid' : 'alu-stack'}`} style={{ gap: 'var(--space-stack-lg)' }}>
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
              <span className="alu-badge alu-badge--accent">{page.eyebrow}</span>
              <span className="alu-badge">{page.path}</span>
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
                  className="alu-button alu-button--primary alu-button--md"
                >
                  <span>Teklif Talep Formu</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
                <a
                  href={TRIAL_CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-button alu-button--secondary alu-button--md"
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
              <img src={heroImage.src} alt={heroImage.alt || page.h1} />
              {heroImage.alt && <figcaption className="alu-caption">{heroImage.alt}</figcaption>}
            </figure>
          )}
        </div>
      </section>

      {/* Special Interactive View: Video Playlist (/solutions-v2/training/video-library/[playlistId]) */}
      {playlist && (
        <section className="preview-section" aria-labelledby="playlist-heading">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="alu-stack">
              <span className="preview-kicker">EĞİTİM OYNATMA LİSTESİ · {playlist.count} VİDEO</span>
              <h2 id="playlist-heading" className="alu-h2">
                {playlist.title}
              </h2>
              {playlist.subtitle && <p className="alu-body">{playlist.subtitle}</p>}
            </div>

            {activeVideoId && (
              <div
                className="alu-card"
                style={{ padding: 'var(--space-inset-md)', background: 'var(--surface-raised)' }}
              >
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
                    className="alu-card"
                    style={
                      isSelected
                        ? { borderColor: 'var(--accent-border)', boxShadow: 'inset 0 0 0 1px var(--accent-border)' }
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      className="alu-card__media alu-card__media--video"
                      onClick={() => setActiveVideoId(vid.id)}
                      aria-label={`${vid.title} videosunu oynat`}
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
                    <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                      <span className="alu-badge">Bölüm {idx + 1}</span>
                      {vid.duration && <span className="alu-caption">{vid.duration}</span>}
                    </div>
                    <div className="alu-card__body">
                      <h3 className="alu-card__title" style={{ fontSize: 'var(--type-h4-size)' }}>
                        {vid.title}
                      </h3>
                      {vid.description && <p className="alu-body-sm">{vid.description}</p>}
                    </div>
                    <div className="alu-card__footer alu-cluster" style={{ justifyContent: 'space-between' }}>
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
              <span className="preview-kicker">14 EĞİTİM SERİSİ · 216 VİDEO</span>
              <h2 id="all-playlists-heading" className="alu-h2">
                Tüm Eğitim Oynatma Listeleri
              </h2>
            </div>
            <div className="alu-grid">
              {allPlaylists.map((pl) => {
                const firstVidId = pl.videos?.[0]?.id;
                return (
                  <article key={pl.id} className="alu-card">
                    {firstVidId && (
                      <Link href={pl.url} className="alu-card__media alu-card__media--video">
                        <img
                          src={`https://i.ytimg.com/vi/${firstVidId}/hqdefault.jpg`}
                          alt={pl.title}
                          loading="lazy"
                        />
                        <span className="alu-video-play-badge">
                          <AluIcon name="play" size="md" />
                        </span>
                      </Link>
                    )}
                    <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                      <span className="alu-badge alu-badge--accent">
                        <AluIcon name="video" size="sm" />
                        <span>{pl.count} Video</span>
                      </span>
                      <span className="alu-caption">{pl.id}</span>
                    </div>
                    <div className="alu-card__body">
                      <h3 className="alu-card__title">{pl.title}</h3>
                      {pl.subtitle && <p className="alu-body-sm">{pl.subtitle}</p>}
                    </div>
                    <div className="alu-card__footer">
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
            <div className="alu-grid">
              {filteredResults.map((item) => (
                <article key={item.path} className="alu-card">
                  <span className="alu-card__eyebrow">{item.section.toUpperCase()}</span>
                  <div className="alu-card__body">
                    <h3 className="alu-card__title">{item.title}</h3>
                    <p className="alu-body-sm">{item.description}</p>
                  </div>
                  <div className="alu-card__footer">
                    <Link className="alu-link alu-link--standalone" href={item.path}>
                      <span>{item.path}</span>
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
          <div className="alu-container alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))' }}>
            <div className="alu-card alu-stack">
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
                <button type="submit" className="alu-button alu-button--primary alu-button--md">
                  <span>Mesajı Gönder</span>
                  <AluIcon name="arrow-right" size="sm" />
                </button>
              </form>
            </div>

            <div className="alu-card alu-stack">
              <h2 className="alu-h2">Merkez Ofis ve Doğrudan Erişim</h2>
              <p className="alu-body">
                Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul
              </p>
              <ul className="alu-stack" style={{ listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem' }}>
                <li>
                  <AluIcon name="phone" size="sm" /> <strong>Telefon 1:</strong>{' '}
                  <a className="alu-link" href="tel:+902162258441">(+90) 216 225 84 41</a>
                </li>
                <li>
                  <AluIcon name="phone" size="sm" /> <strong>Telefon 2:</strong>{' '}
                  <a className="alu-link" href="tel:+905432119442">(+90) 543 211 94 42</a>
                </li>
                <li>
                  <AluIcon name="phone" size="sm" /> <strong>Telefon 3:</strong>{' '}
                  <a className="alu-link" href="tel:+905494997379">(+90) 549 499 73 79</a>
                </li>
                <li>
                  <AluIcon name="mail" size="sm" /> <strong>E-posta:</strong>{' '}
                  <a className="alu-link" href="mailto:info@aluplan.com.tr">info@aluplan.com.tr</a>
                </li>
                <li>
                  <AluIcon name="life-buoy" size="sm" /> <strong>Teknik Destek Portalı:</strong>{' '}
                  <a className="alu-link" href="https://allplan.net.tr/tr" target="_blank" rel="noopener noreferrer">
                    allplan.net.tr/tr ↗
                  </a>
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
            <div className="alu-card alu-stack">
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
              <h2 className="alu-h2">Uygulama ve İş Akışı Videoları</h2>
            </div>
            <div className="alu-grid">
              {pageVideos.map((vid, vIdx) => (
                <article key={`${vid.src}-${vIdx}`} className="alu-card">
                  <div className="alu-card__media">
                    <video
                      src={vid.src}
                      poster={vid.poster || undefined}
                      controls
                      preload="metadata"
                      playsInline
                      style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-control)' }}
                    />
                  </div>
                  {vid.title && (
                    <div className="alu-card__body">
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

      {/* Preserved Structured Content Sections (100% Content & Image Parity) */}
      <section className="preview-section" aria-label="Sayfa içeriği">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-grid" style={{ gridTemplateColumns: isLegalPage ? '1fr' : 'repeat(auto-fit, minmax(21rem, 1fr))' }}>
            {page.sections.map((sec, idx) => {
              const secImg = !isLegalPage && idx < contentImages.length ? contentImages[idx] : null;
              return (
                <article key={`${sec.heading}-${idx}`} className="alu-card alu-stack">
                  {secImg && (
                    <div className="alu-card__media">
                      <img src={secImg.src} alt={secImg.alt || sec.heading} loading="lazy" />
                    </div>
                  )}
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
                  <div className="alu-stack" style={{ gap: '0.5rem' }}>
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

          {/* Remaining Visual Assets Gallery (ensuring 100% of page.images are displayed) */}
          {!isLegalPage && contentImages.length > page.sections.length && (
            <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
              <div className="alu-stack">
                <span className="preview-kicker">GÖRSEL GALERİ</span>
                <h2 className="alu-h2">Modül, Ekran Görüntüleri ve Teknik Görseller</h2>
              </div>
              <div className="alu-gallery-grid">
                {contentImages.slice(page.sections.length).map((img, gIdx) => (
                  <figure key={`${img.src}-${gIdx}`} className="alu-card alu-gallery-card">
                    <div className="alu-card__media">
                      <img src={img.src} alt={img.alt || page.h1} loading="lazy" />
                    </div>
                    {img.alt && <figcaption className="alu-caption">{img.alt}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Interactive States / Tabs captured during Phase 0 dynamic audit */}
          {page.interactiveStates && page.interactiveStates.length > 0 && (
            <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
              <h2 className="alu-h2">Detaylı Modül ve Sekme İçerikleri</h2>
              {page.interactiveStates.map((st, sIdx) => (
                <details key={`${st.label}-${sIdx}`} className="preview-service-group" open={sIdx === 0}>
                  <summary>
                    <span>{st.label}</span>
                    <span className="alu-badge">{st.texts.length} madde</span>
                  </summary>
                  <div className="alu-stack" style={{ gap: '0.5rem', paddingTop: '0.75rem' }}>
                    {st.texts.map((txt, tIdx) => (
                      <p key={tIdx} className="alu-body-sm" style={{ margin: 0 }}>
                        {txt}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* Preserved Embedded Media */}
          {page.embeds && page.embeds.length > 0 && !playlist && (
            <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
              <h2 className="alu-h2">Video ve Multimedya</h2>
              <div className="alu-grid">
                {page.embeds.map((emb, eIdx) => (
                  <div key={`${emb.src}-${eIdx}`} className="alu-card">
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
            <div className="alu-card alu-stack">
              <h2 className="alu-h3" style={{ margin: 0 }}>
                İlgili Bağlantılar ve Dokümanlar
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
          )}
        </div>
      </section>

      {/* Global Trial CTA (Aligned with 25.10.2026 User Decision: Direct to allplan.com/trial-or-subscription/) */}
      {!isLegalPage && (
        <section className="preview-section preview-section--subtle" aria-labelledby="global-trial-heading">
          <div className="alu-container">
            <div className="preview-role-copy">
              <div className="alu-stack">
                <span className="alu-badge alu-badge--accent">ALLPLAN</span>
                <h2 id="global-trial-heading" className="alu-h1">
                  DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM
                </h2>
                <p className="alu-body">
                  ALLPLAN&apos;ın tam sürümünü ALLPLAN resmî deneme ve abonelik sayfası üzerinden ücretsiz ve yükümlülük altına girmeden test edin. Yazılımı indirin ve tüm avantajları deneyimleyin.
                </p>
                <div className="alu-cluster">
                  <a
                    href={TRIAL_CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--primary alu-button--md"
                  >
                    <span>Ücretsiz Deneme (ALLPLAN Resmî Sayfası)</span>
                    <AluIcon name="external-link" size="sm" />
                  </a>
                  <a
                    href={MAIN_QUOTE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-button alu-button--secondary alu-button--md"
                  >
                    <span>Teklif Talep Formu</span>
                    <AluIcon name="external-link" size="sm" />
                  </a>
                </div>
              </div>
              <div className="alu-stack">
                <h3 className="alu-h3">ALLPLAN&apos;ı ücretsiz deneyin</h3>
                <ul className="alu-stack" style={{ paddingLeft: '1.25rem', margin: 0, gap: '0.5rem' }}>
                  <li className="alu-body-sm">Tek bir platformda disiplinler arası AEC ekip çalışması</li>
                  <li className="alu-body-sm">Malzeme ve inşaat yöntemlerinin üstün koordinasyonu</li>
                  <li className="alu-body-sm">Gelişmiş BIM iş akışları ve gerçek zamanlı işbirliği</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
