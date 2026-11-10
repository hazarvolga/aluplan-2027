/**
 * Aluplan Akademi — "Donatı Detaylandırma" serisi.
 *
 * Grounded, Türkçe, destek bilgi çekirdeğinden (aluplan_core.db) küratörlü üretilmiş
 * dersler. TmLesson tipini ve TmLessonDetail / TmOverview bileşenlerini yeniden kullanır.
 * Ekran görüntüleri kaynak makalelere ait gerçek ALLPLAN arayüz görselleridir.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './donati-detaylandirma/01.json';
import l02 from './donati-detaylandirma/02.json';
import l03 from './donati-detaylandirma/03.json';
import l04 from './donati-detaylandirma/04.json';
import l05 from './donati-detaylandirma/05.json';
import l06 from './donati-detaylandirma/06.json';
import l07 from './donati-detaylandirma/07.json';
import l08 from './donati-detaylandirma/08.json';

export const donatiDetaylandirmaHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: "Donatı Detaylandırma",
  lead:
    "ALLPLAN Mühendislik ile betonarme elemanların 3B donatısını, ulusal norma göre kesit serilerini, özel büküm şekillerini, donatı gösterimini ve metrajını adım adım kurarsınız.",
} as const;

export const donatiDetaylandirmaLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07, l08,
].map((raw) => raw as unknown as TmLesson);

export function getDonatiDetaylandirmaLesson(slug: string): TmLesson | undefined {
  return donatiDetaylandirmaLessons.find((lesson) => lesson.slug === slug);
}

export function donatiDetaylandirmaRouteParams(): Array<{ ders: string }> {
  return donatiDetaylandirmaLessons.map((lesson) => ({ ders: lesson.slug }));
}
