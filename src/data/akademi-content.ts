/**
 * Aluplan Akademi structured content model (2026-11-08).
 *
 * Single source of truth for every akademi page. Module content lives as
 * committed JSON in src/data/akademi-content/<code>.json (validated by
 * scripts/validate_akademi_content.py). This module adds the hand-written
 * TS types, the program/level taxonomy, and the loader that binds the module
 * JSON into levels and tracks. No YAML/zod dependency.
 */
import m1 from './akademi-content/M1.json';
import m2 from './akademi-content/M2.json';
import m3 from './akademi-content/M3.json';
import m4 from './akademi-content/M4.json';
import m4b from './akademi-content/M4B.json';
import m3b from './akademi-content/M3B.json';
import m5 from './akademi-content/M5.json';
import m6 from './akademi-content/M6.json';
import m7 from './akademi-content/M7.json';
import m8 from './akademi-content/M8.json';
import m9 from './akademi-content/M9.json';
import m10 from './akademi-content/M10.json';

export interface Outcome {
  text: string;
  bloom: string;
  code: string;
}

export interface Concept {
  term: string;
  desc: string;
  en: string;
}

export interface SessionStep {
  time: string;
  phase: string;
  instructor: string;
  participant: string;
  material?: string;
}

export interface DurationSlice {
  label: 'Anlatım' | 'Uygulama' | 'Ölçme' | 'Bireysel';
  minutes: number;
}

export interface ContentModule {
  code: string;
  slug: string;
  title: string;
  /** Semantic level slug: temel | orta | ileri | uzman. */
  levelSlug: string;
  /** Set only for track-based levels (İleri); groups modules into a track. */
  trackTitle?: string | null;
  hours: number;
  format: string;
  prerequisite: string;
  summary: string;
  outcomes: readonly Outcome[];
  concepts?: readonly Concept[];
  sessionFlow: readonly SessionStep[];
  durationSplit: readonly DurationSlice[];
  runningProjectStep: string;
  homework?: string;
  assessment?: string;
  materials?: readonly string[];
  /** True when the module is proposed in the plan, not yet in the PRD. */
  proposed?: boolean;
  /** Reserved for a future per-lesson split; unused today. */
  lessons?: readonly unknown[];
}

export interface ContentTrack {
  title: string;
  summary: string;
  modules: readonly ContentModule[];
}

export interface ContentLevel {
  number: number;
  /** Semantic slug for the level route: temel | orta | ileri | uzman. */
  slug: string;
  title: string;
  role: string;
  shared: boolean;
  summary: string;
  modules?: readonly ContentModule[];
  tracks?: readonly ContentTrack[];
}

export interface AkademiEntryPath {
  icon: 'graduation-cap' | 'layers';
  title: string;
  audience: string;
  steps: readonly string[];
}

export interface AkademiProgram {
  hero: typeof hero;
  entryPaths: readonly AkademiEntryPath[];
  runningProject: typeof runningProject;
  lessonParts: typeof lessonParts;
  certificate: typeof certificate;
  knowledgeBase: typeof knowledgeBase;
  progressNote: string;
  levels: readonly ContentLevel[];
}

const hero = {
  kicker: 'ALUPLAN AKADEMİ · TASLAK',
  title: 'ALLPLAN’ı Türkçe, seviye seviye öğrenin',
  lead: 'Üniversite öğrencileri ve çalışan mühendis ve mimarlar için ücretsiz, herkese açık bir ALLPLAN eğitim programı. Her ders kısa anlatım, adım adım uygulama ve öz değerlendirme quiziyle ilerler.',
} as const;

