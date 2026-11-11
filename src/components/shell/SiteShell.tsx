'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasOwnChrome } from '@/lib/chrome-routes';
import { getNavigationData, MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { SearchDialog } from './SearchDialog';
import { AluIcon, AluIconName } from '@/components/ui/AluIcon';
import { clearConsent } from '@/lib/consent';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { DebugComponentLabel } from '@/components/sections/DebugComponentLabel';
import debugStyles from '@/components/sections/DebugComponentLabel.module.css';
import { useThemeMode } from '@/components/theme/ThemeModeProvider';

const navData = getNavigationData();

function getSocialIconName(label: string): AluIconName {
  const low = label.toLowerCase();
  if (low.includes('facebook')) return 'facebook';
  if (low.includes('twitter') || low.includes('x')) return 'twitter';
  if (low.includes('linkedin')) return 'linkedin';
  if (low.includes('instagram')) return 'instagram';
  if (low.includes('youtube')) return 'youtube';
  return 'globe';
}

interface MenuItem {
  name: string;
  href: string;
  external?: boolean;
  releaseOnly?: boolean;
}

function visibleItems(items: readonly MenuItem[]): MenuItem[] {
  return isReleaseContentEnabled() ? [...items] : items.filter((item) => !item.releaseOnly);
}

function MobileMenuGroup({ title, href, sections, onNavigate }: {
  title: string;
  href: string;
  sections: readonly { title: string; items: readonly MenuItem[] }[];
  onNavigate: () => void;
}) {
  return (
    <details className="alu-mobile-drawer__group">
      <summary className="alu-mobile-drawer__summary">
        <span>{title}</span>
        <AluIcon name="chevron-down" size="sm" />
      </summary>
      <div className="alu-mobile-drawer__group-content">
        <Link href={href} className="alu-mobile-drawer__all" onClick={onNavigate}>
          {title === 'Çözümler' ? 'Tüm Çözümler' : 'Tüm Ürünler'}
        </Link>
        {sections.map((section) => (
          <div key={section.title} className="alu-mobile-drawer__section">
            <h3 className="alu-megamenu__title">{section.title}</h3>
            <ul className="alu-megamenu__list">
              {visibleItems(section.items).map((item) => (
                <li key={item.href + item.name}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="alu-megamenu__item" onClick={onNavigate}>
                      {item.name}
                    </a>
                  ) : (
                    <Link href={item.href} className="alu-megamenu__item" onClick={onNavigate}>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

/** showAkademi comes from the server (launch flag ALLPLAN_SHOW_AKADEMI); the client cannot read it. */
export function SiteShell({ children, showAkademi = false }: { children: React.ReactNode; showAkademi?: boolean }) {
  const { mode, toggleMode } = useThemeMode();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<'products' | 'solutions' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Search (Ctrl/Cmd+K) lives in SearchDialog; Escape here closes the menus.
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Sections with their own chrome (e.g. /akademi) render bare; their own layout supplies the shell.
  if (hasOwnChrome(pathname ?? '')) {
    return <>{children}</>;
  }

  const logoSrc = mode === 'dark' ? '/assets/logo/aluplan-logo-white-filled.svg' : '/assets/logo/aluplan-logo-black.svg';

  return (
    <div className="preview-shell" data-theme="aluplan" data-mode={mode}>
      <a href="#main-content" className="alu-skip-link">
        İçeriğe geç
      </a>

      {/* Top Bar */}
      <DebugComponentLabel name="SiteShell · TopBar (özel)"><div className="alu-topbar">
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
      </div></DebugComponentLabel>

      {/* Main Header (Navigation-focused per Phase 5 decision) */}
      <header className="alu-site-header" onMouseLeave={() => setOpenMenu(null)}>
        <span className={debugStyles.label} data-debug-label="SiteShell · Header (özel)" aria-hidden="true" />
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
            <Link className="alu-site-nav__link" href={isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'}>
              Kaynaklar
            </Link>
            {showAkademi && (
              <Link className="alu-site-nav__link" href="/akademi">
                Akademi
              </Link>
            )}
            <Link className="alu-site-nav__link" href="/references">
              Referanslar
            </Link>
            <Link className="alu-site-nav__link" href="/about">
              Hakkımızda
            </Link>
            <Link className="alu-site-nav__link" href="/faq">
              S.S.S.
            </Link>
            <Link className="alu-site-nav__link" href="/contact">
              İletişim
            </Link>
          </nav>

          <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-regular)' }}>
            <SearchDialog
              defaultScope="all"
              trigger={(openSearch) => (
                <button
                  type="button"
                  className="alu-button alu-button--ghost alu-button--sm"
                  aria-label="Site içi arama (Ctrl+K)"
                  onClick={openSearch}
                >
                  <AluIcon name="search" size="sm" />
                </button>
              )}
            />
            <button
              type="button"
              className="alu-button alu-button--secondary alu-button--sm"
              aria-label={mode === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
              onClick={toggleMode}
            >
              <AluIcon name={mode === 'dark' ? 'sun' : 'moon'} size="sm" />
            </button>
            <button
              type="button"
              className="alu-button alu-button--ghost alu-button--sm alu-mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <AluIcon name={mobileMenuOpen ? 'x' : 'menu'} size="sm" />
              <span>Menü</span>
            </button>
          </div>
        </div>

        {/* Desktop MegaMenu */}
        {openMenu && (
          <div key={openMenu} className="alu-megamenu" role="region" aria-label={openMenu === 'products' ? 'Ürünler Menüsü' : 'Çözümler Menüsü'}>
            <div className="alu-container alu-megamenu__grid">
              {(openMenu === 'products' ? navData.productsMenu : navData.solutionsMenu).map((sec) => (
                <div key={sec.title}>
                  <h3 className="alu-megamenu__title">{sec.title}</h3>
                  <ul className="alu-megamenu__list">
                    {visibleItems(sec.items).map((item) => (
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
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="alu-megamenu__item"
                            onClick={() => setOpenMenu(null)}
                          >
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
          <div id="mobile-navigation" className="alu-megamenu alu-mobile-drawer" role="navigation" aria-label="Mobil Gezinme Menüsü">
            <div className="alu-container alu-stack" style={{ gap: 'var(--space-application-jsx-section-wide)' }}>
              <div className="alu-mobile-drawer__nav">
                <MobileMenuGroup title="Çözümler" href="/solutions" sections={navData.solutionsMenu} onNavigate={() => setMobileMenuOpen(false)} />
                <MobileMenuGroup title="Ürünler" href="/products" sections={navData.productsMenu} onNavigate={() => setMobileMenuOpen(false)} />
                <Link className="alu-mobile-drawer__link" href={isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'} onClick={() => setMobileMenuOpen(false)}>
                  Kaynaklar
                </Link>
                {showAkademi && (
                  <Link className="alu-mobile-drawer__link" href="/akademi" onClick={() => setMobileMenuOpen(false)}>
                    Akademi
                  </Link>
                )}
                <Link className="alu-mobile-drawer__link" href="/references" onClick={() => setMobileMenuOpen(false)}>
                  Referanslar
                </Link>
                <Link className="alu-mobile-drawer__link" href="/about" onClick={() => setMobileMenuOpen(false)}>
                  Hakkımızda
                </Link>
                <Link className="alu-mobile-drawer__link" href="/faq" onClick={() => setMobileMenuOpen(false)}>
                  S.S.S.
                </Link>
                <Link className="alu-mobile-drawer__link" href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  İletişim
                </Link>
              </div>
              <div className="alu-mobile-drawer__contact">
                <div className="alu-topbar__socials" aria-label="Sosyal medya bağlantıları">
                  {navData.topBar.socialLinks.map((soc) => (
                    <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer" aria-label={soc.label} className="alu-topbar__link">
                      <AluIcon name={getSocialIconName(soc.label)} size="sm" />
                    </a>
                  ))}
                </div>
                <a href={`mailto:${navData.topBar.email}`} className="alu-topbar__link">
                  <AluIcon name="mail" size="sm" />
                  <span>{navData.topBar.email}</span>
                </a>
                <a className="alu-topbar__link" href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  <span>Hızlı Talep Oluştur</span>
                  <AluIcon name="arrow-up-right" size="sm" />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Footer */}
      <DebugComponentLabel name="SiteShell · Footer (özel)"><footer className="alu-site-footer">
        <div className="alu-site-footer__grid">
          <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
            <img
              className="alu-logo alu-site-footer__logo"
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
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              {showAkademi && (
                <li>
                  <Link className="alu-site-footer__link" href="/akademi">
                    <span>ALUPLAN AKADEMİ</span>
                  </Link>
                </li>
              )}
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
            <button
              type="button"
              className="alu-site-footer__link"
              style={{ background: 'transparent', border: 0, padding: 0, font: 'inherit', cursor: 'pointer' }}
              onClick={clearConsent}
            >
              Çerez tercihleri
            </button>
          </div>
          <a href="https://hazarvolga.com.tr/" target="_blank" rel="noopener noreferrer" className="alu-site-footer__link">{navData.footer.credit}</a>
        </div>
      </footer></DebugComponentLabel>


    </div>
  );
}
