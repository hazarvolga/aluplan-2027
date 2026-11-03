# Yayın öncesi engeller (E1–E5) — kabul kaydı, 02.11.2026

Plan: `docs/superpowers/plans/2026-11-02-prelaunch-blockers.md`. Dal: `codex/prelaunch-blockers`, `615eeb9..25b23b2`. Push, merge, deploy ve Vercel ortam değişkeni değişikliği yapılmadı.

## Kapanan engeller

| Engel | Commit | Kanıt |
|---|---|---|
| E1 — bayrak ikilemi | `3445b44` | `ALUPLAN_SHOW_2027` ve `ALUPLAN_BLOCK_INDEXING` ayrıldı; ortam yalnız `src/lib/release-flags.ts` ve `next.config.mjs` içinden okunuyor. `/2027/*` kendi sayfalarına sahip, `/preview/*` production'da 404. |
| E2 — 2027 SEO | `25b23b2` | Altı rota için canonical, OG, Twitter, JSON-LD (`WebPage`, `BreadcrumbList`, `SoftwareApplication` — `compare` hariç) ve sitemap kaydı eklendi; "Yerel inceleme" etiketleri kaldırıldı. Tüm JSON-LD `<` kaçışlı. 2027 ana sayfa varyantı da JSON-LD basıyor. `llms.txt` 2027 bölümü eklendi. |
| E3 — kart bağlantıları | `d8cf355` | `/products` 7, `/solutions/addons` 9, `/solutions/cds-addon` 9, `/solutions-v2/training` 6, `/solutions/ax3000-mekanik-tesisat` 6 kart bağlantısı kaynaktan geri geldi. |
| E4 — AX3000 dokümanları | `1f07293` | 6 indirme kaynak `documentGroups` dizisinden; 6/6 dosya 200 dönüyor. |
| E5 — lisans bağlantıları | `52459ad` | `connect2.allplan.com`, `how-to-assign` ve `forms.office.com/r/HSrhvAkYmb` geri geldi. 6 AX3000 alt sayfasına modül gezinmesi (7 bağlantı) ve mekanik tesisat EKB/doküman CTA'ları eklendi. |

## Komutlar ve sonuçlar

| Komut | Sonuç |
|---|---|
| `pnpm test` | 224 unit test, 36/36 faz paritesi, 45/45 token testi geçti |
| `pnpm typecheck` | Hatasız |
| `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` | Geçti |
| `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=0 pnpm build` | Geçti |
| `pnpm audit --prod` | Bilinen güvenlik açığı yok |
| `pnpm data:generate` (2 kez) | `src/data/*.json` bayt bazında aynı; değişen veriler yalnız eklenen `link`, `actions` ve `documentGroups` alanları |

## Yerel production kabulü

**İnceleme ortamı (`SHOW=1`, `BLOCK=1`):**
- `/` → `X-Robots-Tag: noindex, nofollow`, `robots.txt` `Disallow: /`, meta `noindex, nofollow`.
- `/2027/*` 6 rota → 200 ve meta `noindex, nofollow`.
- E3–E5 kapsamındaki 9 rota → 200.

**Gerçek alan adı ayarı (`SHOW=1`, `BLOCK=0`):**
- `/2027/max`, `/2027/features`, `/2027/compare` → `x-robots-tag` yok, meta `index, follow`, canonical `https://aluplan.com.tr/2027/*`, rotaya özgü `og:image`.
- Sitemap 6 2027 rotasını içeriyor; `/preview/*` 404 dönüyor.

**Geri dönüş ayarı (`SHOW=0`):** runtime testiyle doğrulandı. Eski ana sayfa varyantı dönüyor ve sitemap'te `/2027/` kaydı yok.

**Gerçek tarayıcı kabulü (yerleşik tarayıcı, `SHOW=1`, `BLOCK=1`):**
- Masaüstünde `/products` → "Detayları Görüntüle: ALLPLAN Civil" tıklaması `/products/civil` sayfasını açtı.
- `/solutions-v2/connect-license` sayfasında Tab ile odaklanan "Allplan Connect'e Git" bağlantısında `:focus-visible` görünür (2 px solid).
- 375 px görünümde `/products`, `/solutions/addons`, `/solutions-v2/training`, `/products/ax3000/dokumanlar`, `/solutions-v2/connect-license` ve `/solutions/ax3000/sprinkler` sayfalarında yatay taşma yok.
- Konsol hatası yok.

