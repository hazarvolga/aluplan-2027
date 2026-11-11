# Akademi yayına hazırlık (kısa tasarım + plan)

Tarih: 2026-11-11 · Kullanıcı onayı: "Evet, böyle yap" (üç karar aşağıda).

## Amaç

Akademi canlıya alındığında tüm içeriği dizine eklenebilir, paylaşıldığında düzgün kart gösterir ve
ana siteden ulaşılabilir olsun. Yayın tek anahtarla (Coolify'da `ALUPLAN_SHOW_AKADEMI=1`) açılıp kapanır.

## Kararlar (kullanıcı onaylı)

1. **Tek yayın anahtarı.** `isAkademiEnabled()` açıkken: Akademi sayfaları `index, follow`; sitemap,
   `llms.txt` ve site araması Akademi'yi içerir. Kapalıyken: bugünkü gibi 404, hiçbir listede yok.
2. **Ana site bağlantısı.** Bayrak açıkken ana site üst menüsünde ve altbilgide "Akademi" bağlantısı.
3. **Sayfa başına paylaşım görseli.** Her Akademi sayfası için 1200×630 PNG (başlık, seri/seviye
   etiketi, Aluplan logosu); her sayfaya başlık, açıklama, kanonik adres, Open Graph ve X kartı;
   ders sayfalarına `LearningResource`, seri sayfalarına `Course` yapılandırılmış verisi.

## Hedef dışı

URL değişikliği, yeni içerik, çoklu dil (`hreflang`), Akademi için ayrı alan adı.

## Kaçınılacaklar

- Bayrak kapalıyken herhangi bir Akademi yolunun sitemap/llms/menüye sızması.
- Staging ya da yerel ortamın dizine açılması: staging zaten parola korumalı; ek önlem gerekmez.
- Sayfa başına elle yazılmış meta: tek katalogdan üretilir (bakım yükü tek yerde).

## Tasarım

- **Sayfa kataloğu** `src/lib/akademi-pages.ts` (yalnız sunucu): `listAkademiPages(): AkademiPageInfo[]`
  ve `getAkademiPage(path)`. `AkademiPageInfo = { path, title, description, kicker, kind: 'overview' | 'catalog' | 'level' | 'module' | 'series' | 'lesson', series? }`.
  Kaynaklar: `akademiProgram.levels`, modül JSON'ları, 8 serinin `*Hero` ve `*Lessons` dışa aktarımları.
- **Metadata yardımcısı** `src/lib/akademi-metadata.ts`: `akademiMetadata(path): Metadata` → başlık
  (`<başlık> | Aluplan Akademi`), açıklama, `alternates.canonical`, `robots` (bayrak açık → index/follow),
  `openGraph` (type `website`, `locale tr_TR`, görsel `/og/akademi/<yol>`), `twitter` (`summary_large_image`).
  Tüm Akademi `page.tsx` dosyalarındaki sabit `robots: { index: false }` bununla değişir
  (dinamik rotalarda `generateMetadata`).
- **Paylaşım görseli** `src/app/og/akademi/[[...path]]/route.tsx`: `next/og` `ImageResponse`, katalogdan
  başlık/etiket; bayrak kapalıysa ya da yol yoksa 404; `Cache-Control: public, max-age=86400, immutable`.
  Görsel: koyu zemin, Aluplan beyaz logo (SVG data URI), mono etiket, büyük başlık, alt satır "Aluplan Akademi".
- **Sitemap** `src/app/sitemap.ts`: bayrak açıkken `listAkademiPages()` girdileri (öncelik: genel bakış 0.8,
  seri/seviye 0.7, ders/modül 0.6).
- **llms.txt** `src/app/llms.txt/route.ts`: bayrak açıkken "Aluplan Akademi" bölümü (genel bakış, seviyeler, seriler).
- **Menü** ana site üst menüsü ve altbilgi: bayrak açıkken "Akademi" → `/akademi` (SiteShell'e prop ile;
  istemci bayrağı okuyamaz).
- **Yapılandırılmış veri**: ders sayfalarına `LearningResource` (+ `isPartOf` Course), seri sayfalarına `Course`
  (`hasPart` dersler), mevcut `AkademiJsonLd` deseninde.

## Testler

Taslak döneminin "Akademi hiçbir listede yok / hep noindex" testleri, "bayrağa bağlı" testlere dönüşür.
Yeni: katalog her ders/modül/seviye/seri yolunu tam bir kez içerir; her Akademi `page.tsx` metadata'yı
yardımcıdan alır; sitemap/llms/menü bayrağa bağlı; OG rotası bayrak kapalıyken 404; derlenmiş bir ders
sayfasında `og:image`, `twitter:card`, `canonical`, `index` ve JSON-LD bulunur; OG görseli 200 ve `image/png` döner.
