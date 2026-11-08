# Aluplan Akademi — İçerik Veri Mimarisi (Tasarım Dokümanı)

> Taslak · 2026-11-08
> İlgili: [2026-11-08-akademi-redesign-design.md](2026-11-08-akademi-redesign-design.md) · müfredat [docs/curriculum/](../../curriculum/) · kod `src/data/akademi.ts`, `src/components/akademi/`

## 1. Amaç ve neden

Akademi sayfaları şu an iki ayrı yerden besleniyor: `src/data/akademi.ts` (ince: kod/başlık/saat/outcomes) sayfaları çiziyor; asıl zengin içerik `docs/curriculum/03-ders-planlari/*.md` içinde **düz metin/tablo** olarak duruyor (sayfalara bağlı değil). Kullanıcının paylaştığı "Ders Bilgi Kartı" mockup'ı (meta satırı, süre dağılımı, Bloom etiketli kazanımlar, dakika-bazlı akış, sürekli proje, ölçme/ödev/materyaller) bu zengin içeriği ister — ama veri yok.

Bu doküman **tek bir içerik veri mimarisi** kurar: tüm akademi sayfaları (landing, seviye, ve yeni **modül detay** sayfaları) tek doğruluk kaynağından render edilir. Kullanıcının isteği: mimari tüm akademiye uygulansın, tek kaynak olsun.

**Neden şimdi:** Kabuk + tasarım dili + aksan hazır (merge edildi). Zengin kartlar için veri katmanı eksik; onsuz modül detay sayfaları yapılamaz.

## 2. Hedefler / Hedef olmayanlar / Anti-hedefler

