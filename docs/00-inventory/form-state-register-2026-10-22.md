# Form durum envanteri — 22.10.2026

Kapsam: salt-okunur `../aluplan-2026/app` ve `components` form/input/handler/import taraması; ardından ana çalışmanın kaydettiği22 Ekim canlı boş-form tarayıcı kanıtlarıyla güncelleme. Bu kayıt canlı teslimat testi değildir. Veri girilmedi, gönderim/login yapılmadı; `.env` ve gizli değerler okunmadı. Yapılandırma değerleri rapora alınmadı. [Makine okunur kayıt ve bütün Microsoft Forms kaynak referansları](./form-state-register-2026-10-22.json).

## 1. Eğitim ContactModal

Kaynak: `components/layout-v2/ContactModal.tsx:18–140`. Gerçek tüketiciler: `app/solutions-v2/training/page.tsx:482` ve `components/templates/TrainingDetailTemplate.tsx:162`.

| Alan / name | Tür | Zorunluluk | Davranış |
|---|---|---|---|
| Ad Soyad / name | text | required | Native doğrulama |
| Firma / company | text | Hayır | Serbest |
| E-posta / email | email | required | Native email doğrulama |
| Telefon / phone | tel | Hayır | Ek pattern yok |
| Meslek / Unvan / jobTitle | text | Hayır | Serbest |
| Sektör / sector | text | Hayır | Serbest |
| Konu / subject | text | required yok | readonly; çağıran bağlamı sağlar |
| Mesajınız / message | textarea | required | Native doğrulama |

Gönderim handler'ı `:28–40`: `preventDefault` → FormData → **console kaydı** → 1000ms bekleme → başarı ekranı. API, e-posta veya kalıcı kayıt çağrısı yok. Başarı metni “Teşekkürler! Mesajınız başarıyla alınmıştır. Ekibimiz sizinle en kısa sürede … konusu hakkında iletişime geçecektir.” Gerçek teslimat olmadan bu mesaj gösteriliyor. Pending/disabled durum, ağ hatası ve yeniden deneme dalı yok; açılışta başarı sıfırlanıyor. İptal/Kapat modalı kapatır. Native geçersiz alan mesajı tarayıcıya bağlıdır, sabit Türkçe metin değildir.

Girişler:

- Eğitim sayfasında Temel, İleri Seviye, Özel ve BIM kartları: `Eğitim Teklifi: {cat.title}`. Başlıklar sırasıyla “ALLPLAN Dünyasına Giriş!”, “ALLPLAN Uzmanı Olma Yolunda!”, “Özel Konularda Derin Bilgi!”, “BIM Üzerine Uzmanlık!”. Ayrıca “Okul ve Öğrenciler İçin Teklif” girişi (`training/page.tsx:344,460`). Hızlı Başlangıç ve Video Kütüphanesi girişleri modal açmaz.
- Şablonun gerçek modal CTA tüketicileri: `training/individual` → “Bireysel Eğitim Teklifi”; `online` → “Online Eğitim Başvurusu”; `classroom` → “Sınıf İçi Eğitim Başvurusu”; `events` → “Etkinlik Bilgi Talebi”; `webinar` → “Webinar Bilgi Talebi”. Şablon varsayılanı `Bilgi Talebi: {title}`; modal başlığı `{title} Hakkında İletişim`.
- `training/e-learning` şablonu import eder fakat CTA `https://learnnow.allplan.com/course/search.php` açar. DOM'da modal bileşeninin bulunması o CTA'nın form açtığı anlamına gelmez (`TrainingDetailTemplate.tsx:50–56`, `e-learning/page.tsx:41`).
- Kullanıcının eğitim adlandırmasını sadeleştirme kararı bu envanterde eski sayfayı silmek/taşımak olarak yorumlanmadı; mevcut kaynak aynen kayıt edildi.

## 2. Lisans yöneticisi: mevcut dosya ile gerçek hedef farklı

`components/layout-v2/LicenseManagerModal.tsx` dosyasında beş alanın tamamı required: Firma (`company`, text), Telefon No (`phone`, tel), Lisans Yöneticisinin Adı Soyadı (`managerName`, text), Lisans Yöneticisinin E-posta Adresi (`managerEmail`, email), Müşteri No (`customerNo`, text). Alanların `name` attribute'u yok; müşteri numarası için `C300XXXXXX` placeholder ve açıklama var, pattern yok.

