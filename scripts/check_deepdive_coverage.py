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
import hashlib

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


DECISION_LOG = os.path.join(ROOT, "docs", "ders-tasarimi", "derinlemesine-kararlari.md")
_TR = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")


def series_slug(name: str) -> str:
    return name.strip().translate(_TR).lower().replace(" ", "-")


def parse_decisions(text: str) -> dict:
    """Karar kaydı tablosu -> {seri_slug: {(ders_slug, kart_id): karar}}."""
    out: dict = {}
    for line in text.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 7 or cells[0] in ("Seri", "") or cells[0].startswith("---"):
            continue
        out.setdefault(series_slug(cells[0]), {})[(cells[1], cells[2])] = cells[4]
    return out


IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp", ".gif")


def parse_equivalents(text: str) -> dict:
    """'## Eşdeğer görseller' tablosu -> {seri_slug: {kart_görseli: yerleşen_eşdeğer}}."""
    out: dict = {}
    if "## Eşdeğer görseller" not in text:
        return out
    section = text.split("## Eşdeğer görseller", 1)[1].split("\n## ", 1)[0]
    for line in section.splitlines():
        cells = [c.strip().strip("`") for c in line.strip().strip("|").split("|")]
        if len(cells) != 4 or cells[0] in ("Seri", "") or cells[0].startswith("---"):
            continue
        out.setdefault(series_slug(cells[0]), {})[cells[1]] = cells[2]
    return out


def file_digest(src: str) -> str:
    """/akademi/... yolunun içerik özeti; dosya yoksa yolun kendisi."""
    path = os.path.join(ROOT, "public", src.lstrip("/"))
    if not os.path.isfile(path):
        return src
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()


def audit_series(lessons: list, decisions: dict, digest=None, equivalents=None) -> list:
    """Kararı kaydedilmiş seri: her kartın karar satırı olmalı; 'Bekliyor' olmayan
    kartların her görseli serinin Derinlemesine'sinde tam bir kez yer almalı.
    Birebir aynı içerikli bir kopya yerleşmişse görsel karşılanmış sayılır."""
    digest = digest or (lambda s: s)
    equivalents = equivalents or {}
    errors = []
    required = set()
    for les in lessons:
        for art in les.get("articles", []):
            key = (les["slug"], art["id"])
            decision = decisions.get(key)
            if decision is None:
                errors.append(f"{les['slug']} / {art['id']}: karar kaydında satır yok")
                continue
            if not decision.startswith("Bekliyor"):
                required.update(f for f in (art.get("figures") or [])
                                if f.lower().endswith(IMAGE_EXT))
    placed: dict = {}
    for les in lessons:
        for blk in (les.get("deepDive") or {}).get("blocks", []):
            if blk.get("type") == "image":
                placed[blk["src"]] = placed.get(blk["src"], 0) + 1
    placed_digests = {digest(s) for s in placed}
    for src in sorted(required - set(placed)):
        if digest(src) not in placed_digests and equivalents.get(src) not in placed:
            errors.append(f"{src}: Derinlemesine'de yerleşmemiş")
    for src, n in sorted(placed.items()):
        if n > 1:
            errors.append(f"{src}: Derinlemesine'de birden fazla kez ({n})")
    return errors


def load_lessons(series: str) -> list:
    paths = sorted(glob.glob(os.path.join(ROOT, "src", "data", series, "*.json")))
    return [json.load(open(p)) for p in paths if not os.path.basename(p).startswith("_")]


def main() -> int:
    log_text = open(DECISION_LOG).read() if os.path.exists(DECISION_LOG) else ""
    decisions = parse_decisions(log_text)
    equivalents = parse_equivalents(log_text)
    audit_errors = []
    for series, dec in sorted(decisions.items()):
        lessons = load_lessons(series)
        audit_errors += [f"{series}: {e}" for e in audit_series(lessons, dec, file_digest,
                                                                  equivalents.get(series, {}))]
    if audit_errors:
        print("FAIL: Karar kaydı / görsel yerleşimi eksik\n")
        for e in audit_errors:
            print(f"  {e}")
        return 1

    gaps = []
    checked = 0
    for series in SERIES:
        if series in decisions:
            continue
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

    audited = ", ".join(sorted(decisions)) or "yok"
    print(f"OK: karar kaydıyla denetlenen seriler: {audited}. "
          f"Kayıt dışı {checked} derste detaylı Soru/Cevap makaleleri karşılanıyor.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
