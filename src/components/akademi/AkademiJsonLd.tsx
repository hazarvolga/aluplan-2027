import { akademiProgram } from '@/data/akademi-content';
import type { ContentLevel } from '@/data/akademi-content';

const { hero: akademiHero, levels: akademiLevels } = akademiProgram;

const SITE = 'https://aluplan.com.tr';

function levelCourse(level: ContentLevel) {
  return {
    '@type': 'Course',
    name: `Seviye ${level.number} · ${level.title}`,
    description: level.summary,
    url: `${SITE}/akademi/${level.slug}`,
    inLanguage: 'tr',
    provider: { '@type': 'Organization', name: 'Aluplan', url: SITE },
  };
}

/**
 * Course / ItemList structured data for the academy. Rendered now so the GEO/SEO
 * foundation is in place; the pages themselves stay noindex until launch.
 */
export function AkademiJsonLd({ level }: { level?: ContentLevel }) {
  const data = level
    ? { '@context': 'https://schema.org', ...levelCourse(level) }
    : {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Aluplan Akademi — ALLPLAN Türkçe eğitim programı',
        description: akademiHero.lead,
        itemListElement: akademiLevels.map((lvl, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: levelCourse(lvl),
        })),
      };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
