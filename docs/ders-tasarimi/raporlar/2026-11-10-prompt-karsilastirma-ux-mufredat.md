# Prompt Karşılaştırmalı UX/Müfredat Denetimi — Aluplan Akademi

Tarih: 2026-11-10 · Yöntem: `allplan-ders-tasarimi` skill UX/UI denetimi + canlı ölçüm
(localstorage:3001, 375 / 720 / 1440 px) + kod incelemesi · Karşılaştırma kaynağı:
`allplan-egitim-nextjs-tasarim-promptu.md` (kök dizin).

**Mimari karar (kullanıcı, 2026-11-10):** Akademi **backend'siz, hesapsız, flag + noindex
arkasında statik** kalacak (seçenek a). Bu nedenle promptun **hesap / sunucu-quiz / sertifika /
giriş-kayıt / SEO-index** gerektiren maddeleri **kapsam dışı**; aşağıdaki denetim yalnız
**backend gerektirmeyen** (statik + localStorage + istemci) ölçütlere odaklanır.

İlke: önce rapor, sonra düzeltme. Bu belge öneridir; kod değiştirilmedi.

---

## Özet

Karar (a) altında prompt **çok iyi oturuyor**: istediklerinin neredeyse tamamı (katalog
sunumu, öğrenme yolları, ders sunumu, arama, ilerleme) backend olmadan da yapılabilir. Elden
çıkan tek şey hesaba bağlı olanlar: cihazlar arası senkron, doğrulanabilir sertifika, sunucuda
quiz değerlendirme — ve müfredat zaten sertifikayı "eğitmenli eğitimler"e yönlendirdiği için
bu tutarlı.

- **Ders sunumu: güçlü.** Promptun ders-sayfası listesinin ~%80'i karşılanıyor (bu oturumda
  omurga kapatıldı). Kalan boşluklar cila + birkaç UX özelliği; hepsi backend'siz.
- **Müfredat: iskelet sağlam, et dengesiz.** 4 seviye + modül + track yapısı promptun katalog
  niyetine uyuyor; ama içerik kütlesi Temel'de yığılı (temel-modelleme 22 + arazi 10 = 32
  birim), Orta ince (lejant 10), İleri/Uzman iskelet. Katalog filtresi, gerçek öğrenme yolu ve
  "kaldığın yerden devam" UX'i yok — hepsi statik yapılabilir.

---

## Canlı ölçüm (3 genişlik, ders sayfası)

| Ölçüt (prompt) | 375 px | 720 px (yarım ekran) | 1440 px |
|---|---|---|---|
| Yatay sayfa kaydırması YOK | ✅ | ✅ | ✅ |
| Gövde ≥16px | ✅ 16px | ✅ | ✅ |
| Satır başına 60–75 karakter | 37 (mobil, kabul) | ✅ **73** | ❌ **~100** (çok geniş) |
| Tablo/değer taşmıyor | ✅ | ✅ | ✅ |
| Tek h1 · "içeriğe atla" linki | — | — | ✅ / ✅ |
| Dokunma hedefi ≥44×44px | ❌ TOC 28, Tamamla 24 | (fare) | (fare) |
| İçindekiler yapışkan | statik | ❌ statik (yarım ekranda yapışkan olmalı) | ✅ yapışkan |

**Çıkarım:** Yarım ekran (720) düzeni birinci sınıf (73 krk, taşma yok) — promptun en çok
önemsediği senaryo iyi. İki gerçek sorun: tam ekranda okuma sütunu çok geniş, mobilde dokunma
hedefleri küçük.

---

## Ders sunumu — prompt maddesi bazında

