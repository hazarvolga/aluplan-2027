# Aluplan 2027

Aluplan 2026 sitesini içeriğini koruyarak yeni tasarımla yeniden kur.
- Salt-okunur kaynak: `../aluplan-2026`. ASLA yazma, silme, taşıma veya bağımlılık kurma; build/dev komutu çalıştırma.
- Bütün çıktıları yalnızca `aluplan-2027/` içine yaz. Kardeş projeleri inceleme, değiştirme veya içeriklerini karıştırma.
- İçerikleri, URL'leri, buton hedeflerini, menüleri ve dosyaları koru. Uydurma, özetleme veya kısaltma yapma. Zorunlu URL değişikliklerini 301 haritasıyla onaya sun.
- Gizli bilgileri okuma veya dokümanlara/repoya kaydetme. `.env` dosyalarını envantere içerikleriyle alma.
- Türkçe yanıt ver; kod, dosya ve değişken adlarını İngilizce yaz.
- Her faz sonunda dur ve kullanıcı onayını bekle. Fazları atlama.

## Oturum başlangıç protokolü
1. `docs/MASTER-PROMPT.md` dosyasını oku.
2. `HANDOFF.md` dosyasını oku.
3. `docs/BRAND-GUIDELINES.md` dosyasını oku; onaylanmamış önerileri taslak olarak tut.
4. Mevcut fazı ve sıradaki adımı 3–5 satırda özetle; kullanıcı onayını bekle.

## Oturum bitiş protokolü
Oturum bitmeden ve önemli bir adım tamamlanınca `HANDOFF.md` dosyasını güncelle.

## Doğrulanan kaynak bilgileri
- Kaynak proje: Next.js 14 / React 18 / TypeScript / Tailwind CSS 3 (package.json sürüm aralıkları; kurulu sürüm iddiası değildir).
- Canlı site: https://aluplan.com.tr (app/sitemap.ts ve app/layout.tsx; 19 Ekim 2026 tarihinde erişim doğrulandı).
- Yeni teknoloji yığını henüz seçilmedi; Faz 3 onayında kararlaştır.
- Canlı site esas; kök yerel uygulamayla aynı olduğu kullanıcı tarafından 19.10.2026 tarihinde teyit edildi. Yalnız yerelde bulunan içerikleri ayrıca onaya sun.
- Kullanıcı kararlarını `docs/00-inventory/user-decisions.md` dosyasından izle. Sayısal iddiaları, form hedeflerini, üretici logolarını ve footer kredisini aynen koru.
- Marka kılavuzu: `docs/BRAND-GUIDELINES.md` v1.0 TASLAK / ONAY BEKLİYOR. Teal/Ink ve yeni fontlar kesin karar değildir; PRD onayından önce design system üretme.
- Segment önceliği, birincil dönüşüm, özel form altyapısı, palet/font/logo/slogan ve üretici izinleri açık karar olarak kalır.

## Komutlar
Yeni uygulama kurulmadı. `build`, `test`, `lint`, `dev`: henüz tanımlı değil; geliştirme fazında doldur.
