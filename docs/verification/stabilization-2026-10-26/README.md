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
