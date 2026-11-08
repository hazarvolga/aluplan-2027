# Aluplan Akademi — Yeniden Tasarım ve Kendi Kabuğu (Tasarım Dokümanı)

> Taslak · 2026-11-08 · Önceki kararlar: [2026-11-08-aluplan-akademi-plan.md](2026-11-08-aluplan-akademi-plan.md)
> Müfredat: [docs/curriculum/](../../curriculum/) · İlgili kod: `src/app/akademi/`, `src/components/sections/Akademi*`, `src/data/akademi.ts`

## 1. Amaç ve neden

Aluplan Akademi şu an sitenin genel kabuğu (SiteShell: ağır üst menü + footer) içinde, tek kolon, genel bileşenlerle çalışan bir taslak. Bu doküman, Akademi'yi **odaklı bir eğitim portalına** dönüştürür: kendi hafif kabuğu, sol müfredat gezinmesi ve mimari/editoryal bir tasarım dili.

**Neden şimdi:** Müfredat (00–10 + 12 ders planı) ve temel sayfalar (`/akademi`, `/akademi/seviye-1..4`) hazır. Kullanıcı sayfaları canlı görürken iki eksik netleşti: (1) genel bakış kartlarından seviyelere/akışa giriş zayıf, (2) kartlar başlığa bağlı, dağınık ve genel site kabuğu dikkat dağıtıyor. Kullanıcı "mimari uzmanlığa yakışır, premium ama slop olmayan" bir dil istiyor.

**Birincil hedef:** ALLPLAN kullanıcı sayısını artırmak (Akademi bir edinim kanalı). **İkincil:** eğitmenli eğitimlere sağlam, tutarlı bir altyapı.

## 2. Hedefler / Hedef olmayanlar / Anti-hedefler

**Hedefler**
- Akademi'ye kendi kabuğu: ince üst şerit + minimal footer + **sol müfredat sidebar'ı** (program geneli gezinme).
- Mimari/editoryal tasarım dili: monokrom mürekkep, hairline çizgiler, Manrope başlık + IBM Plex Mono kod/metadata, kare köşe, bol beyaz alan, güçlü tipografik hiyerarşi.
- **Paylaşılan kompakt bileşen kiti**: modül kartı (kod küçük ayrı etiket, başlık serbest, saat tek kez), seviye kartı, meta satırı, bölüm primitifleri. Overview + seviye sayfalarında ortak.
- Dark + light (tamamen token tabanlı, sabit renk yok).
- Mobil öncelikli, erişilebilir (WCAG), semantik HTML.
- Motion: mevcut CSS motion token'ları + ölçülü micro-interaction birincil; **yalnız 1–2 imza an için lazy-load GSAP**.
- SEO/GEO + performans temeli baştan: semantik yapı, `Course`/`ItemList` yapısal verisine hazır, düşük JS, iyi Core Web Vitals.

**Hedef olmayanlar (bu proje)**
- Ders düzeyi sayfalar (ders bilgi kartı tasarımı referans alındı ama sayfa üretimi sonraki faz).
- Bilgi bankası, hesap/senkron, bülten.
- İndekslemeyi açmak — Akademi `ALUPLAN_SHOW_AKADEMI` arkasında, launch'a kadar **noindex** ve sitemap/menü/arama dışında kalır.

**Anti-hedefler (başarısızlık sayılır)**
- Dört doygun renkli (mavi/yeşil/turuncu/mor) dolgu başlık, yuvarlak pill rozet yığını, gradyan — "AI slop" kurs-platformu hissi.
- Native scroll'u ele geçiren ağır efektler; INP/erişilebilirlik/performans bozulması.
- Sitenin mevcut tasarım sistemini veya (site) sayfalarını bozmak.
- Token dışı sabit renk/ölçü; dark/light'ta kırılan kart.

## 3. Kısıtlar

- Next.js 16 / React 19, `output: 'standalone'`, pnpm. Statik üretim.
- `scripts/check_component_colors.py`: literal renk yasak; yalnız CSS token'ları (`--surface-*`, `--text-*`, `--accent-*`, `--border-*`, `--space-*`, `--type-*`, `--font-*`, `--target-*`).
- Flag + noindex: `isAkademiEnabled()` (üretimde kapalı, `ALUPLAN_SHOW_AKADEMI=1` gerekmedikçe); seviye rotaları `generateStaticParams` üretimde `[]`, `dynamicParams=false`.
- Mevcut motion token sistemi reduced-motion'a saygılı; buna yaslan.
- Sıfır-runtime-bağımlılığı prensibi: tek yeni bağımlılık **GSAP**, yalnız lazy, imza anlar için. Lenis/React Bits yok.
- Kullanıcı kuralları: GUI > CLI, Türkçe, anti-slop, minimal/güvenli değişiklik, sır hardcode yok, **her iş testten sonra main'e birleştirilir + restore tag**.
- Coolify SHA-pin bug'ı: üretim dağıtımı ayrı; bu projenin tek güvenlik yükümlülüğü production'da Akademi'nin gizli kalması.

