/**
 * Aluplan Akademi landing content (draft, 2026-11-08).
 * Structure follows docs/superpowers/specs/2026-11-08-aluplan-akademi-plan.md.
 * Module hours come from the curriculum PRD and are recalculated in the curriculum phase.
 */

export interface AkademiModule {
  code: string;
  title: string;
  hours: number;
  /** True when the module is proposed in the plan and not part of the PRD. */
  proposed?: boolean;
  /** Learning outcomes (kazanımlar) shown on the level detail page. */
  outcomes?: readonly string[];
}

export interface AkademiTrack {
  title: string;
  summary: string;
  modules: readonly AkademiModule[];
}

export interface AkademiLevel {
  number: number;
  /** Semantic URL slug for the level detail page, e.g. 'temel'. */
  slug: string;
  title: string;
  role: string;
  shared: boolean;
  summary: string;
  modules?: readonly AkademiModule[];
  tracks?: readonly AkademiTrack[];
}

export interface AkademiEntryPath {
  icon: 'graduation-cap' | 'layers';
  title: string;
  audience: string;
  steps: readonly string[];
}

export const akademiHero = {
  kicker: 'ALUPLAN AKADEMİ · TASLAK',
  title: 'ALLPLAN’ı Türkçe, seviye seviye öğrenin',
  lead: 'Üniversite öğrencileri ve çalışan mühendis ve mimarlar için ücretsiz, herkese açık bir ALLPLAN eğitim programı. Her ders kısa anlatım, adım adım uygulama ve öz değerlendirme quiziyle ilerler.',
} as const;

export const akademiEntryPaths: readonly AkademiEntryPath[] = [
  {
    icon: 'graduation-cap',
    title: 'ALLPLAN’a yeni başlıyorum',
    audience: 'Öğrenciler ve BIM’e yeni başlayanlar',
    steps: ['Seviye 1 ile başlayın', 'Ortak çekirdeği tamamlayın', 'Seviye 3’te disiplin kolunuzu seçin'],
  },
  {
    icon: 'layers',
    title: 'Revit veya AutoCAD kullanıyorum',
    audience: 'ALLPLAN’a geçmek isteyen profesyoneller',
    steps: ['Seviye belirleme quizini çözün', '“Revit’ten ALLPLAN’a” geçiş modülünü izleyin', 'Önerilen seviyeden devam edin'],
  },
];

export const akademiLevels: readonly AkademiLevel[] = [
  {
    number: 1,
    slug: 'temel',
    title: 'Temel',
    role: 'BIM Uygulayıcısı',
    shared: true,
    summary: 'Arayüz, proje yapısı ve parametrik mimari elemanlarla ilk modelinizi kurarsınız.',
    modules: [
      {
        code: 'M1',
        title: 'Arayüz ve temel gezinme',
        hours: 8,
        outcomes: [
          'ALLPLAN arayüzünün ana bölümlerini tanımlar',
          'Temel gezinme ve görünüm araçlarını kullanır',
          'CAD ile BIM arasındaki farkı açıklar',
        ],
      },
      {
        code: 'M2',
        title: 'Proje yapısı, yapı yapısı ve çizim dosyaları',
        hours: 12,
        outcomes: [
          'Proje, yapı yapısı ve çizim dosyası ilişkisini açıklar',
          'Kat/seviye ve aks sistemini kurar',
          'Çizim dosyalarını katman mantığına göre düzenler',
        ],
      },
      {
        code: 'M3',
        title: 'Parametrik mimari elemanlar ve hacimler',
        hours: 16,
        outcomes: [
          'Duvar, döşeme, kolon ve kirişi doğru parametrelerle yerleştirir',
          'Kapı/pencere açıklıklarını ve merdiveni oluşturur',
          'Elemanlar arası birleşim önceliklerini uygular',
        ],
      },
    ],
  },
  {
    number: 2,
    slug: 'orta',
    title: 'Orta',
    role: 'BIM Uzmanı',
    shared: true,
    summary: 'Modelden kesit, görünüş, pafta ve metraj üretirsiniz.',
    modules: [
      {
        code: 'M4',
        title: '2B dokümantasyon, kesitler ve pafta düzeni',
        hours: 12,
        outcomes: [
          'Modelden kesit ve görünüş üretir',
          'Pafta düzenini kurar ve PDF/DWG çıktı alır',
          'Ölçülendirme, metin ve tarama ile paftayı tamamlar',
        ],
      },
      {
        code: 'M4B',
        title: 'Kütüphane, özellikler ve metraj listeleri',
        hours: 12,
        proposed: true,
        outcomes: [
          'Kütüphane ve özel parametrik objeleri yönetir',
          'Elemanlara özellik atar ve sınıflandırma uygular',
          'Metraj, çizelge ve mahal listesi üretir',
        ],
      },
    ],
  },
  {
    number: 3,
    slug: 'ileri',
    title: 'İleri',
    role: 'Disiplin uzmanı',
    shared: false,
    summary: 'Dört eşit süreli koldan birini seçip mesleğinize göre derinleşirsiniz.',
    tracks: [
      {
        title: 'Mimari',
        summary: 'Karmaşık geometri, cephe, varyantlar ve görselleştirme.',
        modules: [
          {
            code: 'M3B',
            title: 'İleri mimari modelleme ve sunum',
            hours: 16,
            proposed: true,
            outcomes: [
              'Karmaşık geometri ve cephe sistemlerini modeller',
              'Tasarım varyantları ve görselleştirme çıktısı oluşturur',
            ],
          },
        ],
      },
      {
        title: 'Betonarme ve 3B donatı',
        summary: '3B donatı detaylandırma, büküm şemaları ve donatı listeleri.',
        modules: [
          {
            code: 'M5',
            title: 'Betonarme yapılarda 3B donatı',
            hours: 16,
            outcomes: [
              'Betonarme elemanlarda 3B donatıyı detaylandırır',
              'Büküm şemaları ve donatı listeleri üretir',
            ],
          },
        ],
      },
      {
        title: 'Prekast ve çelik',
        summary: 'Prekast eleman üretimi ve çelik bağlantılar.',
        modules: [
          {
            code: 'M6',
            title: 'Çelik yapı tasarımı ve SDS2',
            hours: 8,
            outcomes: ['Çelik yapı elemanlarını ve bağlantılarını modeller'],
          },
          {
            code: 'M7',
            title: 'Prekast elemanlar ve üretim verisi',
            hours: 8,
            outcomes: ['Prekast elemanları ve üretim verisini hazırlar'],
          },
        ],
      },
      {
        title: 'Altyapı ve köprü',
        summary: 'Parametrik yol, tünel ve köprü modelleme.',
        modules: [
          {
            code: 'M8',
            title: 'ALLPLAN Civil ve Bridge ile altyapı',
            hours: 16,
            outcomes: [
              'Parametrik yol/altyapı modelini oluşturur',
              'Prefabrik kirişli köprüyü modeller',
            ],
          },
        ],
      },
    ],
  },
  {
    number: 4,
    slug: 'uzman',
    title: 'Uzman',
    role: 'BIM Yöneticisi ve Geliştirici',
    shared: true,
    summary: 'openBIM ile disiplinler arası çalışır, tekrar eden işleri otomatikleştirirsiniz.',
    modules: [
      {
        code: 'M9',
        title: 'Otomasyon, Visual Scripting ve PythonParts',
        hours: 12,
        outcomes: [
          'Görsel programlama ile parametrik bir iş akışı kurgular',
          'PythonParts ile özel otomasyon geliştirir',
        ],
      },
      {
        code: 'M10',
        title: 'openBIM, IFC 4.3, IDS ve CDE koordinasyonu',
        hours: 10,
        outcomes: [
          'IFC dışa/içe aktarımını yapar ve veri kaybını denetler',
          'BCF ile sorun yönetimi ve koordinasyonu yürütür',
          'IDS/CDE ve ISO 19650 kavramlarını teslim akışına uygular',
        ],
      },
    ],
  },
];

