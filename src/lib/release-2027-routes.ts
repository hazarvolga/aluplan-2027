import type { Metadata } from 'next';
import { SITE_ORIGIN } from './site-data';
import { isIndexingBlocked } from './release-flags';

export interface Release2027Route {
  path: string;
  name: string;
  description: string;
  productName: string | null;
  ogImage: string;
  /** Built and kept, but unlinked and 404 in production until ALLPLAN publishes the product on allplan.com. */
  heldUntilManufacturerRelease?: boolean;
}

const DEFAULT_OG_IMAGE = '/opengraph-image.jpg';
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
    path: '/2027/surum-notlari',
    name: 'ALLPLAN 2027 Sürüm Notları',
    description: 'Allplan 2027 sürüm ailesindeki tüm teknik yenilikleri, geliştirmeleri ve güncellemeleri sürüm bazında takip edin.',
    productName: 'ALLPLAN 2027',
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/2027/surum-notlari/2027-0-0',
    name: 'Allplan 2027-0-0 Sürüm Notları',
    description: 'Allplan 2027 (28.10.2026) sürüm notları: Allplan AI MAX, dijital modelleme, donatı detaylandırma, yapım, altyapı, Python API ve bulut yenilikleri.',
    productName: 'ALLPLAN 2027',
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/products/allplan-max',
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
    path: '/products/frilo',
    name: 'FRILO',
    description: 'FRILO; beton, çelik, ahşap ve yığma yapıların bileşen odaklı analizi ve tasarımı için BIM bağlantıları ve Eurocode ile DIN temelli araçlar sunar.',
    productName: 'FRILO',
    ogImage: '/assets/previews/frilo/frilo-hero.jpg'
  },
  {
    path: '/products/scia',
    name: 'SCIA',
    description: 'SCIA, bina, altyapı ve karmaşık taşıyıcı sistemler üzerinde çalışan mühendisler için yapı analizi ve tasarım araçları sunar.',
    productName: 'SCIA',
    ogImage: '/assets/previews/frilo/frilo-hero.jpg'
  },
  {
    path: '/products/allplan-rebar',
    name: 'Allplan Rebar',
    description: 'Allplan Rebar; donatı tasarımı, detaylandırma, dokümantasyon, metraj ve proje koordinasyonunu tek bir odaklı BIM çözümünde birleştirir. Çubuk, hasır ve BAMTEC donatısı ile yapay zekâ destekli, otomatik detaylandırma.',
    productName: 'Allplan Rebar',
    ogImage: '/assets/previews/allplan-2027-features/csm_bar_group_circular_-_selected_3306dc1ad4.jpg',
    heldUntilManufacturerRelease: true
  },
  {
    path: '/products/allplan-parametric',
    name: 'Allplan Parametric',
    description: 'Allplan Parametric; köprü, tünel, istinat duvarı, gürültü bariyeri ve prekast kirişli köprülerin dört boyutlu parametrik modellenmesi ve detaylandırılması için özel işlevler sunar.',
    productName: 'Allplan Parametric',
    ogImage: '/assets/previews/allplan-civil-2027/civil-hero.jpg',
    heldUntilManufacturerRelease: true
  },
  {
    path: '/2027/allplan-basic',
    name: 'ALLPLAN Basic 2027 yenilikleri',
    description: 'Allplan Basic, güvenilir 2B çizime, temel 3B modellemeye ve bulut tabanlı iş birliğine ihtiyaç duyan ekipler için giriş seviyesi CAD çözümüdür.',
    productName: 'ALLPLAN Basic',
    ogImage: '/assets/heroes/families/vf-07-allplan-product-platform.jpg'
  },
  {
    path: '/2027/allplan-concept',
    name: 'ALLPLAN Concept 2027 yenilikleri',
    description: 'Allplan Concept, erken tasarımdan teslimata kadar güvenilir modelleme, görselleştirme ve dokümantasyona ihtiyaç duyan mimari ekipler için bir BIM çözümüdür.',
    productName: 'ALLPLAN Concept',
    ogImage: '/assets/heroes/families/vf-07-allplan-product-platform.jpg'
  },
  {
    path: '/2027/allplan-professional',
    name: 'ALLPLAN Professional 2027 yenilikleri',
    description: 'Allplan Professional, yüksek performanslı modelleme, detaylandırma ve otomasyona ihtiyaç duyan mimari ve mühendislik ekipleri için güçlü bir BIM çözümüdür.',
    productName: 'ALLPLAN Professional',
    ogImage: '/assets/heroes/families/vf-07-allplan-product-platform.jpg'
  },
  {
    path: '/2027/allplan-ultimate',
    name: 'ALLPLAN Ultimate 2027 yenilikleri',
    description: 'Allplan Ultimate, tasarımdan inşaya uzanan uçtan uca iş akışları için nihai BIM çözümüdür.',
    productName: 'ALLPLAN Ultimate',
    ogImage: '/assets/heroes/families/vf-07-allplan-product-platform.jpg'
  },
  {
    path: '/paket-karsilastirma',
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
  },
  {
    path: '/kaynaklar',
    name: 'Kaynaklar',
    description: 'Eğitim, Microsoft Teams canlı bağlantı ve allplan.net.tr/tr ticket platformu dahil 19 profesyonel hizmet ve teknik kaynağa tek merkezden ulaşın.',
    productName: null,
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/egitim-merkezlerimiz',
    name: 'Eğitim İş Ortaklarımız',
    description: 'Akademik iş birliklerimiz ve yetkili eğitim merkezlerimiz.',
    productName: null,
    ogImage: DEFAULT_OG_IMAGE
  },
  {
    path: '/kaydedilmis-webinarlar',
    name: 'Kaydedilmiş Webinarlar',
    description: 'Kısa, odaklanmış ve bilgi dolu çevrimiçi seminerler. Kaçırdığınız veya tekrar izlemek istediğiniz webinarlarımıza buradan ulaşabilirsiniz.',
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

/** Release routes that are linked, listed in the sitemap and in llms.txt. */
export const PUBLISHED_RELEASE_2027_ROUTES: readonly Release2027Route[] = RELEASE_2027_ROUTES.filter((route) => !route.heldUntilManufacturerRelease);

export function isHeldRelease2027Route(path: string): boolean {
  return RELEASE_2027_ROUTES.some((route) => route.path === path && route.heldUntilManufacturerRelease === true);
}