Handler `:19–28` yalnız 1500ms bekler. Veri toplama/POST yok. Beklerken buton disabled ve “Gönderiliyor...”; ardından “Bilgileriniz Alındı! Lisans yönetici bilgileriniz sistemimize kaydedilmiştir. Teşekkür ederiz.” gösterir. Hata dalı yok; kapanış sonrası başarı sıfırlanır.

**Ancak app/components içinde bu bileşeni import/render eden tüketici bulunmadı.** Bu nedenle canlı çalışan form olarak sayılmadı. Gerçek `/solutions-v2/connect-license` CTA'sı `page.tsx:304` üzerinden **`https://forms.office.com/r/HSrhvAkYmb`** adresini açıyor. Harici formun alanlarını yerel kullanılmayan bileşenden çıkarmak yanlış olur. Sonraki canlı gözlemde ilk dört alan zorunlu, **Müşteri No isteğe bağlı** bulundu; kullanılmayan yerel modalın beş zorunlu alanıyla aynı değildir.

## 3. Aktivasyon: ilk adım gerçekten gönderiyor

Kaynak: `app/solutions-v2/connect-license/activation/ActivationWizard.tsx`; tüketici aynı dizindeki `ClientPage.tsx:26`.

| Adım | Alan / işlem | Zorunluluk / sonuç |
|---|---|---|
| 1 Kullanıcı Bilgileri | Adınız / firstName, Soyadınız / lastName, E-posta Adresiniz / email | JS boş/değer kontrolü; HTML required yok. Form elementine bağlı native doğrulama yok; email tipi tek başına bu buton akışını doğrulamaz |
| 2 Lisans Numarası | Yalnız açıklama ve görsel | Lisans/müşteri no giriş alanı yok |
| 3 Talep Nedeni | Yalnız İngilizce örnekler ve açıklama | Neden metni giriş alanı yok |
| 4 Dijital İmza | PDF imzalama ve destek platformuna yükleme talimatı | İmza/upload alanı yok; `https://www.allplan.net.tr` yönlendirmesi |
| 5 Tamamla | agreed checkbox, “Declaration Allplan formu için onay verin / Okudum, anladım, onaylıyorum.” | Yalnız PDF indirmeyi açar; ilk adımdaki gönderimi kontrol etmez ve POST'a eklenmez |

İlk “Devam Et” **POST `/api/send-activation-email`** gönderir; payload yalnız firstName,lastName,email. Boşlukları trim eden veya email biçimini doğrulayan kontrol görünmüyor. Eksik alan: “Lütfen tüm alanları doldurun.” Pending: “Bekleyiniz...”, gezinme disabled. HTTP başarılıysa “Bilgileriniz başarıyla kaydedildi.” ve adım2; başarısızsa “Bir hata oluştu, lütfen tekrar deneyin.”

Son adım hedefi `/docs/Declaration_Allplan_2021-06-01.pdf`, indirme adı `Declaration_Allplan.pdf`. Onay yoksa “Lütfen önce şartları onaylayın.”; varsa “Dosya indiriliyor...” toast. Toast indirme/teslimat başarısını kanıtlamaz. Örnek görsel `/images/Declaration_Allplan_2021-06-01.jpg`.

API kaynak davranışı (`app/api/send-activation-email/route.ts`):

- `:9–10` eksik değer için400 “Eksik bilgi”.
- `:13–29` yapılandırılmışsa webhook'a firstName,lastName,email,date gönderir. Webhook HTTP durumunu kontrol etmiyor; exception halinde mail akışına devam ediyor. Hedefin yapılandırma değeri okunmadı.
- `:46–82` `info@aluplan.com.tr` ve kullanıcının email adresine iki Nodemailer gönderimi; kullanıcı mesajı bunun **1. aşama** olduğunu ve imzalı PDF'nin destek platformuna yüklenmesi gerektiğini söylüyor.
- `:84–87` başarılı Promise sonucunda200 `{success:true,messageId}`; hata halinde500 “E-posta gönderilemedi”. Mail sağlayıcısının kabulü, gelen kutusu teslimatı veya kalıcı başvuru kaydı kanıtı değildir. İki gönderimden biri tamamlanıp diğeri hata verirse tekrar denemede mükerrer gönderim riski bulunur.

