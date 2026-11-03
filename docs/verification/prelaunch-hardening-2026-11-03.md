# Yayın öncesi sağlamlaştırma — kabul kaydı, 03.11.2026

Plan: `docs/superpowers/plans/2026-11-03-prelaunch-hardening.md`. Dal: `codex/prelaunch-hardening` (`codex/prelaunch-blockers` üzerine). Push, deploy ve Vercel ayarı değişikliği yapılmadı.

## Kapanan maddeler

| Madde | Commit | Sonuç |
|---|---|---|
| Y1 ana sayfa ağırlığı | `2b384e4` | 8 PNG (22 MB) yerine 1200 px JPEG türevleri (2,2 MB). Ana sayfanın referans verdiği toplam boyut **20,1 MB → 5,6 MB**. Varsayılan OG görseli, eski tasarıma ait 1960×15736 ekran görüntüsü yerine 1200×630 JPEG. |
| Y2 `/2027/max` medyası | `812cf6c` | Klipler ekrana girene kadar kaynak almıyor ve yalnız ≥768 px ekranda, hareket azaltma kapalıyken oynuyor. 375 px'de tam kaydırmada MP4 indirmesi **≈8 MB → 0**. Tanıtım videosu tıklanınca yükleniyor. |
| Y3 analitik | `f598503` | GA4 (`G-DQYT0D9MQ5`) ve Vercel ölçümleri yalnız onaydan sonra yükleniyor. CSP, GA4 veri gönderimini engelliyordu; düzeltildi. |
| Y4 üçüncü taraf gömmeler | `84d5579` | Tüm iframe'ler `ConsentEmbed` üzerinden gösteriliyor. Onay yoksa kapak çıkıyor ve yalnız tıklanan gömme yükleniyor; YouTube her yerde `youtube-nocookie.com`. |
| Y5 YouTube kanalı | `d3d173c` | `@ALLPLANglobal` ve kaynaktaki `@AllplanInternational` adreslerinin ikisi de 404. Kart, allplan.com'un kendi verdiği `youtube.com/c/AllplanInternational` adresine bağlandı. |
| O2 önbellek | `dfb2969` | `/assets`, `/docs`, `/videos` ve `/images` 7 gün önbellekte kalıyor (`stale-while-revalidate` ile). `_next/static` önbelleği `immutable` olarak kaldı. |
| O3 Node sürümü | `dfb2969` | `engines` 24.x, `.nvmrc` 24, CI `.nvmrc` dosyasını kullanıyor. |
| O6 izleme | `f598503` | Vercel Web Analytics ve Speed Insights betikleri onaydan sonra ve yalnız Vercel build'lerinde yükleniyor. **Vercel panelinden etkinleştirilmesi gerekiyor.** |
| O9 kontrast | `f8b510d` | Ana sayfa "İncele" etiketi **4,30:1 → 9,46:1** (opaklık dahil). |
| O10 iletişim başlığı | `f8b510d` | "İletişim ve Teknik Danışmanlık \| Aluplan" |
| D5 alt metin | `f8b510d` | 13 boş alt metinli görselin 12'si `aria-hidden` ikon, 1'i arka plan hero'su; hepsi dekoratif. Durum testle sabitlendi. |
| D9 tablo ARIA | `f8b510d` | ✓ ve — işaretleri ekran okuyucudan gizlendi, yerine görünmez metin eklendi; tooltip butonları `aria-controls` ile tooltip'e bağlandı. |
| D12 konsol uyarıları | `84d5579` | `web-share` izni artık istenmiyor; manuel PNG preload'u kalktı. |

## Kod değişmeden kabul edilen riskler (H6)

- **D2 – CSP `'unsafe-inline'`:** Nonce tabanlı CSP, Next.js'in 118 statik sayfasını her istekte dinamik render'a zorlar; önbellek ve performans kaybı getirir. Inline betikler build zamanında üretiliyor ve kullanıcı girdisi içermiyor.
- **D3 – `access-control-allow-origin: *`:** Vercel'in statik içerik varsayılanı. HTML herkese açık; çerez veya kimlik bilgisi taşımıyor.

## Kapatılamayan ve kararınızı bekleyen maddeler

