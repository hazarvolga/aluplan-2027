import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideoSourcePage } from '@/components/sections/VideoSourcePage';
import { getVideoSource, VIDEO_SOURCES } from '@/lib/video-sources';
import { getChannelVideos } from '@/lib/youtube-feed';

// Refresh even if the upstream feed was unavailable during the previous render.
export const revalidate = 3600;

type Props = { params: Promise<{ source: string }> };
export function generateStaticParams() { return Object.keys(VIDEO_SOURCES).map((source) => ({ source })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { source } = await params;
  const data = getVideoSource(source);
  if (!data) return {};
  return { title: `${data.title} | Video Kütüphanesi | Aluplan`, description: data.description, robots: { index: false, follow: true } };
}
export default async function Page({ params }: Props) {
  const { source } = await params;
  const data = getVideoSource(source);
  if (!data) notFound();
  const videos = 'channelId' in data ? await getChannelVideos(data.channelId) : [];
  return <VideoSourcePage title={data.title} description={data.description} sourceUrl={data.sourceUrl} playlistId={'playlistId' in data ? data.playlistId : undefined} videos={videos} />;
}
