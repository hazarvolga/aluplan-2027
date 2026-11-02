# HANDOFF PROMPT — Canlı envanterden (allplan-canlı/) sayfa kurulumu

> Bu dosya, başka bir ajana (ya da yeni oturuma) verilecek **kopyala–yapıştır
> prompt**tur. Aluplan 2027 deposunda `docs/content-2027/allplan-canlı/`
> klasöründeki canlı içerik envanterini kullanarak dört ürün sayfasını kurmak
> için gereken tüm bağlamı içerir.

---

## 1. Kimlik ve görev

Sen Aluplan 2027 deposunda çalışan içerik sayfası kurulum ajansın. Görevin:
allplan.com'un **canlı 2027 ürün sayfalarının birebir envanterini** kullanarak
bu sayfaları yeni tasarımla Aluplan 2027 sitesinde kurmak (uyarlamak, çeviri
taslaklarını gerekçelendirmek, medyayı bağlamak, sayfa bileşenlerini üretmek).

Yetki sınırın: içerik eşleme + sayfa kurulumu önerisi + uygulama. Marka
kararları, rota karşılıkları ve faz geçişleri kullanıcı onayına bağlıdır.

## 2. Çalışma kuralları (dokunulmaz)

1. Yalnız `aluplan-2027/` içine yaz. `../aluplan-2026` salt-okunurdur: yazma,
   silme, taşıma, bağımlılık kurma, build/dev komutu çalıştırma.
2. Türkçe yanıt ver; kod, dosya ve değişken adları İngilizce.
3. Her faz sonunda dur; kullanıcı onayını bekle. Fazları atlama.
4. Commit öncesi kullanıcı onayı al; push/merge/deploy yok.
5. **Dil kapsamı (kullanıcı kararı 29.10.2026):** yalnız EN (birebir) +
   TR (taslak). İtalyan/Almanca URL ve metin kaçışlarıyla vakit kaybetme;
   üretimde bunların EN/TR karşılıklarını kullan.
6. Gizli bilgileri (env değerleri, token) okuma veya repoya kaydetme.
7. Sayısal iddialar (%93, %86, %71 istatistik çubukları; "5×", "20–50%"
   gibi) üretici metinden aynen taşınır; TR taslakta abartı/ek iddia yok.
8. Ücretsiz deneme bağlantıları `https://www.allplan.com/trial-or-subscription/`
   adresine gider (kullanıcı kararı); "14 gün" vaadi yeni sitede yazılmaz.
9. YouTube gömeleri **yalnızca referans** olarak envanterde durur; yerel
   kopyalama kararı ayrıca kullanıcıya aittir (telif). Varsayılan: gömme
   iframe ile üretici kanalından oynatılır.

## 3. Kaynak: canlı envanter klasörü

> Aşağıdaki bölümde "canlı URL" = sayfanın allplan.com üzerindeki gerçek
> adresi; envanter tamamen o URL'den birebir çıkarılmıştır.

Klasör: `docs/content-2027/allplan-canlı/` — commitler `46a73ef` (allplan-max),
`7f1a69d` (üç ürün sayfası + medya), `d4adbab` + `93364b9` (HANDOFF + karar).
Çıkarım tarihi tüm dosyalar için **29.10.2026**, render edilmiş canlı DOM.
Yazım hatası dahil tüm metinler **birebir**; "Konum" sütunundaki y değeri
sayfadaki dikey konumu (px) verir. TR = taslak; ID formatı:
`live.<sayfa-kodu>.<bölüm>.<alan>` (ör. `live.civ.what.body`).

| Envanter dosyası | Canlı kaynak (birebir) | Yeni sitede hedef rota |
|---|---|---|
| `allplan-max.md` | `https://www.allplan.com/allplan-max/` | `/products/allplan-max` (önerilen, yeni) |
| `allplan-2027-features.md` | `https://www.allplan.com/products/allplan-2027-features/` | yeni rota, açık karar (bkz. §6) |
| `allplan-civil.md` | `https://www.allplan.com/products/allplan-civil/` | `/products/civil` (mevcut, envantere eşleştir) |
| `allplan-sds2-detailing-fabrication.md` | `https://www.allplan.com/products/sds2-detailing-fabrication/` | `/products/sds2-home` (mevcut) veya yeni `/products/sds2` — açık karar |

