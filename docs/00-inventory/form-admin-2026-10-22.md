# Ana teklif formu — yönetici görünümü kanıtı

22.10.2026. Kullanıcının paylaştığı Microsoft Forms düzenleme bağlantısı mevcut oturumla açıldı. Form tasarımındaki 14 bölüm ve 24 soru okundu; dallanma görünümündeki mevcut değerler incelendi. Yanıtlar açılmadı, alan/seçenek/dallanma değiştirilmedi, başvuru gönderilmedi. Yönetici bağlantısı veya hesap bilgisi rapora kopyalanmadı.

## Kapanan içerik açığı

- **Bölüm 8 — Scalypso Eklentisi:** zorunlu tek seçimli “10 - Scalypso Eklentisini Denemek istiyorum.”; tek seçenek “Onaylıyorum.” Bölümün sonraki hedefi 13 — Demografik Bilgiler.
- **Bölüm 14 — Gizlilik & Kullanım Şartları:** zorunlu tek seçimli aynı adlı soru; tek seçenek “Okudum Onaylıyorum”. Bölüm açıklamasındaki hedefler `https://aluplan.com.tr/kisisel-verilerin-islenmesine-iliskin-aydinlatma-metni/` ve `https://aluplan.com.tr/gizlilik-politikasi/`. Bu gözlem hukuki yeterlilik veya bu URL'lerin çalışma kanıtı değildir.

Önceki raporlarda bu iki bölümün içeriğinin bilinmediği notu bu kanıtla aşılmıştır. İçerik envanteri açısından bu dış erişim engeli kapandı; gerçek gönderim/teslimat/sonuç ekranı kabulü yapılmadı. Faz geçişi otomatik değildir.

## Dallanma bulgusu

Eklenti seçimi sorusunun mevcut hedefleri:

| Seçenek | Yönetici görünümünde hedef |
|---|---|
| Allto PythonPart Eklentisi | Bölüm 10 — Allto PythonPart Eklentisi |
| Aluplan BIM Eklentisi | Bölüm 9 — Aluplan BIM Eklentisi |
| Scalypso Eklentisi | Bölüm 13 — Demografik Bilgiler |
| CDS Allplan Add On | Bölüm 7 — CDS Allplan Add On |
| SDS2 Ultimate | Next; bölüm 6 çıkışı 13 olarak ayarlı. Önceki ziyaretçi gözleminde de13görüldü |

Scalypso seçeneği bölüm8yerine13'e gider. Bu, önceki ziyaretçi incelemesinde bölüm8'in görünmemesini açıklar; bölümün silindiği veya formda bulunmadığı anlamına gelmez. Bu tek girişin atlaması kanıtlandı; olası tüm diğer girişler için erişilemezlik iddiası yapılmaz.

İki farklı konu karıştırılmaz: web sitesindeki Pythonpart/Scalypso CTA'larının ayrı CDS formuna gitmesi önceki hedef uyumu sorunudur; burada ana teklif formunun kendi içindeki Scalypso dalı incelenmiştir.

## Diğer kayıtlar ve strateji etkisi

- Demografik bölümde ad, e-posta, GSM, firma, şehir, çalışma alanı ve duyum kaynağı zorunlu; Notlar isteğe bağlı. GSM için sayısal değer kuralı görünür. Telefonu sayı olarak ele alma ve öğrenci akışında firma zorunluluğu sonraki UX/form sözleşmesinde değerlendirilecek, değiştirilmedi.
- Bölüm/soru numarası ile başlığa elle yazılmış numaralar farklı; veri eşlemesi yalnız görünen numara metnine dayanmayacak.
- Form içeriği ve dalları kayıtlıdır; öğrenci belge koşulları üreticinin güncel politikası olarak bağımsız doğrulanmış sayılmaz.
- Schema planı değişmez: talep/onay seçeneği ürün hakkı, Offer, tamamlanmış kayıt veya lisans kabulü kanıtı değildir. Bölüm8'in varlığı yeni bir ürün/hizmet varlığı yaratmaz. Yasal onay alanı genel hizmet schema'sına taşınmaz.

**Tek yeni karar:** Scalypso talebinde bölüm8'deki ek deneme onayı gerekli mi, yoksa doğrudan iletişim bilgilerine geçiş bilinçli mi? Öneri: ürün seçimi niyeti zaten belirtiyorsa fazladan onay adımını zorunlu kılmamak; kesin davranış form sadeleştirme kararında ele alınsın. Şimdi onarım yapılmadı.

Kanıt: [alan ve dallanma kaydı](form-admin-2026-10-22.json). 76 designer DOM kaydı, 14 bölüm +24 soru için kapsayıcı ve başlık kayıtlarını birlikte içerir;76ayrı soru değildir. 13 dal gözlemi saklandı. Kişisel yanıt verisi yok.
