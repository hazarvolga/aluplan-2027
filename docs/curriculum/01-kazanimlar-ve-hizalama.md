# 01 — Kazanımlar ve Hizalama

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı · Taslak 2026-11-08

Bu dosya, programın öğrenme kazanımlarını (learning outcomes) tanımlar ve her kazanımı bir öğrenme
etkinliği ile bir ölçme aracına bağlar (Yapısal Hizalama / Constructive Alignment, Biggs). Kazanım
kodları soru bankasını, rubrikleri ve ders planlarını birbirine bağlar.

## Kodlama sistemi

- **Seviye:** B (Başlangıç/Temel), O (Orta), İ (İleri), U (Uzman)
- **Kazanım kodu:** `K-<seviye><modül no>.<sıra>` — ör. `K-B1.2` = Başlangıç, Modül 1, 2. kazanım
- **Ders kodu:** `<seviye>.M<modül>.D<ders>` — ör. `B.M1.D1`

Kazanım fiilleri Revize Bloom Taksonomisi'ne göre seçilmiştir; seviye ilerledikçe fiiller yükselir
(hatırlama → yaratma). "Öğrenir / bilir / kavrar" gibi ölçülemeyen fiiller kullanılmaz.

---

## Program düzeyi kazanımlar (PK)

Programı tamamlayan katılımcı:

- **PK-1** ALLPLAN'da nesne tabanlı, parametrik bir bina modelini baştan sona **oluşturur**.
- **PK-2** Modelden kesit, görünüş, pafta ve metraj dokümantasyonunu **üretir**.
- **PK-3** Seçtiği disiplinde (mimari, betonarme, prefabrik/çelik veya altyapı) ileri düzey model
  **geliştirir**.
- **PK-4** openBIM (IFC/BCF) ile disiplinler arası koordinasyonu **yürütür** ve model kalitesini
  **denetler**.
- **PK-5** Tekrar eden işleri görsel programlama ve PythonParts ile **otomatikleştirir**.
- **PK-6** Çalışmasını ofis standartlarına ve ilgili teslim kurallarına uygun **düzenler**.

---

## Seviye 1 — Temel (BIM Uygulayıcısı)

**Seviye kazanımı:** Katılımcı ALLPLAN arayüzünde gezinir, proje yapısını kurar ve parametrik
mimari elemanlarla ilk bina modelini oluşturur.

### Modül M1 — Arayüz ve temel gezinme
- **K-B1.1** ALLPLAN arayüzünün ana bölümlerini (menü, araç paletleri, pencere yönetimi) **tanımlar**.
- **K-B1.2** Temel gezinme ve görünüm kontrolü araçlarını **kullanır**. `[sürüme göre doğrula]`
- **K-B1.3** CAD ve BIM arasındaki farkı, nesne tabanlı modellemenin mantığını **açıklar**.

### Modül M2 — Proje yapısı, yapı yapısı ve çizim dosyaları
- **K-B2.1** Proje, yapı yapısı (building structure) ve çizim dosyası (document) ilişkisini **açıklar**.
- **K-B2.2** Kat/seviye ve aks sistemini **kurar**.
- **K-B2.3** Çizim dosyalarını katman/yapı mantığına göre **düzenler**.

### Modül M3 — Parametrik mimari elemanlar ve hacimler
- **K-B3.1** Duvar, döşeme, kolon, kiriş gibi parametrik elemanları doğru parametrelerle **yerleştirir**.
- **K-B3.2** Kapı/pencere açıklıklarını ve merdiven/korkuluk elemanlarını **oluşturur**.
- **K-B3.3** Elemanlar arası birleşim ve öncelik kurallarını **uygular**.

---

## Seviye 2 — Orta (BIM Uzmanı)

**Seviye kazanımı:** Katılımcı modelden kesit, görünüş, pafta ve metraj üretir; kütüphane ve
özellikleri yönetir.

### Modül M4 — 2B dokümantasyon, kesitler ve pafta düzeni
- **K-O4.1** Modelden kesit ve görünüş **üretir** ve görünüm ayarlarını **düzenler**.
- **K-O4.2** Pafta düzenini (layout) kurar ve PDF/DWG olarak **çıktı alır**.
- **K-O4.3** Ölçülendirme, metin ve tarama ile paftayı **tamamlar**.

