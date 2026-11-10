/**
 * Aluplan Akademi — "Çelik Yapı ve SDS2" serisi.
 *
 * Grounded, Türkçe, destek bilgi çekirdeğinden (aluplan_core.db) küratörlü üretilmiş
 * dersler. TmLesson tipini ve TmLessonDetail / TmOverview bileşenlerini yeniden kullanır.
 * Ekran görüntüleri kaynak makalelere ait gerçek ALLPLAN arayüz görselleridir.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './celik-yapi/01.json';
import l02 from './celik-yapi/02.json';
import l03 from './celik-yapi/03.json';
import l04 from './celik-yapi/04.json';
import l05 from './celik-yapi/05.json';
import l06 from './celik-yapi/06.json';
import l07 from './celik-yapi/07.json';

export const celikYapiHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: "Çelik Yapı ve SDS2",
  lead:
    "ALLPLAN Mühendislik ve SDS2 ile çelik taşıyıcı sistemi, profilleri ve otomatik bağlantıları modeller; BVBS/NC imalat verisi ve metraj listeleri üretirsiniz.",
} as const;

export const celikYapiLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07,
].map((raw) => raw as unknown as TmLesson);

export function getCelikYapiLesson(slug: string): TmLesson | undefined {
  return celikYapiLessons.find((lesson) => lesson.slug === slug);
}

export function celikYapiRouteParams(): Array<{ ders: string }> {
  return celikYapiLessons.map((lesson) => ({ ders: lesson.slug }));
}
