/**
 * Aluplan Akademi — "Otomasyon ve Visual Scripting" serisi.
 *
 * Grounded, Türkçe, destek bilgi çekirdeğinden (aluplan_core.db) küratörlü üretilmiş
 * dersler. TmLesson tipini ve TmLessonDetail / TmOverview bileşenlerini yeniden kullanır.
 * Ekran görüntüleri kaynak makalelere ait gerçek ALLPLAN arayüz görselleridir.
 */
import type { TmLesson } from './temel-modelleme';
import l01 from './otomasyon-scripting/01.json';
import l02 from './otomasyon-scripting/02.json';
import l03 from './otomasyon-scripting/03.json';

export const otomasyonScriptingHero = {
  kicker: 'ALUPLAN AKADEMİ',
  title: "Otomasyon ve Visual Scripting",
  lead:
    "ALLPLAN'da tekrar eden isleri Visual Scripting ve PythonParts ile otomatiklestirir, formul editoru betik komutlariyla listeleri guclendirirsiniz.",
} as const;

export const otomasyonScriptingLessons: readonly TmLesson[] = [
  l01, l02, l03,
].map((raw) => raw as unknown as TmLesson);

export function getOtomasyonScriptingLesson(slug: string): TmLesson | undefined {
  return otomasyonScriptingLessons.find((lesson) => lesson.slug === slug);
}

export function otomasyonScriptingRouteParams(): Array<{ ders: string }> {
  return otomasyonScriptingLessons.map((lesson) => ({ ders: lesson.slug }));
}
