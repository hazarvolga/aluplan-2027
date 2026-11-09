/**
 * Aluplan Akademi — "Arazi Modelleme Eğitimi" series.
 *
 * Grounded, Turkish, screenshot-based lessons generated from the
 * allplan_learnnow source course (scripts/build_series.py, run manually),
 * then enriched with the student didactic layer. Reuses the TmLesson type
 * and the TmLessonDetail / TmOverview renderers.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './arazi-modelleme/01.json';
import l02 from './arazi-modelleme/02.json';
import l03 from './arazi-modelleme/03.json';
import l04 from './arazi-modelleme/04.json';
import l05 from './arazi-modelleme/05.json';
import l06 from './arazi-modelleme/06.json';
import l07 from './arazi-modelleme/07.json';
import l08 from './arazi-modelleme/08.json';
import l09 from './arazi-modelleme/09.json';
import l10 from './arazi-modelleme/10.json';

export const araziModellemeHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: 'Arazi Modelleme Eğitimi',
  lead:
    'ALLPLAN ile halihazır haritadan başlayıp bir arsanın sayısal arazi modelini, eş yükselti egrilerini, 3B maketini, yollarını ve çevre binalarını adım adım modellersiniz. On uygulamalı derste bina projenizi gerçek araziye oturtursunuz.',
} as const;

export const araziModellemeLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07, l08, l09, l10,
].map((raw) => raw as unknown as TmLesson);

export function getAraziModellemeLesson(slug: string): TmLesson | undefined {
  return araziModellemeLessons.find((lesson) => lesson.slug === slug);
}

export function araziModellemeRouteParams(): Array<{ ders: string }> {
  return araziModellemeLessons.map((lesson) => ({ ders: lesson.slug }));
}