const entryPaths: readonly AkademiEntryPath[] = [
  {
    icon: 'graduation-cap',
    title: 'ALLPLAN’a yeni başlıyorum',
    audience: 'Öğrenciler ve BIM’e yeni başlayanlar',
    steps: ['Temel seviye ile başlayın', 'Ortak çekirdeği tamamlayın', 'İleri seviyede disiplin kolunuzu seçin'],
  },
  {
    icon: 'layers',
    title: 'Revit veya AutoCAD kullanıyorum',
    audience: 'ALLPLAN’a geçmek isteyen profesyoneller',
    steps: ['Seviye belirleme quizini çözün', '“Revit’ten ALLPLAN’a” geçiş modülünü izleyin', 'Önerilen seviyeden devam edin'],
  },
];

const runningProject = {
  title: 'Tek proje, baştan sona',
  lead: 'Program boyunca 4-5 katlı, betonarme, karma kullanımlı bir bina geliştirilir. Her ders projeye bir katman ekler; altyapı kolunda ayrıca prekast kirişli küçük bir köprü modellenir.',
  steps: [
    { level: 'Temel', text: 'Akslar, katlar ve temel mimari model' },
    { level: 'Orta', text: 'Kesitler, görünüşler, paftalar ve metraj' },
    { level: 'İleri', text: 'Kolunuza göre mimari detay, donatı, prekast veya köprü' },
    { level: 'Uzman', text: 'IFC teslimi, kural denetimi ve otomasyon' },
  ],
} as const;

const lessonParts = [
  { icon: 'book-open', title: 'Kısa anlatım', text: 'Dersin neden önemli olduğu ve temel kavramlar.' },
  { icon: 'circle-play', title: 'Video ve adımlar', text: 'Her adımın yanında “neden?” notuyla uygulama.' },
  { icon: 'circle-help', title: 'Öz değerlendirme', text: 'Ders sonu quizi; açıklamalı cevaplarla.' },
  { icon: 'download', title: 'Ders dosyaları', text: 'Başlangıç ve tamamlanmış proje dosyaları.' },
] as const;

const certificate = {
  title: 'Sertifika için eğitmenli eğitimler',
  text: 'Akademi programı Aluplan’ın eğitmenli eğitimleriyle aynı müfredatı kullanır. Sertifika, eğitmen eşliğinde yapılan pratik sınav ve bitirme projesiyle verilir.',
  action: { label: 'Eğitim merkezlerimiz', href: '/egitim-merkezlerimiz' },
} as const;

const knowledgeBase = {
  title: 'Bilgi Bankası (yakında)',
  text: 'ALLPLAN destek makalelerinin Türkçe karşılıkları; lisanslama, modelleme ve sık karşılaşılan sorunlar için adım adım çözümler. Makaleler ilgili derslere bağlanacak.',
} as const;

const progressNote =
  'Quiz sonuçlarınız yalnızca bu tarayıcıda saklanır; hesap açmanız gerekmez. Quizler öz değerlendirme içindir ve sertifika yerine geçmez.';

