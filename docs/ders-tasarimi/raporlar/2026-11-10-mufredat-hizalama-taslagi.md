# Müfredat Hizalama Taslağı — 42 ders → 12 modül / 4 seviye / rol-yolları

Tarih: 2026-11-10 · Kapsam: 3 uygulamalı seri (temel-modelleme 22, arazi-modelleme 10,
lejant 10 = 42 ders) · Yöntem: `allplan-ders-tasarimi` skill kategorizasyon ölçütleri (6 eksen).

**Bu bir TASLAK ve öneridir** (skill ilkesi 1 + kategorizasyon kuralı): onaysız ders taşınmaz,
yeniden adlandırılmaz. **Kritik: hizalama bir METADATA + sunum katmanıdır** — ders
slug'ları ve `/akademi/<seri>/<ders>` URL'leri **değişmez**, localStorage ilerleme kayıtları
(slug'a bağlı) **kırılmaz**. Modül/rol gruplaması üstten eklenir.

---

## Özet

İyi haber: **12 modül / 4 seviye iskeleti kullanıcı tarafından zaten tanımlı**
(`src/data/akademi-content/M*.json`), ama bu modüllerin `lessons` alanı **boş (0)** — iskelet
var, et yok. 42 zengin ders ise ayrı 3 seride (`temel-modelleme`, `arazi`, `lejant`) ve bu
iskelete **bağlı değil**. İki içerik modeli (modül-JSON vs TmLesson-seri) paralel duruyor.

Hizalama bu ikisini birbirine bağlar: her seri dersini bir modül + seviye + rol(ler)e eşler.

**Bulgu:** 42 dersimiz **Temel + Orta mimari/dokümantasyon omurgasını (M1–M4B) ve arazi
girişini tam dolduruyor** → **Mimar** ve **Teknik Ressam/Öğrenci** yolları Temel-Orta'da
eksiksiz. Buna karşılık **İleri/Uzman ve disipline-özel modüller (M3B, M5, M6, M7, M8-ileri,
M9, M10) içerik boşluğu** — yani Statik/Altyapı/Prekast/BIM-Yöneticisi yolları kısmi.

---

## Mevcut modül iskeleti (akademi-content, lessons=0)

| Kod | Seviye | Başlık | Durum |
|---|---|---|---|
| M1 | Temel | Arayüz ve Temel Gezinme | ⬅ dolacak |
| M2 | Temel | Proje Yapısı, Yapı Yapısı ve Çizim Dosyaları | ⬅ dolacak |
| M3 | Temel | Parametrik Mimari Elemanlar ve Hacimler | ⬅ dolacak |
| M4 | Orta | 2B Dokümantasyon, Kesitler ve Pafta Düzeni | ⬅ dolacak |
| M4B | Orta | Kütüphane, Özellikler ve Metraj Listeleri | ⬅ dolacak |
| M3B | İleri | İleri Mimari Modelleme ve Sunum | 🔴 boşluk |
| M5 | İleri | Betonarme Yapılarda 3B Donatı | 🔴 boşluk |
| M6 | İleri | Çelik Yapı Tasarımı ve SDS2 | 🔴 boşluk |
| M7 | İleri | Prefabrik Elemanlar ve Üretim Verisi | 🔴 boşluk |
| M8 | İleri | ALLPLAN Civil ve Bridge ile Altyapı | 🟡 arazi girişi var, ileri boşluk |
| M9 | Uzman | Otomasyon, Visual Scripting ve PythonParts | 🔴 boşluk |
| M10 | Uzman | openBIM, IFC 4.3, IDS ve CDE | 🔴 boşluk |

---

## Önerilen hizalama — 42 ders

### temel-modelleme (22)

| # Ders | → Modül | Seviye | Rol(ler) | Alan | Not |
|---|---|---|---|---|---|
| 01 BIM Felsefesi | M1 | Temel | Herkes | Kavram/arayüz | |
| 03 Arayüz İncelemesi | M1 | Temel | Herkes | Arayüz/gezinme | |
| 05 2B Oluşturma | M1 | Temel | Herkes | 2B çizim | |
| 06 2B Düzenleme | M1 | Temel | Herkes | 2B düzenleme | |
| 02 Proje Oluşturma | M2 | Temel | Herkes | Proje yapısı | |
| 04 Çizim Dosyaları & Yükseklik | M2 | Temel | Herkes | Çizim dosyası/düzlem | |
| 08 Aks Oluşturma | M2 | Temel | Herkes | Referans ızgara | |
| 09 Duvar | M3 | Temel | Mimar, Statik | Yapı elemanı | |
| 10 Kapı/Pencere | M3 | Temel | Mimar | Yapı elemanı | |
| 11 Kolon/Kiriş | M3 | Temel | Mimar, Statik | Taşıyıcı eleman | |
| 12 Döşeme | M3 | Temel | Mimar, Statik | Taşıyıcı eleman | |
| 13 Merdiven | M3 | Temel | Mimar | Yapı elemanı | |
| 14 Temel | M3 | Temel | Mimar, Statik | Taşıyıcı eleman | |
| 15 Kat Kopyalama | M3 | Temel | Mimar | İş akışı | |
| 16 Çatı Elemanları | M3 | Temel | Mimar | Yapı elemanı | |
| 17 Mahaller | M3 | Temel | Mimar, BIM Yön. | Mahal/hacim | |
| 07 Ölçülendirme | M4 | Orta | Mimar, Teknik Ressam | Dokümantasyon | **Seviye notu:** seride erken (Temel) ama tema dokümantasyon; M4'e önerilir |
| 19 Görünüşler | M4 | Orta | Mimar, Teknik Ressam | İlişkisel görünüş | |
| 20 Kesitler | M4 | Orta | Mimar, Teknik Ressam | İlişkisel kesit | |
| 21 Kot/Etiket | M4 | Orta | Mimar, Teknik Ressam | Kot/etiket | |
| 22 Pafta & PDF | M4 | Orta | Mimar, Teknik Ressam | Pafta/çıktı | |
| 18 Çevre ve Arazi | → Arazi serisi / M8-giriş | Temel | Altyapı, Mimar | Arazi girişi | arazi serisiyle birleşir (yinelenme kontrolü) |

### arazi-modelleme (10) → Altyapı/Köprü yolu girişi (Temel-Orta)

| Ders | → Modül | Seviye | Rol(ler) | Not |
|---|---|---|---|---|
| 01–10 (giriş…binalar) | **Arazi Modelleme** (M8'in Temel-Orta girişi) | Temel-Orta | Altyapı/Köprü (+ Mimar vaziyet) | M8'in "İleri Civil/Bridge" kısmı boşluk; arazi serisi onun önkoşul/giriş tabanı |

**Karar gerek:** Arazi (giriş/Temel) ile M8 (İleri Civil/Bridge) arasında seviye farkı var.
Öneri: Arazi'yi ayrı bir "Arazi Modelleme" modülü (Temel-Orta) olarak tut, M8'i onun üstünde
İleri devam olarak bırak (içerik gelince). Alternatif: arazi'yi M8'in alt-bölümü yap.

### lejant (10) → M4B (Kütüphane, Özellikler, Metraj — Orta)

| Ders | → Modül | Seviye | Rol(ler) | Not |
|---|---|---|---|---|
| 01–06 (mimari lejant: parçalar, hücre, oluşturma, test) | M4B | Orta | Mimar, Teknik Ressam, BIM Yön. | Mahal/doğrama metraj lejantı |
| 07–10 (donatı lejantı: tasarım, hücre, oluşturma, test) | M4B (→ M5 köprü) | Orta | Statik/Donatı | Donatı metraj; M5 (3B donatı) geldiğinde ona bağlanır |

---

## Boşluklar (içerik yok → "yakında" / ekip)

| Modül | Boşluk | Kaynak var mı (LearnNow) |
|---|---|---|
| M3B İleri Mimari/Sunum | Tüm içerik | Arşivde var (render, sunum) |
| M5 Betonarme 3B Donatı | 3B donatı modelleme (lejant yalnız metraj tarafı) | Arşivde var (donatı) |
| M6 Çelik/SDS2 | Tüm içerik | Arşivde kısmi |
| M7 Prefabrik | Tüm içerik | Arşivde var (Precast) |
| M8 Civil/Bridge (İleri) | Arazi üstü ileri civil/bridge | Arşivde var |
| M9 Otomasyon/PythonParts | Tüm içerik | Arşivde var |
| M10 openBIM/IFC | Tüm içerik | Arşivde var (IFC 4.3, IDS) |

**Dürüstlük ilkesi:** Boş modüller "yakında" etiketiyle açıkça gösterilmeli; öğrenci Orta/İleri'de
boşluğa düşmesin.

---

## Rol-bazlı öğrenme yolları (mevcut içerikle)

| Rol | Yol (modül zinciri) | Kapsam |
|---|---|---|
| **Mimar** | M1→M2→M3→M4→M4B (→M3B yakında) | ✅ Temel-Orta tam |
| **Teknik Ressam / Öğrenci** | M1→M2→M3→M4→M4B | ✅ tam |
| **Statik / Donatı** | M1→M2→M3(duvar/kolon/kiriş/temel/döşeme)→M4B(donatı lejantı) (→M5/M6 yakında) | 🟡 kısmi |
| **BIM Yöneticisi** | M1→M2→M3(mahal)→M4B(metraj) (→M9/M10 yakında) | 🟡 kısmi |
| **Altyapı / Köprü** | M1→M2→Arazi serisi (→M8 ileri yakında) | 🟡 giriş tam, ileri boşluk |
| **Prekast** | M1→M2→M3 (→M7 yakında) | 🔴 çoğu boşluk |

Ortak "temel" bölüm (M1-M2-M3) tüm yolların paylaştığı çekirdek — kategorizasyon ilkesine uygun.

---

## Uygulama planı (backend'siz, slug korunur)

1. **Hizalama metadata'sı:** Her TmLesson'a `moduleCode` + `levelSlug` + `roles[]` alanı ekle
   (veya ayrı bir `akademi-mufredat-haritasi.ts` kayıt tablosu — slug → {modül, seviye, roller}).
   *Ders JSON'una eklemek en co-located; kayıt tablosu en az dokunuşlu.* Öneri: kayıt tablosu.
2. **Modül detay sayfaları** (`/akademi/[seviye]/[modul]`) zaten var; haritadan beslenip
   modülün derslerini (artık boş değil) listeler.
3. **Katalog + rol filtreleri** (Faz A) bu metadata üstüne kurulur.
4. **Rol-yolları** (Faz A) bu haritadan üretilir; localStorage ilerleme slug'a bağlı kalır.
5. Boş modüller "yakında" durumuyla render; yol kartlarında "x/y ders hazır" dürüst sayaç.
6. **Hiçbir slug/URL değişmez**; yönlendirme gerekmez, ilerleme kaydı korunur.

## Açık kararlar (kullanıcıya)
- **07 Ölçülendirme** M4'e (Orta) mi taşınsın, yoksa seri sırası için Temel'de mi kalsın (yalnız
  etiket Orta)? (Seri akışı bozulmasın diye: yerinde kalsın, modül etiketi M4 olsun.)
- **Arazi**: ayrı "Arazi Modelleme" modülü mü, M8 alt-bölümü mü?
- **18 Çevre-Arazi** (temel-modelleme) ile arazi serisi girişi arasındaki yinelenme: biri
  diğerine yönlendirilsin mi?
- Modül kodları (M1…M10) korunsun mu, yoksa seri adlarıyla mı (temel-modelleme…) sunulsun?