**Uygulama öncesi teknik açıklar:** görünen route içinde sınırlı truthiness doğrulaması, rate-limit/anti-spam kontrolü yok; kullanıcı metni mail HTML'ine doğrudan ekleniyor; TLS sertifika doğrulaması kapatılmış (`:40–42`). Güvenlik incelemesi ve gerçek teslimat kabul planı gerekir. Bu turda endpoint çalıştırılmadı veya değişiklik yapılmadı. İlk gönderim ile son onayın sırası ayrıca netleştirilmeli; bu teknik gözlem hukuki rıza değerlendirmesi değildir.

## 4. İletişim ve arama

`app/contact/ClientPage.tsx` içinde gömülü form/ContactModal yok. Üç CTA: deneme → `https://www.allplan.com/trial-or-subscription/`; teklif → `https://forms.office.com/r/hXhnKAG912`; destek → `https://allplan.net.tr/`. Form alanı/başarı/hata bu sayfaya atfedilmez. Sayfanın “30 gün” deneme metni mevcut stratejideki14 gün bilgisinden farklı; içerik kararı için korunmuş çelişki, bu tur değiştirilmedi.

`app/search/SearchPageClient.tsx:75–100` gerçek `<form>` içerir: zorunlu olmayan text query; submit `/search?q=${encodeURIComponent(query)}` navigasyonu; sonuçlar yerel searchIndex üzerinden filtrelenir. Durumlar: boş arama talimatı, sonuç sayısı, “Sonuç bulunamadı”; Suspense “Yükleniyor...”. Satış/iletişim teslimatı değildir.

## 5. Harici formlar: bilinen ile okunamayan ayrımı

| Hedef | Kaynak/kanıt | Alanlar ve açık durum |
|---|---|---|
| `https://forms.office.com/r/hXhnKAG912` | [21 Ekim tarayıcı gözlemi](./form-observation-2026-10-21.md); çok sayıda ürün/çözüm/teklif CTA'sı | 21 Ekim ALLPLAN dalına ek22 Ekim teklif/download/eklenti dalları gözlendi; aşağıdaki dal haritası geçerli. Sayfa8/14 ve teslimat hâlâ açık |
| `https://forms.office.com/r/HSrhvAkYmb` | Connect lisans sayfası “Lisans Yöneticisi Bilgi Formu” | Sonraki22 Ekim canlı gözleminde5 alan/4 zorunlu; ayrıntılar aşağıda. Başarı/hata/teslimat denenmedi |
| `https://forms.office.com/r/XLQm9JPTSR` | Pythonpart “Başvuru Formu”, Scalypso ve alt ürün sayfaları | Sonraki22 Ekim canlı gözleminde CDS AddOn başlığı,7 zorunlu soru; ayrıntılar aşağıda. Ana teklif formuyla aynı akış değil |

Ana teklif formunda önceki gözlemde zorunlu alanlar: Başvuru Tercihi (Teklif/Download/Eklenti Talep), ürün ilgisi (Allplan/AX3000/BIMX5/Eklentiler), Allplan talep türü (Teknik Bilgi/Fiyat Teklifi), abonelik ürün seçimi; sonrasında Adınız Soyadınız, E-Mail, GSM, Firma, Şehir, Çalışma Alanı, Bizi nereden duydunuz. Notlar zorunlu görünmedi. Ürün listesinin eksiksiz seçenekleri ve çalışma alanı/kaynak kanalı seçenekleri bağlı21 Ekim kaydında korunur. Harici sunucu alıcısı veya CRM hedefi bilinmiyor.

JSON, Microsoft Forms URL'lerinin app/components içindeki bütün statik referanslarını içerir; bu liste görünür CTA sayısı değildir (örn. Precast'te `false &&` içindeki referans da var). Üretici deneme, LearnNow ve destek girişleri ayrıca harici hizmettir; bunların özel formları bu salt-okunur envanterle bilinemez.

