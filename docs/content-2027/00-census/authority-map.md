# Otorite haritası

> Karma dosya: sınıflandırma kuralları, sayımlar ve eksik kaynak listesi
> `scripts/build_content_inventory.py` tarafından üretilir; çakışma
> kararları ve açık sorular elle yazılır. Kararlar değiştiğinde betikteki
> ilgili bölüm güncellenir.

İki dosya aynı konuyu anlattığında hangisinin esas alınacağını tanımlar.
Kural: **canlı site ve üreticinin son sürümü esastır**; taslak, kopya ve
iç kullanım belgeleri içerik kaynağı sayılmaz.

## 1. Sınıflandırma kuralları

| Sınıf | Anlamı | Dosya |
|---|---|---|
| `source-authoritative` | Yayımlanabilir kaynak. Metin birebir alınır. | 2543 |
| `external-link-missing` | SharePoint kısayolu; dosya depoda yok. İndirilmeden kullanılamaz. | 14 |
| `draft-not-final` | Taslak. Sitede kullanılmaz; yalnızca yön bilgisi. | 4 |
| `internal-only` | İç kullanım (rekabet, iç eğitim). Sitede yayımlanmaz. | 3 |
| `pii-restricted` | Kişisel veri içerir. Envantere yalnızca anonim özet alınır. | 2 |
| `template` | Boş şablon. İçerik kaynağı değil. | 5 |
| `archive-raw` | Ham çalışma dosyası. Düzenlenmiş sürüm esas alınır. | 3 |
| `duplicate-candidate` | Ad `Copy`/`(1)` içeriyor. Otorite değil. | 40 |
| `superseded-copy` | `Aluplan Design System/` kopyası. `design-system/` otorite. | 238 |
| `concept-prototype` | Konsept prototip. Üretim içeriği değil. | 37 |
| `process-record` | Süreç/karar kaydı. Site içeriği değil, referans. | 1076 |

## 2. Çakışma kararları

### `design-system/` ile `Aluplan Design System/`

`Aluplan Design System/` klasörü `Aluplan Design System-reviewed-v3-refreshed.zip`
dosyasının açılmış hâlidir. İçerik olarak `design-system/` ile büyük ölçüde aynıdır
ancak iki klasör arasında farklar vardır.

**Karar:** `design-system/` otoritedir (token testleri, `pnpm tokens:check` ve
parite kapıları bu klasöre bakar). `Aluplan Design System/` yalnızca kaynak
paketin referans kopyasıdır; düzenlenmez.

### `RAW files/`, `Templates/`, `Copy1`

SCIA klasöründeki `RAW files/` ve `Templates/` ham/şablon çalışma dosyalarıdır.
Düzenlenmiş, dili belirtilmiş sürümler esas alınır. `Copy1` ekli dosyalar
mükerrer adayıdır; `Web Pages` altındaki üç `Launch 2027 - Intro text edition
pages shop EN.xlsx` dosyası **birebir aynıdır** ve tek kaynak sayılır.

### İngilizce messaging brief'ler

Altı ürünün İngilizce `Messaging Brief` ve `Product Launch Messaging`
belgeleri depoda **yoktur**; yalnızca SharePoint `.url` kısayolu vardır.
Yerelde DE/FR/IT/ES/CZ sürümleri bulunur. İngilizce metin gerekiyorsa
kaynak indirilmelidir; bu envanter bunları `external-link-missing` olarak
kaydeder ve DE sürümünden çıkarım yapıldığını ayrıca işaretler.

### Çevrilmemiş dil varyantları

Bazı dosyalar farklı dil etiketiyle kaydedilmiş ama içeriği birebir aynıdır:
FRILO (cs/es/fr/it), SDS2 (de/es/fr) ve SCIA (de/it) messaging brief'leri.
Bunlar çeviri değil, yeniden adlandırmadır. Ayrıntı: `duplicates.md` →
“Çevrilmemiş dil varyantları”. Site metni üretilirken bu diller için kaynak
yok kabul edilir.

### İç kullanım belgeleri

`Competitive Landscape` (SDS2, ALLPLAN Civil), `INTERNAL` etiketli sunumlar ve
`NOT FINAL` taslaklar sitede yayımlanmaz. Rekabet karşılaştırması Aluplan'ın
kendi konumlandırmasıdır, üreticinin kamuya açık iddiası değildir.

### Kişisel veri

`Proof Points and Usable Quotes.xlsx` beta anketi yanıtlarını ad, e-posta ve
firma bilgisiyle içerir; bazı satırlarda `Consent: None` yazar. Bu dosyadan
envantere **yalnızca anonim yüzdeler** alınır. Alıntı metinleri, izin durumu
`full` olanlar dışında kullanılmaz.

## 3. Eksik kaynak listesi

| Dosya | Ürün | Durum |
|---|---|---|
| `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging - ALLPLAN 2027 - English.url` | allplan | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - ALLPLAN - English.url` | allplan | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/ALLPLAN Edition Table - ALL FEATURES.xlsx.url` | allplan | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN Civil 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - ALLPLAN Civil 2027 - English.url` | allplan-civil | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN Civil 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - ALLPLAN Civil - English.url` | allplan-civil | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/NOT FINAL - Link to Article in AEC Magazine.url` | allplan-max | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/NOT FINAL - Link to Press Release.url` | allplan-max | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging - ALLPLAN Max - English.url` | allplan-max | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - FRILO 2027 - English.url` | frilo | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - FRILO - English.url` | frilo | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - SCIA 2027 - English.url` | scia | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SCIA - English.url` | scia | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - SDS2 2027 - English.url` | sds2 | SharePoint kısayolu — yerel dosya yok |
| `Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SDS2 - English.url` | sds2 | SharePoint kısayolu — yerel dosya yok |

## 4. Karar bekleyen otorite soruları

1. İngilizce messaging brief'ler indirilecek mi, DE sürümüyle mi ilerlenecek?
2. `ALLPLAN Edition Table - ALL FEATURES.xlsx` tam özellik matrisi olmadan
   edition karşılaştırma sayfası üretilebilir mi?
3. `Aluplan Design System/` klasörü arşive taşınacak mı, yoksa yerinde mi kalacak?
