# S01 — Sağlamlaştırma başlangıç kaydı

26.10.2026. Kullanıcının onayladığı yol haritasının ilk adımı. Makine okunur kanıt: `baseline.json`. Bu kayıt düzeltme öncesi durumu korur; sonraki üretim sonuçları bunun üzerine yazılmaz.

## Sonuçlar

- `src/data/` altındaki 5 JSON dosyasının boyutları ve SHA-256 değerleri kaydedildi.
- `public/docs/` altındaki 10 PDF/DOCX dosyasının tamamı, 2026 kaynağındaki karşılıklarından farklıdır: **0/10 hash eşliği**. Orijinal kaynak karşılıkları 10/10 bulundu.
- İki `.docx` hedefinin imzası PDF; özgün kaynakları ZIP/OOXML imzalıdır. Kaynak gerçekliğinin yerine dosyanın mevcut/boş değil kontrolü yeterli değildir.
- Çıkarıcının kaynak dizinindeki **161 TSX snapshot'ı güncel 2026 kaynak dosyasıyla 161/161 bayt eşit**. Bu dar kaynak kümesinde snapshot eskimesi bulunmadı. Bu kontrol kaynak projenin tüm dosyalarını kapsamaz; 110 rotanın metin/render/etkileşim paritesi veya canlı eşliği kabulü değildir.
- `Allplan 2027 Marketing Materials/` yalnız kökte Git ignore kuralına eklendi. İçeriği açılmadı veya değiştirilmedi; migration kaynaklarına karıştırılmadı.

## Güvenlik ve sınırlar

Üreticiler, build veya dev komutları çalıştırılmadı. 2026 kaynağı yalnız okundu; gizli dosya/env okunmadı. Canlı site taranmadı. Veri ve belgeler değiştirilmedi. Başlangıç commit kimliği JSON kaydındadır.

## Sonraki adım

S02'de Python veri hattı tek yetkili giriş olacak; `pnpm data:generate` ve test komutları eşlenecek, eski JS üreticisi çalıştırılamayacak. Her iki üreticideki belge yazımı güvenceye alınmadan üretim yapılmayacak. S03'te orijinal belgeler hash ve dosya türü kabulüyle geri getirilecek. Güncel snapshot eşliği S05'in başlangıç kanıtıdır, tam içerik kabulü değildir.

## S02/S03 — Tek üretici ve özgün belgeler (26.10.2026)

Tamamlandı. Güncel yetkili üretici `scripts/generate_site_data.py`; `pnpm data:generate` doğrudan bunu çağırır. Eski `generate-site-data.mjs` yalnız aynı Python girişine yönlendiren uyumluluk sarmalayıcısıdır; ayrı üretim mantığı yoktur. `extract_structured_pages.py` bu hattın mevcut yapısal içerik modülüdür. `pnpm test` ve `pnpm test:parity` artık mevcut Python dosyalarını çalıştırır.

Her iki üreticideki temsili belge oluşturma kaldırıldı. `scripts/document_assets.py` onaylı 10 özgün kaynaktan 11 URL üretir; 11. hedef ana sayfanın mevcut `karsilastirma` yazımlı URL'sini, kaynak `karsilastirme` dosyasının birebir kopyasıyla korur. Yeni yönlendirme veya CTA değişikliği yapılmadı. Özgün10belge toplamı yaklaşık43MB'dır; indirme gerektiğinde sunulur, başlangıç sayfa yüküne topluca dahil edilmez.

Kaynak yolları allowlist ile sınırlı; tüm dosyalar yazımdan önce okunup PDF/OOXML türü kontrol edilir. Eksik/bozuk kaynakta üretim durur; iç içe kaynak/hedef ve symlink kaçışı reddedilir. Kopyalar atomik değiştirilir, aynı baytlarda tekrar yazılmaz. `src/data/documents-manifest.json` kaynak/hedef/boyut/SHA-256 kaydıdır; CI/parite, 2026 checkout olmadan bu kayıtla doğrular. Gerçek belge güncellemesinde yetkili kaynaktan `pnpm docs:sync` kullanılır; manifest/binary değişiklikleri birlikte incelenir. Veri üretimi için 2026 kaynağı gerekir; normal build/test için gerekmez.

Doğrulamalar:
- 34 birim testi ve36 parite kontrolü geçti; belge hattına11test eklendi. Yanlış tür, bozuk manifest, kaynağın değişmemesi, eksik dosyada önkontrol, idempotency ve path/symlink sınırları test edildi.
- `pnpm typecheck` ve üretim build geçti; token kontrolü188çift/0hata.
- Beş mevcut içerik JSON'u S01 hashleriyle aynı; yeni manifest dahil6JSON tekrarlı üretimde aynı. Uyumluluk JS girişi de aynı Python hattını başarıyla çalıştırdı.
- 10özgün belge + yazım aliası için11/11kaynak–hedef–HTTP gövde hash eşliği. Yerel üretim sunucusunda11/11HTTP200; veri katmanından keşfedilen10benzersiz iç indirme hedefi geçerli PDF/DOCX döndürdü. İçeriği bozuk DOCX'ler gerçek Word OOXML dosyalarıyla değiştirildi.
- 161kaynak TSX snapshotı S01sonrası değişmedi. Canlı tarama/deploy yok; bu sonuç yerel üretim kanıtıdır. Kaynak2026'ya yazılmadı. Build'in ürettiği next-env yol değişikliği eski haline getirildi.
- Bağımsız kod incelemesi kritik/yüksek bulgu vermedi; önerilen manifest tür doğrulaması da testle eklendi.

Kanıt: `documents-after.json`. S04 Microsoft Forms geçişi sıradaki ayrı adımdır; mevcut form kodu bu adımda değiştirilmedi. S05 kapsamlı içerik/etkileşim kabulü ve S06token/bileşen sağlamlaştırma hâlâ açıktır.

## S04 — Microsoft Forms tek talep kanalı (26.10.2026)

Ortak teklif/ürün/deneme desteği/eğitim talepleri mevcut Microsoft Forms hedefini kullanır. Topbar yerel modalı, iletişim formu ve çalışmayan lisans gönderim alanları kaldırıldı; lisans görevi PDF/ticket/mail üzerinden ayrı tutulur. Üç eski POST adresi gövdeyi okumadan410verir; form verisini POST redirect ile Microsoft'a taşımaz. Eski CDS talep URL'si tam eşleşmeyle ortak forma hizalanır; lisans yöneticisi Forms'u korunur. `request_links.py` taze veri ağacı üretir; tarihsel kanıt veya kaynak snapshotlarına yazmaz.

43birim testi,36parite kontrolü, TypeScript/production build geçti; tarayıcıda contact/training/activation kontrol edildi. Microsoft formuna gönderim yapılmadı. Üç API'ye bozukJSON ile localPOST410sonucu, güvenli link nitelikleri ve kanal ayrımı `forms-after.json` içindedir. `forms-contact.png` üretim tarayıcı kanıtıdır. İncelemeler kritik/yüksek bulgu vermedi.

Açık içerik bulgusu: /contact gövdesindeki30gün deneme metni S05'e taşındı; form geçişi bunu çözmez. S04sonrasında kapsamlı içerik/etkileşim paritesi, token refaktörü ve yayın kabulü henüz açıktır.
