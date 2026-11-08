# 00 — Program Kimliği ve İhtiyaç Analizi

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı
> Taslak · 2026-11-08 · Kaynak kararlar: [2026-11-08-aluplan-akademi-plan.md](../superpowers/specs/2026-11-08-aluplan-akademi-plan.md)

## Yapılan varsayımlar

Bu müfredat, aşağıdaki varsayımlarla üretilmiştir. Kullanıcı aksini belirtene kadar geçerlidir.

| Parametre | Değer | Not |
|---|---|---|
| Yazılım | ALLPLAN | Aluplan, ALLPLAN'ın Türkiye distribütörü |
| Sürüm | Güncel sürüm (ALLPLAN 2024/2025) | Arayüz terimleri `[sürüme göre doğrula]` ile işaretli; mevcut terim referansı ALLPLAN 2020 TR arayüzü |
| Kitle | Karma — üniversite öğrencisi + çalışan mühendis/mimar | İki giriş personası (bkz. §Personalar) |
| Seviye | Başlangıç → Uzman (4 seviye tam yol) | Seviye 1–2–4 ortak, Seviye 3 disiplin kollu |
| Format | Hibrit — asenkron web akademi + eğitmenli sınıf | Aynı müfredat iki kanalda kullanılır |
| Disiplin odağı | Mimari + statik + prefabrik/çelik + altyapı (eşit ağırlık) | Araştırma verisi olmadığı için ağırlıklar eşit |
| Sertifika | Web'de yok (öz değerlendirme) · eğitmenli eğitimde var | Backend yükü bindirmemek için sitede sertifika verilmez |
| Akademik kredi | Yok | Ücretsiz, herkese açık; saat bazlı iş yükü gösterilir |

## Programın amacı

Aluplan Akademi, ALLPLAN'ı **Türkçe, seviye seviye** öğreten; üniversite öğrencileri ile çalışan
mühendis ve mimarlara açık, ücretsiz bir eğitim programıdır. İki kurumsal amacı vardır:

1. **Birincil amaç — ALLPLAN kullanıcı sayısını artırmak.** Türkçe, kaliteli ve ulaşılabilir
   eğitim, yazılımı deneyen ve benimseyen kişi sayısını büyütür.
2. **İkincil amaç — Aluplan'ın eğitmenli eğitimlerine sağlam bir altyapı kurmak.** Web akademi ile
   sınıf eğitimi aynı müfredatı, aynı kazanım kodlarını ve aynı sürekli projeyi paylaşır.

## İhtiyaç analizi (neden bu program?)

- **Türkçe kaynak boşluğu:** ALLPLAN'ın Türkçe, yapılandırılmış ve güncel eğitim içeriği azdır;
  mevcut içerik dağınık ve sürüm olarak eskidir.
- **Geçiş engeli:** Revit/AutoCAD kullanan profesyoneller için ALLPLAN'a geçişte "nereden
  başlamalıyım?" sorusu en büyük engeldir. Program, seviye belirleme ve geçiş modülüyle bu engeli
  düşürür.
- **Beceri temelli öğretim ihtiyacı:** BIM yazılımı bir beceridir; video izlemek yetmez. Program
  her derste "göster → rehberli uygula → bağımsız uygula → öz değerlendir" döngüsünü kurar.
- **Kurumsal tutarlılık:** Aluplan'ın eğitmenleri farklı içeriklerle ders verdiğinde kalite
  dalgalanır. Ortak müfredat bunu standartlaştırır.

## Hedef kitle — personalar

### Persona A — "Yeni başlayan öğrenci"
- **Kim:** İnşaat/mimarlık son sınıf veya yeni mezun; BIM'e yeni başlıyor.
- **Ön bilgi:** Temel teknik çizim; CAD'e aşina olabilir, olmayabilir.
- **Hedef:** İş başvurusunda ALLPLAN becerisi; mezuniyet projesini BIM ile yapmak.
- **Giriş noktası:** Seviye 1'den başlar, ortak çekirdeği tamamlar, Seviye 3'te kol seçer.
- **Kısıt:** Ücretsiz içerik; kendi hızında, asenkron ilerler.

### Persona B — "Geçiş yapan profesyonel"
- **Kim:** Ofiste Revit veya AutoCAD kullanan, 2–10 yıl deneyimli mühendis/mimar.
- **Ön bilgi:** BIM kavramlarına ve en az bir BIM/CAD aracına hâkim.
- **Hedef:** ALLPLAN'a hızlı geçiş; temelleri tekrar etmeden üretime geçmek.
- **Giriş noktası:** Seviye belirleme quizini çözer, "Revit'ten ALLPLAN'a" geçiş modülünü izler,
  önerilen seviyeden devam eder.
- **Kısıt:** Zamanı sınırlı; gerçek ofis senaryoları ve kısayol odaklı içerik bekler.

### Persona C (ikincil) — "Eğitmenli sınıf katılımcısı"
- **Kim:** Aluplan'ın ücretli/kurumsal eğitimine katılan kişi.
- **Fark:** Aynı müfredatı eğitmen eşliğinde, canlı projeyle işler; sertifikaya hak kazanır.

## Ön koşullar

| Seviye | Ön koşul |
|---|---|
| Seviye 1 — Temel | Yok. Bilgisayar okuryazarlığı ve temel mimari/yapı kavramları yeterli. |
| Seviye 2 — Orta | Seviye 1 kazanımları veya denk deneyim (seviye belirleme quizi ile doğrulanır). |
| Seviye 3 — İleri | Seviye 2 kazanımları. Kol seçimi kullanıcının disiplinine göre. |
| Seviye 4 — Uzman | Seviye 3'ten en az bir kol; openBIM ve koordinasyona ilgi. |

## Rol ilerlemesi

Program, dört seviyeyi dört mesleki role bağlar:

```
Seviye 1 → BIM Uygulayıcısı    (modeli kuran)
Seviye 2 → BIM Uzmanı          (dokümantasyon ve metraj üreten)
Seviye 3 → Disiplin Uzmanı     (mimari / betonarme / prefabrik-çelik / altyapı)
Seviye 4 → BIM Yöneticisi      (openBIM koordinasyonu ve otomasyon)
```

## Sonraki dosya

→ [01-kazanimlar-ve-hizalama.md](01-kazanimlar-ve-hizalama.md) — program ve seviye kazanımları,
hizalama matrisi.