Rota haritası: `docs/content-2027/02-inventory/routes.md`.
Kullanıcı kararları: `docs/00-inventory/user-decisions.md`.

### Dosya okuma sırası

1. `allplan-canlı/README.md` — klasör kuralları, dosya tablosu, kapsam dışı
   alanlar (header/footer, cookie banner, modal davranışı envantere girmez).
2. Sayfa envanteri (yukarıdaki tablodan) — bölümleri, ID'leri, EN/TR ve
   "Kaynak notları" (canlı hataları) sırasıyla oku.
3. `media/manifest.md` — 4 sayfa için SHA-256 (ilk 16), boyut, canlı konum
   tablosu; indirilen yerel dosya yolu eşlemesi.
4. İlgili Aşama C/D katmanı: `02-inventory/pages/*.md` ve
   `03-data/content-records.json` (394 kayıt/10 sayfa) — canlı envanter bunlara
   **bağlanmadı** (kullanıcı kararı); sayfa kurulumunda ikisini birlikte
   değerlendir, çakışmayı kullanıcıya sor.

## 4. Envanter nasıl okunur (schema)

- Tablolarda satır = DOM blok: `ID | Rol | Konum(y) | EN birebir | TR taslak`.
- **Gizli karusel** slaytları DOM'da ekran dışında/sıfır boyutlu durur;
  içerikleri "gizli" etiketiyle kayıtlıdır — bunlar yayında
  gösterilmeyen metadata değil, sayfanın gerçek içeriğidir (features
  sayfasında Civil, FRILO, SCIA, SDS2 slaytları). Bu slaytları sekme/kaydırma
  irtibatlı karusel bileşeni olarak kur.
- Karşılama altı stat çubukları DOM'da birleşik metinle gelir; başlık/alt
  başlık ayrımını tablodaki "kaynak hatası" notlarından al:
  `93% + Time Saving`, `86% + More Efficiency`, `71% + More Productive`.
- CTA satırları `etiket → hedef` biçimindedir; hedef canlı sitenin path'idir
  (ör. `/personal-demo/`, `/sds2-book-demo/`). Yeni site rota karşılığı
  `routes.md`'den eşle; eşleşmiyorsa kullanıcıya sor.
- **Kaynak notları** bölümündeki maddeler canlı sitedeki üretim hatalarıdır;
  envanterin EN kolonu bunları korur, yeni sayfada düzeltme önerisi
  kullanıcı onayına bağlıdır (ör. "SOLUTIONFOR" -> "SOLUTION FOR").

## 5. Medya kullanımı

- Klasör düzeni: `media/<slug>/images|videos`, slug şunlardır:
  `allplan-2027-features`, `allplan-civil`,
  `allplan-sds2-detailing-fabrication` (`media/` kökünde allplan-max
  dosyaları vardır).
- Her envanter görsel satırı yerel dosya adını doğrudan verir
  (ör. `images/csm_2025_Header_Civil_1440x580_6de5a86993.jpg`); SHA-256
  `media/manifest.md` ile birebir eşleştirir. Dosya adını elle uydurma.
- **Bozuk kaynak (kayda geçmiş):** features sayfasındaki gizli
  "Flexible Distribution and Stationing" slaytının videosu
  `Editable_Stationing.mp4` canlı sunucuda **HTTP 404** — indirelemedi.
  Bu slaytta video yerine ekran görüntüsü/poster kullanmayı öner; kullanıcıya
  bildir.
- Civil sayfasındaki müşteri sözü videoları `event.allplanplus.com`
  oturum bağlantılarıdır (base64 token, yerel video değildir); bunlar
  envanterde referans kalmalı, üretimde "Watch Video" modal link olarak.
- Civil'in 18 YouTube gömesi "Watch Video" modal'larıdır; üreticide iframe
  embed ile oynatılır, video dosyası indirilmez.

