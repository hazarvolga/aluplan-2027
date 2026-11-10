# Genel Denetim Raporu — Aluplan Akademi

Tarih: 2026-11-10 · Kapsam: 3 uygulamalı seri (Temel Modelleme 22, Arazi Modelleme 10, Lejant 10
= 42 ders) · Yöntem: toplu envanter (`ders_envanteri.py`) + alan bazlı istatistik + örnek ders
derin denetimi + canlı render (localhost:3001) + proje kurallarıyla (CLAUDE.md, hafıza, skill
ilkeleri) karşılaştırma.

---

## Özet

Dersler **anlatım kalitesi** açısından güçlü ve tutarlı: 42/42 derste kavram girişi, ölçülebilir
kazanımlar, DİKKAT tuzağı, ders-sonu doğrulama ("Doğru yaptıysanız…") ve çift dilli komut tablosu
var; içerik LearnNow arşivine dayanıyor, dil resmî "siz", anti-slop. Üstüne 35 derste çevrilmiş,
görselli **Derinlemesine** bölümü eklendi (341 inline görsel).

Ama projenin **kendi tanımladığı ders omurgasına** (skill ilkesi 2: *metin + ekran görüntüsü +
uygulama/quiz*) göre **omurganın üçüncü ayağı eksik**: hiçbir derste **uygulama görevi (0/42)** ve
**quiz (0/42)** yok. Buna üç sistemik eksik daha ekleniyor: adım-içi "beklenen sonuç" çok zayıf
(%7), adım görseli kapsamı düşük (%38) ve Derinlemesine ile eski kartın aynı anda görünmesi kafa
karıştırıyor.

**Sistemik puan (10 ölçüt ort.): ~17/30 → Düzeltme gerekli.** Güçlü anlatım, zayıf ölçme-uygulama.

---

## Güçlü yanlar (korunmalı)

| Alan | Kanıt |
|---|---|
| Didaktik iskelet tam | intro 42/42 · objectives 42/42 · pitfalls (DİKKAT) 42/42 · checkpoint 42/42 · commands 42/42 |
| Adım-içi "neden" | Rubrik pası sonrası çoğu adımda "çünkü/böylece" gerekçesi (ör. duvar önceliği 300/100, kaldırım +0,15 m bordür) |
| Grounded + terminoloji | İçerik `makaleler_tr/*.md` kaynaklı; `insaat-teknik-ceviri` ile Decke→döşeme, norm/kod aynen |
| Zengin derinleşme | 35 derste Derinlemesine, 341 görsel; FR/EN kaynaklar da çevrildi |
| Tutarlı sunum | Tek tasarım sistemi (token), monokrom + tek aksan; sidebar odak modu |
| Kalıcı guard | `check_deepdive_coverage.py` pnpm test'e bağlı |

---

## Sistemik bulgular (öncelik sırası)

### 1. 🔴 Uygulama görevi yok (0/42) — omurganın eksik ayağı
Hiçbir derste öğrencinin **kendi başına, adım adım tarif edilmemiş** yapacağı bir görev yok
(ölçüt 7 = 0). Projenin kendi ilkesi "omurga = metin + görsel + **uygulama**/quiz" diyor; şu an
ders "izlenen/okunan" kalıyor, beceri değil tanıdıklık üretiyor. Çözüm şablon düzeyinde: her derse
bir `exercise` alanı (görev metni + başlangıç dosyası/senaryo + beklenen sonuç görseli) + renderer.

### 2. 🔴 Quiz yok (0/42)
Kazanımların hiçbiri ölçülmüyor (ölçüt 8 = 0). Not: eski modül-tabanlı akademi içeriğinde quiz
VARDI (91 soru); yeni seri modeli (TM/Arazi/Lejant JSON) quizsiz. Bu bir **tutarsızlık** da. Çözüm:
`TmLesson`'a `quiz[]` alanı (kazanım-bağlı, çeldiricileri gerçek öğrenci hatasından, açıklamalı) +
renderer; eski quiz bileşeni örnek alınabilir.

