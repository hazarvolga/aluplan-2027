import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { otomasyonScriptingHero, otomasyonScriptingLessons } from '@/data/otomasyon-scripting';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OtomasyonScriptingPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={otomasyonScriptingHero}
      lessons={otomasyonScriptingLessons}
      basePath="/akademi/otomasyon-scripting"
      breadcrumbLabel="Otomasyon"
    />
  );
}
