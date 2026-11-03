export type SubpageHeroPresentation = 'framed' | 'background-only';

export type HeroVisualFamilyId =
  | 'VF-00'
  | 'VF-01'
  | 'VF-02'
  | 'VF-03'
  | 'VF-04'
  | 'VF-05'
  | 'VF-06'
  | 'VF-07'
  | 'VF-08';

export type HeroVisualAssetKind = 'family' | 'official-release' | 'page-fallback';

export interface HeroBackgroundSources {
  desktopSrc: string;
  mobileSrc: string;
}

export interface SubpageHeroPresentationPolicy {
  presentation: SubpageHeroPresentation;
  familyId: HeroVisualFamilyId | null;
  assetKind: HeroVisualAssetKind;
  background: HeroBackgroundSources | null;
}

const FAMILY_ASSET_STEMS = Object.freeze({
  'VF-00': 'vf-00-ecosystem-overview',
  'VF-01': 'vf-01-building-design',
  'VF-02': 'vf-02-infrastructure-civil',
  'VF-03': 'vf-03-construction-fabrication',
  'VF-04': 'vf-04-addons-technical-tools',
  'VF-05': 'vf-05-complementary-cloud',
  'VF-06': 'vf-06-training-support-knowledge',
  'VF-07': 'vf-07-allplan-product-platform'
} satisfies Readonly<Record<Exclude<HeroVisualFamilyId, 'VF-08'>, string>>);

const FAMILY_ROUTES = Object.freeze({
  'VF-00': ['/solutions', '/products'],
  'VF-01': ['/cozumler/bina-tasarimi', '/solutions/architecture', '/solutions/structural', '/solutions/mep', '/solutions/allplan-industry', '/products/architecture'],
  'VF-02': ['/cozumler/altyapi-tasarimi', '/solutions/infrastructure', '/solutions/road-railway', '/solutions/bridge-design', '/solutions/features-allplan-bridge', '/solutions/modeling-of-precast-girder-bridges', '/products/civil'],
  'VF-03': ['/cozumler/insaat-planlamasi', '/solutions/precast', '/solutions/steel', '/solutions/site-planning', '/products/precast', '/products/precast-detail', '/products/sds2-home'],
  'VF-04': ['/eklentiler', '/solutions/cds-addon', '/solutions/pythonpart', '/solutions/ax3000', '/solutions/ax3000-mekanik-tesisat', '/solutions/ax3000-virtual-reality', '/solutions/ax3000-yapi-fizigi', '/solutions/ax3000/elektrik', '/solutions/ax3000/havalandirma', '/solutions/ax3000/isitma', '/solutions/ax3000/konut-havalandirma', '/solutions/ax3000/sihhi-tesisat', '/solutions/ax3000/sprinkler', '/solutions/scalypso', '/solutions/scalypso/converter', '/solutions/scalypso/mobile', '/solutions/scalypso/modeler', '/solutions/scalypso/videos', '/solutions/scalypso/viewer', '/solutions/addons', '/solutions/addons/2d-dwg-converter', '/solutions/addons/drive-curve', '/solutions/addons/geometry-tools', '/solutions/addons/graphical-text', '/solutions/addons/parametric-terrain', '/solutions/addons/ramp', '/solutions/addons/sketchup-converter', '/solutions/addons/steel-components', '/solutions/addons/three-dimensioning', '/products/ax3000'],
  'VF-05': ['/cozumler/diger-urunler', '/solutions/bimflex', '/solutions/rebar-engineering', '/solutions/imar-yonetmeligi-bim-eklentisi', '/solutions/bimx5', '/solutions/oska', '/solutions/poz-catalog', '/solutions/allplan-bulut-hizmetleri', '/products/allplan-bimplus', '/products/allplan-cloud-services'],
  'VF-06': ['/solutions-v2/connect-license', '/solutions-v2/connect-license/activation', '/solutions-v2/connect-license/how-to-assign', '/solutions-v2/connect-login', '/faq', '/video-kutuphanesi', '/video-kutuphanesi/addon-geometry', '/video-kutuphanesi/allplan-reinforcement', '/video-kutuphanesi/ax3000', '/video-kutuphanesi/bridge-workflow-2022', '/video-kutuphanesi/bridge-workflows', '/video-kutuphanesi/campus-de', '/video-kutuphanesi/campus-en', '/video-kutuphanesi/campus-tutorials-2019-2022', '/video-kutuphanesi/hello-allplan-2024', '/video-kutuphanesi/konut-insaati', '/video-kutuphanesi/otomatik-donati', '/video-kutuphanesi/quickstart-buildings', '/video-kutuphanesi/road-design', '/video-kutuphanesi/sds2-intro', '/products/ax3000/dokumanlar'],
  'VF-07': ['/products/allplan', '/products/allplan-aec', '/products/allplan-basic', '/products/allplan-concept', '/products/allplan-professional', '/products/allplan-ultimate'],
  'VF-08': ['/products/allplan-2026', '/products/allplan-2026-yenilikler']
} satisfies Readonly<Record<HeroVisualFamilyId, readonly string[]>>);

const ROUTE_FAMILY_ENTRIES = Object.entries(FAMILY_ROUTES).flatMap(
  ([familyId, routes]) =>
    routes.map((route) => [route, familyId as HeroVisualFamilyId] as const)
);

if (new Set(ROUTE_FAMILY_ENTRIES.map(([route]) => route)).size !== ROUTE_FAMILY_ENTRIES.length) {
  throw new Error('Hero visual family routes must be unique.');
}

export const HERO_VISUAL_FAMILY_ROUTES = Object.freeze(
  Object.fromEntries(ROUTE_FAMILY_ENTRIES)
);

function pageBackground(src: string | null): HeroBackgroundSources | null {
  return src ? { desktopSrc: src, mobileSrc: src } : null;
}

function familyBackground(
  familyId: Exclude<HeroVisualFamilyId, 'VF-08'>
): HeroBackgroundSources {
  const stem = FAMILY_ASSET_STEMS[familyId];
  return {
    desktopSrc: `/assets/heroes/families/${stem}.jpg`,
    mobileSrc: `/assets/heroes/families/${stem}-mobile.jpg`
  };
}

export function getSubpageHeroPresentation(
  path: string,
  fallbackBackgroundSrc: string | null
): SubpageHeroPresentationPolicy {
  const familyId = HERO_VISUAL_FAMILY_ROUTES[path];

  if (!familyId) {
    return {
      presentation: 'framed',
      familyId: null,
      assetKind: 'page-fallback',
      background: pageBackground(fallbackBackgroundSrc)
    };
  }

  if (familyId === 'VF-08') {
    return {
      presentation: 'background-only',
      familyId,
      assetKind: 'official-release',
      background: pageBackground(fallbackBackgroundSrc)
    };
  }

  return {
    presentation: 'background-only',
    familyId,
    assetKind: 'family',
    background: familyBackground(familyId)
  };
}
