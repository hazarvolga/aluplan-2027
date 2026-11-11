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

/**
 * A real ALLPLAN screenshot (or other still) shown in a lesson.
 * `src` is a path under /public (e.g. /akademi/m1/arayuz-paletler.png).
 * `alt` is required: it must describe what the image shows for screen
 * readers and when the image fails to load.
 */
export interface Figure {
  src: string;
  alt: string;
  /** Short caption shown under the image. */
  caption?: string;
  /** Attribution line, e.g. "ALLPLAN dokümantasyonu". */
  source?: string;
  /** Intrinsic pixel size, so the layout reserves space (no CLS). */
  width?: number;
  height?: number;
}

export interface ApplicationStep {
  step: string;
  /** Optional "Neden?" rationale shown beside the step. */
  why?: string;
  /** Optional real screenshot that shows this step on screen. */
  figure?: Figure;
}

/**
 * One taught section of the actual lesson (DERS) — this is the teaching text a
 * self-paced online learner reads, not curriculum scaffolding. `body` holds the
 * explanatory paragraphs; key terms are wrapped in **double asterisks** and
 * rendered bold (safe text segmentation, no HTML). `figure` embeds the real
 * screenshot at the point it is discussed; `tryIt` is a short "now you try it".
 */
/**
 * An embedded tutorial video. `url` is a provider embed URL
 * (e.g. https://player.vimeo.com/video/ID or https://www.youtube.com/embed/ID).
 * The original ALLPLAN Vimeo videos are domain-locked, so these point at
 * Aluplan's own re-hosted copies once available.
 */
export interface LessonVideo {
  /** Provider embed URL. Omit (with placeholder: true) to reserve the slot. */
  url?: string;
  title?: string;
  /** 'vimeo' | 'youtube' — for the label only. */
  source?: string;
  /** True reserves a labelled slot ("video gelecek") until the url is provided. */
  placeholder?: boolean;
}

export interface LessonSection {
  heading: string;
  body: readonly string[];
  figure?: Figure;
  /** Optional embedded tutorial video for this section. */
  video?: LessonVideo;
  tryIt?: string;
}

export interface Lesson {
  /** Topic intro heading that opens the lesson (not a generic "Anlatım" label). */
  title?: string;
  /** Short one-line hook shown under the title. */
  subtitle?: string;
  /** Optional one-paragraph lead-in before the first section. */
  intro?: string;
  sections: readonly LessonSection[];
}

export interface CommonMistake {
  mistake: string;
  symptom: string;
  fix: string;
}

export interface Differentiation {
  /** For fast learners. */
  fast: string;
  /** For learners who need support. */
  support: string;
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Multiple-choice options; exactly one has correct: true. */
  options: readonly QuizOption[];
  /** Shown after answering: why the correct option is right (and distractors wrong). */
  explanation: string;
  bloom?: string;
  /** Kolay | Orta | Zor */
  difficulty?: string;
  /** Linked outcome code, e.g. K-B1.3. */
  outcomeCode?: string;
}

export interface ContentModule {
  code: string;
  slug: string;
  title: string;
  /** Semantic level slug: temel | orta | ileri | uzman. */
  levelSlug: string;
  /** Set only for track-based levels (Disiplin Uzmanlığı); groups modules into a track. */
  trackTitle?: string | null;
  hours: number;
  format: string;
  prerequisite: string;
  summary: string;
  /** Estimated self-paced completion time in minutes (shown on the lesson hero). */
  estimatedMinutes?: number;
  outcomes: readonly Outcome[];
  /** The actual taught lesson (DERS): the spine of the student-facing page. */
  lesson?: Lesson;
  /** Curated real screenshots that demonstrate the module on screen. */
  demo?: readonly Figure[];
  concepts?: readonly Concept[];
  sessionFlow: readonly SessionStep[];
  durationSplit: readonly DurationSlice[];
  runningProjectStep: string;
  homework?: string;
  assessment?: string;
  materials?: readonly string[];
  /** Step-by-step application guide (adım adım uygulama yönergesi). */
  applicationSteps?: readonly ApplicationStep[];
  /** Common mistakes and fixes (sık yapılan hatalar). */
  commonMistakes?: readonly CommonMistake[];
  /** Differentiation for fast learners / those needing support (farklılaştırma). */
  differentiation?: Differentiation;
  /** Interactive self-assessment quiz (öz değerlendirme quizi). */
  quiz?: readonly QuizQuestion[];
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
  progressNote: string;
  levels: readonly ContentLevel[];
}