## 4. Yaklaşımlar

**Ortak teknik temel (karar):** Akademi'ye kendi kabuğunu vermek için App Router **route grubu** kullanılır. Sağlayıcıların bölünmesi (builder-check sonrası netleşti):

- **Kök `layout.tsx` (her iki grup için ortak):** `<html>/<body>`; **ThemeModeProvider** — dark/light mantığı (`data-mode` + `localStorage('aluplan-theme-mode')`) `SiteShell`'den buraya çıkarılır, böylece hem site hem Akademi aynı modu okur; **ConsentScripts + çerez/KVKK onay banner'ı** da `SiteShell`'den buraya çıkarılır (yasal zorunluluk — Akademi'de de görünmeli); `DebugOverlayController`. Kök artık `data-mode`'u sabitlemez; ThemeModeProvider yönetir (ilk render'da localStorage yoksa dark varsayılan, mevcut davranış korunur).
- **`(site)/layout.tsx`:** `SiteShell` (üst menü/footer + kendi tek `<main>`'i) + `SearchIndexProvider` (yalnız site araması; Akademi'ye gerekmez). Tüm mevcut site sayfaları bu gruba taşınır.
- **`akademi/layout.tsx` (top-level, `(site)` dışında):** ince header (logo→`/`, tek ikincil link, küçük tema toggle) + sol sidebar + minimal footer + kendi tek `<main>`'i. Route grupları URL'i değiştirmediğinden ve Akademi `(site)` dışında kaldığından **`/akademi` URL'i aynen korunur** ve SiteShell'i devralmaz.

