import type { ReactElement } from 'react';
// Kept as a literal (like AkademiJsonLd): components may only type-import site-data.
const SITE_ORIGIN = 'https://aluplan.com.tr';

const PROVIDER = { '@type': 'Organization', name: 'Aluplan', url: SITE_ORIGIN } as const;

interface SeriesRef {
  /** Series title, e.g. "Lejant Oluşturma Eğitimi". */
  title: string;
  /** Series path, e.g. "/akademi/lejant". */
  path: string;
}

interface LessonRef {
  slug: string;
  title: string;
  objectives: readonly string[];
}

const plain = (text: string): string => text.replace(/\*\*/g, '').replace(/`/g, '').trim();

/** JSON-LD inside a <script>: "<" is escaped so lesson text can never close the tag. */
function JsonLd({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** LearningResource for one lesson, linked to its series (Course). */
export function AkademiLessonJsonLd({ series, lesson }: { series: SeriesRef; lesson: LessonRef }): ReactElement {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: lesson.title,
        description: plain(lesson.objectives[0] ?? lesson.title),
        url: `${SITE_ORIGIN}${series.path}/${lesson.slug}`,
        inLanguage: 'tr',
        learningResourceType: 'Ders',
        isAccessibleForFree: true,
        teaches: lesson.objectives.map(plain),
        provider: PROVIDER,
        isPartOf: { '@type': 'Course', name: series.title, url: `${SITE_ORIGIN}${series.path}` },
      }}
    />
  );
}

/** Course for a lesson series, listing its lessons as parts. */
export function AkademiSeriesJsonLd({ series, description, lessons }: { series: SeriesRef; description: string; lessons: readonly LessonRef[] }): ReactElement {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: series.title,
        description: plain(description),
        url: `${SITE_ORIGIN}${series.path}`,
        inLanguage: 'tr',
        isAccessibleForFree: true,
        provider: PROVIDER,
        hasPart: lessons.map((lesson) => ({
          '@type': 'LearningResource',
          name: lesson.title,
          url: `${SITE_ORIGIN}${series.path}/${lesson.slug}`,
        })),
      }}
    />
  );
}
