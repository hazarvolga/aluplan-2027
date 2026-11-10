# Geliştirme Değerlendirmesi — Aluplan Akademi (2. tur)

Tarih: 2026-11-10 · Kapsam: 3 uygulamalı seri (Temel Modelleme 22, Arazi 10, Lejant 10 = 42
ders) · Yöntem: güncel envanter + canlı UX denetimi (localhost:3001, 768 px yarım ekran) +
ders-denetimi ve ux-ui ölçütleri · Önceki rapor: `2026-11-10-genel-denetim.md`.

İlke: **önce rapor, sonra düzeltme.** Bu belge öneridir.

> **UYGULANDI (2026-11-10, kullanıcı onayı "uygula hepsini"):** Aşağıdaki fırsatların
> tamamı 6 fazda uygulandı ve commit'lendi (restore tag'leri alındı):
> - ✅ #7 Derinlemesine başlık cilası (`restore/akademi-derin-baslik-cila-20261110`)
> - ✅ #3 Görsel büyütme / lightbox — `LessonImage` (`restore/akademi-lightbox-20261110`)
> - ✅ #6 Ders-içi içindekiler + ilerleme — `LessonToc` (`restore/akademi-toc-ilerleme-20261110`)
> - ✅ #4 Ders künyesi — hero MetaRow (`restore/akademi-kunye-20261110`)
> - ✅ #1 Quiz — 42 derste 126 grounded soru (`restore/akademi-quiz-42-20261110`)
> - ✅ #2 Uygulama görevi — 42 derste (`restore/akademi-exercise-42-20261110`)
> - ⏸️ #8 Kart ikiliği: kullanıcı "şimdilik dursun" dedi.
> - 👥 #5 TR arayüz kareleri: ALLPLAN'ı kullanmayı gerektirir; EKİP işi, manifest hazır.
>
> Doğrulama: tsc, source-contract (4 rota), parity 52/52, styles 47/47, component-colors,
> deepdive guard — hepsi temiz. Canlıya alınmadı (flag + noindex). Önceden var olan,
> ilgisiz: `test_iframes_only_in_consent_embed` (video gömme; ayrı iş).

---

## Özet

Önceki genel denetimden bu yana iki ucuz kazanım kapandı:
- **Adım-içi beklenen sonuç: %7 → %76** (113/148 adım). Rubrik ölçüt 5'in en sık eksik parçası.
- **Başlık eşleme:** Derinlemesine alt-bölüm başlıkları kart makale başlığıyla birebir (106
  maddenin 94'ü), 4 Almanca başlık Türkçeleştirildi. Kart ↔ Derinlemesine "yok" algısı bitti.

Dersler **anlatım** açısından güçlü ve tutarlı kalıyor (intro/objectives/pitfalls/checkpoint/
commands 42/42, 35 derste 342 görselli Derinlemesine). Geriye kalan geliştirmeler iki başlıkta
toplanıyor: **(A) omurganın eksik ayağı — ölçme ve uygulama**, ve **(B) ders sayfası UX
cilası — görsel büyütme, içindekiler/ilerleme.**

## Güncel metrikler

| Ölçüt | Durum | Not |
|---|---|---|
| intro / objectives / pitfalls / checkpoint / commands | 42/42 | tam |
| adım-içi beklenen sonuç | 113/148 (%76) | ✅ bu oturumda kapandı |
| Derinlemesine olan ders | 35/42 · 342 inline görsel | zengin |
| başlık eşleşmesi (kart ↔ Derinlemesine) | 94/106 | ✅ kalan 12 bilinçli (eklenti/dup) |
| **quiz alanı olan ders** | **0/42** | 🔴 omurganın ayağı eksik |
| **uygulama (exercise) alanı olan ders** | **0/42** | 🔴 omurganın ayağı eksik |
| adım görselli | 56/148 (%37) | 🟠 TR arayüz karesi yok (ekip işi) |
| ders künyesi (sürüm/önkoşul/başlangıç dosyası) | sürüm 16/42 · önkoşul 5/42 | 🟠 tutarsız |
| görsel büyütme (lightbox) | yok (18 görsel, 0 zoom) | 🟠 UX |
| ders-içi içindekiler / ilerleme işareti | yok | 🟠 UX |

---

## Geliştirme fırsatları (öncelik sırası)

### 1. 🔴 Quiz (ölçme) — 0/42
Hiçbir kazanım ölçülmüyor (rubrik ölçüt 8 = 0). Not: eski modül-tabanlı akademide quiz **vardı
(91 soru)**; yeni seri modeli quizsiz — bu bir **tutarsızlık**. Çözüm şablon düzeyinde:
`TmLesson.quiz[]` alanı (kazanım-bağlı, çeldiriciler gerçek öğrenci hatasından, her seçenek
açıklamalı) + renderer. Eski quiz bileşeni örnek alınabilir. Emek: Büyük. Pilot 3-4 ders → onay
→ yay.

### 2. 🔴 Uygulama görevi (exercise) — 0/42
Öğrencinin kendi başına, adım adım tarif edilmemiş yapacağı görev yok (ölçüt 7 = 0). Skill
ilkesi 2: "omurga = metin + görsel + **uygulama**/quiz". Şu an ders "izlenen/okunan" kalıyor,
beceri değil tanıdıklık üretiyor. Çözüm: `TmLesson.exercise` alanı (görev metni + başlangıç
senaryosu/dosyası + beklenen sonuç görseli) + renderer. Emek: Büyük. Pilot → yay.

### 3. 🟠 Görsel büyütme (lightbox) yok — UX, kanıtlı
Canlı: ders sayfasındaki 18 görselin hiçbiri tıklanabilir/zoom değil (`cursor:zoom-in` 0).
Yazılım dersinde öğrenci küçük arayüz ayrıntısını (menü yolu, palet) okumak zorunda; büyütme
olmadan görsel işlevini göremiyor. Çözüm: görsellere tıklayınca açılan hafif bir lightbox
(tasarım sistemine uygun, tek bileşen; tüm `figure` ve Derinlemesine `image` bloklarını kapsar).
Emek: Orta.

### 4. 🟠 Ders künyesi tutarsız — sürüm / önkoşul / başlangıç dosyası
`sourceModule` var ama açık **ALLPLAN sürümü** (16/42), **ön koşul ders** (5/42) ve **başlangıç
dosyası** künyesi tutarsız. Yazılım eğitiminde sürüm ve başlangıç dosyası kritik (ölçüt 3).
Çözüm: `TmLesson`'a `prerequisite?`, `allplanVersion?`, `startFile?` alanları + hero'da küçük
künye şeridi. Veri çoğu derste kaynaktan türetilebilir. Emek: Orta.

### 5. 🟠 Adım görseli kapsamı düşük — %37
148 adımın 56'sı görselli. Kök neden belgeli: elimizde **TR arayüz karesi yok** (manifest:
`docs/akademi/step-image-language-map.md`; TR 0 / DE 45 / FR 5). Başlangıç dersinde karar/arayüz
gerektiren her adımda görsel beklenir (ölçüt 6). Çözüm: ekibin ALLPLAN TR arayüzünden toplu kare
çekimi (ayrı iş, manifest hazır). Ara çözüm: uygun DE/dil-nötr kareleri daha çok adıma, dil
notuyla yerleştirmek.

