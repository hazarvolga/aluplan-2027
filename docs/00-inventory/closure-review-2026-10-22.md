# Hedefli envanter kapanış incelemesi — 22.10.2026

Kullanıcının kabul ettiği D01–D03 kanıt çalışması. **Faz 0 devam ediyor.** Kullanıcı bu çalışma sırasında eksik hedeflerin listesini tutup onarımları sonraya bırakmayı seçti. Kod, içerik, URL veya schema uygulaması yapılmadı.

| Kapı | Bu tur kanıtlanan | Kalan / karar | Kanıt |
|---|---|---|---|
| D01 Kısmi | Altı sayfada 57 canlı durum: Eğitim, SSS, Referanslar, hızlı başlangıç, Civil ve Ultimate | Diğer şablonlar, video/görsel modalları, form dalları; etkinleştirme adımı gerçek gönderim gerektiriyor | [Dinamik matris](dynamic-closure-2026-10-22.md), bağlı tam AX kayıtları |
| D02 Kısmi | İki DOCX canlıda var ve kaynakla aynı; 86 görsel+2DOCX toplam 88 GET200/hash eşliği; 974 açık import ilişkisi | 417 hash'li görsel URL bu geçiş dışında; medya kullanım grafiği ve kalan yerel yollar açık. Bir kullanılmayan import hedefi eksik | [Medya raporu](media-closure-2026-10-22.md), bağlı JSON |
| D03 Bilinen hatalar listelendi; onarım ertelendi | 11 benzersiz 404, dört sağlam 308; 2021 slash→404; beş fragment'ten yalnız interface eksik | Yeniden oluştur/uygun hedefe bağla/kaldır kararı daha sonra her satır için verilecek. Tüm site URL kabulü değil | [Hedef ve karar listesi](url-closure-2026-10-22.md), bağlı JSON ve fragment kaydı |

## Önceki belirsizlikleri düzelten bulgular

- AX3000 Word belgeleri yalnız yerelde bulunan yeni içerik değil: canlı AX3000 Dokümanlar sayfası ve dosya hash'leriyle doğrulandı. Dosya silinmedi.
- Destek bağlantısı hem güncel kaynakta hem canlı ana sayfada artık `allplan.net.tr`. Eski `aluplan.net.tr` kaydı tarihsel gözlemdir. Herkese açık kök → `/tr`200; özel müşteri işlemleri denenmedi.
- Ham href sonundaki boşluk beş kırık anchor anlamına gelmiyor; tarayıcı dört mevcut hedefi çözüyor. `#interface` gerçek eksik hedef.
- 308 tek başına başarı değil: Allplan 2021 yolu sonunda 404. Eski ilk-yanıt kaydı korunup yeni zincir kanıtıyla tamamlandı.

## Karar yetkisi ve schema etkisi

Teknik ekip mevcut durumları belgeleyebilir; Hazar hedef başına içerik yeniden oluşturma, eşleme veya kaldırma kararını verebilir. Bu tur alınan karar **onarımı ertelemek**; silme veya yeni hedef uygulaması değil. Hak, fiyat, hizmet koşulu veya lisans iddiası teknik kararla üretilemez.

`/solutions-v2` breadcrumb hedefi404; kaynak aynı segmentlerden BreadcrumbList üretiyor. Canlı JSON-LD bu tur yeniden çıkarılmadı. Uygulamada sayfa ilişkisi ve geçerli hedef birlikte denetlenmeli. Eğitim/Destek entity modeli değişmedi; [schema son kontrolü](../schema-final-review-2026-10-22.md) geçerli plan referansı. Rich Results Test, Search Console, form teslimi ve yeni site paritesi yapılmadı.

## Sıradaki iş

D01/D02 matrisindeki eksik kanıtları tamamlamak; D03 onarım listesini koruyarak ilerlemek. Kanıt toplama ile sonradan yapılacak onarım ayrı izlenir. Bu rapor tasarım/uygulama fazına geçiş kabulü değildir.
