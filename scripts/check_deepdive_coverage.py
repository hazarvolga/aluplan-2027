#!/usr/bin/env python3
"""Derinlemesine kapsama denetimi (kalıcı guard).

Kural (kullanıcı ölçütü): bir dersin "Derinleşmek için" kartındaki her **detaylı
Soru/Cevap** makalesinin, dersin altındaki **Derinlemesine** bölümünde en az bir
alt-bölümü (heading) olmalıdır. Tek satırlık navigasyon, pazarlama ("YENİLİK ...")
ve video açıklaması stub'ları sayılmaz.

Deterministik sinyal: gövdesinde hem "Soru" hem "Cevap" geçen makale = detaylı Q&A.
Bir derste detaylı-Q&A sayısı, Derinlemesine alt-başlık sayısından fazlaysa EKSİK
demektir ve script hata (çıkış kodu 1) verir. Böylece bir daha sessizce atlanamaz.

Kullanım: python3 scripts/check_deepdive_coverage.py
"""
import json
import os
import sys
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERIES = ("temel-modelleme", "arazi-modelleme", "lejant")


def is_detailed_qa(article: dict) -> bool:
    """Gerçek, detaylı Soru/Cevap makalesi mi?"""
    body = article.get("body", "") or ""
    title = article.get("title", "") or ""
    if "Soru" in body and "Cevap" in body:
        # Pazarlama/yenilik duyurusu Soru/Cevap taşımaz; yine de başlık güvencesi:
        if title.startswith("YENİLİK") or title.startswith("Allplan 20"):
            return False
        return True
    return False


def heading_count(lesson: dict) -> int:
    dd = lesson.get("deepDive")
    if not dd:
        return 0
    return sum(1 for b in dd.get("blocks", []) if b.get("type") == "heading")


def main() -> int:
    gaps = []
    checked = 0
    for series in SERIES:
        for path in sorted(glob.glob(os.path.join(ROOT, "src", "data", series, "*.json"))):
            if os.path.basename(path).startswith("_"):
                continue
            d = json.load(open(path))
            qa = [a for a in d.get("articles", []) if is_detailed_qa(a)]
            if not qa:
                continue
            checked += 1
            subs = heading_count(d)
            if subs < len(qa):
                gaps.append({
                    "ders": f"{series}/{d.get('no'):02d} {d.get('slug')}",
                    "detayli_qa": len(qa),
                    "altbolum": subs,
                    "eksik": len(qa) - subs,
                    "qa_ids": [a.get("id") for a in qa],
                })

    if gaps:
        print("FAIL: Derinlemesine kapsamı eksik (detaylı Soru/Cevap > alt-bölüm)\n")
        for g in gaps:
            print(f"  {g['ders']}: detaylı Q&A {g['detayli_qa']} > alt-bölüm {g['altbolum']} "
                  f"(eksik {g['eksik']})")
            print(f"      Q&A makaleleri: {', '.join(g['qa_ids'])}")
        print(f"\n{len(gaps)} derste toplam {sum(g['eksik'] for g in gaps)} detaylı Q&A eksik.")
        return 1

    print(f"OK: {checked} derste tüm detaylı Soru/Cevap makaleleri Derinlemesine'de karşılanıyor.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
