# Sayfa Sonu Dönüşüm Alanı — Kısa Tasarım

Tarih: 27 Ekim 2026
Durum: Kullanıcı onayı bekliyor
Restore point: `restore/pre-page-end-conversion-20261027` → `862ebb15e328c6eee47755d6070f8d333a4125b9`

## Amaç ve gerekçe

Otomatik “İlgili Bağlantılar, Modüller ve Dokümanlar” bölümü bütün sayfalarda gerçek bir içerik ilişkisi sunmuyor; bazı sayfalarda yalnız teklif ve deneme CTA'larını yanlış bir başlık altında göstererek anlatı akışını bölüyor. Sayfa sonu alanının öncelikli görevi, ziyaretçiyi bağlamına uygun bir sonraki ticari veya operasyonel adıma yönlendirmek olacak.

## Hedefler

- Otomatik related-links bölümünü görünür arayüzden tamamen kaldırmak.
- Footer'ın hemen öncesinde en fazla bir adet, ortak tasarım sistemine bağlı dönüşüm bileşeni kullanmak.
- CTA metnini ve hedefini sayfa ailesine göre belirlemek.
- Mevcut Microsoft Forms, ALLPLAN deneme ve Aluplan destek hedeflerini aynen korumak.
- İçerik, schema ve tema katmanlarını birbirinden bağımsız tutmak.

## Hedef olmayanlar

- `contentLinks` kaynak verisini veya tarihsel URL envanterini silmek.
- Microsoft Forms yapısını, form alanlarını veya teslimat operasyonunu değiştirmek.
- Yeni schema türü, fiyat, kampanya, süre veya ürün hakkı üretmek.
- Header, footer, ana menü veya canlı siteyi değiştirmek.
- Tasarım tokenlarını bu iş kapsamında yeniden tanımlamak.

## Değerlendirilen yaklaşımlar

1. **Her sayfada aynı teklif + deneme bandı:** En düşük bakım maliyeti; eğitim ve destek sayfalarında zayıf bağlam.
2. **Tek bileşen, sayfa ailesine göre CTA:** Tutarlı teknik yapı ve bağlama uygun mesaj. **Seçilen yaklaşım.**
3. **Yalnız ticari sayfalarda dönüşüm bandı:** Daha sade; eğitim ve destek kullanıcılarının doğal sonraki adımını görünmez bırakır.

## Seçilen davranış

Tek `PageEndConversion` bileşeni ana sayfa içeriği tamamlandıktan sonra ve site footer'ından hemen önce render edilir. Aynı sayfada ikinci related-links veya global trial bandı bulunmaz.

| Sayfa ailesi | Birincil CTA | İkincil CTA | Hedef |
|---|---|---|---|
| Ürün, paket ve ticari çözüm sayfaları | Teklif İste | Ücretsiz Deneme | Mevcut Microsoft Forms + `https://www.allplan.com/trial-or-subscription/` |
| Eğitim kökü, eğitim türleri, webinar ve video kütüphanesi | Eğitim Talebi | Teklif İste | İki CTA da mevcut tek Microsoft Forms hedefini kullanır; yeni form veya gizli gönderim yoktur |
| Teknik destek, lisans/aktivasyon ve SSS yardım sayfaları | Destek Platformuna Git | Yok | `https://allplan.net.tr/tr` |
| Hakkımızda ve Referanslar | Teklif İste | Yok | Mevcut Microsoft Forms |
| İletişim, arama, sağlık ve yasal sayfalar | Gösterilmez | Gösterilmez | — |
| Ana sayfa | Mevcut hero ve profesyonel hizmet CTA'ları korunur; ek sayfa sonu bandı eklenmez | — | Mevcut hedefler |

Sayfa ailesi eşlemesi tek bir saf politika fonksiyonunda tutulur; bileşen rota kontrolü yapmaz. Böylece içerik/politika ile görsel sunum ayrılır. Gelecekte CMS eklenirse aynı politika girdisi içerik kaydından beslenebilir.

## İçerik ve SEO/GEO sınırı

- Otomatik related-links başlığı ve buton grubu render edilmez.
- İçerik içindeki anlamlı doğal bağlantılar, breadcrumb, menü, kategori/hub sayfaları ve sitemap korunur.
- `contentLinks` verisi kaynak/parite kaydı olarak kalır; silinmez ve schema alanına dönüştürülmez.
- Dönüşüm CTA'ları JSON-LD varlığı değildir; mevcut Product, Service, WebPage ve Organization ilişkileri değişmez.
- Aynı CTA'nın tekrarı yeni bir semantik ilişki olarak yorumlanmaz.

## Görsel ve etkileşim kuralları

- Bileşen mevcut semantik design tokenlarını kullanır; yeni sabit renk, radius, spacing veya shadow eklenmez.
- Birincil ve ikincil CTA görsel hiyerarşisi korunur.
- Harici bağlantılar güvenli yeni sekme davranışı ve erişilebilir adlarla sunulur.
- Yasal/yardımcı sayfalarda boş alan veya boş başlık render edilmez.
- Mobilde CTA'lar okunabilir sırayla alt alta, geniş ekranda aynı cluster içinde gösterilebilir.

## Kabul ölçütleri

- “İLGİLİ BAĞLANTILAR, MODÜLLER VE DOKÜMANLAR” ve “Bu Sayfayla İlgili Hızlı Geçişler ve İndirmeler” metinleri çalışan sayfalarda görünmez.
- Her rota sıfır veya bir `PageEndConversion` üretir; iki kapanış bandı oluşmaz.
- Temsilî ürün, çözüm, eğitim, destek, kurumsal, iletişim ve yasal rotalar doğru politika sonucunu test eder.
- CTA hedefleri mevcut onaylı URL'lerle birebir eşleşir.
- Schema çıktısı, generated content data ve public URL listesi değişmez.
- `pnpm test`, `pnpm typecheck` ve `pnpm build` geçer; masaüstü ve mobil tarayıcı kontrolü yapılır.

## Açık uygulama işi

Onaydan sonra test-first uygulama planı hazırlanacak; ortak bileşen, saf sayfa-ailesi politikası, mevcut iki related-links render noktasının kaldırılması, global trial bandının birleştirilmesi ve tarayıcı kabul adımları planlanacaktır.