## 6. Kullanıcı onayına bağlı açık kararlar (üretim öncesi sorulacak)

1. Features sayfası yeni rota karşılığı (`/products/allplan-2027-yenilikler`
   yerine mı? mevcut `/products/allplan-2026-yenilikler` ile ileride
   çakışır).
2. SDS2 sayfası: mevcut `/products/sds2-home` güncellenir mi, yeni
   `/products/sds2` olur mu?
3. `/products/allplan-max` yeni rota onayı.
4. Gizli features slaytında "Allplan Max" üst başlığı (içerik SDS2'ye ait,
   canlı kopya hatası) — yeni sayfada "SDS2" olarak diyeceksin; onay al.
5. Civil "63% More Time" paradoksu (gövde zaman tasarrufu anlatır) —
   "63% less time" düzeltmesi kullanıcı onayına bağlıdır.
6. Söz–portre eşleşmeleri (canlıda isim yok) tahminidir; gösterilecek mi?
7. Kaynak hataları (birleşik yazımlar, "Midlands, Michigan", "noise barries",
   `??rel=0`, artık `?`) yeni sayfada düzelteceksin ama listeyi kullanıcıya
   onaylat.
8. Çift dil kararı EN+TR sabittir; İtalyan `it/it/` URL'leri EN/TR
   karşılıklarıyla çözülür (`docs/00-inventory/user-decisions.md`).

## 7. Hızlı başlangıç sırası (önerilen)

1. `docs/MASTER-PROMPT.md` + `HANDOFF.md` en üst kayıt + `BRAND-GUIDELINES.md`
   (v1.0 TASLAK — onaylanmamış önerileri taslak tut).
2. `docs/content-2027/allplan-canlı/README.md` ve hedef envanter dosyasını
   oku; sayfa aç dene: envanterdeki bölümleri sayfa şablonu bileşenlerine
   eşle (hero → stat bandı → benefits grid → özellik ızgarası → cloud
   services → options → FAQ → sözler karuseli → hikâye kartları →
   CTA'dan ek CTA → partner).
3. Medya klasöründen görselleri sayfa verisine bağla: envanter görsel
   satırındaki yerel dosya adını birebir kullan (`media/<slug>/images/…`);
   SHA-256 doğrulaması `media/manifest.md`'den yap. Kendi uydurma dosya
   adı veya canlı `_processed_` URL'/filtre uzantıları kullanma.
4. Canlı envanteri Aşama C katmanı `02-inventory/pages/*.md` ile karşılaştır
   (ör. aynı ürünün içerik birimi ikisinde de varsa hangi kaynağın esası
   alınacağını kullanıcıya sor).
5. Sayfa taslağını bileşen kroisiyle üret; kullanıcıya `browser.preview`
   ile göster, onay al, sonra veri katmanına yaz (`src/data/…`,
   `pnpm data:generate`), ardından parite testleri.
6. Her faz sonunda `HANDOFF.md` güncelle ve onay iste.

## 8. Doğrulama komutları

```bash
pnpm data:generate                 # veri üretimi (envanter → src/data/)
pnpm test:parity                   # parite, SEO, güvenlik doğrulaması
pnpm typecheck
pnpm tokens:check                  # token ve kontrast kontrolü
pnpm dev                           # yerel önizleme
python3 -m unittest tests/test_url_parity.py
```

Canlı referans karşılaştırma için tarayıcı sekmeleri:
- features: `https://www.allplan.com/products/allplan-2027-features/`
- civil: `https://www.allplan.com/products/allplan-civil/`
- sds2: `https://www.allplan.com/products/sds2-detailing-fabrication/`
- max: `https://www.allplan.com/allplan-max/`

## 9. Son commit durumu (dal `codex/page-end-conversion-design`)

- `93364b9` karar kaydı (EN+TR yeterli, diğer diller kapsam dışı)
- `d4adbab` HANDOFF güncelleme
- `7f1a69d` üç sayfa envanteri + 94 görsel + manifest + README
- `46a73ef` allplan-max envanteri; `df085cf` HANDOFF
- Push/merge/deploy yok; her faz çıkışında kullanıcı onayı gerekir.
