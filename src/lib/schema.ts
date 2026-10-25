import { SITE_ORIGIN, PageRecord, PlaylistRecord } from './site-data';

export function buildPageJsonLd(page: PageRecord, playlist?: PlaylistRecord | null) {
  const pageUrl = page.canonical;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'Aluplan Program Sistemleri',
      alternateName: 'Aluplan Türkiye',
      url: SITE_ORIGIN,
      foundingDate: '1995',
      description: "1995'ten beri Türkiye'nin güvenilir ALLPLAN distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.",
      email: 'info@aluplan.com.tr',
      telephone: '+90-216-225-84-41',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5',
        addressLocality: 'Ataşehir',
        addressRegion: 'İstanbul',
        postalCode: '34752',
        addressCountry: 'TR'
      },
      sameAs: [
        'https://www.facebook.com/Allplan.Turkey',
        'https://twitter.com/Allplan_Turkey',
        'https://www.linkedin.com/company/allplan-turkey/',
        'https://www.instagram.com/allplan_turkey/',
        'https://www.youtube.com/c/AllplanTurkey'
      ]
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
    const serviceId = `${SITE_ORIGIN}/solutions-v2/training#service`;
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
    const faqEntries = page.sections
      .filter((sec) => sec.heading.includes('?') || sec.items.length > 0)
      .slice(0, 12)
      .map((sec) => ({
        '@type': 'Question',
        name: sec.heading,
        acceptedAnswer: {
          '@type': 'Answer',
          text: sec.items.join(' ') || page.description
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