### 3. 🟠 Adım-içi "beklenen sonuç" zayıf (%7)
Ders-sonu checkpoint 42/42 var ama adım/adım-grubu sonunda "ekranda şunu görmelisiniz" yalnızca
148 adımın 10'unda (%7). Rubriğin en sık eksik parçası bu; öğrencinin kendini kontrol etmesini
sağlayan tek şey. Çözüm: kritik adımların body'sine tek cümle beklenen-sonuç ekle (veya `steps`'e
`expected` alanı).

### 4. 🟠 Adım görseli kapsamı düşük (%38)
148 adımın 56'sı görselli. Kök neden belgeli: elimizde **TR-arayüz karesi yok** (dil manifesti:
TR 0 / DE 45 / FR 5 …). Başlangıç dersinde karar/arayüz gerektiren her adımda görsel beklenir
(ölçüt 6). Çözüm: ekibin Allplan TR arayüzünden toplu kare çekimi (ayrı iş, manifest hazır).

### 5. 🟠 Derinlemesine ↔ "Derinleşmek için" kartı ikiliği (UX)
Aynı Q&A içeriği hem Derinlemesine'de (çevrilmiş) hem eski kartta (ham) görünüyor; alt-bölüm
başlıkları kart başlıklarıyla birebir aynı olmadığı için öğrenci (ve test eden) "yedirilmemiş"
sanıyor. Çözüm: migrate edilen dersin kartını gizle ve/veya Derinlemesine başlıklarını kart
başlıklarıyla eşle (HANDOFF'ta açık karar).

### 6. 🟡 Önkoşul / ALLPLAN sürümü / başlangıç dosyası eksik
`sourceModule` var ama derslerde açık "ön koşul ders", "ALLPLAN sürümü", "başlangıç dosyası"
künyesi tutarlı değil. Yazılım eğitiminde sürüm ve başlangıç dosyası kritik (ölçüt 3).

---

## Örnek ders puanları (10 ölçüt × 0–3)

| Ders | Kaz | Yük | Bağlam | Akış | Adım | Görsel | Uyg | Ölçme | Teknik | Dil | TOP |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| TM 09 Duvar Oluşturma | 3 | 2 | 3 | 2 | 2 | 1 | 0 | 0 | 3 | 3 | **19/30** |
| TM 06 2B Düzenleme (genişletildi) | 2 | 2 | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 3 | **15/30** |
| Lejant 04 Hücre Tanımlama | 2 | 1 | 2 | 2 | 2 | 2 | 0 | 0 | 3 | 3 | **17/30** |

Ortak örüntü: **Uygulama ve Ölçme sütunları her derste 0.** Görsel sütunu seriye göre değişiyor
(TM adımlarında düşük, Lejant/Derinlemesine'de yüksek). Geri kalan ölçütler 2–3.

---

## Müfredat / kategorizasyon bulguları

- **Temel seviye aşırı yüklü.** Temel altında 3 modül + Temel Modelleme (22) + Arazi (10) ≈ 35
  birim. Skill ölçütü "modül başına 4–8 ders". Seriler kendi içinde kurs olsa da Temel'in kütlesi
  büyük; Arazi'yi ayrı bir "kurs/yol" olarak sunmak (seviye kartında zaten ayrı) yükü algıda
  azaltıyor — yapı doğru, etiketleme netleştirilebilir.
- **Erken başarı var.** TM ilk derslerinde öğrenci modele hızla başlıyor (iyi); arayüz turu tek
  derse sığdırılmış.
- **Araç-odaklı başlıklar sınırda.** "Duvar Oluşturma", "Döşeme Oluşturma" menü adı gibi ama
  "Oluşturma" eylemi taşıdığı için kabul edilebilir; istenirse işe göre ("Dış duvarları modelle")
  adlandırma önerilebilir — müfredat kararı, sana ait.
- **Quiz tutarsızlığı** (yukarıda) hem denetim hem müfredat sorunu: iki ders modeli farklı çıta.
- **Seviye/rol etiketi eksik.** Dersler seviyeye bağlı ama rol/disiplin (mimar / donatı müh. /
  altyapı) süzgeci yok; öğrenme yolları rol başına tanımlı değil.

---

## UX/UI bulguları (öncelik: ders sayfası)

| Bulgu | Önem | Not |
|---|---|---|
| Derinlemesine + kart ikiliği, başlık eşleşmemesi | Yüksek | Yukarıda #5; kart gizleme + başlık eşleme |
| Dar ekran (ALLPLAN yanında yarım ekran) doğrulanmadı | Yüksek | Yazılım eğitiminde mobil kadar kritik; ~720 px'te okunurluk test edilmeli |
| Ekran görüntüsü büyütme (lightbox) yok gibi | Orta | Küçük arayüz ayrıntıları için yakınlaştırma gerekir |
| Ders-içi içindekiler / ilerleme işareti | Orta | Uzun Derinlemesine'li derslerde konumlanma zor |
| Tamamlandı işareti / ilerleme kaydı | Orta | Öğrenci "neredeyim/ne kaldı" göremiyor (akademi henüz taslak) |
| Sidebar odak modu | ✓ iyi | Seri içinde yalnız o seri + geri link |

Not: Akademi `noindex` + flag arkasında taslak; ilerleme/sertifika/quiz akışları henüz yok.

---

## Proje kurallarıyla karşılaştırma

| Proje kuralı (CLAUDE.md / hafıza / skill) | Durum |
|---|---|
| Omurga = metin + ekran görüntüsü + **uygulama/quiz** | ⚠️ Metin+görsel var; **uygulama/quiz YOK** |
| Video yalnız destekleyici | ✓ media.videos destekleyici; gömme sınırlı |
| Teknik bilgiyi uydurma (LearnNow doğrula) | ✓ grounded |
| Dil "siz", terim parantezde | ✓ |
| Didaktik rubrik (kavram/adım-içi görsel/chunking/DİKKAT/doğrulama/proje bağı) | ✓ büyük ölçüde; **adım-içi görsel (%38) ve adım-içi beklenen sonuç (%7)** zayıf |
| Mevcut müfredata saygı, onaysız değiştirme | ✓ (bu rapor öneri; değişiklik yapılmadı) |
| Anti-slop (em-dash/LaTeX yok) | ✓ |

---

## Öncelikli öneriler (emek tahmini: K/O/B)

1. **(B) Uygulama görevi altyapısı + içerik.** `TmLesson.exercise` alanı + renderer; her derse
   gerçek-işe-benzer bir görev (başlangıç senaryosu + beklenen sonuç). Önce 3–4 pilot ders, onay,
   sonra yay. — *Omurganın eksik ayağı; en yüksek öğrenme etkisi.*
2. **(B) Quiz altyapısı + içerik.** `TmLesson.quiz[]` + renderer (eski quiz bileşenini örnek al);
   kazanım-bağlı, açıklamalı. Pilot → yay. — *İki ders modelinin çıtasını eşitler.*
3. **(O) Adım-içi beklenen sonuç.** Kritik adımlara tek cümle "ekranda şunu görürsünüz". Toplu,
   deterministik; mevcut checkpoint'ten türetilebilir.
4. **(O) Derinlemesine/kart ikiliği kararı.** Kartı gizle + başlıkları eşle (HANDOFF). — *Aktif
   kafa karışıklığını bitirir.*
5. **(O) Ders künyesi.** Her derse ALLPLAN sürümü + ön koşul ders(ler)i + başlangıç dosyası alanı.
6. **(B, ekip) Adım görselleri.** TR-arayüz kare çekimi (manifest hazır) — ayrı iş.
7. **(K) Dar ekran denetimi.** ~720 px'te ders sayfası okunurluk + görsel büyütme.

---

## Doğrulanamayan teknik ifadeler
Bu denetim mevcut içeriğin arşiv-dayanaklı olduğunu varsaydı (içerik `makaleler_tr` kaynaklı).
Tek tek ders doğrulaması ayrı bir ders-denetimi işidir; `[doğrulanmadı]` işareti bu turda
üretilmedi.

## Sonraki adım
Yukarıdaki 7 öneriden hangileriyle, hangi sırayla başlayalım? (Önerim: 4 → 3 → 2 → 1; önce aktif
UX sorununu ve ucuz kazanımları kapat, sonra quiz ve uygulama altyapısına geç.)
