import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SiteShell } from '@/components/shell/SiteShell';
import { ThemeModeProvider } from '@/components/theme/ThemeModeProvider';
import { ConsentBanner } from '@/components/shell/ConsentBanner';
import { ConsentScripts } from '@/components/shell/ConsentScripts';
import { DebugOverlayController } from '@/components/sections/DebugComponentLabel';
import { SITE_ORIGIN } from '@/lib/site-data';
import { isAkademiEnabled, isReleaseContentEnabled } from '@/lib/release-flags';
import { SearchIndexProvider } from '@/components/shell/SearchIndexProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'ALLPLAN Türkiye | Profesyonel BIM Yazılımları | Aluplan',
    template: '%s'
  },
  description:
    "1995'ten beri Türkiye'nin güvenilir ALLPLAN distribütörü. Mimari, inşaat mühendisliği, altyapı, köprü, prekast ve MEP projeleriniz için profesyonel BIM çözümleri."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="aluplan" data-mode="dark">
      <body>
        <ThemeModeProvider>
          <DebugOverlayController />
          <SearchIndexProvider showRelease={isReleaseContentEnabled()} showAkademi={isAkademiEnabled()}><SiteShell>{children}</SiteShell></SearchIndexProvider>
          <ConsentBanner />
          <ConsentScripts />
        </ThemeModeProvider>
      </body>
    </html>
  );
}
