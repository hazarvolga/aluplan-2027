# Sitewide source-data-render parity — 2026-10-28

## Sonuç

- Kaynak → veri: 110/110 route değerlendirildi, onaysız bulgu `0`.
- Veri → ilk HTML: 110/110 route HTTP 200, 110/110 tek H1.
- Render sonucu: 94 `pass`, 16 `approved_difference`, 0 `failure`.
- 16 onaylı fark, varsayılan olmayan tab/FAQ kategorilerinde etkileşim sonrası açılan 303 metin adayının ilk HTML'de bulunmamasıdır. Bu farklar route + aday sayısı + pointer/metin SHA-256 özetiyle `render_interaction_policy.json` içinde sabitlenmiştir; yeni veya değişmiş bir aday otomatik onaylanmaz.

## Tarayıcı kabulü

- 110 route, masaüstü `1440×1000` ve mobil `390×844` olmak üzere 220 gerçek tarayıcı kontrolünden geçti.
- Navigasyon hatası `0`, H1 hatası `0`, yatay taşma `0`, yüklenemeyen görünür görsel `0`.
- Temsilî etkileşimler gerçek tarayıcıda doğrulandı: workflow tab/alt öğe klavye seçimi, mobil menü, açık/koyu tema, medya lightbox açma-kapama, FAQ kategori/accordion, eğitim tabları, referans filtre+arama ve playlist video değiştirme.
- Responsive tarama `browser-responsive-audit.json`, temsilî etkileşim sonuçları ise rota/eylem/beklenen/gözlenen alanlarıyla `browser-interaction-audit.json` içinde saklanır. Bu otomatik kabul; editoryal tercih veya art-direction onayının yerine geçmez.

## Kapatılan regresyonlar

- `/solutions/bridge-design`: kaynakta bulunmayan genel MP4 galerisi kaldırıldı; doğru ALLPLAN Bridge YouTube girişi korunuyor.
- `/products/allplan-aec`: kaynakta bulunmayan genel MP4 galerisi kaldırıldı; doğru ALLPLAN AEC YouTube girişi korunuyor.
- `/solutions/allplan-industry`: `ALLPLAN Professional` ve `ALLPLAN Ultimate` dahil altı ürün kartı render sözleşmesinde ve HTML'de yer alıyor; kart hedefleri korunuyor.
- Aynı dosyayı kullanan farklı görsel rollerinin veri üretiminde silinmesine yol açan `src`-bazlı tekilleştirme, `src + alt/rol` kimliğine geçirildi.

## Kontrol katmanları

1. `source-data-report.json`: route, H1, sıralı başlık, gövde metni, link, SHA-256 görsel kimliği/alt rolü, native video, embed, yerel dosya ve exact-policy kontrolleri.
2. `render-audit.json`: loopback sunucusundaki 110 route için yalnız `<main>` kapsamındaki ilk HTML, H1, veri→render başlık sırası, kart açıklamaları, link, görsel, video/embed kimliği ve medya sırası. Header/footer tekrarları ana içerik eksiklerini karşılayamaz.
3. Denetim, kaynakta olmayan harici link/görsel/iframe hedeflerini; protocol-relative, `javascript:` ve `data:` hedeflerini; public dizini dışına taşan dosya yollarını ve beklenmeyen redirectleri reddeder.
4. Etkileşimli durumlar ayrı kabul kapsamıdır; ilk HTML taraması hidratasyon sonrası tüm tıklamaları kanıtlamaz.
5. `browser-responsive-audit.json`, ilk HTML denetimini iki viewportta gerçek browser navigasyonu, H1, viewport taşması ve yüklenen görsel kontrolleriyle tamamlar.
6. `browser-interaction-audit.json`, sekiz temsilî hidratasyon sonrası etkileşimin beklenen ve gözlenen sonuçlarını kalıcılaştırır.

## Tekrarlanabilir komutlar

```bash
python3 scripts/verify_sitewide_source_parity.py
python3 scripts/audit_render_parity.py \
  --base-url http://127.0.0.1:3001 \
  --output docs/verification/sitewide-parity-2026-10-28/render-audit.json
pnpm test
```

Canlı siteye yazma, deploy veya uzak repo push işlemi yapılmadı.
