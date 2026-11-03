import { SITE_ORIGIN } from './site-data';
import type { PageRecord } from './site-data';
import { getSubpageHeroPresentation } from '../components/sections/subpage-hero-presentation';

export interface ShareImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

const DEFAULT_SHARE_IMAGE = '/opengraph-image.jpg';
const DEFAULT_SHARE_SIZE = { width: 1200, height: 630 };
const RASTER_IMAGE = /\.(jpe?g|png|webp)(\?|$)/i;

function absolute(src: string): string {
  return src.startsWith('http') ? src : `${SITE_ORIGIN}${src}`;
}

export function getPageShareImage(page: PageRecord): ShareImage {
  const photo = (page.images || []).find((img) => img.src && !img.isIcon && RASTER_IMAGE.test(img.src));
  const background = getSubpageHeroPresentation(page.path, photo?.src ?? null).background;
  const src = background?.desktopSrc ?? photo?.src;
  if (!src) return { url: absolute(DEFAULT_SHARE_IMAGE), alt: page.h1, ...DEFAULT_SHARE_SIZE };
  return { url: absolute(src), alt: page.h1 };
}