### Modül M4B — Kütüphane, özellikler ve metraj listeleri *(önerilen)*
- **K-O4B.1** Kütüphane elemanlarını ve özel parametrik objeleri **yönetir**.
- **K-O4B.2** Elemanlara özellik (attribute) **atar** ve sınıflandırma mantığını **uygular**.
- **K-O4B.3** Metraj, kapı/pencere çizelgesi ve mahal listesi **üretir**.

---

## Seviye 3 — İleri (Disiplin Uzmanı)

**Seviye kazanımı:** Katılımcı dört eşit süreli koldan birini seçip mesleğine göre ileri model
geliştirir. Kolların süreleri eşittir (araştırma verisi olmadığı için eşit ağırlık kararı).

### Kol A — Mimari · Modül M3B *(önerilen)*
- **K-İ3B.1** Karmaşık geometri ve cephe/giydirme cephe sistemlerini **modeller**.
- **K-İ3B.2** Tasarım varyantlarını ve görselleştirme çıktısını **oluşturur**.

### Kol B — Betonarme ve 3B donatı · Modül M5
- **K-İ5.1** Betonarme elemanlarda 3B donatıyı **detaylandırır**.
- **K-İ5.2** Büküm şemaları ve donatı listelerini **üretir**.

### Kol C — Prefabrik ve çelik · Modüller M6, M7
- **K-İ6.1** Çelik yapı elemanlarını ve bağlantılarını **modeller**. `[SDS2 entegrasyonunu sürüme göre doğrula]`
- **K-İ7.1** Prefabrik elemanları ve üretim verisini **hazırlar**.

### Kol D — Altyapı ve köprü · Modül M8
- **K-İ8.1** Parametrik yol/altyapı modelini **oluşturur**. `[ALLPLAN Civil]`
- **K-İ8.2** Prefabrik kirişli köprüyü **modeller**. `[ALLPLAN Bridge / sürüme göre doğrula]`

---

## Seviye 4 — Uzman (BIM Yöneticisi ve Geliştirici)

**Seviye kazanımı:** Katılımcı openBIM ile disiplinler arası çalışır, model kalitesini denetler ve
tekrar eden işleri otomatikleştirir.

### Modül M9 — Otomasyon, Visual Scripting ve PythonParts
- **K-U9.1** Görsel programlama ile parametrik bir iş akışı **kurgular**.
- **K-U9.2** PythonParts ile özel bir parametrik obje/otomasyon **geliştirir**.

### Modül M10 — openBIM, IFC 4.3, IDS ve CDE koordinasyonu
- **K-U10.1** IFC dışa/içe aktarımını **yapar** ve veri kaybını **denetler**.
- **K-U10.2** BCF ile sorun yönetimini ve referans model koordinasyonunu **yürütür**.
- **K-U10.3** IDS/CDE ve ISO 19650 temel kavramlarını teslim akışına **uygular**.

---

## Hizalama matrisi (özet)

Her kazanım en az bir etkinlik ve bir ölçme aracıyla eşleşir. Tam ders bazlı matris
`02-program-mimarisi.md` ve `03-ders-planlari/` ile tamamlanır.

| Kazanım grubu | Öğrenme etkinliği | Biçimlendirici ölçme | Düzey belirleyici ölçme |
|---|---|---|---|
| K-B* (Temel) | Demonstrasyon + rehberli uygulama (sürekli proje: aks, kat, mimari model) | Ders sonu öz değerlendirme quizi | Seviye 1 pratik görevi |
| K-O* (Orta) | Rehberli uygulama (kesit, pafta, metraj) | Quiz + uygulama kontrol listesi | Seviye 2 pratik görevi |
| K-İ* (İleri) | Kola özel uygulama (donatı/köprü/cephe/prefabrik) | Quiz + akran değerlendirmesi | Kol pratik görevi |
| K-U* (Uzman) | Otomasyon ve IFC koordinasyon görevleri | Quiz + kod/model incelemesi | Bitirme projesi (capstone) |

> **Not:** Web akademide ölçme **öz değerlendirme** amaçlıdır ve sertifika yerine geçmez. Düzey
> belirleyici pratik sınav ve sertifika yalnızca Aluplan'ın eğitmenli eğitimlerinde verilir.

## Sonraki dosya

→ [02-program-mimarisi.md](02-program-mimarisi.md) — seviye/modül/ders tablosu, süre hesabı, takvim.
