/**
 * Aluplan Akademi — "Prekast Yapı Elemanları" serisi.
 *
 * Grounded, Türkçe, destek bilgi çekirdeğinden (aluplan_core.db) küratörlü üretilmiş
 * dersler. TmLesson tipini ve TmLessonDetail / TmOverview bileşenlerini yeniden kullanır.
 * Ekran görüntüleri kaynak makalelere ait gerçek ALLPLAN arayüz görselleridir.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './prekast/01.json';
import l02 from './prekast/02.json';
import l03 from './prekast/03.json';
import l04 from './prekast/04.json';

export const prekastHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: "Prekast Yapı Elemanları",
  lead:
    "ALLPLAN'da prekast beton elemanları, gömme parçaları ve üretim listelerini tanımlar; endüstriyel üretim çıktısını otomatikleştirirsiniz.",
} as const;

export const prekastLessons: readonly TmLesson[] = [
  l01, l02, l03, l04,
].map((raw) => raw as unknown as TmLesson);

export function getPrekastLesson(slug: string): TmLesson | undefined {
  return prekastLessons.find((lesson) => lesson.slug === slug);
}

export function prekastRouteParams(): Array<{ ders: string }> {
  return prekastLessons.map((lesson) => ({ ders: lesson.slug }));
}
