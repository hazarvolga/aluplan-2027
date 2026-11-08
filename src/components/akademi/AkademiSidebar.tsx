'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AluIcon } from '@/components/ui/AluIcon';
import { buildSidebarLevels, isAkademiLevelActive } from './sidebar-nav';
import styles from './AkademiSidebar.module.css';

const sidebarLevels = buildSidebarLevels();

/** Program-wide curriculum nav: sticky rail on desktop, off-canvas drawer on mobile. */
export function AkademiSidebar() {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc closes the drawer.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="akademi-sidebar"
        onClick={() => setOpen((value) => !value)}
      >
        <AluIcon name={open ? 'x' : 'menu'} size="sm" />
        <span>Müfredat</span>
      </button>

      {open && <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}

      <nav
        id="akademi-sidebar"
        className={`${styles.sidebar} ${open ? styles.open : ''}`}
        aria-label="Müfredat gezinmesi"
      >
        <p className={styles.heading}>Müfredat</p>
        <ol className={styles.levels}>
          {sidebarLevels.map((level) => {
            const active = isAkademiLevelActive(pathname, level.slug);
            return (
              <li key={level.slug} className={`${styles.level} ${active ? styles.active : ''}`}>
                <Link
                  href={`/akademi/${level.slug}`}
                  className={styles.levelLink}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={styles.levelNo}>{String(level.number).padStart(2, '0')}</span>
                  <span className={styles.levelTitle}>{level.title}</span>
                </Link>
                <ul className={styles.codes}>
                  {level.codes.map((code) => (
                    <li key={code} className={styles.code}>{code}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