### Sonraki canlı doğrulama —22 Ekim

[Harici form AX kanıtı](./browser-complete-2026-10-22/external-forms.json) iki formun ilk sayfasını, veri girilmeden ve Submit kullanılmadan kaydeder. Önceki kaynak incelemesindeki “alanları bilinmiyor” durumu bu iki formun görünür alanları için kapanmıştır; biçim doğrulaması, başarı/hata ve teslimat açık kalır.

- **Lisans Yöneticisi Bilgi Formu:** Firma, Telefon No, Lisans Yöneticisinin Adı Soyadı ve Lisans Yöneticisinin E-posta adresi zorunlu tek satırlı metin. E-posta açıklaması “Kurumsal İş E-postası”. “Müşteri No ( C300 ile başlayan )” alanında zorunluluk işareti yok, açıklaması “Allplan Lisansına Sahipseniz Giriş Yapın”. Sayfada Submit mevcut. AX metni sunucu email biçim kontrolünü kanıtlamaz.
- **CDS Allplan Add On Teklif Talep Formu:** yedi sorunun tamamı zorunlu. Bizi nereden duydunuz? çoklu seçim: Instagram, Facebook, Linkedin, Google, Referans, Aluplan.com.tr. Eklenti Seçimi çoklu seçim: Sürüş Eğrisi, Rampa, Geometri Araçları, Parametrik Arazi, Çelik Profil Bileşenleri, 3B Ölçülendirme, 2B DWG Converter, SketchUp Dönüştürücü, Grafiksel Yazı. Adınız Soyadınız, Email, GSM, Şehir tek satırlı metin. Sektör tek seçim: Özel Sektör, Kurum / Belediye, Üniversite, Öğrenci. Aynı sayfada Submit var. Pythonpart/Scalypso girişlerinin bu CDS eklenti listesine gitmesi **niyet/hedef uyumu kararı** gerektirir; hedef değiştirilmedi.
- İki formda da gizlilik bağlantısı Aluplan `/gizlilik-politikasi`; bu bağlantı rıza/teslimat akışının tam kabul testi değildir.

[Eğitim canlı alan kayıtları](./browser-complete-2026-10-22/forms.json) dokuz yeni açılışı kapsar: beş detay sayfası; Temel, İleri Seviye, Özel sekmeleri; ayrıca sekmelerin dışındaki **Öğrenciler ve Okullar** bölümü. Önceki [BIM modal kanıtıyla](./dynamic-closure-2026-10-22.md) birlikte dört sekme +beş detay +okul/öğrenci olmak üzere on girişin alan/konu kapsamı doğrulandı. Hepsi aynı8 alanı, üç zorunlu alanı ve readonly konuyu gösteriyor. Okul/öğrenci konusu tam olarak **“Okul ve Öğrenciler İçin Teklif”**; ayrı bir form altyapısı değil, aynı ContactModal tüketicisi. Canlı alan/konu paritesi, gönderim simülasyonunun canlı teslimat testi yerine geçmez.

## Ana teklif formu: genişletilmiş canlı dal haritası

22 Ekim [kaydedilmiş AX kanıtı](./browser-complete-2026-10-22/external-forms.json) önceki ALLPLAN-only kapsamını genişletir. Yalnız dal seçimleri; kişisel veri veya gönderim yok. Bazı kayıtların sekme başlığı geçişten önceki sayfayı taşıyor; aşağıdaki sayfa numaraları güncel **AXWebArea/progress** değeridir.

| Giriş | Gözlenen dallar |
|---|---|
| Teklif → sayfa2 | Allplan→3; AX3000→4; BIMX5→5; Eklentiler→6 |
| Download → sayfa11 | Öğrenci→12; demo URL seçeneği→13 |
| Eklenti → sayfa6 | Allto PythonPart→10; Aluplan BIM→9; CDS→7; Scalypso→13; SDS2 Ultimate→13 |

