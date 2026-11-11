'use client';

import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import { useThemeMode } from '@/components/theme/ThemeModeProvider';
import { SearchDialog } from '@/components/shell/SearchDialog';
import styles from './AkademiHeader.module.css';

/** Slim academy top bar: brand -> home, lesson search, one quiet "explore ALLPLAN" link, theme toggle. */
export function AkademiHeader() {
  const { mode, toggleMode } = useThemeMode();
  const logoSrc = mode === 'dark'
    ? '/assets/logo/aluplan-logo-white-filled.svg'
    : '/assets/logo/aluplan-logo-black.svg';

  return (
    <header className={styles.header}>
      <div className={`alu-container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Aluplan ana sayfa">
          <img src={logoSrc} alt="Aluplan" width={166} height={32} className={styles.logo} />
        </Link>
        <nav className={styles.nav} aria-label="Akademi üst gezinme">
          <SearchDialog
            defaultScope="akademi"
            trigger={(openSearch) => (
              <button
                type="button"
                className={styles.search}
                aria-label="Akademi'de ara (Ctrl+K)"
                onClick={openSearch}
              >
                <AluIcon name="search" size="sm" />
                <span className={styles.searchLabel}>Ara</span>
              </button>
            )}
          />
          <Link href="/akademi#katalog" className={styles.navLink}>Katalog &amp; Yollar</Link>
          <Link href="/products" className={styles.explore} aria-label="ALLPLAN’ı keşfet">
            <span className={styles.exploreLabel}>ALLPLAN’ı keşfet</span>
            <AluIcon name="arrow-up-right" size="sm" />
          </Link>
          <button
            type="button"
            className={styles.toggle}
            aria-label={mode === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            onClick={toggleMode}
          >
            <AluIcon name={mode === 'dark' ? 'sun' : 'moon'} size="sm" />
          </button>
        </nav>
      </div>
    </header>
  );
}
