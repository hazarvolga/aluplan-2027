import 'server-only';

export interface ChannelVideo { id: string; title: string }

function decodeXml(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code: string) => {
    if (code.startsWith('#')) {
      const numeric = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isInteger(numeric) && numeric > 0 && numeric <= 0x10ffff && !(numeric >= 0xd800 && numeric <= 0xdfff) ? String.fromCodePoint(numeric) : entity;
    }
    return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" } as Record<string, string>)[code.toLowerCase()] ?? entity;
  });
}

export function parseChannelFeed(xml: string): ChannelVideo[] {
  return [...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g)].slice(0, 15).flatMap((match) => {
    const id = match[1].match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/)?.[1];
    const rawTitle = match[1].match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const title = rawTitle ? decodeXml(rawTitle).trim() : '';
    return id && title ? [{ id, title }] : [];
  });
}

const MAX_FEED_BYTES = 256 * 1024;

async function readBoundedFeed(response: Response): Promise<string> {
  const length = Number(response.headers.get('content-length'));
  if (length > MAX_FEED_BYTES || !response.body) throw new Error('feed_unavailable');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) return text + decoder.decode();
      size += chunk.value.byteLength;
      if (size > MAX_FEED_BYTES) throw new Error('feed_too_large');
      text += decoder.decode(chunk.value, { stream: true });
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

export async function getChannelVideos(channelId: string): Promise<ChannelVideo[]> {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) return [];
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("feed_unavailable");
    return parseChannelFeed(await readBoundedFeed(response));
  } catch {
    console.warn("YouTube channel feed could not be loaded.");
    return [];
  }
}