| Prompt | Durum | Kanıt / not |
|---|---|---|
| Künye (seviye, süre, ön koşul, ALLPLAN sürümü, başlangıç) | ✅ | MetaRow; **rol** eksik |
| "Bu dersin sonunda" kazanımları | ✅ | objectives |
| Numaralı adım, tek eylem, arayüz adı belirgin | ✅ | steps + **kalın** |
| Her bölüm sonunda ayrışan "Beklenen sonuç" bloğu | 🟡 | cümle içinde (%76), ayrı blok değil |
| Girilecek değerler tek tıkla kopyalanır | ❌ | yok |
| Adım düzeyi tamamlama + kaldığın bölüme dön | ❌ | yalnız ders düzeyi "Tamamladım" (localStorage) |
| Ekran görüntüsü tıkla→tam boy, klavye kapanır | ✅ | LessonImage |
| Görsel zoom/pan + kırpılmış/işaretli | 🟡 | büyütme var; zoom/pan ve TR kare yok (ekip) |
| İçindekiler (geniş yapışkan / dar açılır) + konum "Modül · Ders x/y" + yapışkan önceki/sonraki | 🟡 | içindekiler var; **konum göstergesi ve yapışkan prev/next yok** |
| Kutular: ipucu/uyarı/sık hata/kendin dene | ✅ | pitfalls + exercise + Callout |
| Destekleyici video tıkla-yükle | ✅ | ConsentEmbed |
| Odak modu | ❌ | yok |
| Yazdır/PDF stili | ❌ | print CSS yok |
| Görsel width/height (CLS) | 🟡 | `<img>`'de boyut yok → düzen kayması riski |
| Okuma sütunu 60–75 krk | 🟡 | 1440'ta ~100 (`.steps max-width:52rem`) |
| Dokunma hedefi 44px | 🟡 | TOC/Tamamla mobilde <44px |

### Quiz (statik bağlamda)
| Prompt | Durum |
|---|---|
| Geri bildirim renk+simge+metin, açıklamalı | ✅ |
| İlerleme göstergesi | 🟡 "x/total yanıtlandı" (tek-soru akışı değil) |
| Tek soru/ekran | ❌ hepsi liste |
| Soru tipleri (çoklu seçim/sıralama/eşleştirme/tıkla) | ❌ yalnız çoktan seçmeli |
| Yanlışta ilgili ders bölümüne link | ❌ |
| Doğru cevap istemciye gitmez / sunucuda değerlendir | ❌ `"correct"` JSON'da → **karar (a)'da kabul edilen ödün** (öz-değerlendirme, notlandırma yok) |

---

## Müfredat — prompt maddesi bazında

| Prompt | Durum | Not |
|---|---|---|
| Seviye/modül yapısı | ✅ | 4 seviye + modül + İleri track'leri |
| Rol/seviye/süre filtreli katalog + URL state | ❌ | **statik yapılabilir** (istemci filtre + URL param) |
| Rol-bazlı öğrenme yolları (sıralı, toplam süreli, nerede olduğun) | 🟡 | overview'de 2 başlangıç personası var ("yeni başlıyorum" / "Revit-AutoCAD'den geliyorum") ama gerçek sıralı/ilerlemeli yol değil |
| Kurs sayfası: ders listesi, tamamlananlar işaretli, "kaldığın yerden devam" | 🟡 | liste var; **tamamlanan/resume localStorage'dan gösterilmiyor** (statik yapılabilir) |
| Kurs kartında ilerleme | ❌ | localStorage'dan okunabilir |
| Kilitli ders nedeni | ❌ | — |
| Sertifika | ⏸️ | **bilinçli olarak eğitmenli eğitimlere yönlendiriliyor** — karar (a) ile tutarlı |
| İçerik dengesi | ❌ | Temel dolu, Orta ince, **İleri/Uzman iskelet** → öğrenci Orta/İleri'de boşluğa düşer |

---

## Tasarım dili (prompt "kaçınılacak kalıplar" testi)

Prompt AI-slop kalıplarını yasaklıyor (gradient zemin, glass panel, parlayan kenar, ortalanmış
kahraman, üçlü ikon kartı, hap etiket, uydurma sayı, pazarlama dili, oyunlaştırma, paralaks).
**Bizim akademi bu testi geçiyor:** monokrom, tek aksan, token tabanlı, editoryal tipografi,
somut Türkçe metin, oyunlaştırma yok. "Logoyu kaldır, generic panel şablonuna benziyor mu?"
testinde akademi **özgün** duruyor.

---

