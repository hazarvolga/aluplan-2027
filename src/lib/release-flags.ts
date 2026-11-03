export type HomepageVariant = 'release-2027' | 'legacy';

const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export function isReleaseContentEnabled(): boolean {
  return !isProduction() || process.env.ALUPLAN_SHOW_2027 === '1';
}

export function isIndexingBlocked(): boolean {
  return process.env.ALUPLAN_BLOCK_INDEXING === '1';
}

export function isLocalPreviewEnabled(): boolean {
  return !isProduction();
}

export function getHomepageVariant(): HomepageVariant {
  return isReleaseContentEnabled() ? 'release-2027' : 'legacy';
}

export function isVercelInsightsEnabled(): boolean {
  return process.env.ALUPLAN_VERCEL_INSIGHTS === '1';
}
