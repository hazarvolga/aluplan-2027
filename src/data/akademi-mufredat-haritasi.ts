/**
 * Müfredat hizalama haritası: 42 uygulamalı seri dersini (temel-modelleme, arazi, lejant)
 * modül / seviye / rol omurgasına bağlar. Bu bir METADATA katmanıdır — ders slug'ları ve
 * `/akademi/<seri>/<ders>` URL'leri değişmez, localStorage ilerleme kayıtları korunur.
 * Kaynak: docs/ders-tasarimi/raporlar/2026-11-10-mufredat-hizalama-taslagi.md (onaylı).
 */
import { temelModellemeLessons } from './temel-modelleme';
import { araziModellemeLessons } from './arazi-modelleme';
import { lejantLessons } from './lejant';
import type { TmLesson } from './temel-modelleme';

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

export type AkademiSeri = 'temel-modelleme' | 'arazi-modelleme' | 'lejant';

export interface MufredatKaydi {
  series: AkademiSeri;
  slug: string;
  /** Hedef modül kodu (akademi-content): M1, M2, M3, M4, M4B; arazi için 'arazi'. */
  moduleCode: string;
  roles: readonly AkademiRol[];
}

const HERKES: readonly AkademiRol[] = [
  'mimar',
  'statik',
  'altyapi',
  'prekast',
  'bim-yonetici',
  'teknik-ressam',
];

