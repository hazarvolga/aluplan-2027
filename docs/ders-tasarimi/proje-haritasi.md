# Proje Haritası — Aluplan Akademi (ders tasarımı için)

Son güncelleme: 2026-11-10. Bu harita `allplan-ders-tasarimi` skill'i için ortak hafıza.

## Ne tür platform
Next.js 16 (App Router, Turbopack, pnpm) tabanlı ALLPLAN Türkçe eğitim sitesi. Akademi bölümü
`ALLPLAN_SHOW_AKADEMI` bayrağı (`isAkademiEnabled()`, `src/lib/release-flags.ts`) arkasında,
`noindex`. Hedef: eğitmensiz, kendi kendine ilerlenen **öğrenci dersi** modeli; dil resmî "siz".

## Ders içeriği nerede, hangi biçimde
Dersler **commit'li JSON**. Üç uygulamalı seri:
- `src/data/temel-modelleme/NN.json` (22 ders) → Temel seviye · `/akademi/temel-modelleme`
- `src/data/arazi-modelleme/NN.json` (10 ders) → Temel · `/akademi/arazi-modelleme`
- `src/data/lejant/NN.json` (10 ders) → Orta · `/akademi/lejant`
Her serinin loader'ı: `src/data/<seri>.ts` (tip: `TmLesson`). `_index.json` = müfredat indeksi
(gerçek ders değil; envanter script'i bunları da sayar, yok say).

### TmLesson alanları (src/data/temel-modelleme.ts)
`no, slug, title, duration, sourceModule, intro?, objectives[], steps[]{time,heading,body,figures[]},
pitfalls?[]{title,body}, checkpoint?, commands[]{name,menu,shortcut,desc}, media{videos,pdfs,samples},
articles[]{id,title,body,figures[]}, deepDive?{blocks[]{type:heading|text|image}},
quiz?[]{id,prompt,options[{text,correct}],explanation,bloom?,difficulty?,outcomeCode?},
exercise?{task,startFile?,expected,hint?}`
- `body` içinde `**kalın**` ve `` `kod` `` → `withEmphasis()` render eder.
- `articles` = "Derinleşmek için" kartı (ham KB Q&A). `deepDive` = "Derinlemesine" (çevrilmiş,
  görselli; alt-bölüm başlıkları kart başlığıyla birebir eşli). İkisi şu an BİRLİKTE görünür
  (kart gizleme kararı: "şimdilik dursun").
- `quiz` = "Kendinizi sınayın" (42 derste ~3 grounded soru; `AkademiQuiz` bileşeni).
- `exercise` = "Şimdi siz deneyin" uygulama görevi (42 derste; görev + beklenen sonuç + ipucu).
- `deepDive.title` KALDIRILDI; Derinlemesine bölüm başlığı sabit "Sık karşılaşılan durumlar".

## Müfredat yapısı
Seviyeler: Temel / Orta / İleri / Uzman (`src/data/akademi-content.ts`, `akademiProgram.levels`).
Temel ve Orta altında modüller (Arayüz, Proje Yapısı, Parametrik Elemanlar vb. — tekil sayfa) +
uygulamalı seriler (registry: `AkademiSidebar.tsx` `AKADEMI_SERIES`, `AkademiLevelDetail.tsx`
`SERIES_CARDS`). İleri/Uzman çoğunlukla iskelet.

## Renderer / bileşenler
- Ders detay: `src/components/sections/TmLessonDetail.tsx` (+ `.module.css`). Bölümler: hero +
  künye (MetaRow: seviye/süre/ön koşul/başlangıç/sürüm), **LessonToc** (yapışkan ders-içi
  içindekiler + scroll-spy + "Tamamladım" localStorage), "Neler yapacaksınız", "Adım adım"
  (steps + figures), checkpoint, "Takılırsanız" (pitfalls), **"Şimdi siz deneyin"** (exercise),
  **"Kendinizi sınayın"** (quiz → AkademiQuiz), ilgili video, "Komut..." (CommandTable),
  **Derinlemesine** (deepDive), **Derinleşmek için** (articles kartı), PDF/örnek, PrevNext.
- Kit bileşenleri: `LessonImage` (tıkla-büyüt lightbox; MediaDialog), `LessonToc` (içindekiler
  + ilerleme), `MetaRow` (künye), `AkademiQuiz` (quiz). `level`/`allplanVersion` propları
  seri sayfalarından geçer (lejant "Orta", diğerleri "Temel").
- Seri genel: `TmOverview.tsx`. Sidebar: `AkademiSidebar.tsx` (seri içinde **odak modu**:
  yalnız o serinin dersleri + geri link). Seviye: `AkademiLevelDetail.tsx`.
- Tasarım sistemi: token tabanlı (`pnpm styles:check`, `check_component_colors.py` — bileşen
  CSS'inde literal renk yok). Tek aksan: `--accent-akademi`. Monokrom, mimari/editoryal dil.

## Kaynak arşivi (teknik doğrulama için)
LearnNow export: `/Users/hazarvolgaekiz/dev/lab/scrapling/exports/allplan_learnnow/<kurs>/`
(`makaleler_tr/de_*.md` = tam KB Q&A; `dersler/*.md` = ders kitabı; `assets/screenshots/`).
Görseller `public/akademi/<seri>/` altına kopyalı.

## Denetim / guard script'leri
- `pnpm test` zinciri: unittest + search:check + source-contract + parity + styles:check +
  `scripts/check_deepdive_coverage.py` (her detaylı Soru/Cevap için Derinlemesine alt-bölüm şart).
- `scripts/check_component_colors.py`, `design-system/scripts/token-tests.mjs`.

## Çeviri
`insaat-teknik-ceviri` skill (DE/EN/ES/FR→TR; Decke→döşeme, armature/Bewehrung→donatı; norm/kod
aynen; ondalık virgül; terim parantezde).

## Önemli kısıtlar
Onaysız push/deploy yok · canlıya alınmadı (flag+noindex) · anti-slop (em-dash/LaTeX yok) ·
grounded (uydurma yok) · fazlar halinde commit + restore tag.

## Açık konular (bkz. docs/akademi/HANDOFF.md)
Derinlemesine/kart ikiliği (başlık eşleşmesi + kart gizleme kararı) · görselsiz adımlar için
TR-arayüz kareleri (toplu iş) · Fransızca görsellerin TR muadili (toplu iş).