**Hedefler**
- Modül granülerliğinde yapılandırılmış içerik verisi (karar: modül = detay birimi; bkz. §4 analiz). Model `lessons[]` ile ileride ders düzeyine açık.
- Tek kaynak tüm akademi sayfalarını besler: landing (program özeti), seviye sayfaları (modül listesi + kazanımlar), **yeni modül detay sayfaları** (zengin bilgi kartı). **Karar (builder-check #2):** `akademi.ts` **tamamen bu modele taşınır ve emekliye ayrılır** (program içeriği hero/entryPaths/runningProject/lessonParts/certificate + level/track + `getAkademiLevel`/`akademiLevelSlugs` dahil); Overview/LevelDetail/kit yeni modeli okuyacak şekilde refaktör edilir. Tek kaynak hedefi bunu gerektiriyor; planda aşamalı yapılır (önce modül+detay, sonra program içeriği).
- İçerik **YAML** olarak repoda, "bizim" (kullanıcı+Claude) sürdürdüğümüz; şema-doğrulamalı; tipli TS'e derlenir (runtime parse yok).
- Mimari/editoryal tasarım dili + `--accent-akademi`; mobil; SEO/GEO (Course JSON-LD).

**Hedef olmayanlar (bu proje)**
- Ders düzeyi (modül → N ayrı ders) içerik üretimi — model açık bırakılır, içerik sonra.
- CMS — YAML sürdürülür, CMS sonraya (YAML → CMS köprüsü kolay).
- Bilgi bankası, hesap/bülten, indekslemeyi açmak.

**Anti-hedefler (başarısızlık)**
- Prose markdown'ı kırılgan parse etmek.
- Veriyi iki yerde tutup senkron kaçırmak.
- `akademi.ts` ince modelini sürdürüp zengin kartları yarım bırakmak.
- Token dışı renk; dark/light'ta kırılma; production'da akademi sızıntısı.

## 3. Kısıtlar

- Next.js 16 / React 19, `output: 'standalone'`, pnpm, statik üretim.
- Yalnız CSS token'ları (`check_component_colors.py`); yeni `--accent-akademi` kullanılır.
- Akademi tüm sayfaları `isAkademiEnabled()` arkasında, `robots noindex`, sitemap/nav/arama dışında; modül detay rotaları `generateStaticParams` üretimde `[]`, `dynamicParams=false`.
- Yeni bağımlılık minimal: YAML okuma build-time (Node'un `yaml` paketi veya mevcut araç); runtime'a YAML girmez.
- Kullanıcı kuralları: GUI>CLI, Türkçe, anti-slop, minimal/güvenli değişiklik, sır yok, her iş test sonrası main'e birleşir + restore tag.
- Mevcut `generate_site_data.py` deseni var (build-time veri üretimi) — buna benzer kurgu.

## 4. Granülerlik kararı (analiz — modül vs ders)

İçeriğe bakıldı: her modülün ders akışı tablosu **"bir oturum örneği"** olarak yazılı (B-M1 dahil). Yani modül başına **tek temsilî oturum** var, 12 ayrı ders değil. Mockup'ın tek 180 dk akışı = bir oturum.
- **Ders düzeyi:** mockup'a birebir ama içerik YOK; modülleri derslere bölüp her biri için yeni içerik üretmek gerekir — devasa, YAGNI'ye aykırı.
- **Modül düzeyi:** içerik birebir oturur (meta + kazanımlar + örnek oturum akışı + sürekli proje + ödev + ölçme + materyaller), sıfır yeni içerik.

**Karar: modül = detay birimi.** "Ders akışı" bölümü "örnek oturum" olarak sunulur. Model `module.lessons?: Lesson[]` ile ders düzeyine açık tutulur (bugün boş, sonra doldurulur).

## 5. Yaklaşımlar (veri kaynağı)

- **A — Modül başına yapılandırılmış JSON + stdlib şema doğrulayıcı (seçildi; format JSON'a güncellendi — planlama-anı kararı).** İçerik doğrudan `src/data/akademi-content/<code>.json` olarak repoda (projenin `pages.json` deseni). Elle yazılmış TS tipleri + ince bir loader (`src/data/akademi-content.ts`) modül JSON'larını statik import edip birleştirir ve tipli sunar (ayrı build adımı yok). Bir **Python stdlib doğrulayıcı** (`scripts/validate_akademi_content.py`, **yeni dep yok**) JSON'ları şemaya göre denetler, `pnpm test`'te çalışır. **YAML+PyYAML terk edildi:** projede Python dep yönetimi yok (requirements/pyproject yok), CI pip kurmuyor — PyYAML yeni altyapı borcu + "minimal dep"e aykırı olurdu. Prose markdown referans kalır. Artı: **sıfır yeni dep**, proje deseniyle birebir, tip-güvenli, tek kaynak, `lessons[]`'a açık, CMS'e köprü. Eksi: JSON yazımı YAML kadar şık değil (Claude yazar; ~12 dosya).
- **B — Markdown frontmatter (reddedildi).** Tek dosyada veri+metin; zengin veri frontmatter'ı şişirir, gray-matter bağımlılığı, prose gövde veriyle çakışır.
- **C — Prose parse (reddedildi).** Markdown insan-için; değişken tablolar, Bloom fiilin içinde, `[sürüme göre doğrula]` notları → kırılgan parser.

**Seçim gerekçesi:** A, "YAML'ı biz sürdürürüz" tercihine, güvenilirliğe ve tek-kaynak/CMS-köprü hedefine en uygun.

## 6. Kararlaştırılan model ve yapı

### 6.1 Veri modeli (tipler — alanlar şema ile doğrulanır)
- **Program:** hero, giriş yolları, sürekli proje, ders yapısı, sertifika, bilgi bankası notu (mevcut `akademi.ts` içerikleri buraya taşınır/bütünleşir).
- **Level:** number, **slug (semantik: temel/orta/ileri/uzman)**, title, role, shared, summary, (modules | tracks).
- **Module:** `code` (sayfada etiket), **`slug` (açıklayıcı, URL'de; başlıktan türetilir, seviye içinde benzersiz)**, `title`, `level`, `hours`, `format` (ör. "Hibrit"), `prerequisite` (önceki modül kodu/serbest metin), `summary`, `outcomes: { text, bloom, code }[]`, `concepts?: { term, desc, en }[]`, `sessionFlow: { time, phase, instructor, participant, material }[]` (örnek oturum), `durationSplit: { label, minutes }[]` (anlatım/uygulama/ölçme/bireysel), `runningProjectStep`, `homework?`, `assessment?` (quiz özeti), `materials?: string[]`, `proposed?`, `lessons?: Lesson[]` (ileriye açık).
- **Not (karar):** `durationSplit` 4 etiketle (**anlatım/uygulama/ölçme/bireysel**, mockup) **YAML'da elle yazılır**; markdown'daki Temas/Uygulama/Bireysel'den içerik aktarımında türetilir (ölçme dilimi = ders sonu quiz/değerlendirme payı). Hesaplama değil, yazılı veri — güvenilir.

### 6.2 İçerik hattı (karar — JSON-direct, planlama-anı)
- Kaynak = commit'li `src/data/akademi-content/<code>.json` (modül başına). TS loader (`src/data/akademi-content.ts`) statik import'la birleştirir + tipler; **üretici/build adımı yok**.
- **Doğrulama:** `scripts/validate_akademi_content.py` (Python **stdlib**, zod/PyYAML YOK) JSON'ları şemaya göre denetler (zorunlu alanlar, slug benzersizliği, süre toplamları, enum'lar); `pnpm test`'e eklenir. Eksik/yanlış → test fail.
- Not: Ayrı "generated" dosya yok (kaynak JSON zaten tüketilen veri), dolayısıyla drift sorunu yok; yalnız şema doğrulaması.

### 6.3 Sayfalar / rotalar
**URL yapısı — tam semantik, prefix yok (kullanıcı kararı, SEO/GEO için):**
- `/akademi` (landing): program özeti + seviye kartları — modelden.
- `/akademi/[seviye]` (seviye detay): seviye slug'ı **semantik** → `temel` / `orta` / `ileri` / `uzman` (mevcut `seviye-1..4` yerine; akademi noindex+linksiz olduğundan değiştirmek bedava). Modüller + kazanımlar; her modül detay sayfasına linklenir.
- **Yeni:** `/akademi/[seviye]/[modul]` modül detay (zengin bilgi kartı). Modül slug'ı **açıklayıcı** (başlıktan türetilen keyword-zengini slug, ör. `arayuz-ve-temel-gezinme`); **kod (M1) URL'de değil, sayfada görünür etiket**. `generateStaticParams` flag açıkken **12 modülün tümünü** üretir; L3 modülü track altında olsa da `(seviye, modul-slug)` ile çözülür, **track breadcrumb'da veriden türetilir**; slug seviye içinde benzersiz. `dynamicParams=false`. `/allplan` prefix'i **eklenmedi** (marjinal SEO faydası, geri-alması pahalı yapısal borç; ALLPLAN ağırlığı title/H1/JSON-LD'de taşınıyor).
- Hepsi flag-gated, noindex, Course JSON-LD (modül → Course).

### 6.4 Bileşenler
- Mevcut kit'e eklenecekler (redesign'da ertelenen): `DistributionBar`, `Timeline` (ders akışı), ve modül detay için `LessonInfoCard` düzeni (MetaRow + DistributionBar + kazanım listesi + Timeline + Callout + ölçme/ödev/materyaller).

## 7. Kullanıcı kararları (çözüldü)
- **URL:** tam semantik, prefix yok → `/akademi/temel/arayuz-ve-temel-gezinme` (seviye slug'ı temel/orta/ileri/uzman; modül slug'ı açıklayıcı; kod sayfada etiket). `/allplan` prefix'i eklenmedi. *(2026-11-08 kullanıcı onayı.)*
- **Prose markdown:** `03-ders-planlari/*.md` **referans olarak kalır** (sayfalarda gösterilmeyen temel kavramlar, adım adım yönerge, sık hatalar, eğitmen notları değerli). *(2026-11-08 kullanıcı onayı.)*

### Builder-check'ten gelip benim kararladığım noktalar (kullanıcı veto edebilir)
- **İçerik hattı:** JSON-direct (format YAML→JSON'a güncellendi) — kaynak `src/data/akademi-content/<code>.json`, TS loader birleştirir/tipler, Python **stdlib** doğrulayıcı `pnpm test`'te. **Sıfır yeni dep** (PyYAML terk edildi: proje Python dep yönetmiyor, CI pip kurmuyor).
- **akademi.ts:** tamamen taşınır/emekli (tek kaynak); tüketiciler refaktör (planda aşamalı).
- **Rota:** modül slug=kod (benzersiz), `generateStaticParams` 12 modül, track breadcrumb'da veriden.
- **durationSplit:** 4 etiket YAML'da elle yazılı (hesaplama değil).

## 8. Doğrulama ve teslim
- Şema doğrulama + `akademi:generate --check` (drift); token-only; typecheck; landmark/tek-main; flag-gating + noindex testleri; modül detay üretim-güvenliği (ayrı worktree build, sızıntı yok).
- Dark+light + mobil + reduced-motion; Course JSON-LD geçerliliği.
- Tam `pnpm test` + production build; restore tag; test sonrası main'e birleştir.

## 9. Yaklaşım onayı sonrası
Doküman onaylanınca `superpowers:writing-plans` ile uygulama planı çıkarılır.
