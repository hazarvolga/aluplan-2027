'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNavigationData, getSearchIndex, MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { AluIcon, AluIconName } from '@/components/ui/AluIcon';
import { MediaDialog } from '@/components/ui/MediaDialog';

const navData = getNavigationData();
const searchIndex = getSearchIndex();

function getSocialIconName(label: string): AluIconName {
  const low = label.toLowerCase();
  if (low.includes('facebook')) return 'facebook';
  if (low.includes('twitter') || low.includes('x')) return 'twitter';
  if (low.includes('linkedin')) return 'linkedin';
  if (low.includes('instagram')) return 'instagram';
  if (low.includes('youtube')) return 'youtube';
  return 'globe';
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [openMenu, setOpenMenu] = useState<'products' | 'solutions' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'rejected' | null>(null);
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('aluplan-theme-mode');
      if (savedMode === 'light' || savedMode === 'dark') {
        setMode(savedMode);
        document.documentElement.setAttribute('data-mode', savedMode);
      } else {
        document.documentElement.setAttribute('data-mode', 'dark');
      }
      const savedConsent = localStorage.getItem('cookie-consent');
      if (savedConsent === 'accepted' || savedConsent === 'rejected') {
        setCookieConsent(savedConsent);
      }
    } catch {
      // ignore storage errors
    }
    setConsentLoaded(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Keep a single modal owner for focus and body scroll restoration.
        if (document.querySelector('dialog.alu-video-modal:modal')) return;
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpenMenu(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.setAttribute('data-mode', next);
    try {
      localStorage.setItem('aluplan-theme-mode', next);
    } catch {
      // ignore
    }
  };

  const handleConsent = (choice: 'accepted' | 'rejected') => {
    setCookieConsent(choice);
    try {
      localStorage.setItem('cookie-consent', choice);
    } catch {
      // ignore
    }
  };

  const filteredSearch = searchQuery.trim()
    ? searchIndex
        .filter((item) => {
          const q = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.seoTitle.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.path.toLowerCase().includes(q) ||
            item.keywords.toLowerCase().includes(q)
          );
        })
        .slice(0, 12)
    : searchIndex.slice(0, 8);

  const logoSrc = mode === 'dark' ? '/assets/logo/aluplan-logo-white-filled.svg' : '/assets/logo/aluplan-logo-black.svg';

  return (
    <div className="preview-shell" data-theme="aluplan" data-mode={mode}>
      <a href="#main-content" className="alu-skip-link">
        İçeriğe geç
      </a>

      {/* Top Bar */}
      <div className="alu-topbar">
        <div className="alu-container alu-topbar__inner">
          <div className="alu-topbar__socials" aria-label="Sosyal medya bağlantıları">
            {navData.topBar.socialLinks.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.label}
                className="alu-topbar__link"
              >
                <AluIcon name={getSocialIconName(soc.label)} size="sm" />
                <span>{soc.label}</span>
              </a>
            ))}
          </div>
          <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
            <a href={`mailto:${navData.topBar.email}`} className="alu-topbar__link">
              <AluIcon name="mail" size="sm" />
              <span>{navData.topBar.email}</span>
            </a>
            <a
              className="alu-topbar__link"
              href={MAIN_QUOTE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Hızlı Talep Oluştur</span>
              <AluIcon name="arrow-up-right" size="sm" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header (Navigation-focused per Phase 5 decision) */}
      <header className="alu-site-header" onMouseLeave={() => setOpenMenu(null)}>
        <div className="alu-site-header__inner">
          <Link className="alu-logo-link" href="/" aria-label="Aluplan Ana Sayfa">
            <img
              className="alu-logo alu-logo--md"
              src={logoSrc}
              alt="Aluplan Program Sistemleri"
              width={166}
              height={32}
            />
          </Link>

          <nav className="alu-site-nav" aria-label="Ana gezinme">
            <button
              type="button"
              className="alu-site-nav__link"
              style={{ background: 'transparent', border: 0, cursor: 'pointer', gap: 'var(--space-application-jsx-tight)' }}
              aria-expanded={openMenu === 'solutions'}
              onClick={() => setOpenMenu(openMenu === 'solutions' ? null : 'solutions')}
              onMouseEnter={() => setOpenMenu('solutions')}
            >
              <span>Çözümler</span>
              <AluIcon name="chevron-down" size="sm" />
            </button>
            <button
              type="button"
              className="alu-site-nav__link"
              style={{ background: 'transparent', border: 0, cursor: 'pointer', gap: 'var(--space-application-jsx-tight)' }}
              aria-expanded={openMenu === 'products'}
              onClick={() => setOpenMenu(openMenu === 'products' ? null : 'products')}
              onMouseEnter={() => setOpenMenu('products')}
            >
              <span>Ürünler</span>
              <AluIcon name="chevron-down" size="sm" />
            </button>
            <Link className="alu-site-nav__link" href="/#professional-services">
              Kaynaklar
            </Link>
            <Link className="alu-site-nav__link" href="/references">
              Referanslar
            </Link>
            <Link className="alu-site-nav__link" href="/about">
              Hakkımızda
            </Link>
            <Link className="alu-site-nav__link" href="/contact">
              İletişim
            </Link>
          </nav>

          <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-regular)' }}>
            <button
              type="button"
              className="alu-button alu-button--ghost alu-button--sm"
              aria-label="Site içi arama (Ctrl+K)"
              onClick={() => setSearchOpen(true)}
            >
              <AluIcon name="search" size="sm" />
              <span>Arama (Ctrl+K)</span>
            </button>
            <button
              type="button"
              className="alu-button alu-button--secondary alu-button--sm"
              aria-label={mode === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
              onClick={toggleMode}
            >
              <AluIcon name={mode === 'dark' ? 'sun' : 'moon'} size="sm" />
              <span>{mode === 'dark' ? 'Açık Mod' : 'Koyu Mod'}</span>
            </button>
            <button
              type="button"
              className="alu-button alu-button--ghost alu-button--sm alu-mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <AluIcon name={mobileMenuOpen ? 'x' : 'menu'} size="sm" />
              <span>Menü</span>
            </button>
          </div>
        </div>

        {/* Desktop MegaMenu */}
        {openMenu && (
          <div className="alu-megamenu" role="region" aria-label={openMenu === 'products' ? 'Ürünler Menüsü' : 'Çözümler Menüsü'}>
            <div className="alu-container alu-megamenu__grid">
              {(openMenu === 'products' ? navData.productsMenu : navData.solutionsMenu).map((sec) => (
                <div key={sec.title}>
                  <h3 className="alu-megamenu__title">{sec.title}</h3>
                  <ul className="alu-megamenu__list">
                    {sec.items.map((item) => (
                      <li key={item.href + item.name}>
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="alu-megamenu__item"
                            onClick={() => setOpenMenu(null)}
                          >
                            <span>{item.name}</span>
                            <AluIcon name="arrow-up-right" size="sm" />
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="alu-megamenu__item"
                            onClick={() => setOpenMenu(null)}
                          >
                            <AluIcon name="chevron-right" size="sm" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="alu-megamenu alu-mobile-drawer" role="dialog" aria-label="Mobil Gezinme Menüsü">
            <div className="alu-container alu-stack" style={{ gap: 'var(--space-application-jsx-section-wide)' }}>
              <div className="alu-cluster">
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/products" onClick={() => setMobileMenuOpen(false)}>
                  Tüm Ürünler
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/solutions" onClick={() => setMobileMenuOpen(false)}>
                  Tüm Çözümler
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/solutions-v2/training" onClick={() => setMobileMenuOpen(false)}>
                  Eğitim & Webinar
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/references" onClick={() => setMobileMenuOpen(false)}>
                  Referanslar
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/about" onClick={() => setMobileMenuOpen(false)}>
                  Hakkımızda
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  İletişim
                </Link>
              </div>
              <div className="alu-megamenu__grid">
                {[...navData.productsMenu, ...navData.solutionsMenu].map((sec, sIdx) => (
                  <div key={`${sec.title}-${sIdx}`}>
                    <h3 className="alu-megamenu__title">{sec.title}</h3>
                    <ul className="alu-megamenu__list">
                      {sec.items.map((item) => (
                        <li key={item.href + item.name}>
                          <Link
                            href={item.href}
                            className="alu-megamenu__item"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <AluIcon name="chevron-right" size="sm" />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Footer */}
      <footer className="alu-site-footer">
        <div className="alu-site-footer__grid">
          <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
            <img
              className="alu-logo alu-logo--sm"
              src={logoSrc}
              alt="Aluplan"
              width={132}
              height={26}
            />
            <p className="alu-site-footer__link">{navData.footer.description}</p>
            <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-regular)' }}>
              {navData.topBar.socialLinks.map((soc) => (
                <a
                  key={soc.label}
                  className="alu-topbar__link"
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                >
                  <AluIcon name={getSocialIconName(soc.label)} size="sm" />
                  <span>{soc.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="alu-site-footer__heading">Ürünler</h2>
            <ul className="alu-site-footer__list">
              {navData.footer.products.map((item) => (
                <li key={item.href}>
                  <Link className="alu-site-footer__link" href={item.href}>
                    <AluIcon name="chevron-right" size="sm" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="alu-site-footer__heading">ÇÖZÜMLER</h2>
            <ul className="alu-site-footer__list">
              {navData.footer.solutions.map((item) => (
                <li key={item.href}>
                  <Link className="alu-site-footer__link" href={item.href}>
                    <AluIcon name="chevron-right" size="sm" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="alu-site-footer__heading">İletişim</h2>
            <ul className="alu-site-footer__list">
              {navData.footer.address.map((line, i) => (
                <li key={line} className="alu-site-footer__link" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-application-jsx-compact)' }}>
                  {i === 0 && <AluIcon name="map-pin" size="sm" />}
                  <span>{line}</span>
                </li>
              ))}
              {navData.footer.phones.map((phoneItem) => (
                <li key={phoneItem}>
                  <a className="alu-site-footer__link" href={`tel:${phoneItem.replace(/[^+\d]/g, '')}`}>
                    <AluIcon name="phone" size="sm" />
                    <span>{phoneItem}</span>
                  </a>
                </li>
              ))}
              <li>
                <a className="alu-site-footer__link" href={`mailto:${navData.footer.email}`}>
                  <AluIcon name="mail" size="sm" />
                  <span>{navData.footer.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="alu-site-footer__legal">
          <span>{navData.footer.copyright}</span>
          <div className="alu-cluster">
            {navData.footer.legal.map((item) => (
              <Link key={item.href} className="alu-site-footer__link" href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <span>{navData.footer.credit}</span>
        </div>
      </footer>

      {/* Search Command Modal */}
      {searchOpen && (
        <MediaDialog className="alu-modal-backdrop" label="Site içi arama" onClose={() => setSearchOpen(false)}>
          <div className="alu-modal alu-stack">
            <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
              <h2 className="alu-h3" style={{ margin: 0 }}>
                Ürün, Çözüm ve Eğitim Arama
              </h2>
              <button
                type="button"
                className="alu-button alu-button--ghost alu-button--sm"
                onClick={() => setSearchOpen(false)}
              >
                <AluIcon name="x" size="sm" />
                <span>Kapat (ESC)</span>
              </button>
            </div>
            <input
              type="search"
              className="alu-input"
              placeholder="ALLPLAN, AX3000, BIMFlex, Köprü, Prekast, Video ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Site içinde ara"
              data-media-dialog-initial-focus
            />
            <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-regular)', maxHeight: 'var(--layout-application-utility-panel-max-height)', overflowY: 'auto' }}>
              {filteredSearch.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="alu-card"
                  style={{ padding: 'var(--space-application-jsx-comfortable) var(--space-application-jsx-section)', textDecoration: 'none' }}
                  onClick={() => setSearchOpen(false)}
                >
                  <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
                    <span className="alu-badge">{item.section.toUpperCase()}</span>
                  </div>
                  <p className="alu-caption" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </MediaDialog>
      )}

      {/* KVKK Cookie Consent Banner (gates Google Analytics until accepted) */}
      {consentLoaded && cookieConsent === null && (
        <aside className="alu-cookie-banner" aria-label="Çerez Tercihleri">
          <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
            <p className="alu-body-sm" style={{ margin: 0 }}>
              Deneyiminizi iyileştirmek ve site trafiğini analiz etmek için çerezleri kullanıyoruz. Analitik çerezler yalnızca açık onayınızla etkinleştirilir. Detaylı bilgi için{' '}
              <Link href="/gizlilik-politikasi" className="alu-link">
                Gizlilik Politikası
              </Link>{' '}
              ve{' '}
              <Link href="/kvkk" className="alu-link">
                KVKK Aydınlatma Metni
              </Link>{' '}
              sayfalarını inceleyebilirsiniz.
            </p>
            <div className="alu-cluster" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="alu-button alu-button--secondary alu-button--sm"
                onClick={() => handleConsent('rejected')}
              >
                Yalnız Zorunlu Çerezler
              </button>
              <button
                type="button"
                className="alu-button alu-button--primary alu-button--sm"
                onClick={() => handleConsent('accepted')}
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
