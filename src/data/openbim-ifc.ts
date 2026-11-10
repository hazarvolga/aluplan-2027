/**
 * Aluplan Akademi — "OpenBIM ve IFC" serisi.
 *
 * Grounded, Türkçe, destek bilgi çekirdeğinden (aluplan_core.db) küratörlü üretilmiş
 * dersler. TmLesson tipini ve TmLessonDetail / TmOverview bileşenlerini yeniden kullanır.
 * Ekran görüntüleri kaynak makalelere ait gerçek ALLPLAN arayüz görselleridir.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './openbim-ifc/01.json';
import l02 from './openbim-ifc/02.json';
import l03 from './openbim-ifc/03.json';
import l04 from './openbim-ifc/04.json';
import l05 from './openbim-ifc/05.json';
import l06 from './openbim-ifc/06.json';
import l07 from './openbim-ifc/07.json';
import l08 from './openbim-ifc/08.json';
import l09 from './openbim-ifc/09.json';
import l10 from './openbim-ifc/10.json';
import l11 from './openbim-ifc/11.json';

export const openbimIfcHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: "OpenBIM ve IFC",
  lead:
    "ALLPLAN ve Bimplus ile openBIM iş akışını kurar; IFC dışa/içe aktarımını, öznitelik eşlemeyi, IDS ile teslim doğrulamasını ve çakışma/BCF yönetimini öğrenirsiniz.",
} as const;

export const openbimIfcLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07, l08, l09, l10, l11,
].map((raw) => raw as unknown as TmLesson);

export function getOpenbimIfcLesson(slug: string): TmLesson | undefined {
  return openbimIfcLessons.find((lesson) => lesson.slug === slug);
}

export function openbimIfcRouteParams(): Array<{ ders: string }> {
  return openbimIfcLessons.map((lesson) => ({ ders: lesson.slug }));
}