**Sayfa8 gözlenen dallarda karşılaşılmadı. Sayfa14, sayfa13'teki zorunlu kişisel bilgiler girilmediği için açılmadı. 14 sayfanın tamamı veya bütün koşul kombinasyonları tamamlandı denemez.** Öğrenci ve BIM dalındaki belge/müşteri bilgileri girilmedi; sonraki geçişler varsayılmadı. Başarı/hata/teslimat ve format doğrulaması açık.

Aşağıdaki alan/seçenek kayıtları AX'ten olduğu gibi çıkarılmıştır; seçili0/1 değerleri testteki dal gezintisi durumunu gösterir. “Required to answer” gözlemi zorunluluk kanıtıdır; başlıkta görünmeyen zorunluluk metin alanında bulunabilir.

### Sayfa 11 — Download branch

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
57 heading DOWNLOAD, Value: 2
62 heading 15 - Download Formları Required to answer, Value: 2
68 radio button (settable, integer) Description: Allplan Öğrenci Versiyonu, Value: 0
72 radio button (settable, integer) Description: https://info.allplan.com/en/demo-download/cad-software-v2.html, Value: 0
```

### Sayfa 12 — Download student next

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
78 heading Öğrenci Versiyonu Başvuru, Value: 2
86 heading 16 - Gerekli Belgeler Required to answer, Value: 2
109 radio button (settable, integer) Description: YÖK e-devlet, Value: 0
113 radio button (settable, integer) Description: Öğrencilik Durumu: Aktif Öğrenci (Güncel Tarihli ), Value: 0
119 heading 17 - Bölüm Required to answer, Value: 2
125 radio button (settable, integer) Description: Mimarlık, Value: 0
129 radio button (settable, integer) Description: İnşaat Mühendisliği, Value: 0
133 radio button (settable, integer) Description: Yapı İşletmesi, Value: 0
137 radio button (settable, integer) Description: İnşaat Teknolojisi, Value: 0
141 radio button (settable, integer) Description: İç Mimarlık, Value: 0
```

### Sayfa 13 — Download demo next

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
77 heading Demografik Bilgiler, Value: 2
82 heading Adınız Soyadınız, Value: 2
84 text field (settable) 3, Adınız Soyadınız Required to answer. Single line text.
88 heading E-Mail, Value: 2
90 text field (settable) 4, E-Mail Required to answer. Single line text.
94 heading GSM, Value: 2
96 text field (settable) 5, GSM Required to answer. Single line text.
100 heading Firma, Value: 2
102 text field (settable) 6, Firma Required to answer. Single line text.
106 heading Şehir, Value: 2
108 text field (settable) 7, Şehir Required to answer. Single line text.
112 heading Çalışma Alanı Required to answer, Value: 2
118 radio button (settable, integer) Description: Özel, Value: 0
122 radio button (settable, integer) Description: Kurum / Belediye, Value: 0
126 radio button (settable, integer) Description: Üniversite, Value: 0
130 radio button (settable, integer) Description: Öğrenci, Value: 0
136 heading Bizi nereden duydunuz Required to answer, Value: 2
142 checkbox (settable, integer) Description: Instagram, Value: 0
146 checkbox (settable, integer) Description: Facebook, Value: 0
150 checkbox (settable, integer) Description: Google, Value: 0
154 checkbox (settable, integer) Description: LinkedIn, Value: 0
158 checkbox (settable, integer) Description: Twitter, Value: 0
162 checkbox (settable, integer) Description: Referans, Value: 0
166 checkbox (settable, integer) Description: aluplan.com.tr, Value: 0
172 heading Notlar, Value: 2
174 text entry area (settable) 10, Notlar Multi Line Text.
```

### Sayfa 6 — Addon request branch

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
56 heading Eklentiler, Value: 2
61 heading 08 - Eklenti Formları Required to answer, Value: 2
67 radio button (settable, integer) Description: Allto PythonPart Eklentisi, Value: 0
71 radio button (settable, integer) Description: Aluplan BIM Eklentisi, Value: 0
75 radio button (settable, integer) Description: Scalypso Eklentisi, Value: 0
79 radio button (settable, integer) Description: CDS Allplan Add On , Value: 0
83 radio button (settable, integer) Description: SDS2 Ultimate, Value: 0
```

