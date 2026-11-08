import type { ReactNode } from 'react';
import { AkademiShell } from '@/components/akademi/AkademiShell';

/** The akademi section renders its own chrome (SiteShell is skipped for /akademi). */
export default function AkademiLayout({ children }: { children: ReactNode }) {
  return <AkademiShell>{children}</AkademiShell>;
}
