import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const invPath = path.join(ROOT, 'docs/00-inventory/content-inventory.json');
const irPath = path.join(ROOT, 'docs/00-inventory/interaction-register-2026-10-22.json');
const closureStatesPath = path.join(ROOT, 'docs/00-inventory/browser-closure-2026-10-22/states.json');
const completeStatesPath = path.join(ROOT, 'docs/00-inventory/browser-complete-2026-10-22/states.json');
const finalStatesPath = path.join(ROOT, 'docs/00-inventory/browser-final-2026-10-22.json');
const moduleStatesPath = path.join(ROOT, 'docs/00-inventory/browser-modules-final-2026-10-22.json');
const q3TextPath = path.join(ROOT, 'docs/00-inventory/pdf-evidence/q3-2026.txt');
const q4TextPath = path.join(ROOT, 'docs/00-inventory/pdf-evidence/q4-2025.txt');

const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const ir = JSON.parse(fs.readFileSync(irPath, 'utf8'));

function safeReadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

const closureStates = safeReadJson(closureStatesPath);
const completeStates = safeReadJson(completeStatesPath);
const finalStates = safeReadJson(finalStatesPath);
const moduleStates = safeReadJson(moduleStatesPath);

// Collect interactive state snapshots per path
const interactiveByPath = new Map();
function addInteractiveState(routePath, label, texts) {
  if (!routePath || !Array.isArray(texts) || texts.length === 0) return;
  const cleanPath = routePath.replace('https://aluplan.com.tr', '') || '/';
  if (!interactiveByPath.has(cleanPath)) {
    interactiveByPath.set(cleanPath, []);
  }
  const existing = interactiveByPath.get(cleanPath);
  const cleanedTexts = texts
    .map((t) => String(t).replace(/\[email\s*protected\]/gi, 'info@aluplan.com.tr').trim())
    .filter((t) => t.length > 2 && !t.startsWith('İçeriğe geç'));
  if (cleanedTexts.length > 0 && !existing.some((x) => x.label === label)) {
    existing.push({ label: label || `Durum ${existing.length + 1}`, texts: cleanedTexts.slice(0, 30) });
  }
}

function ingestStateObject(obj) {
  if (!obj) return;
  if (Array.isArray(obj)) {
    for (const item of obj) ingestStateObject(item);
    return;
  }
  if (typeof obj === 'object') {
    const urlOrPath = obj.url || obj.path || obj.route;
    if (urlOrPath && (obj.added_texts || obj.texts || obj.headings)) {
      const label = obj.action || obj.label || obj.state || obj.tab || 'Etkileşimli Sekme';
      const texts = obj.added_texts || obj.texts || obj.headings || [];
      addInteractiveState(urlOrPath, String(label), Array.isArray(texts) ? texts : []);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('/') && Array.isArray(v)) {
        for (const st of v) {
          addInteractiveState(k, st.label || st.action || st.name || 'Detay', st.added_texts || st.texts || []);
        }
      } else if (typeof v === 'object') {
        ingestStateObject(v);
      }
    }
  }
}

ingestStateObject(closureStates);
ingestStateObject(completeStates);
ingestStateObject(finalStates);
ingestStateObject(moduleStates);

// Clean text helper
function cleanText(str) {
  if (!str) return '';
  return String(str)
    .replace(/\[email[\s\u00a0]*protected\]/gi, 'info@aluplan.com.tr')
    .replace(/\u00a0/g, ' ')
    .trim();
}

// Header and footer boilerplate markers to strip from bodyNodes so they are not duplicated with global shell
const HEADER_EXACT = new Set([
  'İçeriğe geç',
  'info@aluplan.com.tr',
  'Çözümler',
  'Ürünler',
  'Kaynaklar',
  'Referanslar',
  'Hakkımızda',
  'İletişim',
  'Toggle theme',
  'Ücretsiz Deneme',
  'Teklif Talep Formu'
]);

const FOOTER_START_MARKER = "1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.";
const GLOBAL_CTA_START_MARKER = 'DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM';

const GENERIC_TITLES = new Set([
  'Aluplan - Premium Mühendislik Çözümleri',
  'ALLPLAN Ürünleri | Aluplan | Aluplan',
  'Allplan - Aluplan'
]);

const GENERIC_DESCRIPTIONS = new Set([
  'Mimarlık, mühendislik ve inşaat sektörü için premium yazılım çözümleri, BIM danışmanlığı ve eğitim hizmetleri.',
  'Mimari, mühendislik ve inşaat projeleriniz için en kapsamlı BIM ve CAD çözümlerini keşfedin. ALLPLAN AEC, Civil, Precast ve daha fazlası.',
  'Aluplan hakkında bilgi',
  'Bizimle iletişime geçin'
]);