### Sayfa 10 — Addon Allto

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
89 heading Allto PythonPart Eklentisi, Value: 2
112 heading 14 - Lütfen seçim yapın Required to answer, Value: 2
118 checkbox (settable, integer) Description: Wall Reinforcement, Value: 0
122 checkbox (settable, integer) Description: Wall Opening and Wall Edge Reinforcement, Value: 0
126 checkbox (settable, integer) Description: Beam Reinforcement, Value: 0
130 checkbox (settable, integer) Description: Column Reinforcement, Value: 0
134 checkbox (settable, integer) Description: Single Footing Reinforcement, Value: 0
138 checkbox (settable, integer) Description: Strip Footing Reinforcement, Value: 0
142 checkbox (settable, integer) Description: Detecting IFC Model Changes, Value: 0
146 checkbox (settable, integer) Description: Slab With Opening, Value: 0
150 checkbox (settable, integer) Description: Slab Main Rebar, Value: 0
154 checkbox (settable, integer) Description: Column dowels, Value: 0
158 checkbox (settable, integer) Description: Layout Service, Value: 0
162 checkbox (settable, integer) Description: 2D Axis Grid in ALLPLAN Engineering, Value: 0
```

### Sayfa 9 — Addon Aluplan BIM Eklentisi

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
89 heading Aluplan BIM Eklentisi, Value: 2
106 heading 11 - Lütfen seçim yapını Required to answer, Value: 2
112 checkbox (settable, integer) Description: Aluplan BIM Eklentisi 2023, Value: 0
116 checkbox (settable, integer) Description: Aluplan BIM Eklentisi 2024, Value: 0
122 heading 13 - Müşteri Numaranız:  , Value: 2
125 text field (settable) 4, 13 - Müşteri Numaranız:   Masaüstü > Allmenü 2024 > Bilgi > Müşteri Numarası  ( C300 000 000 0) Required to answer. Single line text.
```

### Sayfa 7 — Addon CDS Allplan Add On

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
89 heading CDS Allplan Add On, Value: 2
95 heading 09 - Lütfen ilgilendiğiniz ürünü belirtin. Required to answer, Value: 2
101 checkbox (settable, integer) Description: Sürüş Eğrisi, Value: 0
105 checkbox (settable, integer) Description: Rampa, Value: 0
109 checkbox (settable, integer) Description: Geometri Araçları, Value: 0
113 checkbox (settable, integer) Description: Parametrik Arazi, Value: 0
117 checkbox (settable, integer) Description: Çelik Profil Bileşenleri, Value: 0
121 checkbox (settable, integer) Description: 3B Ölçülendirme, Value: 0
125 checkbox (settable, integer) Description: 2B DWG Converter, Value: 0
129 checkbox (settable, integer) Description: SketchUp Dönüştürücü, Value: 0
133 checkbox (settable, integer) Description: Grafiksel Yazı, Value: 0
```

### Sayfa 2 — Quote product choices

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
56 heading Aluplan Ürünlerinden hangisi ile ilgileniyorsunuz?, Value: 2
61 heading 02- Ürünlerimizden hangisi ile ilgileniyorsunuz? Required to answer, Value: 2
67 radio button (settable, integer) Description: Allplan, Value: 0
71 radio button (settable, integer) Description: AX3000, Value: 0
75 radio button (settable, integer) Description: BIMX5, Value: 0
79 radio button (settable, integer) Description: Eklentiler, Value: 0
```

### Sayfa 4 — Quote AX3000

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
85 heading AX3000 MEP, Value: 2
91 heading 06- Ürün Seçimi  Required to answer, Value: 2
97 checkbox (settable, integer) Description: AX3000 MEP, Value: 0
101 checkbox (settable, integer) Description: Havalandırma (Akustik hesaplama & konut havalandırma dahil ), Value: 0
105 checkbox (settable, integer) Description: Isıtma ( Döşemeden ısıtma & TS825 ısı kaybı hesabı dahil ), Value: 0
109 checkbox (settable, integer) Description: Soğutma, Value: 0
113 checkbox (settable, integer) Description: Sıhhi Tesisat ( Sprinkler "grafiksel" & Yağmur suyu dahil ), Value: 0
117 checkbox (settable, integer) Description: Elektrik, Value: 0
```

### Sayfa 5 — Quote BIMX5

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
85 heading BIMX5 TEKLİF TALEP, Value: 2
90 heading 07 - Ürün Seçimi - Abonelik Required to answer, Value: 2
96 checkbox (settable, integer) Description: Oska e-Hakediş Pro, Value: 0
100 checkbox (settable, integer) Description: 2B DWG Converter, Value: 0
104 checkbox (settable, integer) Description: İmar Yönetmeliği Eklentisi, Value: 0
108 checkbox (settable, integer) Description: Kurumlar Raporları Eklentisi, Value: 0
```

