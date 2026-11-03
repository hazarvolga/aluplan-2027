import { getSiteIdentity, SITE_ORIGIN } from './site-data';
import type { PageRecord, PlaylistRecord, StructuredFaqItem } from './site-data';

function faqAnswerText(item: StructuredFaqItem): string {
  return [
    item.answer,
    ...(item.bullets || []),
    ...(item.table?.headers || []),
    ...(item.table?.rows.flat() || []),
    item.note
  ].filter(Boolean).join(' ');
}

export function buildPageJsonLd(page: PageRecord, playlist?: PlaylistRecord | null) {
  const pageUrl = page.canonical;
  const siteIdentity = getSiteIdentity();
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: siteIdentity.name,
      alternateName: siteIdentity.alternateName,
      url: SITE_ORIGIN,
      foundingDate: siteIdentity.foundingDate,
      description: siteIdentity.description,
      email: siteIdentity.email,
      telephone: siteIdentity.telephone,
      address: siteIdentity.address,
      sameAs: siteIdentity.sameAs
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: 'Aluplan Program Sistemleri — ALLPLAN Türkiye',
      inLanguage: 'tr-TR',
      publisher: {
        '@id': `${SITE_ORIGIN}/#organization`
      }
    }
  ];

  // BreadcrumbList (never includes 404 intermediate routes like /solutions-v2)
  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: page.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.label,
        item: crumb.href === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${crumb.href}`
      }))
    });
  }

  const baseWebPage: Record<string, unknown> = {
    '@type': ['AboutPage', 'ContactPage', 'CollectionPage'].includes(page.schemaType)
      ? page.schemaType
      : 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    headline: page.h1,
    description: page.description,
    inLanguage: 'tr-TR',
    isPartOf: {
      '@id': `${SITE_ORIGIN}/#website`
    },
    about: {
      '@id': `${SITE_ORIGIN}/#organization`
    },
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`
    }
  };

  if (page.schemaType === 'SoftwareApplication') {
    const appEntityId = `${pageUrl}#software`;
    baseWebPage.mainEntity = { '@id': appEntityId };
    graph.push(baseWebPage);
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': appEntityId,
      name: page.h1,
      description: page.description,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Windows 10, Windows 11',
      url: pageUrl,
      provider: {
        '@id': `${SITE_ORIGIN}/#organization`
      }
    });
  } else if (page.schemaType === 'Service') {
    const serviceId = `${pageUrl}#service`;
    baseWebPage.mainEntity = { '@id': serviceId };
    graph.push(baseWebPage);
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: page.h1,
      description: page.description,
      serviceType: 'BIM Eğitim, Webinar ve Teknik Danışmanlık Hizmeti',
      provider: {
        '@id': `${SITE_ORIGIN}/#organization`
      },
      areaServed: {
        '@type': 'Country',
        name: 'Türkiye'
      }
    });
  } else if (page.schemaType === 'FAQPage') {
    const visibleFaqItems = page.structuredLayout?.faqDirectory?.categories.flatMap(
      (category) => category.items
    ) || page.structuredLayout?.faq?.items || [];
    const faqEntries = visibleFaqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faqAnswerText(item)
        }
      }));
    graph.push({
      ...baseWebPage,
      '@type': 'FAQPage',
      mainEntity: faqEntries
    });
  } else if (page.schemaType === 'VideoGallery' && playlist && playlist.videos.length > 0) {
    baseWebPage['@type'] = 'CollectionPage';
    baseWebPage.mainEntity = {
      '@type': 'ItemList',
      itemListElement: playlist.videos.slice(0, 25).map((v, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'VideoObject',
          name: v.title,
          description: v.description || `${playlist.title} — ${v.title}`,
          thumbnailUrl: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
          contentUrl: `https://www.youtube.com/watch?v=${v.id}`
        }
      }))
    };
    graph.push(baseWebPage);
  } else {
    graph.push(baseWebPage);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
