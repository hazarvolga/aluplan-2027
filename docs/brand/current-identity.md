# Mevcut kimlik ve marka kılavuzu farkları

19.10.2026. Kaynak kökü `../aluplan-2026` salt-okunur. Yeni kılavuz `../BRAND-GUIDELINES.md` v1.0 **taslak / onay bekliyor**. Mevcut değerlerin tam dökümü: `../00-inventory/existing-design-tokens.json` ve `.md`.

| Özellik | Mevcut kaynak kanıtı | Kılavuz önerisi | Karar durumu |
|---|---|---|---|
| Ana renk | CSS primary `217 91% 60%` (yorum #3B82F6); `styles/globals.css` | Alu Teal #2DD4BF / #0F766E | Onay bekliyor |
| Koyu arka plan | CSS `0 0% 2%`; viewport themeColor #0a0e27 ayrı değerdir | Ink 900 #0A0E27 | Onay bekliyor |
| Açık arka plan | `0 0% 100%` | Silver 50 #F5F7FA / beyaz | Onay bekliyor |
| Başlık font ailesi | Tailwind display: Space Grotesk; başlıklarda kullanım bileşene göre değişebilir | Manrope 600/700/800 | Onay bekliyor |
| Gövde fontu | Inter / system-ui | IBM Plex Sans 400/500/600 | Onay bekliyor |
| Teknik font | IBM Plex Mono / Menlo | IBM Plex Mono 400/500 | Onay bekliyor |
| Font yükleme | Google Fonts CSS import, `styles/globals.css:1` | Self-host WOFF2, latin/latin-ext | Faz 3/4 gereksinimi; uygulanmadı |
| Tema | class, defaultTheme dark, enableSystem; `app/layout.tsx` | Sistem tercihi varsayılan, kalıcı seçim | Davranış değişikliği; PRD'ye taşınacak |
| Radius | --radius 0.25rem ve md/sm türevleri | 8px / 12px, rozet 999px | Onay bekliyor |
| Container | 2rem padding, 2xl 1400px | 1200–1280px, cihaz bazlı padding | Onay bekliyor |
| Logo | Kaynaktaki siyah/beyaz SVG'ler | Önce koruma; yeni sembol ayrı onayla | Mevcut logo korunur |
| Marka ilişkisi | ALLPLAN odaklı ürün/hero/title anlatımı | Aluplan bağımsız distribütör/uzman kimliği | Yeni kimlik yönü taslak; mevcut içerik korunur |
| CTA | Mevcut metinler ve harici hedefler | Örnek “Teklif iste” / “14 gün ücretsiz dene” | Örnekler mevcut metin değiştirme izni değil |

## Çakışmaların uygulanma sırası

1. MASTER-PROMPT faz sırası ve içerik koruma kuralları geçerli. Kılavuzda token örneği bulunması Faz 4'e geçiş onayı değildir; `design-system/` boş kalır.
2. Yeni palet/font/logo/slogan önerileri kullanıcı onayı olmadan uygulanmaz. Mevcut metinler, sayılar ve üretici görselleri envanterde korunur; izin durumu ayrı kaydedilir.
3. Kılavuzun “hatasız” vaat önerisi, doğrulanmamış iddia kullanmama kuralıyla birlikte PRD'de açık soru olarak ele alınır; siteye yeni vaat eklenmez.
4. 14/30 gün deneme süresi uyuşmazlığı otomatik çözülmez. Kaynak metin ve hedef URL korunur; değişiklik için dayanak ve onay gerekir.
5. ALLPLAN/Nemetschek'in kullanım izinleri hakkında kılavuzdaki ifadeler, elimizde üreticinin yazılı izin/şart belgesi bulunduğu anlamına gelmez. Resmî kurallar ve varlık başına izin kaydı bekleniyor.
6. Hukuki footer metni taslak; hukuk/kullanıcı onayı alınmadan mevcut footera eklenmez. Mevcut geliştirici kredisi korunur.
7. Kılavuzun benzerlik kontrolü, onay öncesi ve yayın öncesi yapılacak iştir. Henüz yeni ana sayfa/tasarım olmadığından karşılaştırma tamamlandı sayılmaz. Üreticiye mesaj gönderilmedi; yazılı geri bildirim talebi ayrıca kullanıcı yetkilendirmesi gerektirir.

## Açık marka onayları
- Mevcut logo ile devam veya ayrı yeni sembol çalışması.
- Teal/Ink paleti ve Manrope/IBM Plex Sans/IBM Plex Mono eşleşmesi.
- Slogan seçimi, mevcut sloganın kullanım hakkı.
- Üretici marka kullanım dokümanı, ekran görüntüsü/video/logo izinleri.
- Title/hero ALLPLAN vurgusu ve sosyal hesap isimleri.
- Mevcut teknik hero etiketlerinin silinmeden sunumu.

Bu belge tasarım uygulaması veya hukuki uygunluk sonucu değildir.
