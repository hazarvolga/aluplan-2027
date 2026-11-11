import { akademiProgram, levelModules } from '@/data/akademi-content';
import type { TmLesson } from '@/data/temel-modelleme';
import { temelModellemeHero, temelModellemeLessons } from '@/data/temel-modelleme';
import { araziModellemeHero, araziModellemeLessons } from '@/data/arazi-modelleme';
import { lejantHero, lejantLessons } from '@/data/lejant';
import { donatiDetaylandirmaHero, donatiDetaylandirmaLessons } from '@/data/donati-detaylandirma';
import { celikYapiHero, celikYapiLessons } from '@/data/celik-yapi';
import { prekastHero, prekastLessons } from '@/data/prekast';
import { otomasyonScriptingHero, otomasyonScriptingLessons } from '@/data/otomasyon-scripting';
import { openbimIfcHero, openbimIfcLessons } from '@/data/openbim-ifc';

export type AkademiPageKind = 'overview' | 'level' | 'module' | 'series' | 'lesson';

/** One indexable Akademi page: drives metadata, share images, sitemap and llms.txt. */
export interface AkademiPageInfo {
  path: string;
  kind: AkademiPageKind;
  title: string;
  description: string;
  /** Short label shown above the title on the share image (series, level, …). */
  kicker: string;
}

interface SeriesSource {
  path: string;
  hero: { title: string; lead: string };
  lessons: readonly TmLesson[];
  levelSlug: string;
}

/** Same series and levels as the Akademi sidebar. */
const SERIES: readonly SeriesSource[] = [
  { path: '/akademi/temel-modelleme', hero: temelModellemeHero, lessons: temelModellemeLessons, levelSlug: 'temel' },
  { path: '/akademi/arazi-modelleme', hero: araziModellemeHero, lessons: araziModellemeLessons, levelSlug: 'temel' },
  { path: '/akademi/lejant', hero: lejantHero, lessons: lejantLessons, levelSlug: 'orta' },
  { path: '/akademi/donati-detaylandirma', hero: donatiDetaylandirmaHero, lessons: donatiDetaylandirmaLessons, levelSlug: 'ileri' },
  { path: '/akademi/celik-yapi', hero: celikYapiHero, lessons: celikYapiLessons, levelSlug: 'ileri' },
  { path: '/akademi/prekast', hero: prekastHero, lessons: prekastLessons, levelSlug: 'ileri' },
  { path: '/akademi/otomasyon-scripting', hero: otomasyonScriptingHero, lessons: otomasyonScriptingLessons, levelSlug: 'uzman' },
  { path: '/akademi/openbim-ifc', hero: openbimIfcHero, lessons: openbimIfcLessons, levelSlug: 'uzman' },
];

const plain = (text: string): string => text.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

function levelLabel(slug: string): string {
  const level = akademiProgram.levels.find((item) => item.slug === slug);
  return level ? `Seviye ${level.number} · ${level.title}` : 'Aluplan Akademi';
}

function buildPages(): AkademiPageInfo[] {
  const overview: AkademiPageInfo = {
    path: '/akademi',
    kind: 'overview',
    title: 'Aluplan Akademi',
    description: plain(akademiProgram.hero.lead),
    kicker: 'ALLPLAN Türkçe eğitim programı',
  };
  const levels = akademiProgram.levels.flatMap((level): AkademiPageInfo[] => [
    { path: `/akademi/${level.slug}`, kind: 'level', title: levelLabel(level.slug), description: plain(level.summary), kicker: 'Aluplan Akademi' },
    ...levelModules(level).map((module): AkademiPageInfo => ({
      path: `/akademi/${module.levelSlug}/${module.slug}`,
      kind: 'module',
      title: module.title,
      description: plain(module.summary),
      kicker: `${module.code} · ${levelLabel(module.levelSlug)}`,
    })),
  ]);
  const series = SERIES.flatMap((source): AkademiPageInfo[] => [
    { path: source.path, kind: 'series', title: source.hero.title, description: plain(source.hero.lead), kicker: levelLabel(source.levelSlug) },
    ...source.lessons.map((lesson): AkademiPageInfo => ({
      path: `${source.path}/${lesson.slug}`,
      kind: 'lesson',
      title: lesson.title,
      description: plain(lesson.objectives[0] ?? lesson.title),
      kicker: `${source.hero.title} · Ders ${String(lesson.no).padStart(2, '0')}`,
    })),
  ]);
  return [overview, ...levels, ...series];
}

const PAGES: readonly AkademiPageInfo[] = buildPages();
const BY_PATH = new Map(PAGES.map((page) => [page.path, page]));

/** Every indexable Akademi page, in reading order (overview, levels with modules, series with lessons). */
export function listAkademiPages(): readonly AkademiPageInfo[] {
  return PAGES;
}

/** The Akademi page at this path, or undefined (unknown path or a non-page route like /akademi/katalog). */
export function getAkademiPage(path: string): AkademiPageInfo | undefined {
  return BY_PATH.get(path);
}
