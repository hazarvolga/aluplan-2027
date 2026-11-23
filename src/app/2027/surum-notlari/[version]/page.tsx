import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReleaseNotes2027DetailView } from '@/components/sections/ReleaseNotes2027View';
import { getReleaseNote2027, RELEASE_NOTES_2027 } from '@/data/release-notes-2027';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return RELEASE_NOTES_2027.map((release) => ({ version: release.version }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ version: string }>;
}): Promise<Metadata> {
  const { version } = await params;
  const release = getReleaseNote2027(version);
  if (!release) return {};
  return buildRelease2027Metadata(`/2027/surum-notlari/${release.version}`);
}

export default async function ReleaseNoteVersionPage({
  params
}: {
  params: Promise<{ version: string }>;
}) {
  if (!isReleaseContentEnabled()) notFound();
  const { version } = await params;
  const release = getReleaseNote2027(version);
  if (!release) notFound();
  const routePath = `/2027/surum-notlari/${release.version}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd(routePath)) }}
      />
      <ReleaseNotes2027DetailView release={release} />
    </>
  );
}