### Sayfa 3 — Quote Allplan

```text
7 heading Aluplan Teklif & Talep Formu, Value: 1
85 heading ALLPLAN , Value: 2
91 heading 03- Allplan hakkında teklif almak istiyorum. Required to answer, Value: 2
97 checkbox (settable, integer) Description: Teknik Bilgi Talep Ediyorum, Value: 0
101 checkbox (settable, integer) Description: Fiyat Teklifi Talep Ediyorum, Value: 0
107 heading 05 - Allplan Ürün Seçimi - Abonelik Required to answer, Value: 2
113 checkbox (settable, integer) Description: ALLPLAN Basic, Value: 0
117 checkbox (settable, integer) Description: ALLPLAN Concept, Value: 0
121 checkbox (settable, integer) Description: ALLPLAN Professional, Value: 0
125 checkbox (settable, integer) Description: ALLPLAN Ultimate, Value: 0
129 checkbox (settable, integer) Description: ALLPLAN Civil, Value: 0
133 checkbox (settable, integer) Description: ALLPLAN Precast , Value: 0
137 checkbox (settable, integer) Description: ALLPLAN License Server, Value: 0
141 checkbox (settable, integer) Description: SDS2 | Steel Detailing Software, Value: 0
145 checkbox (settable, integer) Description: FRILO Editions , Value: 0
149 checkbox (settable, integer) Description: FRILO GEOTECHNICS, Value: 0
153 checkbox (settable, integer) Description: SCIA Engineer Editions , Value: 0
```

## Kapanış kararları

1. Eğitim ContactModal için tasarım öncesi “talep nereye teslim edilecek?” kararı gerekli. Simülasyonu üretim başarısı olarak taşımamak bizim teknik kararımız olabilir; hedefi kendiliğinden değiştirmeyiz.
2. Lisans yöneticisinde çalışan harici hedef korunmalı; kullanılmayan yerel modal yeni bir form gereksinimi sayılmamalı.
3. Aktivasyonda içerik, ilk iletişim gönderimi, PDF indirme ve imzalı dosyanın destek platformuna iletimi ayrı durumlar olarak tasarlanmalı. API güvenlik/teslimat çalışması uygulama öncesi kapıdır.
4. Ana teklif formunun okunamayan dalları ve tüm formların teslimat durumları açık bırakılır; kullanıcıdan alanları elle dökmesini istemek yerine sonraki yetkili salt-okunur tarayıcı incelemesinin işi olarak listelenir. Gerçek gönderim ayrı izinli kabul testi olur.

Envanter mevcut davranışı kaydeder; alan silme, hedef değiştirme veya entegrasyon onayı değildir. Kod, içerik ve schema değişmedi.

## Bağımsız kaynak güvenlik kontrolü

22 Ekim ayrı inceleme kaynak bulgularını doğruladı: SMTP `rejectUnauthorized:false` ve kullanıcı adresine gönderim için route içinde görünen sınırlı doğrulama/rate-limit eksikliği yüksek; kaçışlanmamış mail HTML metni ve kısmi gönderim/webhook hata davranışı orta risk olarak değerlendirildi. Dış koruma katmanı ve canlı istismar incelenmedi. `secure:false` tek başına açık değildir; `ciphers:"SSLv3"` gerçek bağlantının SSLv3 kullandığının kanıtı değildir. Mail HTML enjeksiyonu doğrulanmış tarayıcı XSS diye sunulmaz. API kaynak kodu değiştirilmedi ve çağrılmadı. Bulgular kapanmadan2027'ye aynen taşıma/yayın güvenlik kabulü verilmez.