## Öğrenci yolculuğu (statik senaryolar)

| Senaryo | Durum | Takılma |
|---|---|---|
| İlk gelen kendi seviyesine uygun başlangıcı bulur | 🟡 | overview personaları yardımcı; rol filtresi/yol yok |
| Dersi ALLPLAN yanında yarım ekranda okur, uygular | ✅ | 720px birinci sınıf |
| Quiz çözer, geri bildirim okur, sonraki derse geçer | ✅ | sonraki ders PrevNext'te |
| Ertesi gün döner, kaldığı yerden devam | ❌ | "kaldığın yerden devam" UX'i yok (localStorage var ama yüzeye çıkmıyor) |
| Belirli bir sorunun çözümünü arar | ❌ | akademiye özel arama yok |
| İlerlemesini görür | 🟡 | ders düzeyi "Tamamladım" var, panel/özet yok |

---

## Öneriler (karar a: backend yok — hepsi statik/localStorage/istemci)

### Kritik/Yüksek (öğrenme deneyimine doğrudan etki)
1. **"Kaldığın yerden devam" + tamamlanan işareti** — seri/seviye sayfalarında localStorage'dan
   okuyup tamamlanan dersleri işaretle, en belirgin eylem "devam et" olsun. *Backend yok.*
2. **Katalog filtresi (rol/seviye/süre) + URL state** — istemci filtre, paylaşılabilir adres.
3. **Gerçek öğrenme yolları** — rol/başlangıç bazında sıralı, toplam süreli, ilerleme gösteren
   statik yollar (mevcut 2 persona bunun çekirdeği).
4. **İçerik dengesi** — Orta/İleri/Uzman'ı ya doldur ya da net "yakında" etiketiyle dürüst
   göster; öğrenci boşluğa düşmesin. *(müfredat kararı, sana ait.)*