- **H7 – BIMFlex videosu (`Qyy_hRNkOtY`):** Video YouTube'da **özel** ("Private video"). Dış bağlantı da çalışmaz. Kart kaldırılsın mı, yoksa video sahibinden herkese açık yapılması mı istensin? Aynı durum canlı sitede de var.
- **YouTube kart metni:** "Youtube Allplan Global" kartı artık üreticinin verdiği kanala gidiyor; kanal YouTube'da "ALLPLAN Deutschland" adıyla görünüyor. Kart başlığı ve açıklaması değiştirilmedi.
- **Onayı geri çekme:** Çerez bandı yalnız bir kez gösteriliyor; ayarı sonradan değiştirecek bir arayüz yok. KVKK açısından bir "Çerez tercihleri" bağlantısı eklenmesi önerilir.
- **Görsel hakları:** Yeni OG görseli (VF-00) ve Max video posteri AI ile üretilmiş görseller; lisans kaydı onay bekliyor.

## Bağımsız kod incelemesi ve düzeltmeler

Dalın tamamı ayrı bir inceleyici tarafından incelendi: Critical bulgu çıkmadı, sonuç "Ready to merge: With fixes".

**Düzeltilen bulgular:**
- **Max klipleri (Important):** Mobilde ve hareket azaltma açıkken klipler boş kutu olarak görünüyordu. Artık görünür olan klip ilk kareyi gösteriyor (`preload="metadata"` + `#t=0.1`). Bu nedenle mobilde görünür kliplerin meta verisi ve ilk karesi indiriliyor; kayıttaki "MP4 indirmesi 0" artık "yalnız ilk kare" anlamına geliyor.
- **Kapak butonu (Minor'den Important'a yükseltildi):** Buton adı artık gömmenin başlığını içeriyor ("{başlık}: Videoyu oynat"). Tıklama sonrası klavye odağı iframe'e geçiyor.
- **Satır içi kapak (Minor'den Important'a yükseltildi):** Video tek tıklamada başlıyor (`autoplay=1`).

**Ertelenen bulgular:**
- **YouTube küçük resimleri:** 275 adet `img.youtube.com` küçük resmi (oynatma listeleri, medya ızgaraları) onaydan bağımsız yükleniyor. Bu durum önceden de vardı. KVKK tutarlılığı için yerel küçük resimlere geçilmesi ya da bunların da onaya bağlanması ayrıca karar gerektiriyor.
- **Türev kontrolü:** `build_web_derivatives.py --check`, kaynak görsel değişip en-boy oranı aynı kalırsa eski türevi yakalamıyor. Kaynak dosyaların SHA-256 değerlerini tutan bir manifest eklenebilir.
- **İletişim haritası:** Haritanın yüksekliği kapakta ve yüklenmiş haritada farklı; onaydan sonra küçük bir yerleşim kayması oluyor.

## Komutlar ve sonuçlar

| Komut | Sonuç |
|---|---|
| `pnpm test` | 272 unit test, 36/36 parite, 45/45 token testi geçti |
| `pnpm typecheck` | Hatasız |
| `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=0 pnpm build` ve `=1` | İkisi de geçti |
| `pnpm audit --prod` | Bilinen güvenlik açığı yok |

## Tarayıcı kabulü (yerel production)

- **Onay verilmemiş ziyaretçi:** GA, Vercel, YouTube ve Google Maps isteği 0. `/contact`, `/about`, `/2027/civil` ve oynatma listesi sayfalarında kapak gösteriliyor.
- **"Kabul" sonrası:** GA sayfa yenilenmeden yüklendi, `collect` isteği gitti, CSP ihlali 0.
- **"Reddet" sonrası:** Üçüncü taraf isteği 0.
- **Gömme davranışı:** Harita kapağına tıklayınca harita 320 px yüksekliğinde yüklendi. Civil kapağı videoyla aynı boyutta (525×295). Max modalı doğrudan `youtube-nocookie` adresini yükledi; gerçek Escape tuşu modalı kapattı ve odak tetikleyici butona döndü.
- **375 px görünüm:** `/contact`, `/about`, `/solutions/scalypso` ve oynatma listesi sayfalarında yatay taşma yok.

## Ölçüm yöntemi ve sınırlar

- **Sayfa ağırlığı:** HTML'deki tüm görsel, betik ve stil adreslerinin boyutu toplandı (`HEAD` isteğindeki `Content-Length`). "Önce" değeri `aluplan-2027.vercel.app`, "sonra" değeri yerel build'den alındı. Bu ölçüm sıkıştırma öncesi boyutu verir; gerçek aktarım daha düşüktür.
- **Sınır:** Mobil Lighthouse ve gerçek kullanıcı verisi yine ölçülemedi.
- **Kapsam dışı gözlem:** 1,6 MB'lık (sıkıştırılmamış) bir JS paketi var; ayrıca incelenmeye değer.
