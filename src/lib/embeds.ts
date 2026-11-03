export type EmbedKind = 'video' | 'map';

const YOUTUBE_COOKIE_EMBED = /^https:\/\/(?:www\.)?youtube\.com\/embed\//;
const YOUTUBE_NOCOOKIE_EMBED = 'https://www.youtube-nocookie.com/embed/';

export function normalizeEmbedSrc(src: string): string {
  return src.replace(YOUTUBE_COOKIE_EMBED, YOUTUBE_NOCOOKIE_EMBED);
}

export function embedKind(src: string): EmbedKind {
  return /google\.[a-z.]+\/maps/.test(src) ? 'map' : 'video';
}