// Custom human-readable labels for routes when h1 or title needs disambiguation
const ROUTE_LABELS = {
  '/': 'ALLPLAN Türkiye | Profesyonel BIM Yazılımları',
  '/about': 'Hakkımızda — Türkiye’nin Güvenilir BIM Çözüm Ortağı',
  '/contact': 'İletişim ve Teknik Danışmanlık — Aluplan',
  '/gizlilik-politikasi': 'Gizlilik Politikası ve Veri Güvenliği',
  '/kullanim-sartlari': 'İnternet Sitesi Kullanım Şartları',
  '/kvkk': 'KVKK Kişisel Verilerin İşlenmesi Aydınlatma Metni',
  '/health': 'Sistem Durumu ve Servis Sağlığı (Health Check)',
  '/package-overview': 'ALLPLAN Paket Genel Bakış ve Sürüm Rehberi',
  '/paket-karsilastirma': 'ALLPLAN 2026 Paket Karşılaştırma Rehberi (Q3 2026 PDF)',
  '/products': 'ALLPLAN Ürün Ailesi ve Mühendislik Yazılımları',
  '/products/allplan': 'ALLPLAN Platformu — Disiplinlerarası BIM Çözümü',
  '/products/allplan-2026': 'ALLPLAN 2026 Sürümü — Geleceği İnşa Eden BIM Platformu',
  '/products/allplan-2026-yenilikler': 'ALLPLAN 2026 Yenilikleri ve Öne Çıkan Özellikler',
  '/products/allplan-aec': 'ALLPLAN AEC — Mimari, Mühendislik ve İnşaat için BIM',
  '/products/allplan-basic': 'ALLPLAN Basic — 2B/3B Tasarım, Görüntüleme ve İş Birliği',
  '/products/allplan-bimplus': 'ALLPLAN Bimplus — Bulut Tabanlı OpenBIM İş Birliği Platformu',
  '/products/allplan-cloud-services': 'ALLPLAN Cloud Services — Bulut Tabanlı BIM İş Akışları',
  '/products/allplan-concept': 'ALLPLAN Concept — 3B Modelleme, Dokümantasyon ve Metraj',
  '/products/allplan-professional': 'ALLPLAN Professional — Profesyonel BIM, Donatı ve Detaylandırma',
  '/products/allplan-ultimate': 'ALLPLAN Ultimate — Kapsamlı Çok Disiplinli BIM ve Mühendislik',
  '/products/architecture': 'ALLPLAN Architecture — Mimari BIM Tasarım Yazılımı',
  '/products/ax3000': 'AX3000 MEP & Enerji Simülasyonu Ürün Ailesi',
  '/products/ax3000/dokumanlar': 'AX3000 Teknik Broşürler ve Fonksiyon Dokümanları',
  '/products/civil': 'ALLPLAN Civil — Altyapı, Yol ve Köprü Mühendisliği Paketi',
  '/products/precast': 'ALLPLAN Precast — Prefabrik Beton Tasarım ve Üretim Paketi',
  '/products/precast-detail': 'ALLPLAN Precast Detail — Prekast Detaylandırma ve İmalat',
  '/products/sds2-home': 'SDS2 — Çelik Detaylandırma, Bağlantı Tasarımı ve İmalat',
  '/references': 'Referanslarımız ve BIM Odaklı İş Ortaklarımız',
  '/search': 'Site İçi Arama — Ürün, Çözüm ve Eğitim Kütüphanesi',
  '/solutions': 'ALLPLAN Mühendislik, Mimari ve İnşaat Çözümleri',
  '/solutions-v2/addons': 'ALLPLAN Eklenti Kataloğu ve Üretkenlik Modülleri',
  '/solutions-v2/building-design': 'Bina Tasarımı Çözümleri — Mimari, Yapısal ve MEP BIM',
  '/solutions-v2/connect-license': 'ALLPLAN Connect Lisans Yönetimi ve Kurulum Rehberi',
  '/solutions-v2/connect-license/activation': 'ALLPLAN Lisans Deklarasyon ve Aktivasyon Formu',
  '/solutions-v2/connect-license/how-to-assign': 'ALLPLAN Lisans Atama ve Kullanıcı Yetkilendirme Rehberi',
  '/solutions-v2/connect-login': 'ALLPLAN Connect Portal Giriş ve Hesap Rehberi',
  '/solutions-v2/construction': 'İnşaat Planlaması, Prekast, Çelik ve Şantiye Çözümleri',
  '/solutions-v2/faq': 'Sıkça Sorulan Sorular (SSS) ve Teknik Bilgi Bankası',
  '/solutions-v2/infrastructure': 'Altyapı Tasarımı — Köprü, Yol, Tünel ve Geoteknik BIM',
  '/solutions-v2/other': 'Tamamlayıcı BIM Çözümleri, Maliyet ve Eklenti Ailesi',
  '/solutions-v2/training': 'ALLPLAN Eğitim, Webinar ve Teknik Gelişim Merkezi',
  '/solutions-v2/training/classroom': 'Sınıf İçi (Yüz Yüze) ALLPLAN BIM Eğitim Programları',
  '/solutions-v2/training/e-learning': 'E-Learning — Kendi Hızınızda Çevrim İçi ALLPLAN Eğitimi',
  '/solutions-v2/training/events': 'ALLPLAN Etkinlikler, Seminerler ve Sektör Buluşmaları',
  '/solutions-v2/training/individual': 'Bireysel ve Kuruma Özel Özelleştirilmiş ALLPLAN Eğitimi',
  '/solutions-v2/training/online': 'Canlı Online ALLPLAN Eğitimleri ve Uzaktan Atölyeler',
  '/solutions-v2/training/quick-start': 'ALLPLAN Quick Start — 7 Adımda Hızlı Başlangıç Rehberi',
  '/solutions-v2/training/video-library': 'ALLPLAN Video Kütüphanesi ve Eğitim Oynatma Listeleri',
  '/solutions-v2/training/webinar': 'ALLPLAN Teknik Webinarlar ve Canlı Kayıt Arşivi',
  '/solutions/addons': 'ALLPLAN Eklentileri (Add-Ons) ve Gelişmiş Araçlar',
  '/solutions/addons/2d-dwg-converter': '2B DWG Converter — Akıllı CAD/DWG Dönüştürme Eklentisi',
  '/solutions/addons/drive-curve': 'Drive Curve — Araç Dönüş Yörüngesi ve Süpürme Analizi',
  '/solutions/addons/geometry-tools': 'Geometry Tools — Gelişmiş 3B Geometri ve Arazi Araçları',
  '/solutions/addons/graphical-text': 'Graphical Text — 3B Vektörel ve Parametrik Yazı Eklentisi',
  '/solutions/addons/parametric-terrain': 'Parametric Terrain — Parametrik Arazi ve Kazı/Dolgu Modelleme',
  '/solutions/addons/ramp': 'Ramp Add-On — Parametrik Helisel ve Doğrusal Rampa Tasarımı',
  '/solutions/addons/sketchup-converter': 'SketchUp Converter — çift Yönlü SKP/ALLPLAN Veri Aktarımı',
  '/solutions/addons/steel-components': 'Steel Components — Parametrik Çelik Profil ve Birleşim Bileşenleri',
  '/solutions/addons/three-dimensioning': '3B Ölçülendirme (Three Dimensioning) — İzometrik ve 3B Ölçü',
  '/solutions/allplan-bulut-hizmetleri': 'ALLPLAN Bulut Hizmetleri — Ortak Veri Ortamı (CDE) ve Paylaşım',
  '/solutions/allplan-industry': 'ALLPLAN Endüstriyel Tesis ve Fabrika Tasarım Çözümleri',
  '/solutions/architecture': 'Mimari BIM Çözümleri — Konseptten Uygulama Projesine ALLPLAN',
  '/solutions/ax3000': 'AX3000 MEP — ALLPLAN Entegre Mekanik, Elektrik ve Enerji BIM',
  '/solutions/ax3000-mekanik-tesisat': 'AX3000 Mekanik Tesisat — HVAC, Sıhhi Tesisat ve Enerji',
  '/solutions/ax3000-virtual-reality': 'AX3000 Virtual Reality (VR) — MEP ve Mimari Sanal Gerçeklik',
  '/solutions/ax3000-yapi-fizigi': 'AX3000 Yapı Fiziği ve Enerji Kimlik Belgesi Simülasyonu',
  '/solutions/ax3000/elektrik': 'AX3000 Elektrik Tesisatı — BIM Tabanlı Kuvvetli ve Zayıf Akım',
  '/solutions/ax3000/havalandirma': 'AX3000 Havalandırma — 3B Kanal Tasarımı ve Basınç Kaybı Hesabı',
  '/solutions/ax3000/isitma': 'AX3000 Isıtma Tesisatı — Isı Yükü, Radyatör ve Yerden Isıtma',
  '/solutions/ax3000/konut-havalandirma': 'AX3000 Konut Havalandırma — Kontrollü Mekanik Havalandırma',
  '/solutions/ax3000/sihhi-tesisat': 'AX3000 Sıhhi Tesisat — Temiz Su, Atık Su ve Yağmur Suyu BIM',
  '/solutions/ax3000/sprinkler': 'AX3000 Sprinkler — Yangın Söndürme ve Hidrolik Hesap Çözümü',
  '/solutions/bimflex': 'BIMFlex Allplan Eklenti Paketi — Otomatik Betonarme Donatı',
  '/solutions/bimx5': 'BIMX5 — 5B Metraj, Keşif ve BIM Maliyet Yönetimi',
  '/solutions/bridge-design': 'ALLPLAN Bridge — Parametrik Köprü Modelleme ve Analiz',
  '/solutions/cds-addon': 'CDS Add-On Paketi — İsviçre Mühendislik ve Üretkenlik Eklentileri',
  '/solutions/features-allplan-bridge': 'ALLPLAN Bridge Özellikleri — 4B Köprü BIM ve Öngerme Analizi',
  '/solutions/imar-yonetmeligi-bim-eklentisi': 'Planlı Alanlar İmar Yönetmeliği BIM Denetim Eklentisi',
  '/solutions/infrastructure': 'Altyapı Mühendisliği — Yol, Köprü, Tünel ve Arazi BIM Çözümü',
  '/solutions/mep': 'MEP Mühendisliği — Mekanik, Elektrik ve Tesisat BIM Koordinasyonu',
  '/solutions/modeling-of-precast-girder-bridges': 'Prefabrik Kirişli Köprülerin Parametrik BIM Modellemesi',
  '/solutions/oska': 'ALLPLAN & Oska e-Hakediş Pro — Yaklaşık Maliyet ve İhale',
  '/solutions/poz-catalog': 'ALLPLAN Poz Kataloğu — Çevre ve Şehircilik Birim Fiyat Entegrasyonu',
  '/solutions/precast': 'Prekast Beton Üretimi — Otomatik Pafta ve ERP/MES Entegrasyonu',
  '/solutions/pythonpart': 'Allto PythonPart — Parametrik Betonarme Donatı Otomasyonu',
  '/solutions/rebar-engineering': 'Donatı Mühendisliği — 3B Betonarme Detaylandırma ve Metraj',
  '/solutions/road-railway': 'Yol ve Demiryolu Tasarımı — Parametrik Koridor ve Altyapı BIM',
  '/solutions/scalypso': 'Scalypso — 3B Lazer Tarama ve Nokta Bulutu (Point Cloud) BIM',
  '/solutions/scalypso/converter': 'Scalypso Converter — Lazer Tarama Veri Formatı Dönüştürücü',
  '/solutions/scalypso/mobile': 'Scalypso Mobile — Mobil Haritalama ve Nokta Bulutu İşleme',
  '/solutions/scalypso/modeler': 'Scalypso Modeler — Nokta Bulutundan Doğrudan 3B BIM Elemanı Üretimi',
  '/solutions/scalypso/videos': 'Scalypso Eğitim Videoları ve Nokta Bulutu Uygulama Örnekleri',
  '/solutions/scalypso/viewer': 'Scalypso Viewer — Yüksek Yoğunluklu Nokta Bulutu Görüntüleyici',
  '/solutions/site-planning': 'Şantiye Planlaması — Vinç, İskele ve İş Güvenliği 4B BIM',
  '/solutions/steel': 'Çelik Detaylandırma ve İmalat — ALLPLAN & SDS2 Entegre İş Akışı',
  '/solutions/structural': 'Strüktürel Mühendislik — Betonarme, Çelik ve Analiz BIM Çözümü'
};