### 6. 🟠 Ders-içi içindekiler + ilerleme/tamamlandı işareti yok — UX
Canlı: ne bölüm içindekiler listesi ne ilerleme/tamamlandı işareti var. Uzun Derinlemesine'li
derslerde öğrenci "neredeyim / ne kaldı" göremiyor. Çözüm: yapışkan ders-içi içindekiler
(adımlar + Derinlemesine başlıkları) ve ders-sonu "tamamlandı" işareti (akademi taslak olduğu
için ilerlemeyi localStorage ile hafif tutmak yeterli). Emek: Orta.

### 7. 🟡 Derinlemesine başlık tekrarı — cila
Başlık eşlemeden sonra bazı derslerde `deepDive.title` (ör. "Mevcut Duvara Isı Yalıtımı") hemen
altındaki ilk kart-başlığıyla (ör. "Tadilat Planlaması - Mevcut Bir Duvar...") neredeyse
çakışıyor. Çözüm: `deepDive.title`'ı tek alt-bölümlü/çakışan derslerde kaldırmak ya da yalnızca
"Derinlemesine" etiketini bırakmak. Emek: Küçük (deterministik, scriptle).

### 8. 🟡 Kart ikiliği — ertelendi (kullanıcı kararı)
Başlıklar artık eşleştiği için eski "Derinleşmek için" kartı çift içerik. Kullanıcı "şimdilik
dursun" dedi. Kaldırma kararı verildiğinde migrate edilen 35 dersin kartı tek renderer
koşuluyla gizlenebilir; eşleşmeyen 12 madde (6 eklenti + video + 5 dup) "Destekleyici kaynak"
olarak ayrı sunulabilir.

---

## Müfredat / kategorizasyon notları
- **Temel seviye yükü** hâlâ yüksek (Temel Modelleme 22 + Arazi 10). Yapı doğru (seviye kartında
  ayrı kurslar); etiketleme netleştirilebilir.
- **Rol/disiplin süzgeci yok** (mimar / donatı / altyapı). Öğrenme yolları rol başına tanımlı
  değil — ileri bir iyileştirme.
- **Quiz tutarsızlığı** (madde 1) hem denetim hem müfredat sorunu: iki ders modeli farklı çıta.

## Önerilen sıra
Önce ucuz ve kanıtlı UX kazanımları, sonra omurga:
**7 (başlık cilası) → 3 (lightbox) → 6 (içindekiler/ilerleme) → 4 (künye) → 1 (quiz) → 2
(uygulama) → 5 (TR görseller, ekip).**
Gerekçe: 7/3/6/4 küçük-orta ve hemen görünür değer; 1/2 büyük altyapı, pilotla gidilmeli; 5 ekip
bağımlı.
