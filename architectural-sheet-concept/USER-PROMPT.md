# ROL
Kıdemli bir art director, design engineer ve Next.js performans uzmanısın. şu aka kadar konuştuğumuz ALUPLAN için  için kurumsal web sitesi tasarlayıp kodlayacaksın.
üzerinde çalıştığımız design system (token'lar, bileşenler, tipografi) TEK DOĞRULUK KAYNAĞIDIR. Token dışı değer
uydurma; eksik bir şey gerekiyorsa önce gerekçesiyle öner, sonra kullan.

# TASARIM KONSEPTİ: "MİMARİ PAFTA"
Site, bir mimari proje paftası seti gibi davranmalı. Her sayfa/bölüm bir pafta, ziyaretçi bir çizim
setini inceleyen mimar gibi gezinmeli. Bu bir süsleme değil, bilgi mimarisinin kendisi olmalı.

Kullanılacak pafta dili (abartmadan, ölçülü):
- **Antet (title block):** Sağ alt köşede sabit veya bölüm sonlarında; firma, pafta adı, pafta no
  (A-101), ölçek, tarih, revizyon. Footer ve iletişim bölümü gerçek bir antet olarak tasarlanmalı.
- **Aks sistemi:** Kenarlarda ince aks çizgileri ve aks etiketleri (A, B, C… / 1, 2, 3…). Grid layout
  gerçekten bu akslara oturmalı.
- **Ölçü çizgileri:** Başlık, görsel veya kart genişliklerinde tick'li ölçü çizgileri ve küçük mono
  ölçü yazıları (dekoratif ama anlamlı: ör. "2.400" yerine gerçek bilgi taşıyabilir).
- **Kesit/detay işaretleri:** Bölüm başlıkları "KESİT B-B" / "DETAY 03" formatında; detay çağrı
  daireleri (üstte detay no, altta pafta no) tab ve akordiyonlara giriş noktası olarak kullanılmalı.
- **Çizgi kalınlık hiyerarşisi:** 0.25 / 0.5 / 1 px gibi 3 seviye; kalın çizgi = önemli sınır.
- **Tarama (hatch) desenleri:** Yalnızca vurgulanacak alanlarda, düşük opaklıkta, SVG pattern ile.
- **Kuzey oku, ölçek çubuğu, crop mark'lar, pafta indeksi:** Navigasyon bir "pafta listesi" olarak
  tasarlanmalı (01 Vaziyet Planı, 02 Ürünler, 03 Çözümler…).
- **Teknik yazı:** Etiketler, numaralar ve meta bilgiler monospace / teknik harf karakterinde,
  büyük harf, geniş harf aralığı.

# RENK
- Zemin: koyu antrasit (ör. #1A1C1E). Yüzey katmanları 2-3 ton açık antrasit (#212427, #2A2E32).
- Çizgiler: açık gri, düşük opaklık (ör. rgba(255,255,255,0.08–0.18)).
- Metin: kırık beyaz (#E6E4DF), ikincil metin #9A9EA3.
- Vurgu: turuncu skala (ör. #FF6A13 ana, #E2550A koyu, #FFA25C açık, #FF6A13 %10 opak zemin).
- KURAL: Turuncu ekranın %5-8'ini geçmemeli. Sadece: aktif durum, CTA, kesit işaretleri, kritik
  ölçü çizgisi, hover. Gradient yok (en fazla tek ton içinde çok hafif).
- Tüm kombinasyonlar WCAG AA'yı geçmeli; turuncu küçük gövde metninde kullanılmamalı.
- Design system'de bu token'lar farklı isimlendirildiyse onlara map et.

# TİPOGRAFİ
- Design system'deki fontları kullan. Yoksa öneri: başlıklar için karakterli ama teknik bir grotesk
  (ör. Archivo / Archivo Narrow), meta ve etiketler için mono (ör. IBM Plex Mono / JetBrains Mono).
- Inter, Poppins, Space Grotesk gibi "AI varsayılanı" fontları kullanma.
- Türkçe karakterler (ğ, ş, İ, ı) için latin-ext subset; `next/font` ile self-host, `display: swap`,
  fallback metrik ayarı (size-adjust) ile CLS = 0.
- Tip ölçeği akışkan (clamp), başlıklarda sıkı satır aralığı, gövdede 1.6.

# YASAKLAR: YAPAY ZEKA / SAAS KLİŞELERİ
Aşağıdakilerin HİÇBİRİ olmayacak:
- Ortalanmış dev başlık + iki buton + altında ürün ekran görüntüsü olan hero
- Mor/mavi gradient, glow blob'lar, glassmorphism, noise gradient arka planlar
- İkonlu 3'lü / 4'lü eşit "feature card" gridleri ve generic bento grid
- Her şeyde rounded-2xl, yumuşak gölgeler; (köşeler keskin veya 2px max olmalı, gölge yerine çizgi)
- "10.000+ mutlu müşteri" sayaçları, sahte testimonial, stok fotoğraf, emoji ikonlar
- Pricing tablosu şablonu, "Trusted by" gri logo şeridi (referanslar pafta mantığında sunulmalı)
- Her elementin fade-up ile girdiği tekdüze animasyonlar
- Anlamsız "Unlock / Supercharge / Seamless" tipi pazarlama dili
Her bölüm için kendine şunu sor: "Bu bölüm bir SaaS template'inde olabilir miydi?" Cevap evetse,
pafta diliyle yeniden tasarla. Asimetrik kompozisyon, aks hizalaması ve boşluk kullanımı cesur olmalı.

# HAREKET VE ETKİLEŞİM (smooth, ölçülü)
- Çizim efekti: SVG çizgileri scroll ile "çiziliyor" gibi belirsin (stroke-dashoffset). Bölüm başına
  en fazla bir kez.
- Parallax: Yalnızca 2-3 yerde, katmanlı çizimler (ör. plan katmanı, aks gridi, tarama katmanı farklı
  hızlarda). Maksimum yer değiştirme küçük tutulmalı, metin asla parallax olmamalı.
- Öncelik CSS scroll-driven animations (`animation-timeline: view()`), destek yoksa
  IntersectionObserver ile progressive enhancement. Ağır scroll kütüphanesi ve scroll-jacking yok.
- Sayfa geçişlerinde View Transitions API (pafta değiştirme hissi), desteklenmezse sessizce düşsün.
- Hover: çizgi kalınlaşması, turuncu ölçü çizgisinin uzaması, crosshair imleç vurgusu gibi teknik
  mikro etkileşimler. Süre 150-300ms, easing tutarlı (token olarak tanımla).
- `prefers-reduced-motion`'da tüm hareket kapanmalı, içerik tam görünür kalmalı.
- Yalnızca transform ve opacity animate edilsin; layout tetikleyen animasyon yok.

# DETAYLI BİLGİ ALANLARI: TAB VE AKORDİYON
- Tablar: Ürün karşılaştırma, modül detayları, disiplinlere göre çözümler (Mimari / Mühendislik /
  Altyapı / Prefabrik vb.). Tab başlıkları pafta sekmesi veya detay çağrı işareti görünümünde.
  - WAI-ARIA tabs pattern, ok tuşlarıyla gezinme.
  - TÜM panel içerikleri sunucuda render edilip DOM'da bulunmalı (SEO/GEO için); yalnızca görünürlük
    değişsin. Her tab URL hash veya query ile deep-link edilebilir olsun.
- Akordiyonlar: SSS, teknik gereksinimler, lisans/eğitim detayları. Native `<details>/<summary>`
  temelli, açılma animasyonu `interpolate-size` / grid-rows tekniğiyle, JS'siz çalışmalı.
  SSS akordiyonları FAQPage şemasıyla birebir eşleşmeli.

# SAYFA YAPISI (ANA SAYFA = PAFTA SETİ)
00 KAPAK PAFTASI: Hero yerine kapak paftası. Asimetrik başlık, sağ altta antet, arka planda tek bir
   ince çizilen aksonometrik/plan çizimi (SVG, hafif parallax). Tek net CTA.
01 VAZİYET PLANI: Firmanın ne yaptığının 3-4 cümlelik net tanımı (cevap-öncelikli metin), aks gridine
   oturan kısa bilgi blokları.
02 ÜRÜNLER: Tablı yapı; her yazılım için ne işe yarar, kimin için, öne çıkan yetenekler, sürüm.
03 ÇÖZÜMLER / DİSİPLİNLER: Kesit mantığında yatay bölümlenmiş anlatım.
04 DETAYLAR: Teknik gereksinimler, lisanslama, entegrasyonlar; detay çağrı işaretleriyle akordiyonlar.
05 REFERANS PROJELER: Bir çizim seti gibi; proje paftaları (proje adı, ölçek, yıl, kullanılan yazılım).
06 EĞİTİM VE DESTEK
07 REVİZYON TABLOSU: Haberler/sürüm notları revizyon tablosu formatında (Rev / Tarih / Açıklama).
08 ANTET / İLETİŞİM: Footer gerçek bir antet bloğu.
Alt sayfalar: /urunler/[slug], /cozumler/[slug], /referanslar/[slug], /egitim, /blog/[slug],
/iletisim. Her biri pafta numarası taşır ve breadcrumb pafta yolu gibi görünür.

# TEKNİK GEREKSİNİMLER
- Next.js (güncel stabil sürüm), App Router, TypeScript strict.
- Varsayılan Server Components; client component yalnızca etkileşimli adacıklarda (tab, mobil menü,
  form). Statik üretim + gerekli yerlerde ISR / revalidate.
- Styling: design system yaklaşımına uy (CSS variables token'ları + [Tailwind / CSS Modules]).
- SVG çizimler SVGO'dan geçmiş, mümkünse inline ve tekrar kullanılabilir bileşen
  (`<DimensionLine>`, `<AxisGrid>`, `<SectionMarker>`, `<DetailCallout>`, `<TitleBlock>`,
  `<HatchPattern>`, `<ScaleBar>`, `<NorthArrow>`).
- Görseller `next/image`, AVIF/WebP, doğru `sizes`, LCP görseli `priority`.
- Üçüncü parti scriptler (analitik vb.) `next/script` ile `lazyOnload` veya Partytown.

# PERFORMANS HEDEFLERİ (zorunlu)
- Lighthouse mobil: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- Core Web Vitals: LCP < 2.0 sn, INP < 200 ms, CLS < 0.05.
- İlk yükleme JS (gzip) < 90 KB; animasyon kütüphanesi gerekiyorsa yalnızca ilgili adacıkta dinamik
  import. WebGL/Three.js, video arka plan, Lottie yok.
- Font dosyaları preload, toplam font < 120 KB.

# SEO
- Metadata API ile sayfa bazlı title/description, canonical, Open Graph + Twitter kartları; OG
  görselleri `next/og` ile pafta temalı dinamik üretilsin.
- `lang="tr"`, çok dil varsa hreflang. `sitemap.ts`, `robots.ts`.
- Semantik HTML: tek h1, mantıklı başlık hiyerarşisi, `<main>`, `<nav>`, `<article>`, `<section>`
  aria-labelledby ile. Dekoratif SVG'ler `aria-hidden`.
- JSON-LD: Organization (+ LocalBusiness), SoftwareApplication/Product (her ürün için),
  BreadcrumbList, FAQPage (akordiyonlarla eşleşen), Course/Event (eğitimler), Article (blog).
- Türkçe anahtar kelime stratejisi: "[yazılım adı] fiyat", "[yazılım adı] eğitim",
  "BIM yazılımı", "mimari proje programı" gibi niyete göre sayfa eşleştirmesi; URL'ler Türkçe ve kısa.
- İç linkleme: ürün ↔ çözüm ↔ referans ↔ eğitim sayfaları arasında bağlamsal linkler.

# GEO (Generative Engine Optimization)
- Her sayfanın başında 2-3 cümlelik, alıntılanabilir, net "cevap paragrafı" (ne, kim için, neden).
- Varlıkları açık tanımla: firma, distribütörlük ilişkisi, yazılımlar, hizmet bölgesi; tutarlı
  isimlendirme.
- Karşılaştırma tabloları gerçek `<table>`; bilgi asla yalnızca görselde, canvas'ta veya
  JS ile sonradan gelen içerikte olmasın.
- Tarihli, kaynaklı, doğrulanabilir bilgiler (sürüm numaraları, sistem gereksinimleri, eğitim süreleri).
- Yazar/uzman sayfaları ve blog yazılarında yazar bilgisi (E-E-A-T).
- Kök dizinde `llms.txt` (site özeti + önemli sayfa linkleri).

# ERİŞİLEBİLİRLİK
- Klavye ile tam gezinme, görünür focus stili (turuncu, 2px, offset'li; pafta işaretleme diliyle).
- Kontrast AA, dokunma hedefleri ≥ 44px, skip-link.
- Dekoratif teknik yazılar ekran okuyucudan gizlensin; anlam taşıyanlar okunabilir kalsın.

# RESPONSIVE
- Mobilde pafta dili sadeleşsin ama kaybolmasın: aks etiketleri tek kenara iner, antet akordiyona
  döner, ölçü çizgileri kısalır, parallax kapanır.
- Breakpoint'ler design system'deki değerler. Yatay scroll yok.

# ÇALIŞMA SIRASI VE ÇIKTI
1. Önce kod yazmadan: tasarım gerekçesi (kısa), bölüm bölüm kompozisyon açıklaması ve klişelerden
   nasıl kaçındığın. Onayımı bekle.
2. Klasör yapısı, token eşlemesi ve pafta bileşen kütüphanesi.
3. Ana sayfa, ardından bir ürün detay sayfası (tablar + akordiyonlar + JSON-LD dahil).
4. Her adımın sonunda: yayınlanan JS boyutu tahmini, hangi bileşenlerin client olduğu ve neden,
   ve aşağıdaki kontrol listesinin durumu.

# KABUL KONTROL LİSTESİ
- [ ] Yasak listesindeki hiçbir kalıp yok
- [ ] Turuncu kullanımı %8'in altında, kontrastlar AA
- [ ] Tüm tab/akordiyon içerikleri SSR'da DOM'da
- [ ] JSON-LD şemaları geçerli (Rich Results Test)
- [ ] prefers-reduced-motion'da hareket yok
- [ ] Lighthouse ve CWV hedefleri karşılandı
- [ ] JS kapalıyken içerik okunabilir ve gezilebilir