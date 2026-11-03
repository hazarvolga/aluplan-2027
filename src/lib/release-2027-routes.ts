import type { Metadata } from 'next';
import { SITE_ORIGIN } from './site-data';
import { isIndexingBlocked } from './release-flags';

export interface Release2027Route {
  path: string;
  name: string;
  description: string;
  productName: string | null;
  ogImage: string;
}

const DEFAULT_OG_IMAGE = '/opengraph-image.png';
const SITE_NAME = 'Aluplan Program Sistemleri';

export const RELEASE_2027_ROUTES: readonly Release2027Route[] = [
  {
    path: '/2027/features',
    name: 'ALLPLAN 2027 Yenilikleri',
    description: 'Allplan, Allplan Civil, FRILO, SCIA ve SDS2’nin 2027 sürümlerini keşfedin. İş akışı ne olursa olsun mühendisler için çözümler sunuyoruz. Kontrolü sizin elinizde tutan yapay zekâ araçları, yapı analizi için modern araçlar, daha hızlı çizim ve detaylandırma ve altyapı için güçlü parametrik modeller.',
    productName: 'ALLPLAN 2027',
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/2027/max',
    name: 'Allplan Max',
    description: 'Allplan Max, güçlü yapay zekâ araçlarını sizin kontrolünüze verir. Bir eklenti ya da ayrı bir paket değildir. Her 2027 ürününe dahildir.',
    productName: 'Allplan Max',
    ogImage: '/assets/previews/home-2027/allplan-max-generated-v2.jpg'
  },
  {
    path: '/2027/civil',
    name: 'ALLPLAN Civil',
    description: 'ALLPLAN Civil, çok disiplinli ve inşaat mühendisliği danışmanlık ofisleri ile bina ve altyapı yüklenicilerinde tasarım ve inşaatın tüm sürecini destekleyen, ileri altyapı tasarımından inşaata iş akışları için ALLPLAN’ın kapsamlı çözümüdür.',
    productName: 'ALLPLAN Civil',
    ogImage: '/assets/previews/allplan-civil-2027/civil-hero.jpg'
  },
  {
    path: '/2027/frilo',
    name: 'FRILO',
    description: 'FRILO; beton, çelik, ahşap ve yığma yapıların bileşen odaklı analizi ve tasarımı için BIM bağlantıları ve Eurocode ile DIN temelli araçlar sunar.',
    productName: 'FRILO',
    ogImage: '/assets/previews/frilo/frilo-hero.jpg'
  },
  {
    path: '/2027/scia',
    name: 'SCIA',
    description: 'SCIA, bina, altyapı ve karmaşık taşıyıcı sistemler üzerinde çalışan mühendisler için yapı analizi ve tasarım araçları sunar.',
    productName: 'SCIA',
    ogImage: '/assets/previews/frilo/frilo-hero.jpg'
  },
  {
    path: '/2027/compare',
    name: 'ALLPLAN 2027 sürüm karşılaştırması',
    description: 'Basic, Concept, Professional ve Ultimate sürümlerinin özelliklerini karşılaştırın.',
    productName: null,
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/product-lifecycle',
    name: 'Ürün Yaşam Döngüsü Politikası',
    description: 'Ürün bakım aşamaları, sürüm desteği ve sunulan hizmetler.',
    productName: null,
    ogImage: DEFAULT_OG_IMAGE
  }
];

export function getRelease2027Route(path: string): Release2027Route {
  const route = RELEASE_2027_ROUTES.find((entry) => entry.path === path);
  if (!route) throw new Error(`Unknown 2027 release route: ${path}`);
  return route;
}

const titleOf = (route: Release2027Route): string => `${route.name} | Aluplan`;
const canonicalOf = (route: Release2027Route): string => `${SITE_ORIGIN}${route.path}`;

export function buildRelease2027Metadata(path: string): Metadata {
  const route = getRelease2027Route(path);
  const title = titleOf(route);
  const canonical = canonicalOf(route);
  const image = `${SITE_ORIGIN}${route.ogImage}`;
  return {
    title,
    description: route.description,
    alternates: { canonical },
    robots: isIndexingBlocked() ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: route.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website',
      images: [{ url: image, alt: route.name }]
    },
    twitter: { card: 'summary_large_image', title, description: route.description, images: [image] }
  };
}

export function buildRelease2027JsonLd(path: string): Record<string, unknown> {
  const route = getRelease2027Route(path);
  const canonical = canonicalOf(route);
  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: titleOf(route),
    description: route.description,
    inLanguage: 'tr-TR',
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    breadcrumb: { '@id': `${canonical}#breadcrumb` }
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: route.name, item: canonical }
    ]
  };
  if (!route.productName) return { '@context': 'https://schema.org', '@graph': [webPage, breadcrumb] };
  const softwareId = `${canonical}#software`;
  const software = {
    '@type': 'SoftwareApplication',
    '@id': softwareId,
    name: route.productName,
    description: route.description,
    applicationCategory: 'DesignApplication',
    url: canonical,
    provider: { '@id': `${SITE_ORIGIN}/#organization` }
  };
  return { '@context': 'https://schema.org', '@graph': [{ ...webPage, mainEntity: { '@id': softwareId } }, breadcrumb, software] };
}