const hero = {
  title: 'ALLPLAN’ı Türkçe, seviye seviye öğrenin',
  lead: 'Üniversite öğrencileri ve çalışan mühendis ve mimarlar için ücretsiz, herkese açık bir ALLPLAN eğitim programı. Her ders kısa anlatım, adım adım uygulama ve öz değerlendirme quiziyle ilerler.',
} as const;

const entryPaths: readonly AkademiEntryPath[] = [
  {
    icon: 'graduation-cap',
    title: 'ALLPLAN’a yeni başlıyorum',
    audience: 'Öğrenciler ve BIM’e yeni başlayanlar',
    steps: ['Temeller seviyesiyle başlayın', 'Ortak çekirdeği tamamlayın', 'Disiplin Uzmanlığı seviyesinde kolunuzu seçin'],
  },
  {
    icon: 'layers',
    title: 'Revit veya AutoCAD kullanıyorum',
    audience: 'ALLPLAN’a geçmek isteyen profesyoneller',
    steps: ['Seviye belirleme quizini çözün', '“Revit’ten ALLPLAN’a” geçiş modülünü izleyin', 'Önerilen seviyeden devam edin'],
  },
];

const runningProject = {
  title: 'Tek proje: iki katlı konut',
  lead: 'Temel Modelleme serisinin 22 dersi boyunca aynı iki katlı konutu kurarsınız: boş bir projeyle başlar, her derste modele bir katman ekler ve DIN A1 bir paftayla bitirirsiniz. Diğer seriler (Lejant, Donatı, Çelik, Prekast, Otomasyon, OpenBIM) kendi konularına uygun örneklerle çalışır.',
  steps: [
    { label: 'Dersler 01–04', title: 'Proje ve yapı', text: 'Boş proje, Bina Strüktürü, zemin ve 1. kat düzeyleri' },
    { label: 'Dersler 08–14', title: 'Zemin kat', text: 'Aks ağı, çok katmanlı duvarlar, kapı-pencere, kolon-kiriş, döşeme, merdiven, temel' },
    { label: 'Dersler 15–17', title: 'Üst kat ve çatı', text: 'Kat kopyalama, çatı düzlemi, mahaller ve ince yapı yüzeyleri' },
    { label: 'Dersler 19–22', title: 'Dokümantasyon', text: 'Görünüş, kesit, kot ve etiket; DIN A1 pafta ve PDF çıktı' },
  ],
  action: { label: 'Seriye başla', href: '/akademi/temel-modelleme' },
} as const;

const lessonParts = [
  { icon: 'book-open', title: 'Kısa anlatım', text: 'Dersin neden önemli olduğu ve temel kavramlar.' },
  { icon: 'circle-play', title: 'Video ve adımlar', text: 'Her adımın yanında “neden?” notuyla uygulama.' },
  { icon: 'circle-help', title: 'Öz değerlendirme', text: 'Ders sonu quizi; açıklamalı cevaplarla.' },
] as const;

const certificate = {
  title: 'Sertifika için eğitmenli eğitimler',
  text: 'Akademi programı Aluplan’ın eğitmenli eğitimleriyle aynı müfredatı kullanır. Sertifika, eğitmen eşliğinde yapılan pratik sınav ve bitirme projesiyle verilir.',
  action: { label: 'Eğitim merkezlerimiz', href: '/egitim-merkezlerimiz' },
} as const;

const progressNote =
  'Quiz sonuçlarınız yalnızca bu tarayıcıda saklanır; hesap açmanız gerekmez. Quizler öz değerlendirme içindir ve sertifika yerine geçmez.';

/** Display order of module codes within a level. */
const MODULE_ORDER = ['M1', 'M2', 'M3', 'M4', 'M4B', 'M3B', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'] as const;

/** Display order of tracks within the Disiplin Uzmanlığı level. */
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
    title: 'Temeller',
    role: 'BIM Uygulayıcısı',
    shared: true,
    summary: 'Arayüz, proje yapısı ve parametrik mimari elemanlarla ilk modelinizi kurarsınız.',
    modules: modulesForLevel('temel'),
  },
  {
    number: 2,
    slug: 'orta',
    title: 'Üretim ve Dokümantasyon',
    role: 'BIM Uzmanı',
    shared: true,
    summary: 'Modelden kesit, görünüş, pafta ve metraj üretirsiniz.',
    modules: modulesForLevel('orta'),
  },
  {
    number: 3,
    slug: 'ileri',
    title: 'Disiplin Uzmanlığı',
    role: 'Disiplin uzmanı',
    shared: false,
    summary: 'Dört eşit süreli koldan birini seçip mesleğinize göre derinleşirsiniz.',
    tracks: tracksForLevel('ileri'),
  },
  {
    number: 4,
    slug: 'uzman',
    title: 'BIM Yönetimi ve Otomasyon',
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
