# HANDOFF — Aluplan Akademi "Derinlemesine" (Q&A yedirme) işi

Son güncelleme: 2026-11-09. Oturum limiti dolduğu için ara verildi; limit açılınca buradan devam.

## Bağlam — ne yapıyoruz
Akademi derslerinin altındaki **"Derinleşmek için"** kartlarında ALLPLAN KB'den gelen
değerli **Soru/Cevap** makaleleri var. Hedef: bu Q&A'ları dersin altına **"Derinlemesine"**
bölümü olarak, **"siz" diliyle Türkçeye çevrilmiş** (çeviri: `insaat-teknik-ceviri` skill),
**görseller inline** (görselsizse metin-only) biçimde yedirmek. Eski kart **şimdilik görünür
kalıyor** (kapatma kararı sonraya; kullanıcı kararı).

Veri modeli: `TmLesson.deepDive = { title, blocks: [{type:'heading'|'text'|'image', ...}] }`
(bkz. `src/data/temel-modelleme.ts`). Renderer: `src/components/sections/TmLessonDetail.tsx`
— Derinlemesine ve eski kart artık BAĞIMSIZ, ikisi de görünür (commit e1489ae).

## Mevcut durum (yapıldı)
- **35 derste Derinlemesine** var (133 alt-bölüm, 341 inline görsel). Kart maddelerindeki
  çoklu Q&A art arda alt-bölüm olarak yedirildi (DE/FR/EN çevrildi; FR arayüz caption'larda
  belirtildi; tekrarlı kaynaklar bir kez çevrilip seride yeniden kullanıldı).
- Kalıcı guard: `scripts/check_deepdive_coverage.py` → `pnpm test`'e bağlı.
- Kapsama listesi: `docs/akademi/derinlemesine-kapsama.md`.
- tsc temiz, styles 47/47, anti-slop (em-dash/LaTeX) temiz, 341 görselin tamamı public'te.
- **Push edildi** `origin/main`'e (son push 7ad4b3a'ya kadardı; sonraki e1489ae/b0d8daf/cdd58df
  commit'leri YEREL — git log'a bak, gerekirse push kullanıcı onayıyla). **Canlıya ALINMADI**
  (akademi `isAkademiEnabled()` flag + noindex arkasında).

## 🔴 AÇIK SORUN #1 (kullanıcının aktif şikayeti — ÖNCE BUNU ÇÖZ)
Kullanıcı `arazi-modelleme/04` (dijital-arazi) sayfasında "Derinleşmek için kartındaki Soru/Cevap
bölümleri **derse yedirilmemiş / sadece bir tanesi var**" diyor. AMA JSON'da **6 Derinlemesine
alt-bölümü VAR**: fr_9311 (Arazi Modülüne Kuşbakışı), de_11379 (Dış Sınır), de_11316, en_11159,
de_9026, en_11111. Gap-fill metni (en_11111 "kazı/dolgu dengesi") kullanıcının ekranında
görünüyor → yani veri ulaşıyor. Çelişki var.

