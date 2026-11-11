import React from 'react';
import { preload } from 'react-dom';
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

/**
 * Heading (Manrope) and body (IBM Plex Sans 400) faces, latin + latin-ext (Turkish ş/ğ/İ live
 * in latin-ext). Preloading them lets the first paint use the real fonts, so text does not
 * reflow when they arrive (that swap was the main layout shift on product/solution pages).
 */
const CRITICAL_FONTS = [
  '/assets/fonts/Manrope-400_800-normal-latin.woff2',
  '/assets/fonts/Manrope-400_800-normal-latin-ext.woff2',
  '/assets/fonts/IBMPlexSans-400-normal-latin.woff2',
  '/assets/fonts/IBMPlexSans-400-normal-latin-ext.woff2',
] as const;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  for (const href of CRITICAL_FONTS) preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <html lang="tr" data-theme="aluplan" data-mode="dark">
      <body>
        <ThemeModeProvider>
          <DebugOverlayController />
          <SearchIndexProvider showRelease={isReleaseContentEnabled()} showAkademi={isAkademiEnabled()}><SiteShell showAkademi={isAkademiEnabled()}>{children}</SiteShell></SearchIndexProvider>
          <ConsentBanner />
          <ConsentScripts />
        </ThemeModeProvider>
      </body>
    </html>
  );
}
