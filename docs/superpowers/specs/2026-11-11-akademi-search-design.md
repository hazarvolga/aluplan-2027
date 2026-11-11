# Site araması: Akademi derslerinin eklenmesi (tasarım)

Tarih: 2026-11-11 · Durum: onay bekliyor · Restore etiketi: `restore/pre-akademi-search-20261111`

## Amaç ve neden

Aluplan sitesinde tek bir arama sistemi olacak; Akademi dersleri bu aramada bir kapsam olarak yer alacak.
Öğrenci bir konuyu aradığında **ilgili dersi** bulmalı (kullanıcı kararı: ders düzeyi; adım ya da
paragraf düzeyi değil). Akademi yayına alınmak üzere; arama yayından önce bitmeli.

SEO/GEO notu: site içi arama sıralamayı doğrudan etkilemez (Google'ın sitelinks arama kutusu 2024 sonunda
kalktı; yapay zekâ motorları site aramasını kullanmaz). Değeri kullanıcı deneyimidir. SEO/GEO işleri
(Akademi'yi dizine açma, paylaşım etiketleri, sitemap, llms.txt) ayrı "yayına hazırlık" işinde yapılacak.

## Hedefler

- Akademi'deki her ders ve modül sayfası aramada tek bir sonuç olarak bulunur.
- Arama hem ana sitede hem Akademi'de açılır; Akademi'de varsayılan kapsam "Akademi"dir.
- Sonuçlar sıralanır: başlıkta geçen eşleşme açıklamada ya da anahtar kelimede geçenin önüne geçer.
- Türkçe ve orijinal (Almanca/İngilizce) arayüz adlarıyla aranabilir (ör. "Zelle definieren", "hücre tanımla").

## Hedef dışı

- Adım, paragraf ya da Derinlemesine bölümüne doğrudan atlama (ders düzeyi yeterli).
- Sunucu tarafı arama, harici servis (Algolia), Pagefind.
- Yazım hatası toleransı (bulanık arama), eş anlamlı sözlüğü.

## Kaçınılacaklar (iş "çalışsa" bile başarısızlık sayılır)

- Akademi kayıtlarının, Akademi kapalıyken (`ALUPLAN_SHOW_AKADEMI` yok) canlı site aramasına sızması.
- Ana sitenin arama açılışını yavaşlatmak: Akademi dizini yalnız ihtiyaç olunca yüklenir.
- İki ayrı arama penceresi kodu: tek bileşen, iki yerde kullanım.

## Bugünkü durum

- Dizin: `src/data/search-index.json` (101 sayfa), `search-release-index.json`, `search-extra-index.json`,
  video kaynakları; `SearchIndexProvider` (kök layout) arama açılınca tembel yükler.
- Eşleşme: `src/lib/search.ts` `searchEntries` her kelimenin metinde geçmesini ister; Türkçe normalleştirme var;
  **sıralama yok**.
- Pencere: `SiteShell.tsx` içinde gömülü (Cmd+K ve başlık düğmesi). Akademi kendi kabuğunu kullandığı için
  (`hasOwnChrome`) Akademi'de arama penceresi yok.
- `/search` sayfası `SearchPageSection` ile aynı `searchEntries`'i kullanıyor; sitemap'te dizine kapalı.

## Yaklaşımlar

| | Yol | Artı | Eksi |
|---|---|---|---|
| **A (seçildi)** | Mevcut aramayı genişlet: derleme sırasında üretilen Akademi dizini, sıralama, kapsam, ortak pencere | Mevcut altyapı, ek servis yok, küçük | Dizin tarayıcıya iner (tahmin: sıkıştırılmış ~50 KB) |
| B | Sunucuda arama (API ucu) | Tarayıcı dosya indirmez | Sunucu yükü, gecikme, işletilecek yeni parça |
| C | Pagefind (statik, derlenmiş HTML'den) | Otomatik, güçlü | Mevcut aramanın yerine geçer, derleme süreci değişir |

Kullanıcı A'yı seçti.

## Tasarım

### 1. Akademi dizini (derleme zamanı)

- Yeni betik `scripts/build_akademi_search_index.mjs` (mevcut `build_*_search_index.mjs` deseni, `--check` modu ile).
- Çıktı: `src/data/search-akademi-index.json` (commit'li; `pnpm search:check` ile güncel olduğu denetlenir).
- Kayıtlar (`SearchEntry` biçimi, yeni alan yok):
  - 8 serinin her dersi: `path` = `/akademi/<seri>/<slug>`, `title` = ders adı, `section` = `Akademi`,
    `description` = dersin ilk hedefi, `keywords` = seri adı + seviye adı + diğer hedefler + adım başlıkları +
    komut adları (Türkçe ve orijinal) + Derinlemesine başlıkları.
  - Modül sayfaları (`/akademi/<seviye>/<modul>`), seviye sayfaları ve seri giriş sayfaları.
- Anahtar kelimeler tekilleştirilir ve kayıt başına üst sınır konur (öneri: 1.500 karakter) ki dizin şişmesin.

### 2. Yükleme ve bayrak

- `SearchIndexProvider`'a `showAkademi` bayrağı (kök layout'ta `ALUPLAN_SHOW_AKADEMI`'den) eklenir.
- Bayrak açıksa `search-akademi-index.json` dinamik import ile, arama ilk açıldığında yüklenir; kapalıysa hiç yüklenmez.

### 3. Sıralama ve kapsam (`src/lib/search.ts`)

- `searchEntries` korunur (geri uyumluluk); yeni `rankSearchEntries(entries, query, scope)`:
  - Tüm kelimeler eşleşmeli (bugünkü kural). Puan: başlıkta +3, açıklamada +2, anahtar kelimede +1 (kelime başına);
    eşit puanda mevcut sıra korunur.
  - `scope`: `'all' | 'akademi' | 'site'` (`section === 'Akademi'` ayrımı).
- Saf fonksiyon, birim testli.

### 4. Ortak arama penceresi

- `SiteShell.tsx` içindeki pencere `src/components/shell/SearchDialog.tsx` bileşenine taşınır; Cmd+K dinleyicisi de.
- Kapsam düğmeleri: Tümü / Akademi / Site (Akademi kapalıyken gizli).
- `SiteShell` pencereyi varsayılan kapsam "Tümü" ile, `AkademiHeader` "Akademi" ile kullanır.
- Akademi başlığına arama düğmesi (ikon + "Ara", Cmd+K ipucu); dar ekranda yalnız ikon.
- `/search` sayfası da `rankSearchEntries` kullanır.

### 5. Testler

- Birim: sıralama (başlıktaki eşleşme önde), kapsam filtresi, Türkçe normalleştirme.
- Dizin: her ders ve modül sayfası dizinde bir kez; yollar gerçek sayfalara karşılık gelir; `--check` güncel.
- Sızıntı: bayrak kapalıyken Akademi dizini yüklenmez (kaynak testi).
- Tarayıcı: ana sitede ve Akademi'de pencere açılır; "Zelle definieren" ve "parapet" ile ilgili ders bulunur.

## Builder'a bırakılanlar

- Pencerenin görsel detayları mevcut `alu-modal` stilini izler.
- Puan ağırlıkları testlerle ayarlanabilir.
