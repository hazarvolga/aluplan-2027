/**
 * Aluplan Akademi — "Lejant Oluşturma Eğitimi" series.
 *
 * Grounded, Turkish, screenshot-based lessons generated from the
 * allplan_learnnow source course (scripts/build_series.py, run manually),
 * then enriched with the student didactic layer. Reuses the TmLesson type
 * and the TmLessonDetail / TmOverview renderers.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './lejant/01.json';
import l02 from './lejant/02.json';
import l03 from './lejant/03.json';
import l04 from './lejant/04.json';
import l05 from './lejant/05.json';
import l06 from './lejant/06.json';
import l07 from './lejant/07.json';
import l08 from './lejant/08.json';
import l09 from './lejant/09.json';
import l10 from './lejant/10.json';

export const lejantHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: 'Lejant Oluşturma Eğitimi',
  lead:
    'ALLPLAN Pafta Düzenleyicide mimari ve donatı lejantlarını (legend) sıfırdan tasarlar, hücre ve formülleri tanımlar, lejantı oluşturup test eder ve düzenlersiniz. On uygulamalı derste paftalarınıza standart, otomatik beslenen lejantlar eklersiniz.',
} as const;

export const lejantLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07, l08, l09, l10,
].map((raw) => raw as unknown as TmLesson);

export function getLejantLesson(slug: string): TmLesson | undefined {
  return lejantLessons.find((lesson) => lesson.slug === slug);
}

export function lejantRouteParams(): Array<{ ders: string }> {
  return lejantLessons.map((lesson) => ({ ders: lesson.slug }));
}