/** Display order of module codes within a level. */
const MODULE_ORDER = ['M1', 'M2', 'M3', 'M4', 'M4B', 'M3B', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'] as const;

/** Display order of tracks within the İleri level. */
const TRACK_ORDER = ['Mimari', 'Betonarme ve 3B donatı', 'Prekast ve çelik', 'Altyapı ve köprü'] as const;

const TRACK_SUMMARIES: Record<string, string> = {
  Mimari: 'Karmaşık geometri, cephe, varyantlar ve görselleştirme.',
  'Betonarme ve 3B donatı': '3B donatı detaylandırma, büküm şemaları ve donatı listeleri.',
  'Prekast ve çelik': 'Prekast eleman üretimi ve çelik bağlantılar.',
  'Altyapı ve köprü': 'Parametrik yol, tünel ve köprü modelleme.',
};

const allModules: readonly ContentModule[] = [m1, m2, m3, m4, m4b, m3b, m5, m6, m7, m8, m9, m10].map(
  (raw) => raw as ContentModule,
);

function moduleOrderIndex(code: string): number {
  const index = MODULE_ORDER.indexOf(code as (typeof MODULE_ORDER)[number]);
  return index === -1 ? MODULE_ORDER.length : index;
}

function modulesForLevel(levelSlug: string): readonly ContentModule[] {
  return allModules
    .filter((module) => module.levelSlug === levelSlug)
    .slice()
    .sort((a, b) => moduleOrderIndex(a.code) - moduleOrderIndex(b.code));
}

function tracksForLevel(levelSlug: string): readonly ContentTrack[] {
  const levelModules = modulesForLevel(levelSlug);
  const byTrack = new Map<string, ContentModule[]>();
  for (const module of levelModules) {
    const track = module.trackTitle ?? 'Diğer';
    const bucket = byTrack.get(track) ?? [];
    bucket.push(module);
    byTrack.set(track, bucket);
  }
  const ordered = [...byTrack.keys()].sort((a, b) => {
    const ai = TRACK_ORDER.indexOf(a as (typeof TRACK_ORDER)[number]);
    const bi = TRACK_ORDER.indexOf(b as (typeof TRACK_ORDER)[number]);
    return (ai === -1 ? TRACK_ORDER.length : ai) - (bi === -1 ? TRACK_ORDER.length : bi);
  });
  return ordered.map((title) => ({
    title,
    summary: TRACK_SUMMARIES[title] ?? '',
    modules: byTrack.get(title) ?? [],
  }));
}

const levels: readonly ContentLevel[] = [
  {
    number: 1,
    slug: 'temel',
    title: 'Temel',
    role: 'BIM Uygulayıcısı',
    shared: true,
    summary: 'Arayüz, proje yapısı ve parametrik mimari elemanlarla ilk modelinizi kurarsınız.',
    modules: modulesForLevel('temel'),
  },
  {
    number: 2,
    slug: 'orta',
    title: 'Orta',
    role: 'BIM Uzmanı',
    shared: true,
    summary: 'Modelden kesit, görünüş, pafta ve metraj üretirsiniz.',
    modules: modulesForLevel('orta'),
  },
  {
    number: 3,
    slug: 'ileri',
    title: 'İleri',
    role: 'Disiplin uzmanı',
    shared: false,
    summary: 'Dört eşit süreli koldan birini seçip mesleğinize göre derinleşirsiniz.',
    tracks: tracksForLevel('ileri'),
  },
  {
    number: 4,
    slug: 'uzman',
    title: 'Uzman',
    role: 'BIM Yöneticisi ve Geliştirici',
    shared: true,
    summary: 'openBIM ile disiplinler arası çalışır, tekrar eden işleri otomatikleştirirsiniz.',
    modules: modulesForLevel('uzman'),
  },
];

export const akademiProgram: AkademiProgram = {
  hero,
  entryPaths,
  runningProject,
  lessonParts,
  certificate,
  knowledgeBase,
  progressNote,
  levels,
};

/** Level slugs for the detail route (used by generateStaticParams). */
export const levelSlugs: readonly string[] = levels.map((level) => level.slug);

/** Returns the level for a slug, or undefined when the slug is unknown. */
export function getLevelBySlug(slug: string): ContentLevel | undefined {
  return levels.find((level) => level.slug === slug);
}

/** Flattens a level's modules whether it uses a flat list or tracks. */
export function levelModules(level: ContentLevel): readonly ContentModule[] {
  if (level.modules) return level.modules;
  if (level.tracks) return level.tracks.flatMap((track) => track.modules);
  return [];
}

/** Returns a module by its level + module slug, or undefined when unknown. */
export function getModuleBySlug(levelSlug: string, moduleSlug: string): ContentModule | undefined {
  return allModules.find((module) => module.levelSlug === levelSlug && module.slug === moduleSlug);
}

/** Route params for every module detail page: { seviye, modul }. */
export function moduleRouteParams(): { seviye: string; modul: string }[] {
  return allModules.map((module) => ({ seviye: module.levelSlug, modul: module.slug }));
}