Böylece site hiç bozulmadan Akademi ayrı kabuk kazanır, dark/light ve çerez onayı iki grupta da çalışır. (Alternatif — SiteShell içinde rota koşuluyla dallanma — reddedildi: SiteShell'i kirletir, kırılgan.)

- **A — Önce tasarım iskeleti (seçildi):** route grubu + Akademi layout + sidebar + paylaşılan bileşen kiti önce kurulur; ilk gerçek sayfa olarak overview erken bağlanır (kullanıcı erken görür), sonra 4 seviye sayfası kit üzerinden gelir. Tutarlılık, SEO ve performans baştan oturur. Dezavantaj: kit inene kadar görünür yeni çıktı az.
- **B — Sayfa sayfa dikey dilim (reddedildi):** overview uçtan uca bitirilir, sonra seviye sayfaları; iskelet yolda ortaklaşır. Hızlı görünür ilerleme ama bileşen tekrar işçiliği ve tasarım kayması riski — kalite/SEO çıtasıyla çelişir.

**Seçim gerekçesi:** Paylaşılan kit ve kabuk tek yerde oturunca dark/light, erişilebilirlik, yapısal veri ve performans bir kez doğru kurulur; "iki kez iş yapmama" isteğini A karşılar.

## 5. Kararlaştırılan tasarım

### 5.1 Kabuk ve gezinme
- **İnce üst şerit:** küçük "Aluplan Akademi" logosu → ana siteye döner (`/`); tek sessiz ikincil link **"ALLPLAN'ı keşfet" → `/products`**; ve **küçük bir tema (dark/light) toggle'ı** — Akademi'de SiteShell'in toggle'ı olmadığından, kullanıcı burada da mod değiştirebilsin (benim kararım; ortak ThemeModeProvider'ı çağırır, site ile aynı modu paylaşır).
- **Çerez/KVKK onayı:** kök ortak sağlayıcıdan gelir; Akademi sayfalarında da görünür (yasal).
- **Sol sidebar (program geneli gezinme):** 4 seviye → modüller; bulunulan seviye/modül vurgulanır (wayfinding aksanı). Masaüstünde sticky; **mobilde** mevcut sitenin gruplu çekmece (drawer) desenine uygun açılır panel. Klavye/odak erişilebilir (route değişince kapanma, Esc ile kapanış, odak yönetimi — mevcut mobil menü incelemesindeki a11y dersleri uygulanır).
- **Minimal footer:** yalnız KVKK/yasal ve ana siteye tek dönüş; pazarlama bloğu yok.

### 5.2 Tasarım dili
- Monokrom mürekkep (`--text-primary`, `--text-secondary`, `--accent-fg`), hairline (`--border-*`), kare köşe, bol beyaz alan.
- Tipografi: Manrope (başlık/display), **IBM Plex Mono** (kod/metadata: `M3B`, `B1.M2.D3`, saat) — teknik çizim anotasyonu.
- Dağılım/istatistik çubukları **gri tonlarda** (candy renk yok). Dolu renkli buton yerine metin-CTA (`Detayları incele →`) ya da tek aksan outline.
- **Wayfinding (Seçenek 2):** monokrom; yalnız **aktif** seviye/bölümde tek sessiz aksan (teal token, her iki modda okunur). Dört ayrı renk yok.

### 5.3 Paylaşılan bileşen kiti
- **Modül kartı (kompakt, ortak):** kod küçük ayrı etiket (başlıktan bağımsız), başlık serbest akar, kazanımlar sıkı checklist, saat **tek kez** (tek modüllü kolda kol toplamı tekrar edilmez; çok modüllü kolda modül saatleri + kol toplamı). Varyant yönü: "A — satır başlı / serbest başlık" (mockup'ta onaylanan yön). Overview + seviye sayfaları aynı bileşeni kullanır.
- **Seviye kartı:** iri mono numara (01–04), uppercase etiket (seviye · rol), başlık, cetvelli istatistikler (saat/modül), öne çıkanlar, metin-CTA. Aktifte wayfinding aksanı.
- **Meta satırı / bölüm primitifleri:** cetvelli key/value satırı, uppercase mikro-label, hairline bölüm başlıkları, hairline zaman çizelgesi, sürekli-proje callout (sol kenar aksanı).
- **Giriş yolu kartları → seviyelere link:** "Nereden başlamalısınız?" kartları ve adımları ilgili seviye sayfalarına bağlanır.

### 5.4 Motion
- Birincil: mevcut CSS motion token'ları + ölçülü micro-interaction (hover/focus, içerik reveal), `prefers-reduced-motion` tam destek.
- GSAP: yalnız 1–2 **imza an** (öneri: hero/başlık reveal ve/veya seviye zaman çizelgesinin çizilmesi), **dynamic import ile lazy**, ilk render/LCP'yi etkilemeden. Reduced-motion'da devre dışı.

### 5.5 SEO/GEO ve performans
- Semantik HTML (tek `<main>`, doğru başlık hiyerarşisi, `<nav>` sidebar, listeler).
- `Course` ve/veya `ItemList` JSON-LD yapısal verisi **hazır tutulur** ama launch'a (indeksleme açılana) kadar aktif edilmeyebilir — builder kararına bırakıldı.
- Düşük JS: statik üretim, token CSS, GSAP lazy. Görseller varsa optimize.
- Launch'a kadar: noindex, sitemap/nav/arama dışında.

## 6. Builder'a bırakılanlar
- Sidebar'ın tam etkileşimi (sticky/scrollspy ölçüleri, mobil drawer animasyonu) — mevcut mobil menü desenine uyarak.
- Hangi imza an(lar) GSAP alır (bütçe içinde, öneri verildi).
- `Course`/`ItemList` JSON-LD'nin tam şeması ve launch'ta mı açılacağı.
- Kit bileşenlerinin dosya bölünmesi (çok sayıda küçük dosya, <800 satır).
- Sidebar modül girişlerinin ders sayfaları olmadığından nereye bağlanacağı (şimdilik seviye sayfası içindeki ilgili modüle çapa/anchor).

## 7. Kullanıcı kararı (çözüldü)
- İnce header'daki tek ikincil link: **"ALLPLAN'ı keşfet" → ürünler** (`/products`). Edinim odaklı, birincil hedefe (ALLPLAN kullanıcı sayısı) hizmet eder. *(Kullanıcı 2026-11-08 onayı.)*

### Builder-check'ten gelip benim kararladığım noktalar (kullanıcı veto edebilir)
- **Tema/mod:** dark/light mantığı SiteShell'den kök **ThemeModeProvider**'a çıkarılır; site ve Akademi aynı modu paylaşır (tek kaynak), kök layout'a minimal dokunuş, iki mod da ayrı test edilir. Akademi header'ında küçük toggle.
- **Çerez/KVKK onayı:** ConsentScripts + banner kök ortak sağlayıcıya çıkarılır → Akademi'de de görünür. `SearchIndexProvider` yalnız `(site)`'te kalır.
- **Rota yapısı:** Akademi `(site)` grubunun dışında, top-level `/akademi` olarak kalır; URL korunur, SiteShell devralınmaz; her layout kendi tek `<main>`'ini sahiplenir.

## 8. Doğrulama ve teslim
- Token-only (`check_component_colors`), typecheck, landmark/tek-main, flag-gating + noindex testleri; yeni bileşen/sidebar için testler.
- Dark **ve** light + mobil (≤390px) + masaüstü dev server doğrulaması; `prefers-reduced-motion`.
- Tam `pnpm test` + ayrı worktree'de production build (seviye HTML'i sızmamalı).
- Restore tag; test sonrası main'e birleştir + push. Üretimde Akademi gizli kalır.

## 9. Yaklaşım onayı sonrası
Doküman onaylanınca `superpowers:writing-plans` ile uygulama planı çıkarılır (başka skill değil).