**Hipotezler (sırayla doğrula):**
1. **Yoğunlaştırma fazla agresif:** Derinlemesine her Q&A'yı ÖZETLEDİ; kartta ise TAM Q&A var
   (ör. de_11379'un 1.1/1.2/1.3 koşulları + tam menü yolları "Oluştur (Erzeugen) -> Jeodezi (Geo)
   -> ..."). Kullanıcı muhtemelen **tam/eksiksiz içeriğin** yedirilmesini istiyor, özet değil.
   → EN OLASI KÖK NEDEN. Çözüm yönü: Derinlemesine alt-bölümlerini kaynağın TAM adımlarıyla
   (koşullar, menü yolları, sayılar) yeniden yaz; özetleme değil, tam çeviri + inline görsel.
2. **Algı/eşleşme:** Kart başlığı ("SAM (DGM) - 3B/2B Çizgilerden...") ile Derinlemesine başlığı
   ("3B / 2B Çizgilerden Dış Sınır...") birebir aynı değil; kullanıcı eşleştiremiyor olabilir.
3. **Stale render (az olası):** gap-fill metni göründüğü için tam stale değil; yine de temiz
   restart + hard reload ile doğrula.
**İLK İŞ:** Dev server'ı temiz başlat, arazi 04'ü hard-reload et, Derinlemesine alt-bölüm
sayısını ve DOLULUĞUNU gözle teyit et. Sonra kullanıcıya "özet mi tam içerik mi istiyorsun" diye
NET sor (muhtemelen tam içerik). Bütün 35 ders bu karara göre yeniden ele alınabilir (büyük iş).

## 🟠 AÇIK SORUN #2 — denetim script'i açığı
`scripts/check_deepdive_coverage.py` yalnızca gövdede **"Soru"+"Cevap"** arıyor. Ama bazı
makaleler **"SORUN"/"ÇÖZÜM"** etiketi kullanıyor (ör. `fr_9311`). "Soru" ⊂ "SORUN" ama "Cevap"
≠ "ÇÖZÜM" → bu makaleler "detaylı Q&A" sayılmıyor, guard onları KAÇIRIYOR (yanlış "OK").
**Fix:** `is_detailed_qa`'yı `("Soru" in b or "SORUN" in b) and ("Cevap" in b or "ÇÖZÜM" in b)`
yap; sonra guard'ı tekrar çalıştır, çıkan yeni boşlukları doldur.

## 🟡 Diğer açık kararlar
- **de_12732** (Add-On Baugrube - Arazi Oluşturma, Q&A değil, eklenti tanıtımı) arazi 04'te
  Derinlemesine'ye konmadı. Konsun mu? (Kullanıcı "hepsini tut" dedi → muhtemelen evet, kısa.)
- **Fransızca görseller** (fr_9311/fr_9170): piksele gömülü Fransızca el yazısı notlar var.
  Kullanıcı kararı: METNİ tut, GÖRSELLERİ sonra **topluca ayrı iş** olarak ele al (TR arayüzden
  yeni kare). Şimdilik dokunma.
- **Kart gizleme:** eski "Derinleşmek için" kartı şimdilik görünür; yedirme bitince kapatma
  kararı verilecek. (Renderer'da ikisi bağımsız; gizlemek tek satır.)
- **Görselsiz ama detaylı Q&A'lar** zaten metin-only yedirildi (bu doğru yaklaşım).

## Kısıtlar (DEĞİŞMEZ)
- Onaysız **push yok**, **canlıya/deploy yok**. `git reset --hard` / `git clean -fd` YOK.
- Anti-slop: em-dash (—) ve LaTeX ($) yok; "adeta/büyüleyici" yok. Resmî "siz".
- Çeviri: `insaat-teknik-ceviri` skill (Decke→döşeme, armature/Bewehrung→donatı, norm/kod/formül
  AYNEN: DIN 277, C25/30, ISO 3766, SUMME(...); ondalık virgül; FR terim parantezde).
- Her görsel yerleştirince `os.path.exists('public'+src)` ile doğrula.
- Fazlar halinde commit + restore tag.

## Anahtar dosyalar
- Renderer: `src/components/sections/TmLessonDetail.tsx` (+ `.module.css` deepDive stilleri)
- Tip: `src/data/temel-modelleme.ts` (TmDeepDive/TmDeepBlock)
- Veri: `src/data/{temel-modelleme,arazi-modelleme,lejant}/NN.json` (deepDive alanı)
- Guard: `scripts/check_deepdive_coverage.py` (pnpm test)
- Kapsama: `docs/akademi/derinlemesine-kapsama.md`
- Kaynak Q&A tam metinleri: `/Users/hazarvolgaekiz/dev/lab/scrapling/exports/allplan_learnnow/
  <kurs>/makaleler_tr/<id>.md` (JSON body'ler 2502'de kesik; tam metin burada)

## Sonraki adımlar (öncelik sırası)
1. Arazi 04'ü canlı doğrula (temiz restart + hard reload); "özet mi tam içerik mi" netleştir.
2. Karar tam-içerikse: Derinlemesine alt-bölümlerini kaynağın tam adım/koşul/menü-yoluyla
   yeniden yaz (önce arazi 04'te pilot, kullanıcı onayı, sonra 35 derse yay).
3. Denetim script'ini SORUN/ÇÖZÜM için düzelt; yeni boşlukları doldur.
4. de_12732 + kart gizleme + FR görsel toplu işi kararlarını uygula.

## Bu oturumun commit'leri (akademi)
cdd58df kapsama boşluk+guard · 7ad4b3a ders02+liste · e577e27 çok-Q&A (çeviri) · b0d8daf 04 2.Q&A
demo · e1489ae kart gizleme kaldır · 85df1e0/85e14aa/3a82626 A altyapı+içerik · c218024 B ince
ders · 1027c3c/74c245e/85bca21 rubrik · 3c06807 sidebar odak · de39826 dil manifesti.