## Açık kalanlar (kullanıcı kararı)

- **K3 metinleri:** 2027 sayfalarının başlıkları "ürün adı | Aluplan" biçiminde; açıklamalar sayfada yayında olan hero paragrafından birebir alındı. Yeni metin yazılmadı. Onay bekleniyor (`src/lib/release-2027-routes.ts`).
- **`/2027/features` H1'i:** ana sayfa H1'iyle aynı; farklı bir H1 yeni metin gerektiriyor.
- **`/preview/product-lifecycle`:** kullanıcı kararıyla (03.11.2026) `/product-lifecycle` adresine taşındı; eski adres 308 ile yönleniyor. Sayfa rota kaydına eklendi (canonical, OG, JSON-LD, sitemap), "Yerel Önizleme" başlığı ve sabit noindex kalktı. Önceki not: 2027 ana sayfası bu adrese bağlantı veriyor, bu yüzden yayın bayrağıyla açık. Kalıcı URL ve "Yerel Önizleme" başlığı için karar gerekiyor.
- **Bağlantı farkları:** `docs/verification/main-link-gap-2026-11-02.md` D bölümündeki farklar sınıflandırılmalı.
- **OG görselleri:** `/2027/max` OG görseli AI üretimi hero, `/2027/scia` OG görseli FRILO hero'su. Marka ve hak onayı açık.
- **Vercel ortam değişkenleri (K2):** Preview ve Production için `ALUPLAN_SHOW_2027=1` ve `ALUPLAN_BLOCK_INDEXING=1` tanımlanmalı, ardından `ALUPLAN_2027_PREVIEW` kaldırılmalı. Eski değişken yeni değişkenler olmadan dururken `next.config.mjs` build'i bilerek durdurur (`3ded119`). Böylece indeks engeli sessizce kalkamaz.
- **`/2027/compare` iç notu:** kullanıcı kararıyla (03.11.2026) "Bu yerel inceleme, uluslararası üretici sayfasına dayanır. Türkiye paket kapsamı ve koşulları doğrulanmalıdır." cümleleri kaldırıldı. Aynı paragraftaki "Sürüm bağlantıları mevcut yerel ürün sayfalarına gider." cümlesi korundu.

## Bağımsız kod incelemesi ve düzeltmeler

Dalın tamamı ayrı bir inceleyici tarafından incelendi. Sonuç: Critical yok, 3 Important, 3 Minor.

- **Important — AX3000 sayfaları:** Elektrik ve Havalandırma sayfalarında modül gezinmesi YouTube kartına bağlanmıştı; üç sayfada YouTube bağlantısı düz metin kalmıştı. Düzeltildi (`25562a6`): gezinme ana sütun başlığına bağlandı, YouTube kartları ayrı blok oldu. Çıkarıcı artık bloktaki bir bağlantıyı yakalayamazsa hata veriyor.
- **Important — eski bayrak:** eski bayrak yeni değişkenler olmadan kalırsa koruma sessizce kalkıyordu. Düzeltildi: `next.config.mjs` build'i durduruyor. Testler `test_config_refuses_legacy_flag_without_new_flags`, `test_config_loads_with_new_flags`, `test_config_loads_without_any_flag`.
- **Important — `/2027/compare` iç notu:** içerik kararı olarak kullanıcıya bırakıldı (yukarıda).
- **Minor (ertelendi):**
  - İndirme bağlantılarında erişilebilir ad görünür metinle başlamıyor (WCAG 2.5.3).
  - Dış eylem bağlantılarında yeni sekme duyurusu yok; kod tabanındaki mevcut desenle aynı.

Son durum: 230 unit test, 36/36 parite, 45/45 token, typecheck ve build geçti.

## Kapsam dışı gözlemler

- `/products` kartlarında kaynak veriden gelen "İncele" ve bir sonraki kartın rozet metni (ör. "PROFESYONEL") düz metin olarak görünüyor. Bu durum değişiklikten önce de vardı.
- İnceleme modunda alt sayfaların meta etiketi `index, follow` kalıyor. Sayfaları `X-Robots-Tag` header'ı ve `robots.txt` engelliyor; bu da değişiklikten önceki davranışla aynı.