export const mufredatHaritasi: readonly MufredatKaydi[] = [
  // M1 — Arayüz ve Temel Gezinme (Temel)
  { series: 'temel-modelleme', slug: 'giris-bim-felsefesi', moduleCode: 'M1', roles: HERKES },
  { series: 'temel-modelleme', slug: 'arayuz-incelemesi', moduleCode: 'M1', roles: HERKES },
  { series: 'temel-modelleme', slug: '2d-olusturma-komutlari', moduleCode: 'M1', roles: HERKES },
  { series: 'temel-modelleme', slug: '2d-duzenleme-komutlari', moduleCode: 'M1', roles: HERKES },
  // M2 — Proje Yapısı, Yapı Yapısı ve Çizim Dosyaları (Temel)
  { series: 'temel-modelleme', slug: 'proje-olusturma', moduleCode: 'M2', roles: HERKES },
  { series: 'temel-modelleme', slug: 'cizim-dosyalari-yukseklik', moduleCode: 'M2', roles: HERKES },
  { series: 'temel-modelleme', slug: 'aks-olusturma', moduleCode: 'M2', roles: HERKES },
  // M3 — Parametrik Mimari Elemanlar ve Hacimler (Temel)
  { series: 'temel-modelleme', slug: 'duvar-olusturma', moduleCode: 'M3', roles: ['mimar', 'statik'] },
  { series: 'temel-modelleme', slug: 'kapi-pencere', moduleCode: 'M3', roles: ['mimar'] },
  { series: 'temel-modelleme', slug: 'kolon-kiris', moduleCode: 'M3', roles: ['mimar', 'statik'] },
  { series: 'temel-modelleme', slug: 'doseme-olusturma', moduleCode: 'M3', roles: ['mimar', 'statik'] },
  { series: 'temel-modelleme', slug: 'merdiven-olusturma', moduleCode: 'M3', roles: ['mimar'] },
  { series: 'temel-modelleme', slug: 'temel-olusturma', moduleCode: 'M3', roles: ['mimar', 'statik'] },
  { series: 'temel-modelleme', slug: 'kat-kopyalama', moduleCode: 'M3', roles: ['mimar'] },
  { series: 'temel-modelleme', slug: 'cati-elemanlari', moduleCode: 'M3', roles: ['mimar'] },
  { series: 'temel-modelleme', slug: 'mahaller', moduleCode: 'M3', roles: ['mimar', 'bim-yonetici'] },
  // M4 — 2B Dokümantasyon, Kesitler ve Pafta (Orta)
  { series: 'temel-modelleme', slug: 'olculendirme', moduleCode: 'M4', roles: ['mimar', 'teknik-ressam'] },
  { series: 'temel-modelleme', slug: 'gorunusler', moduleCode: 'M4', roles: ['mimar', 'teknik-ressam'] },
  { series: 'temel-modelleme', slug: 'kesitler', moduleCode: 'M4', roles: ['mimar', 'teknik-ressam'] },
  { series: 'temel-modelleme', slug: 'kot-etiket', moduleCode: 'M4', roles: ['mimar', 'teknik-ressam'] },
  { series: 'temel-modelleme', slug: 'pafta', moduleCode: 'M4', roles: ['mimar', 'teknik-ressam'] },
  // Arazi (Altyapı girişi) — temel-modelleme köprü dersi
  { series: 'temel-modelleme', slug: 'cevre-arazi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  // Arazi serisi (Temel-Orta, Altyapı/Köprü girişi)
  { series: 'arazi-modelleme', slug: 'giris', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'arazi-dosyasini-alma', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'arazi-nokta-kotlarinin-girilmesi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'dijital-arazi-modelinin-olusturulmasi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'es-yukselti-egrilerinin-olusturulmasi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: '3b-arazi-modelinin-olusturulmasi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: '3b-maket-modelinin-olusturulmasi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: '3b-arazinin-duzleme-donusturulmesi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'yollarin-modellenmesi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  { series: 'arazi-modelleme', slug: 'binalarin-modellenmesi', moduleCode: 'arazi', roles: ['altyapi', 'mimar'] },
  // M4B — Kütüphane, Özellikler ve Metraj Listeleri (Orta) — lejant
  { series: 'lejant', slug: 'giris', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'bir-lejantin-parcalari', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'mimari-lejant-tasarimi-lejant-kopyalama', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'mimari-lejant-hucresi-tanimlama', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'mimari-lejanti-olusturma', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'mimari-lejanti-test-etme-duzenleme', moduleCode: 'M4B', roles: ['mimar', 'teknik-ressam', 'bim-yonetici'] },
  { series: 'lejant', slug: 'donati-lejanti-tasarimi-lejant-kopyalama', moduleCode: 'M4B', roles: ['statik'] },
  { series: 'lejant', slug: 'donati-lejanti-hucresini-tanimlama', moduleCode: 'M4B', roles: ['statik'] },
  { series: 'lejant', slug: 'donati-lejantini-olusturma', moduleCode: 'M4B', roles: ['statik'] },
  { series: 'lejant', slug: 'donati-lejantini-test-etme-duzenleme', moduleCode: 'M4B', roles: ['statik'] },
];

/** Modül kodundan seviye slug'ı. */
export const MODUL_SEVIYE: Record<string, string> = {
  M1: 'temel',
  M2: 'temel',
  M3: 'temel',
  M4: 'orta',
  M4B: 'orta',
  arazi: 'temel',
};

const SERI: Record<AkademiSeri, { lessons: readonly TmLesson[]; basePath: string; label: string }> = {
  'temel-modelleme': { lessons: temelModellemeLessons, basePath: '/akademi/temel-modelleme', label: 'Temel Modelleme' },
  'arazi-modelleme': { lessons: araziModellemeLessons, basePath: '/akademi/arazi-modelleme', label: 'Arazi Modelleme' },
  lejant: { lessons: lejantLessons, basePath: '/akademi/lejant', label: 'Lejant' },
};

export interface ModulDersi {
  slug: string;
  href: string;
  title: string;
  no: number;
  duration: string;
  seriLabel: string;
  roles: readonly AkademiRol[];
}

/** Bir modüle haritalanmış seri derslerini (başlık + bağlantı) döndürür. */
export function lessonsForModule(moduleCode: string): readonly ModulDersi[] {
  return mufredatHaritasi
    .filter((entry) => entry.moduleCode === moduleCode)
    .map((entry): ModulDersi | null => {
      const seri = SERI[entry.series];
      const lesson = seri.lessons.find((l) => l.slug === entry.slug);
      if (!lesson) return null;
      return {
        slug: lesson.slug,
        href: `${seri.basePath}/${lesson.slug}`,
        title: lesson.title,
        no: lesson.no,
        duration: lesson.duration,
        seriLabel: seri.label,
        roles: entry.roles,
      };
    })
    .filter((item): item is ModulDersi => item !== null);
}

/** Bir dersin (seri+slug) hangi modül/role ait olduğunu döndürür. */
export function moduleForLesson(series: AkademiSeri, slug: string): MufredatKaydi | undefined {
  return mufredatHaritasi.find((entry) => entry.series === series && entry.slug === slug);
}

/** Program sırası: Temel → Orta → Arazi → İleri → Uzman. */
export const MODUL_SIRA: readonly string[] = ['M1', 'M2', 'M3', 'M4', 'M4B', 'arazi', 'M3B', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'];

export interface YolDersi {
  slug: string;
  href: string;
  title: string;
  moduleCode: string;
}

export interface OgrenmeYolu {
  role: AkademiRol;
  roleName: string;
  moduleCodes: readonly string[];
  lessons: readonly YolDersi[];
}

/** Her mesleki rol için sıralı öğrenme yolu: program sırasına göre o role ait dersler. */
export function ogrenmeYollari(): readonly OgrenmeYolu[] {
  const roles: readonly AkademiRol[] = ['mimar', 'statik', 'altyapi', 'bim-yonetici', 'prekast', 'teknik-ressam'];
  return roles.map((role) => {
    const lessons: YolDersi[] = [];
    const moduleCodes: string[] = [];
    for (const code of MODUL_SIRA) {
      const inModule = lessonsForModule(code).filter((lesson) => lesson.roles.includes(role));
      if (inModule.length > 0) {
        moduleCodes.push(code);
        for (const lesson of inModule) {
          lessons.push({ slug: lesson.slug, href: lesson.href, title: lesson.title, moduleCode: code });
        }
      }
    }
    return { role, roleName: ROL_ADLARI[role], moduleCodes, lessons };
  });
}
