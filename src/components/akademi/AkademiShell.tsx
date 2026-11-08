'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useThemeMode } from '@/components/theme/ThemeModeProvider';
import { AkademiHeader } from './AkademiHeader';
import { AkademiFooter } from './AkademiFooter';
import { AkademiSidebar } from './AkademiSidebar';
import styles from './AkademiShell.module.css';

/**
 * Standalone chrome for the akademi section: slim header, one main landmark, minimal footer.
 * The landing page (/akademi) is full-width with no sidebar; the curriculum detail pages
 * (/akademi/<level>) get the left curriculum sidebar for browsing.
 */
export function AkademiShell({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const pathname = usePathname() ?? '';
  const isLanding = pathname === '/akademi';

  return (
    <div className={styles.shell} data-theme="aluplan" data-mode={mode}>
      <a href="#akademi-main" className="alu-skip-link">İçeriğe geç</a>
      <AkademiHeader />
      <div className={isLanding ? styles.bodyFull : styles.body}>
        {!isLanding && <AkademiSidebar />}
        <main id="akademi-main" className={styles.main}>{children}</main>
      </div>
      <AkademiFooter />
    </div>
  );
}
