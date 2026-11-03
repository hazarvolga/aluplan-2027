export const VIDEO_SOURCES = {
  'allplan-2026': {
    title: 'Allplan 2026', description: 'Allplan 2026 sürümü için hazırlanmış kapsamlı eğitim videoları ve yenilikler.',
    sourceUrl: 'https://youtube.com/playlist?list=PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x&si=BSEJvgjsQWgbIwVe',
    playlistId: 'PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x',
  },
  'allplan-english': {
    title: 'Youtube Allplan English', description: 'Allplan global İngilizce içerikleri, uluslararası örnekler ve eğitimler.',
    sourceUrl: 'https://www.youtube.com/@ALLPLANEnglish', channelId: 'UCC3gd-xmQrHOVf-m6hkV2ig',
  },
  'allplan-international': {
    title: 'ALLPLAN YouTube Kanalı', description: 'Dünya genelinden Allplan kullanıcı hikayeleri ve küresel etkinlikler.',
    sourceUrl: 'https://www.youtube.com/c/AllplanInternational', channelId: 'UCYXYHTwXhthaKLSvT_V_KcA',
  },
  'allplan-precast': {
    title: 'Youtube Allplan Precast', description: 'Prekast beton tasarımı ve üretimi üzerine özelleşmiş Almanca/İngilizce içerikler.',
    sourceUrl: 'https://www.youtube.com/c/AllplanPrecast', channelId: 'UCIupHdNjAZbGAw0T5MjOubQ',
  },
} as const;

export type VideoSourceKey = keyof typeof VIDEO_SOURCES;
export function videoSourceForUrl(url: string): VideoSourceKey | undefined {
  return (Object.keys(VIDEO_SOURCES) as VideoSourceKey[]).find((key) => VIDEO_SOURCES[key].sourceUrl === url);
}
export function getVideoSource(key: string) {
  return Object.prototype.hasOwnProperty.call(VIDEO_SOURCES, key) ? VIDEO_SOURCES[key as VideoSourceKey] : null;
}