/** Level slugs for the detail route (used by generateStaticParams when the draft is enabled). */
export const akademiLevelSlugs: readonly string[] = akademiLevels.map((level) => level.slug);

/** Returns the level for a slug, or undefined when the slug is unknown. */
export function getAkademiLevel(slug: string): AkademiLevel | undefined {
  return akademiLevels.find((level) => level.slug === slug);
}

export const akademiRunningProject = {
  title: 'Tek proje, baştan sona',
  lead: 'Program boyunca 4-5 katlı, betonarme, karma kullanımlı bir bina geliştirilir. Her ders projeye bir katman ekler; altyapı kolunda ayrıca prekast kirişli küçük bir köprü modellenir.',
  steps: [
    { level: 'Seviye 1', text: 'Akslar, katlar ve temel mimari model' },
    { level: 'Seviye 2', text: 'Kesitler, görünüşler, paftalar ve metraj' },
    { level: 'Seviye 3', text: 'Kolunuza göre mimari detay, donatı, prekast veya köprü' },
    { level: 'Seviye 4', text: 'IFC teslimi, kural denetimi ve otomasyon' },
  ],
} as const;

export const akademiLessonParts = [
  { icon: 'book-open', title: 'Kısa anlatım', text: 'Dersin neden önemli olduğu ve temel kavramlar.' },
  { icon: 'circle-play', title: 'Video ve adımlar', text: 'Her adımın yanında “neden?” notuyla uygulama.' },
  { icon: 'circle-help', title: 'Öz değerlendirme', text: 'Ders sonu quizi; açıklamalı cevaplarla.' },
  { icon: 'download', title: 'Ders dosyaları', text: 'Başlangıç ve tamamlanmış proje dosyaları.' },
] as const;

export const akademiProgressNote =
  'Quiz sonuçlarınız yalnızca bu tarayıcıda saklanır; hesap açmanız gerekmez. Quizler öz değerlendirme içindir ve sertifika yerine geçmez.';

export const akademiCertificate = {
  title: 'Sertifika için eğitmenli eğitimler',
  text: 'Akademi programı Aluplan’ın eğitmenli eğitimleriyle aynı müfredatı kullanır. Sertifika, eğitmen eşliğinde yapılan pratik sınav ve bitirme projesiyle verilir.',
  action: { label: 'Eğitim merkezlerimiz', href: '/egitim-merkezlerimiz' },
} as const;

export const akademiKnowledgeBase = {
  title: 'Bilgi Bankası (yakında)',
  text: 'ALLPLAN destek makalelerinin Türkçe karşılıkları; lisanslama, modelleme ve sık karşılaşılan sorunlar için adım adım çözümler. Makaleler ilgili derslere bağlanacak.',
} as const;
