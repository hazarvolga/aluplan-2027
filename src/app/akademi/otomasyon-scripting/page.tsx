import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { otomasyonScriptingHero, otomasyonScriptingLessons } from '@/data/otomasyon-scripting';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/otomasyon-scripting');

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
