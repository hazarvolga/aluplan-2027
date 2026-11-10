/**
 * Akademi mesleki rolleri — hafif, veri-bağımsız modül.
 *
 * Bu dosya BİLEREK hiçbir ders JSON'u import etmez. Böylece 'use client'
 * bileşenleri (ör. AkademiKatalogFiltre) rol adlarını, tüm serilerin ders
 * verisini (akademi-mufredat-haritasi) tarayıcı paketine çekmeden kullanır.
 */
export type AkademiRol =
  | 'mimar'
  | 'statik'
  | 'altyapi'
  | 'prekast'
  | 'bim-yonetici'
  | 'teknik-ressam';

export const ROL_ADLARI: Record<AkademiRol, string> = {
  mimar: 'Mimar',
  statik: 'Statik / Donatı',
  altyapi: 'Altyapı / Köprü',
  prekast: 'Prekast',
  'bim-yonetici': 'BIM Yöneticisi',
  'teknik-ressam': 'Teknik Ressam / Öğrenci',
};
