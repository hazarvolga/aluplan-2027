import { VIDEO_SOURCES } from '@/lib/video-sources';
import { getChannelVideosWithStatus } from '@/lib/youtube-feed';

type VideoSearchResult = { entries: { path: string; title: string; seoTitle: string; section: string; description: string; keywords: string }[]; partial: boolean };
let cached: { value: VideoSearchResult; expires: number } | undefined;
let pending: Promise<VideoSearchResult> | undefined;

async function buildIndex(): Promise<VideoSearchResult> {
  const results = await Promise.all(Object.entries(VIDEO_SOURCES).map(async ([slug, source]) => {
    const videos = 'channelId' in source ? await getChannelVideosWithStatus(source.channelId) : [];
    return { unavailable: videos === null, entry: {
      path: `/video-kutuphanesi/kaynak/${slug}`,
      title: source.title,
      seoTitle: `${source.title} | Video Kütüphanesi | Aluplan`,
      section: 'Video',
      description: source.description,
      keywords: (videos ?? []).map((video) => video.title).join(' ')
    }};
  }));
  return { entries: results.map((result) => result.entry), partial: results.some((result) => result.unavailable) };
}

export async function GET() {
  if (!cached || cached.expires <= Date.now()) {
    pending ??= buildIndex().finally(() => { pending = undefined; });
    const value = await pending;
    cached = { value, expires: Date.now() + (value.partial ? 30_000 : 3_600_000) };
  }
  return Response.json(cached.value, {
    headers: { 'Cache-Control': cached.value.partial ? 'no-store' : 'public, max-age=300, s-maxage=3600' }
  });
}
