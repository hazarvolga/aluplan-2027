'use client';

import type { ReactNode } from 'react';
import { useThemeMode } from '@/components/theme/ThemeModeProvider';
import { AkademiHeader } from './AkademiHeader';
import { AkademiFooter } from './AkademiFooter';
import { AkademiSidebar } from './AkademiSidebar';
import styles from './AkademiShell.module.css';

/**
 * Standalone chrome for the akademi section: slim header, a body region (sidebar slot
 * added in the next task), one main landmark, and a minimal footer. No SiteShell.
 */
export function AkademiShell({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();

  return (
    <div className={styles.shell} data-theme="aluplan" data-mode={mode}>
      <a href="#akademi-main" className="alu-skip-link">İçeriğe geç</a>
      <AkademiHeader />
      <div className={styles.body}>
        <AkademiSidebar />
        <main id="akademi-main" className={styles.main}>{children}</main>
      </div>
      <AkademiFooter />
    </div>
  );
}