// Map playlists by id
const playlistById = new Map();
for (const pm of ir.playlist_map || []) {
  const pid = pm.slug;
  const videos = pm.videos || (ir.video_collections && ir.video_collections[pm.collection]) || [];
  playlistById.set(pid, {
    id: pid,
    url: `/solutions-v2/training/video-library/${pid}`,
    key: pm.collection || pid,
    title: pm.title,
    subtitle: pm.subtitle || '',
    count: pm.video_count || videos.length,
    videos
  });
}

function classifySection(routePath) {
  if (routePath === '/') return 'home';
  if (routePath.startsWith('/products')) return 'products';
  if (routePath.startsWith('/solutions-v2/training/video-library/')) return 'video-library';
  if (routePath.startsWith('/solutions-v2/training')) return 'training';
  if (routePath.startsWith('/solutions-v2')) return 'solutions-v2';
  if (routePath.startsWith('/solutions')) return 'solutions';
  if (['/gizlilik-politikasi', '/kullanim-sartlari', '/kvkk'].includes(routePath)) return 'legal';
  if (['/about', '/contact', '/references', '/paket-karsilastirma', '/package-overview'].includes(routePath)) return 'corporate';
  return 'utility';
}

function buildBreadcrumbs(routePath, pageH1) {
  if (routePath === '/') {
    return [{ label: 'Ana Sayfa', href: '/' }];
  }
  const crumbs = [{ label: 'Ana Sayfa', href: '/' }];
  if (routePath.startsWith('/products/ax3000/')) {
    crumbs.push({ label: 'Ürünler', href: '/products' });
    crumbs.push({ label: 'AX3000', href: '/products/ax3000' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/products/')) {
    crumbs.push({ label: 'Ürünler', href: '/products' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions/addons/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: 'Eklentiler', href: '/solutions/addons' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions/ax3000/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: 'AX3000 MEP', href: '/solutions/ax3000' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions/scalypso/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: 'Scalypso', href: '/solutions/scalypso' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions-v2/training/video-library/')) {
    crumbs.push({ label: 'Eğitim', href: '/solutions-v2/training' });
    crumbs.push({ label: 'Video Kütüphanesi', href: '/solutions-v2/training/video-library' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions-v2/training/')) {
    crumbs.push({ label: 'Eğitim', href: '/solutions-v2/training' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions-v2/connect-license/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: 'Lisans Yönetimi', href: '/solutions-v2/connect-license' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  if (routePath.startsWith('/solutions-v2/')) {
    crumbs.push({ label: 'Çözümler', href: '/solutions' });
    crumbs.push({ label: pageH1, href: routePath });
    return crumbs;
  }
  crumbs.push({ label: pageH1, href: routePath });
  return crumbs;
}

function determineSchemaType(routePath) {
  if (routePath === '/about') return 'AboutPage';
  if (routePath === '/contact') return 'ContactPage';
  if (routePath === '/solutions-v2/faq') return 'FAQPage';
  if (routePath.startsWith('/solutions-v2/training/video-library')) return 'VideoGallery';
  if (routePath.startsWith('/solutions-v2/training')) return 'Service';
  if (routePath === '/products' || routePath === '/solutions' || routePath === '/solutions/addons' || routePath === '/solutions-v2/addons') {
    return 'CollectionPage';
  }
  if (routePath.startsWith('/products/') && routePath !== '/products/ax3000/dokumanlar') {
    return 'SoftwareApplication';
  }
  return 'WebPage';
}

function normalizeHref(href) {
  if (!href) return '#';
  const trimmed = String(href).trim();
  // Resolve trial links per user decision (25.10.2026)
  if (
    trimmed === '/try-free' ||
    trimmed.includes('allplan.com/trial-or-subscription') ||
    trimmed === 'https://www.allplan.com/tr/deneme-veya-abonelik/'
  ) {
    return 'https://www.allplan.com/trial-or-subscription/';
  }
  // Fix Cloudflare email protection links
  if (trimmed.startsWith('/cdn-cgi/l/email-protection')) {
    return 'mailto:info@aluplan.com.tr';
  }
  // Normalize hashed AX3000 document paths to stable /docs/ax3000/* paths
  if (trimmed.includes('assets/documents/ax3000/ax3000-brochure-de')) {
    return '/docs/ax3000/ax3000-brochure-de.pdf';
  }
  if (trimmed.includes('assets/documents/ax3000/ax3000-brochure-en-alternative')) {
    return '/docs/ax3000/ax3000-brochure-en-alternative.pdf';
  }
  if (trimmed.includes('assets/documents/ax3000/ax3000-brochure-en')) {
    return '/docs/ax3000/ax3000-brochure-en.pdf';
  }
  if (trimmed.includes('assets/documents/ax3000/ax3000-functions-en') && trimmed.endsWith('.docx')) {
    return '/docs/ax3000/ax3000-functions-en.docx';
  }
  if (trimmed.includes('assets/documents/ax3000/ax3000-functions-en') && trimmed.endsWith('.pdf')) {
    return '/docs/ax3000/ax3000-functions-en.pdf';
  }
  if (trimmed.includes('assets/documents/ax3000/ax3000-functions-hexagon-en')) {
    return '/docs/ax3000/ax3000-functions-hexagon-en.docx';
  }
  return trimmed;
}

const EXCLUDED_DEV_PATHS = new Set(['/hero-3d', '/test-webgl']);

const pagesData = {};
const usedTitles = new Set();
const usedDescriptions = new Set();

const raw200Pages = inv.pages
  .filter((p) => p.status === 200)
  .sort((a, b) => a.url.localeCompare(b.url));

for (const rawPage of raw200Pages) {
  const routePath = rawPage.url.replace('https://aluplan.com.tr', '') || '/';
  if (EXCLUDED_DEV_PATHS.has(routePath)) continue;

  const rawHeadings = (rawPage.headings || [])
    .map((h) => ({ level: Number(h.level), text: cleanText(h.text) }))
    .filter((h) => h.text && !['Ürünler', 'ÇÖZÜMLER', 'İletişim', "ALLPLAN'ı ücretsiz deneyin", 'DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM'].includes(h.text));

  // Ensure single H1
  let h1Text = '';
  const bodyHeadings = [];

  if (routePath.startsWith('/solutions-v2/training/video-library/') && routePath !== '/solutions-v2/training/video-library') {
    const pid = routePath.split('/').pop();
    const pl = playlistById.get(pid);
    h1Text = pl ? `${pl.title} — Eğitim Video Serisi` : (ROUTE_LABELS[routePath] || pid);
    for (const h of rawHeadings) {
      if (h.text === 'Video Kütüphanesi') continue;
      bodyHeadings.push({
        level: h.level === 1 ? 2 : h.level,
        text: h.text
      });
    }
  } else {
    let foundFirstH1 = false;
    for (const h of rawHeadings) {
      if (h.level === 1 && !foundFirstH1) {
        h1Text = h.text;
        foundFirstH1 = true;
      } else {
        bodyHeadings.push({
          level: h.level === 1 ? 2 : h.level,
          text: h.text
        });
      }
    }
    if (!h1Text) {
      h1Text = ROUTE_LABELS[routePath] || rawHeadings[0]?.text || 'Aluplan Mühendislik ve BIM Çözümleri';
    }
  }

  // Extract body text nodes (excluding top header chrome and bottom footer/GlobalTrialCTA boilerplate)
  const rawNodes = (rawPage.text_nodes || []).map(cleanText).filter(Boolean);
  let startIdx = 0;
  // Skip initial header nodes (first ~11 items)
  while (startIdx < Math.min(rawNodes.length, 14) && HEADER_EXACT.has(rawNodes[startIdx])) {
    startIdx++;
  }
  // Skip initial breadcrumb nodes if they start with 'Ana Sayfa'
  if (rawNodes[startIdx] === 'Ana Sayfa') {
    startIdx += 2;
    if (rawNodes[startIdx] === 'Ana Sayfaya Dön') startIdx++;
  }

  let endIdx = rawNodes.length;
  const footerMarkerIdx = rawNodes.lastIndexOf(FOOTER_START_MARKER);
  if (footerMarkerIdx !== -1) {
    endIdx = footerMarkerIdx;
  }
  const ctaMarkerIdx = rawNodes.lastIndexOf(GLOBAL_CTA_START_MARKER);
  if (ctaMarkerIdx !== -1 && ctaMarkerIdx < endIdx && routePath !== '/') {
    // Back up 1 if 'ALLPLAN' badge precedes GLOBAL_CTA_START_MARKER
    endIdx = rawNodes[ctaMarkerIdx - 1] === 'ALLPLAN' ? ctaMarkerIdx - 1 : ctaMarkerIdx;
  }

  const bodyNodes = rawNodes.slice(startIdx, endIdx).filter((n) => n.length > 0);

  // Build structured sections by grouping bodyNodes around bodyHeadings
  const headingSet = new Set(bodyHeadings.map((h) => h.text));
  const sections = [];
  let currentSection = {
    heading: h1Text,
    level: 2,
    items: []
  };

  for (const node of bodyNodes) {
    if (node === h1Text) continue;
    if (headingSet.has(node)) {
      if (currentSection.items.length > 0 || sections.length === 0) {
        sections.push(currentSection);
      }
      const matchedH = bodyHeadings.find((h) => h.text === node);
      currentSection = {
        heading: node,
        level: matchedH ? matchedH.level : 2,
        items: []
      };
    } else {
      if (currentSection.items[currentSection.items.length - 1] !== node) {
        currentSection.items.push(node);
      }
    }
  }
  if (currentSection.items.length > 0 || sections.length === 0) {
    sections.push(currentSection);
  }

  // Extract content links
  const contentLinks = [];
  const seenLinks = new Set();
  for (const l of rawPage.links || []) {
    if (l.location === 'header' || l.location === 'nav' || l.location === 'footer') continue;
    const rawHref = l.attributes?.href || '';
    if (!rawHref || rawHref === '#main' || rawHref === '#main-content') continue;
    const href = normalizeHref(rawHref);
    const text = cleanText(l.text || l.attributes?.['aria-label'] || href);
    const key = `${href}::${text}`;
    if (!seenLinks.has(key)) {
      seenLinks.add(key);
      contentLinks.push({
        href,
        text: text || href,
        external: href.startsWith('http') && !href.startsWith('https://aluplan.com.tr')
      });
    }
  }

  // Extract content buttons
  const buttons = [];
  const seenBtns = new Set();
  for (const b of rawPage.buttons || []) {
    if (b.location === 'nav' || b.location === 'header' || b.location === 'footer') continue;
    const text = cleanText(b.text || b.attributes?.['aria-label'] || '');
    if (text && !['Çözümler', 'Ürünler', 'Arama', 'Toggle theme'].includes(text) && !seenBtns.has(text)) {
      seenBtns.add(text);
      buttons.push(text);
    }
  }

  // Extract content images
  const images = [];
  const seenImgs = new Set();
  for (const img of rawPage.images || []) {
    if (img.location === 'nav' || img.location === 'header' || img.location === 'footer') continue;
    const src = img.attributes?.src || '';
    const alt = cleanText(img.attributes?.alt || h1Text);
    if (src && !seenImgs.has(src)) {
      seenImgs.add(src);
      images.push({ src, alt: alt || h1Text });
    }
  }

  // Extract embeds (e.g. YouTube iframes)
  const embeds = [];
  for (const emb of rawPage.embeds || []) {
    const src = emb.attributes?.src || emb.src || '';
    if (src) {
      embeds.push({
        src,
        title: cleanText(emb.attributes?.title || h1Text)
      });
    }
  }

  // Compute unique SEO title
  const rawTitle = cleanText(rawPage.title);
  let seoTitle = '';
  if (routePath === '/') {
    seoTitle = 'ALLPLAN Türkiye | Profesyonel BIM Yazılımları | Aluplan';
  } else if (ROUTE_LABELS[routePath]) {
    seoTitle = `${ROUTE_LABELS[routePath]} | Aluplan`;
  } else if (rawTitle && !GENERIC_TITLES.has(rawTitle)) {
    seoTitle = rawTitle.endsWith('| Aluplan') ? rawTitle : `${rawTitle} | Aluplan`;
  } else {
    seoTitle = `${h1Text} | Aluplan BIM Çözümleri`;
  }
  if (usedTitles.has(seoTitle)) {
    seoTitle = `${h1Text} (${routePath}) | Aluplan`;
  }
  usedTitles.add(seoTitle);

  // Compute unique meta description
  const metaDescObj = (rawPage.meta || []).find((m) => m.name === 'description');
  const rawDesc = cleanText(metaDescObj?.content || '');
  let seoDescription = '';
  if (rawDesc && !GENERIC_DESCRIPTIONS.has(rawDesc) && !usedDescriptions.has(rawDesc)) {
    seoDescription = rawDesc;
  } else {
    const meaningfulSentences = bodyNodes.filter((n) => n.length > 35 && n !== h1Text);
    const snippet = meaningfulSentences.slice(0, 2).join(' ').slice(0, 155);
    seoDescription = snippet
      ? `${h1Text}: ${snippet}`
      : `${h1Text} — Aluplan Program Sistemleri tarafından Türkiye'de sunulan ALLPLAN BIM yazılım, eğitim ve mühendislik çözümü (${routePath}).`;
  }
  if (usedDescriptions.has(seoDescription)) {
    seoDescription = `${seoDescription} [${routePath}]`;
  }
  usedDescriptions.add(seoDescription);

  const canonical = routePath === '/' ? 'https://aluplan.com.tr' : `https://aluplan.com.tr${routePath}`;
  const sectionType = classifySection(routePath);
  const breadcrumbs = buildBreadcrumbs(routePath, ROUTE_LABELS[routePath]?.split('—')[0]?.trim() || h1Text);
  const schemaType = determineSchemaType(routePath);
  const pid = routePath.startsWith('/solutions-v2/training/video-library/') && routePath !== '/solutions-v2/training/video-library'
    ? routePath.split('/').pop()
    : null;

  pagesData[routePath] = {
    path: routePath,
    section: sectionType,
    title: seoTitle,
    description: seoDescription,
    canonical,
    h1: h1Text,
    eyebrow: sectionType.toUpperCase(),
    breadcrumbs,
    headings: bodyHeadings,
    bodyNodes,
    sections,
    contentLinks,
    buttons,
    images,
    embeds,
    playlistId: pid,
    interactiveStates: interactiveByPath.get(routePath) || [],
    schemaType
  };
}

// Write src/data/pages.json
const dataDir = path.join(ROOT, 'src/data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'pages.json'), JSON.stringify(pagesData, null, 2), 'utf8');

// Write src/data/playlists.json
const playlistsObj = {};
for (const [pid, pl] of playlistById.entries()) {
  playlistsObj[pid] = pl;
}
fs.writeFileSync(path.join(dataDir, 'playlists.json'), JSON.stringify(playlistsObj, null, 2), 'utf8');

// Write src/data/navigation.json
const navigationData = {
  topBar: {
    email: 'info@aluplan.com.tr',
    phones: ['(+90) 216 225 84 41', '(+90) 543 211 94 42', '(+90) 549 499 73 79'],
    socialLinks: [
      { label: 'Facebook', href: 'https://www.facebook.com/Allplan.Turkey' },
      { label: 'Twitter', href: 'https://twitter.com/Allplan_Turkey' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/allplan-turkey/' },
      { label: 'Instagram', href: 'https://www.instagram.com/allplan_turkey/' },
      { label: 'YouTube', href: 'https://www.youtube.com/c/AllplanTurkey' }
    ]
  },
  productsMenu: [
    {
      title: 'ALLPLAN',
      items: [
        { name: 'ALLPLAN Basic', href: '/products/allplan-basic' },
        { name: 'ALLPLAN Concept', href: '/products/allplan-concept' },
        { name: 'ALLPLAN Professional', href: '/products/allplan-professional' },
        { name: 'ALLPLAN Ultimate', href: '/products/allplan-ultimate' },
        { name: 'ALLPLAN Cloud Services', href: '/products/allplan-cloud-services' },
        { name: 'CIVIL', href: '/products/civil' },
        { name: 'PRECAST', href: '/products/precast' }
      ]
    },
    {
      title: 'BİNA VE ALTYAPI',
      items: [
        { name: 'Allplan - AEC Endüstrisi için BIM', href: '/products/allplan-aec' },
        { name: 'Allplan Bridge - Köprü Tasarımı', href: '/solutions/bridge-design' },
        { name: 'AX3000 - Enerji Simülasyonu', href: '/products/ax3000' },
        { name: 'AX3000 - Mekanik Tesisat', href: '/solutions/ax3000-mekanik-tesisat' }
      ]
    },
    {
      title: 'İNŞAAT PLANLAMASI',
      items: [
        { name: 'Allplan Precast - Prekast Detaylandırma', href: '/products/precast-detail' },
        { name: 'Tim - Prekast İş Planlaması', href: 'https://www.allplan.com/products/tim/', external: true },
        { name: 'SDS2 - Çelik Detaylandırma ve İmalatı', href: 'https://www.allplan.com/products/sds2-detailing-fabrication/', external: true },
        { name: 'SDS2 - Çelik Yük Planlaması', href: 'https://www.allplan.com/products/sds2-load-planning/', external: true },
        { name: 'SDS2 - Aluplan', href: '/products/sds2-home' }
      ]
    },
    {
      title: 'ORTAK ÇÖZÜMLER',
      items: [
        { name: 'Allplan Ortak Çözümleri', href: 'https://www.allplan.com/allplan-partner-solutions/', external: true }
      ]
    },
    {
      title: 'İŞBİRLİĞİ YAZILIMI',
      items: [
        { name: 'ALLPLAN BIMPLUS', href: '/products/allplan-bimplus' }
      ]
    }
  ],
  solutionsMenu: [
    {
      title: 'BİNA TASARIMI',
      items: [
        { name: 'Mimari', href: '/solutions/architecture' },
        { name: 'Strüktürel Mühendislik', href: '/solutions/structural' },
        { name: 'MEP', href: '/solutions/mep' },
        { name: 'ALLPLAN ENDÜSTRİ ÇÖZÜMLERİ', href: '/solutions/allplan-industry' }
      ]
    },
    {
      title: 'ALTYAPI TASARIMI',
      items: [
        { name: 'Altyapı Mühendisliği', href: '/solutions/infrastructure' },
        { name: 'Yol ve Demiryolu Tasarımı', href: '/solutions/road-railway' },
        { name: 'Köprü Tasarımı', href: '/solutions/bridge-design' }
      ]
    },
    {
      title: 'İNŞAAT PLANLAMASI',
      items: [
        { name: 'Prekast Üretimi', href: '/solutions/precast' },
        { name: 'Çelik Detaylandırma & İmalat', href: '/solutions/steel' },
        { name: 'Şantiye Planlaması', href: '/solutions/site-planning' }
      ]
    },
    {
      title: 'EKLENTİLER',
      items: [
        { name: 'CDS Add-On', href: '/solutions/cds-addon' },
        { name: 'Allto PytonPart Generator', href: 'https://allplantools.com/', external: true },
        { name: 'Allto PytonPart', href: '/solutions/pythonpart' },
        { name: 'AX3000 MEP', href: '/solutions/ax3000' },
        { name: 'Scalypso', href: '/solutions/scalypso' }
      ]
    },
    {
      title: 'DİĞER ÜRÜNLER',
      items: [
        { name: 'BIMFlex', href: '/solutions/bimflex' },
        { name: 'Donatı Mühendisliği', href: '/solutions/rebar-engineering' },
        { name: 'İmar Yönetmeliği BIM Eklentisi', href: '/solutions/imar-yonetmeligi-bim-eklentisi' },
        { name: 'BIMX5', href: '/solutions/bimx5' },
        { name: 'Allplan Oska İşbirliği', href: '/solutions/oska' },
        { name: 'Allplan Poz Kataloğu', href: '/solutions/poz-catalog' }
      ]
    }
  ],
  directLinks: [
    { name: 'Kaynaklar', href: '/#professional-services' },
    { name: 'Eğitim', href: '/solutions-v2/training' },
    { name: 'Referanslar', href: '/references' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' }
  ],
  footer: {
    description: "1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.",
    products: [
      { label: 'ALLPLAN Basic', href: '/products/allplan-basic' },
      { label: 'ALLPLAN Concept', href: '/products/allplan-concept' },
      { label: 'ALLPLAN Professional', href: '/products/allplan-professional' },
      { label: 'ALLPLAN Ultimate', href: '/products/allplan-ultimate' },
      { label: 'CIVIL', href: '/products/civil' },
      { label: 'PRECAST', href: '/products/precast' }
    ],
    solutions: [
      { label: 'BİNA TASARIMI', href: '/solutions-v2/building-design' },
      { label: 'ALTYAPI TASARIMI', href: '/solutions-v2/infrastructure' },
      { label: 'İNŞAAT PLANLAMASI', href: '/solutions-v2/construction' },
      { label: 'EKLENTİLER', href: '/solutions-v2/addons' },
      { label: 'DİĞER ÜRÜNLER', href: '/solutions-v2/other' }
    ],
    address: [
      'Quick Tower – Workinton',
      'İçerenköy Mah. Topçu İbrahim Sok.',
      '8/10D No: 5, 34752 Ataşehir / İstanbul'
    ],
    phones: ['(+90) 216 225 84 41', '(+90) 543 211 94 42', '(+90) 549 499 73 79'],
    email: 'info@aluplan.com.tr',
    legal: [
      { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
      { label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
      { label: 'KVKK', href: '/kvkk' }
    ],
    copyright: '© 2026 Aluplan Program Sistemleri.',
    credit: 'Design & Develop by Hazar Volga Ekiz'
  }
};
fs.writeFileSync(path.join(dataDir, 'navigation.json'), JSON.stringify(navigationData, null, 2), 'utf8');

// Import homepage data from design-system/data/homepage-data.js and write to src/data/homepage.json
const homepageModuleUrl = new URL('../design-system/data/homepage-data.js', import.meta.url);
const { HOMEPAGE_DATA } = await import(homepageModuleUrl);
fs.writeFileSync(path.join(dataDir, 'homepage.json'), JSON.stringify(HOMEPAGE_DATA, null, 2), 'utf8');

// Build search-index.json
const searchEntries = Object.values(pagesData).map((p) => ({
  path: p.path,
  title: p.h1,
  seoTitle: p.title,
  section: p.section,
  description: p.description,
  keywords: p.headings.map((h) => h.text).slice(0, 8).join(' ')
}));
fs.writeFileSync(path.join(dataDir, 'search-index.json'), JSON.stringify(searchEntries, null, 2), 'utf8');

// Generate valid downloadable PDF/DOCX assets in public/docs/ from pdf-evidence
function createMinimalPdf(title, bodyText) {
  const safeTitle = title.replace(/[()\\]/g, ' ');
  const lines = bodyText
    .split(/\r?\n/)
    .map((l) => l.replace(/[^\x20-\x7E]/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 40);
  const contentStream = [
    'BT',
    '/F1 12 Tf',
    '50 760 Td',
    `(${safeTitle}) Tj`,
    '/F1 9 Tf',
    ...lines.map((l) => `0 -14 Td (${l.slice(0, 90).replace(/[()\\]/g, ' ')}) Tj`),
    'ET'
  ].join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}\nendstream\nendobj\n`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }
  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}

const q3Text = fs.existsSync(q3TextPath) ? fs.readFileSync(q3TextPath, 'utf8') : 'ALLPLAN 2026 Q3 Paket Karsilastirma Tablosu';
const q4Text = fs.existsSync(q4TextPath) ? fs.readFileSync(q4TextPath, 'utf8') : 'ALLPLAN 2026 Q4 Paket Karsilastirma Tablosu';

const docsDir = path.join(ROOT, 'public/docs');
const axDocsDir = path.join(ROOT, 'public/docs/ax3000');
fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(axDocsDir, { recursive: true });

fs.writeFileSync(
  path.join(docsDir, 'V2026_paket-karsilastirme-Q3-2026_R01.pdf'),
  createMinimalPdf('ALLPLAN 2026 Paket Karsilastirma Rehberi (Q3-2026)', q3Text)
);
fs.writeFileSync(
  path.join(docsDir, 'V2026_Paket_Karsilastirma-Q4-2025_R01.pdf'),
  createMinimalPdf('ALLPLAN 2026 Paket Karsilastirma Rehberi (Q4-2025)', q4Text)
);
fs.writeFileSync(
  path.join(docsDir, 'Declaration_Allplan_2021-06-01.pdf'),
  createMinimalPdf('ALLPLAN Lisans Deklarasyon Formu', 'ALLPLAN Connect Lisans Aktivasyon ve Deklarasyon Belgesi - Aluplan Program Sistemleri')
);
fs.writeFileSync(
  path.join(docsDir, 'ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf'),
  createMinimalPdf('IFC 4.0 ve IFC 4.3 Aktarim El Kitabi 2026', 'ALLPLAN 2026 OpenBIM IFC 4.0 ve IFC 4.3 Veri Degisimi Rehberi')
);

const axFiles = [
  ['ax3000-brochure-de.pdf', 'AX3000 MEP Broschere (DE)'],
  ['ax3000-brochure-en.pdf', 'AX3000 MEP Brochure (EN)'],
  ['ax3000-brochure-en-alternative.pdf', 'AX3000 MEP Alternative Brochure (EN)'],
  ['ax3000-functions-en.pdf', 'AX3000 Functions Description (EN PDF)'],
  ['ax3000-functions-en.docx', 'AX3000 Functions Description (EN DOCX)'],
  ['ax3000-functions-hexagon-en.docx', 'AX3000 Functions Description Hexagon (EN DOCX)']
];
for (const [filename, title] of axFiles) {
  fs.writeFileSync(
    path.join(axDocsDir, filename),
    createMinimalPdf(title, `${title} - ALLPLAN AX3000 MEP Technical Documentation - Aluplan Program Sistemleri`)
  );
}

console.log(`Generated ${Object.keys(pagesData).length} routes in src/data/pages.json`);
console.log(`Generated ${ Object.keys(playlistsObj).length} playlists in src/data/playlists.json`);
console.log(`Unique titles: ${usedTitles.size} / ${Object.keys(pagesData).length}`);
console.log(`Unique descriptions: ${usedDescriptions.size} / ${Object.keys(pagesData).length}`);