### Orta (ders sunumu cilası — backend'siz)
5. Adım düzeyi tamamlama + "kaldığın bölüme dön" (localStorage).
6. Okuma sütununu daralt (1440'ta ~100 krk → `.steps` max-width ~40rem ile ~70 krk).
7. "Beklenen sonuç"u her adım grubunda ayrışan bir bloğa taşı (şu an cümle içinde).
8. Kurs konumu "Modül · Ders x/y" + yapışkan önceki/sonraki.
9. Girilecek değer/kısayol için tek-tık kopyalama.
10. Dokunma hedeflerini 44px'e çıkar (TOC linki, Tamamladım), TOC statik breakpoint'ini düşür
    (yarım ekranda yapışkan kalsın).
11. Görsellere width/height (CLS), lightbox'a zoom/pan.
12. Odak modu + yazdır/PDF stili.

### İstemci arama (backend'siz)
13. Build-zamanı statik indeks üzerinde Türkçe-karakter toleranslı (i/ı/İ, ş/s) ders araması;
    DE/EN araç adlarıyla da sonuç.

### Kabul edilen ödünler (karar a gereği, düzeltme değil — not)
- Quiz "correct" istemcide: hesap/notlandırma yok, öz-değerlendirme; kabul.
- Cihazlar arası ilerleme senkronu ve doğrulanabilir sertifika: hesap gerektirir, kapsam dışı.

---

## Doğrulanamayan / ekip işi
- TR arayüz ekran görüntüleri (kırpılmış/işaretli): ALLPLAN gerektirir, ekip içerik işi
  (manifest hazır: `docs/akademi/step-image-language-map.md`).
- Orta/İleri/Uzman içerik hacmi: müfredat/içerik kararı.

---

## Ek: Referans bir deneme uygulamasından alınan statik-uyumlu desenler

Not: Aşağıdaki desenler, promptun tam (backend'li) bir uygulamasını denemek için **yerelde ayrı
geliştirilen bir deneme projesinden** gözlemlendi. O proje bu repoyla ilişkili değildir; yalnız
**backend gerektirmeyen** desenleri referans alınmıştır (hesap/rol/DB katmanı dışarıda). Tasarım
dili bizimkiyle uyumlu (editoryal, monospace etiket, pill çip; gradient/glass yok).

### A. Müfredat / katalog
- **Rol-bazlı sıralı öğrenme yolları:** disiplin başına (Mimar, Statik, Altyapı/Köprü, Prekast,
  BIM Yöneticisi, Teknik Ressam/Öğrenci) modül zinciri + toplam saat → statik veri + localStorage
  ilerleme.
- **URL-paylaşımlı filtreler** (`?seviye=L2&rol=…&sure=…`) — SSR query param, backend gerekmez.
- **"Somut Çıktı" (her modül/ders bir gerçek dosya/çıktı üretir):** `.ubx`, `.atpf`, BVBS `.abs`,
  DSTV NC, PXML, `.pyp`, IFC 4.3/IDS/BCF, ÇŞB e-PYS. Yetkinlik-temelli; içerik alanı.
- **Hedef roller** modül/ders etiketi.

### B. Ders sunumu
- **Sol yapışkan içindekiler + bölüm başına adım ilerlemesi** ("0/3 adım").
- **Adım düzeyi "Adımı İşaretle"** (bizde yalnız ders düzeyi).
- **Ders konumu "Ders 3/6" + ← modül** ve yapışkan önceki/sonraki.
- **Odak Modu (F)** + **Yazdır / PDF**.
- **Komut/menü/kısayol için ayrışan pill etiketleri** (kısayol vurgulu) — satır-içi **kalın**dan
  taranabilir; promptun "değerler ayrı biçimde" maddesi.
- **Ön koşul dersler = bağlantı**, **indirilebilir başlangıç dosyası (.zip)**, **"Neden önemli
  (gerçek proje bağlamı)" bloğu**, **şekilde kaynak atfı (LearnNow #) + zoom**.

### C. Çok dilli arama
- **TR/EN/DE, Türkçe-karakter toleranslı (i/ı/İ, ş/s, ğ/g…) arama** + her derste **EN/DE terim
  indeksi** → build-zamanı statik indeks, istemci arama.

---

## KARAR ve yol haritası (2026-11-10)

Kullanıcı kararı: **(2) statik-uyumlu desenleri 2027 akademiye taşı + (3) müfredat hizalama.**
Backend yok; hepsi statik / SSR query param / localStorage / istemci. Fazlar (öneri sırası):

**Faz A — Katalog & öğrenme yolları (en büyük boşluk):**
- A1. URL-filtreli katalog (seviye/rol/süre, SSR query param). *Kendi içinde tam, yüksek değer.*
- A2. Rol-bazlı sıralı öğrenme yolları (statik veri + localStorage ilerleme).
- A3. "Somut Çıktı" + hedef roller alanları.

**Faz B — Ders sunumu zenginleştirme:**
- B1. Komut/kısayol pill etiketleri (satır-içi bold yerine).
- B2. Adım düzeyi "Adımı İşaretle" + bölüm başına ilerleme (içindekilerde).
- B3. Ders konumu "Ders x/y" + yapışkan önceki/sonraki.
- B4. Odak Modu + Yazdır/PDF.
- B5. Ön koşul linkleri · indirilebilir başlangıç dosyası · "Neden önemli" bloğu · şekil kaynak atfı.
- B6. (UX bulguları) okuma sütununu daralt · görsel width/height (CLS) · dokunma hedefi 44px.

**Faz C — Çok dilli arama:** build-zamanı statik indeks + istemci arama (TR-toleranslı, EN/DE terim).

**Faz D — Müfredat hizalama (içerik/mimari, en büyük ve en riskli):**
- Mevcut 3 seri (temel-modelleme 22, arazi 10, lejant 10 = 42 ders) → 12-modül / 4-seviye /
  rol-yolu omurgasına haritalama. **Önce bir haritalama taslağı** (hangi ders hangi modül/seviye/
  role gidiyor) çıkar, kullanıcı onaylar, sonra uygula. Kör remap yapılmaz.

Öneri: **A1'den başla** (kendi içinde tam, backend'siz, en görünür kazanım); **D için önce
haritalama taslağı** üret, onaysız içerik yapısına dokunma.
