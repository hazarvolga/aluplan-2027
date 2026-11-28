#!/usr/bin/env python3
"""Build the workbook that collects on-site quote requests.

Power Automate appends one row per request to the "Talepler" table (and student
applications to "Ogrenci"). Every other sheet is formula-driven, so the dashboard and the
per-family sheets update on their own and the flow never has to change when a product is added.

Usage:
    uv run --no-project --with openpyxl --with pymupdf --with pillow python -I \
        scripts/build_quote_workbook.py OUTPUT.xlsx [--ornek] [--onizle DIR]

    --ornek       fill the tables with clearly fictional sample rows (for reviewing the layout)
    --veri FILE   fill the tables from a JSON file: {"talepler": [...], "ogrenci": [...], "kampanya": [...], "lisans": [...], "etkinlik": [...]}, rows keyed
                  like the mail data block. The file holds personal data: keep it out of the repository.
"""
from __future__ import annotations

import json
import os
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

XLKIT_DIR = Path.home() / ".claude/skills/excel-design-system/scripts"
if not (XLKIT_DIR / "xlkit.py").is_file():
    sys.exit("excel-design-system skill (xlkit.py) bulunamadı.")
sys.path.insert(0, str(XLKIT_DIR))
import xlkit as xk  # noqa: E402
from openpyxl import Workbook  # noqa: E402
from openpyxl.chart import BarChart, DoughnutChart, LineChart, Reference  # noqa: E402
from openpyxl.styles import Alignment  # noqa: E402
from openpyxl.utils import get_column_letter  # noqa: E402

# Product lines, in the same order and with the same labels as src/lib/quote-catalog.ts.
# The mail's data block carries these labels in "urunAilesi"; a new line needs one entry here.
FAMILIES = [
    "ALLPLAN",
    "FRILO ve SCIA",
    "SDS2",
    "AX3000 MEP",
    "BIMX5",
    "BIMFlex",
    "CDS Allplan Add-On",
    "Allto PythonPart",
    "Scalypso",
    "Aluplan BIM Eklentisi",
]
SOURCES = ["Instagram", "Facebook", "Google", "LinkedIn", "Twitter", "Referans", "aluplan.com.tr"]
WORK_AREAS = ["Özel", "Kurum / Belediye", "Üniversite", "Öğrenci"]
REQUEST_TYPES = [("Teknik bilgi", "Teknik bilgi talep ediyorum"), ("Fiyat teklifi", "Fiyat teklifi talep ediyorum")]

# (header, width, key in the mail data block).
REQUEST_COLUMNS = [
    ("Tarih", 21, "tarih"),
    ("Ürün Ailesi", 22, "urunAilesi"),
    ("Ürünler", 40, "urunler"),
    ("Talep Türü", 30, "talepTuru"),
    ("Ad Soyad", 22, "adSoyad"),
    ("Firma", 26, "firma"),
    ("E-posta", 28, "eposta"),
    ("GSM", 15, "gsm"),
    ("Şehir", 14, "sehir"),
    ("Çalışma Alanı", 17, "calismaAlani"),
    ("Nereden Duydu", 24, "neredenDuydu"),
    ("Scalypso", 16, "scalypso"),
    ("İş Tanımı", 20, "isTanimi"),
    ("Müşteri No", 16, "musteriNo"),
    ("Notlar", 44, "notlar"),
    ("Kaynak Sayfa", 26, "kaynak"),
]
STUDENT_COLUMNS = [
    ("Tarih", 21, "tarih"),
    ("Ad Soyad", 22, "adSoyad"),
    ("Üniversite", 28, "firma"),
    ("Bölüm", 22, "bolum"),
    ("E-posta", 28, "eposta"),
    ("GSM", 15, "gsm"),
    ("Şehir", 14, "sehir"),
    ("Nereden Duydu", 24, "neredenDuydu"),
    ("Notlar", 40, "notlar"),
]
# Leads from one-off campaign forms. They are not product requests, so they get their own table.
CAMPAIGN_COLUMNS = [
    ("Tarih", 21, "tarih"),
    ("Kampanya", 46, "kampanya"),
    ("Ad Soyad", 22, "adSoyad"),
    ("Firma", 30, "firma"),
    ("E-posta", 30, "eposta"),
    ("GSM", 17, "gsm"),
    ("Notlar", 40, "notlar"),
]
# Licence-manager declarations: a separate process from sales requests, kept in the same workbook.
LICENCE_COLUMNS = [
    ("Tarih", 21, "tarih"),
    ("Firma", 44, "firma"),
    ("Telefon", 17, "gsm"),
    ("Lisans Yöneticisi", 28, "adSoyad"),
    ("E-posta", 34, "eposta"),
    ("Müşteri No", 16, "musteriNo"),
]
# Registrations for webinars and other events.
EVENT_COLUMNS = [
    ("Tarih", 21, "tarih"),
    ("Etkinlik", 28, "etkinlik"),
    ("Ad Soyad", 28, "adSoyad"),
    ("Firma", 44, "firma"),
    ("E-posta", 34, "eposta"),
    ("Telefon", 20, "gsm"),
]
# Stored as text so Excel keeps leading zeros and does not reinterpret dates; rows the flow
# appends inherit the format of the row above.
TEXT_KEYS = ("tarih", "gsm", "musteriNo")
NO_RECORDS = "Henüz kayıt yok"
LABEL_LENGTH = 34
CAMPAIGN_BLOCK_COL = 18
EVENT_BLOCK_COL = 22
HEADER_ROW = 6
FIRST_ROW = HEADER_ROW + 1
FAMILY_SHEET_ROWS = 300  # rows prepared on each family sheet; older requests stay in "Talepler"
FAMILY_VIEW = ["Tarih", "Ürünler", "Talep Türü", "Ad Soyad", "Firma", "E-posta", "GSM", "Şehir", "Çalışma Alanı", "Notlar"]
MONTHS_SHOWN = 12
SAMPLE_COUNT = 64


def month_count(table: str, month_cell: str) -> str:
    """Rows of one month. "Tarih" may arrive as ISO text or as a real date; both are counted."""
    column = f"{table}[Tarih]"
    as_text = f'COUNTIF({column},YEAR({month_cell})&"-"&RIGHT("0"&MONTH({month_cell}),2)&"*")'
    as_date = f'COUNTIFS({column},">="&{month_cell},{column},"<"&EDATE({month_cell},1))'
    return f"={as_text}+{as_date}"


def sample_requests() -> tuple[list[dict], list[dict]]:
    """Fictional rows only: no real person, company or address."""
    rng = random.Random(2027)
    products = {
        "ALLPLAN": ["ALLPLAN Basic", "ALLPLAN Concept", "ALLPLAN Professional", "ALLPLAN Ultimate", "ALLPLAN Civil", "ALLPLAN Max"],
        "FRILO ve SCIA": ["FRILO Editions", "FRILO Geotechnics", "SCIA Engineer Editions"],
        "SDS2": ["SDS2 | Steel Detailing Software"],
        "AX3000 MEP": ["Havalandırma", "Isıtma", "Soğutma", "Elektrik"],
        "BIMX5": ["Oska e-Hakediş Pro", "İmar Yönetmeliği Eklentisi"],
        "BIMFlex": ["FlexSoft BIMFlex"],
        "CDS Allplan Add-On": ["Rampa", "Sürüş Eğrisi", "Parametrik Arazi"],
        "Allto PythonPart": ["Beam Reinforcement", "Column Reinforcement"],
        "Scalypso": ["Scalypso Eklentisi"],
        "Aluplan BIM Eklentisi": ["Aluplan BIM Eklentisi"],
    }
    weights = [30, 9, 6, 8, 5, 7, 4, 4, 3, 5]
    cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli", "Konya"]
    now = datetime(2026, 11, 28, 9, 30)
    requests, students = [], []
    for i in range(SAMPLE_COUNT):
        when = now - timedelta(days=rng.randint(0, 330), hours=rng.randint(0, 8))
        stamp = when.strftime("%Y-%m-%dT%H:%M:00.000Z")
        common = {
            "tarih": stamp,
            "adSoyad": f"Örnek Kişi {i + 1:02d}",
            "eposta": f"ornek{i + 1:02d}@example.com",
            "gsm": "05320000000",
            "sehir": rng.choice(cities),
            "neredenDuydu": ", ".join(rng.sample(SOURCES, rng.choice([1, 1, 2]))),
            "notlar": "ÖRNEK KAYIT",
        }
        if i % 8 == 7:
            students.append({**common, "firma": f"Örnek Üniversitesi {i % 5 + 1}", "bolum": rng.choice(["Mimarlık", "İnşaat Mühendisliği", "İç Mimarlık"])})
            continue
        family = rng.choices(FAMILIES, weights)[0]
        picked = rng.sample(products[family], min(len(products[family]), rng.choice([1, 1, 2])))
        types = rng.choice([[REQUEST_TYPES[1][1]], [REQUEST_TYPES[1][1]], [REQUEST_TYPES[0][1]], [t[1] for t in REQUEST_TYPES]])
        requests.append({
            **common,
            "urunAilesi": family,
            "urunler": ", ".join(picked),
            "talepTuru": "" if family in ("Scalypso", "Aluplan BIM Eklentisi") else ", ".join(types),
            "firma": f"Örnek Firma {i + 1:02d}",
            "calismaAlani": rng.choices(WORK_AREAS[:3], [70, 20, 10])[0],
            "scalypso": "Denemek istiyorum" if family == "Scalypso" else "",
            "isTanimi": "Project Manager" if family == "SDS2" else "",
            "musteriNo": "C300 000 000 0" if family == "Aluplan BIM Eklentisi" else "",
            "kaynak": "/teklif",
        })
    by_date = lambda row: row["tarih"]  # noqa: E731
    return sorted(requests, key=by_date), sorted(students, key=by_date)


def build_data_sheet(wb, t, title: str, table_name: str, columns, rows: list[dict], lead: str):
    ws = wb.create_sheet(title)
    xk.zemin(ws, t)
    xk.sayfa_basligi(ws, t, title, lead, genislik=8)
    xk.tablo_basligi(ws, t, HEADER_ROW, 2, [(header, width) for header, width, _ in columns])
    data_rows = rows or [{}]  # an Excel table needs one data row even when empty
    for r, row in enumerate(data_rows):
        for c, (_, _, key) in enumerate(columns):
            cell = ws.cell(FIRST_ROW + r, 2 + c, row.get(key, "") or None)
            cell.alignment = Alignment(vertical="top", wrap_text=key in ("notlar", "urunler"))
            if key in TEXT_KEYS:
                cell.number_format = "@"
    last_row = FIRST_ROW + len(data_rows) - 1
    last_col = 1 + len(columns)
    # Plain data table on purpose: no helper or formula columns, so the flow only ever adds values.
    xk.tablo(ws, f"B{HEADER_ROW}:{get_column_letter(last_col)}{last_row}", table_name)
    xk.dondur(ws, f"A{FIRST_ROW}")
    xk.baski(ws, t, alt_metin="Aluplan web talepleri")
    return ws


def distinct(rows: list[dict], key: str) -> list[str]:
    """Names in first-seen order. A campaign or event added later needs the workbook rebuilt to get its own bar."""
    return list(dict.fromkeys(row[key] for row in rows if row.get(key))) or [NO_RECORDS]


def short_label(name: str) -> str:
    return name if len(name) <= LABEL_LENGTH else name[: LABEL_LENGTH - 1].rstrip() + "…"


def group_block(ws, t, first_col: int, title: str, names: list[str], table_column: str, count_title: str):
    """Three columns for one chart: full name (what COUNTIF matches), short chart label, count."""
    xk.tablo_basligi(ws, t, 6, first_col, [(title, 40), ("Etiket", 30), (count_title, 10)])
    for i, name in enumerate(names):
        row = 7 + i
        ws.cell(row, first_col, name)
        ws.cell(row, first_col + 1, short_label(name))
        ws.cell(row, first_col + 2, f"=COUNTIF({table_column},{get_column_letter(first_col)}{row})").number_format = xk.BICIM["etiket_sayi"]


def build_calc_sheet(wb, t, campaign_names: list[str], event_names: list[str]):
    """Small summary blocks the dashboard charts read. Counts only: no personal data."""
    ws = wb.create_sheet("Hesap")
    xk.zemin(ws, t)
    xk.sayfa_basligi(ws, t, "Hesap", "Panodaki grafiklerin okuduğu özet tablolar. Elle değiştirmeyin.", genislik=10)
    integer = xk.BICIM["etiket_sayi"]

    xk.tablo_basligi(ws, t, 6, 2, [("Ay", 12), ("Talep", 10), ("Öğrenci", 10)])
    for i in range(MONTHS_SHOWN):
        r = 7 + i
        ws.cell(r, 2, f"=EDATE(DATE(YEAR(TODAY()),MONTH(TODAY()),1),{i - MONTHS_SHOWN + 1})").number_format = xk.BICIM["ay"]
        ws.cell(r, 3, month_count("Talepler", f"B{r}")).number_format = integer
        ws.cell(r, 4, month_count("Ogrenci", f"B{r}")).number_format = integer

    xk.tablo_basligi(ws, t, 6, 6, [("Ürün ailesi", 24), ("Talep", 10)])
    for i, family in enumerate(FAMILIES):
        ws.cell(7 + i, 6, family)
        ws.cell(7 + i, 7, f"=COUNTIF(Talepler[Ürün Ailesi],F{7 + i})").number_format = integer

    xk.tablo_basligi(ws, t, 6, 9, [("Kaynak", 18), ("Talep", 10)])
    for i, source in enumerate(SOURCES):
        ws.cell(7 + i, 9, source)
        ws.cell(7 + i, 10, f'=COUNTIF(Talepler[Nereden Duydu],"*"&I{7 + i}&"*")').number_format = integer

    xk.tablo_basligi(ws, t, 6, 12, [("Çalışma alanı", 20), ("Talep", 10)])
    for i, area in enumerate(WORK_AREAS):
        ws.cell(7 + i, 12, area)
        ws.cell(7 + i, 13, f"=COUNTIF(Talepler[Çalışma Alanı],L{7 + i})").number_format = integer

    xk.tablo_basligi(ws, t, 6, 15, [("Ölçü", 26), ("Değer", 12)])
    measures = [
        ("Toplam talep", '=COUNTIF(Talepler[Ürün Ailesi],"?*")'),
        ("Bu ay", f"=C{6 + MONTHS_SHOWN}"),
        ("Geçen ay", f"=C{5 + MONTHS_SHOWN}"),
        ("Fiyat teklifi isteyen", f'=COUNTIF(Talepler[Talep Türü],"*{REQUEST_TYPES[1][0]}*")'),
        ("Öğrenci indirmesi", '=COUNTIF(Ogrenci[Ad Soyad],"?*")'),
        ("Öğrenci bu ay", f"=D{6 + MONTHS_SHOWN}"),
        ("Kampanya talebi", '=COUNTIF(Kampanya[Ad Soyad],"?*")'),
        ("Etkinlik kaydı", '=COUNTIF(Etkinlik[Ad Soyad],"?*")'),
        ("Lisans yöneticisi", '=COUNTIF(LisansYoneticisi[Lisans Yöneticisi],"?*")'),
    ]
    for i, (label, formula) in enumerate(measures):
        ws.cell(7 + i, 15, label)
        ws.cell(7 + i, 16, formula).number_format = integer
    group_block(ws, t, CAMPAIGN_BLOCK_COL, "Kampanya", campaign_names, "Kampanya[Kampanya]", "Talep")
    group_block(ws, t, EVENT_BLOCK_COL, "Etkinlik", event_names, "Etkinlik[Etkinlik]", "Kayıt")
    xk.baski(ws, t, alt_metin="Aluplan web talepleri")
    return ws


def build_dashboard(wb, t, campaign_count: int, event_count: int):
    ws = wb.active
    ws.title = "Pano"
    calc = wb["Hesap"]
    xk.izgara(ws, 23)
    xk.zemin(ws, t, "A1:Z74")
    xk.sayfa_basligi(ws, t, "Web Talepleri Panosu",
                     "aluplan.com.tr teklif formu · tüm değerler Talepler sayfasından formülle gelir", hucre="B2", genislik=23)
    ws["B6"].value = "Son güncelleme"
    ws["B6"].font = xk.yazi(t, 9, kalin=True, renk=t.ara)
    ws.merge_cells("E6:J6")
    ws["E6"].value = "=" + xk.turkce_bugun()
    ws["E6"].font = xk.yazi(t, 10)
    ws["E6"].alignment = Alignment(horizontal="left", vertical="center")
    cards = [
        ("Toplam talep", "=Hesap!P7", "sayi", None, "form üzerinden gelen"),
        ("Bu ay", "=Hesap!P8", "sayi", "=IFERROR(Hesap!P8/Hesap!P9-1,0)", "geçen aya göre"),
        ("Fiyat teklifi oranı", "=IFERROR(Hesap!P10/Hesap!P7,0)", "yuzde", None, "fiyat teklifi isteyen / toplam"),
        ("Öğrenci indirmesi", "=Hesap!P11", "sayi", None, "toplam başvuru"),
    ]
    for i, (label, formula, number_format, delta, note) in enumerate(cards):
        xk.kpi_karti(ws, t, f"{get_column_letter(2 + i * 6)}8", 5, label, formula, number_format,
                     alt_formul=delta, alt_metin=note)

    # Second card row: records that are not product requests, each from its own sheet.
    other_cards = [
        ("Kampanya talebi", "=Hesap!P13", "kampanya formlarından"),
        ("Etkinlik kaydı", "=Hesap!P14", "webinar ve etkinlik kayıtları"),
        ("Lisans yöneticisi bildirimi", "=Hesap!P15", "lisans yöneticisi bilgi formu"),
    ]
    for i, (label, formula, note) in enumerate(other_cards):
        xk.kpi_karti(ws, t, f"{get_column_letter(2 + i * 8)}12", 7, label, formula, "sayi", alt_metin=note)

    trend = LineChart()
    trend.add_data(Reference(calc, min_col=3, max_col=4, min_row=6, max_row=6 + MONTHS_SHOWN), titles_from_data=True)
    trend.set_categories(Reference(calc, min_col=2, min_row=7, max_row=6 + MONTHS_SHOWN))
    xk.grafik_stili(trend, t, "Aylık talep sayısı: son 12 ay", deger="sayi", ay_ekseni=True)
    xk.yerlestir(ws, trend, xk.hucre_araligi(2, 16, 15, 18))

    areas = DoughnutChart(holeSize=55)
    areas.add_data(Reference(calc, min_col=13, min_row=6, max_row=6 + len(WORK_AREAS)), titles_from_data=True)
    areas.set_categories(Reference(calc, min_col=12, min_row=7, max_row=6 + len(WORK_AREAS)))
    xk.grafik_stili(areas, t, "Çalışma alanına göre talepler")
    xk.yerlestir(ws, areas, xk.hucre_araligi(18, 16, 7, 18))

    families = BarChart()
    families.add_data(Reference(calc, min_col=7, min_row=6, max_row=6 + len(FAMILIES)), titles_from_data=True)
    families.set_categories(Reference(calc, min_col=6, min_row=7, max_row=6 + len(FAMILIES)))
    xk.grafik_stili(families, t, "Ürün ailesine göre talep sayısı", deger="sayi", yatay=True)
    xk.yerlestir(ws, families, xk.hucre_araligi(2, 35, 11, 18))

    sources = BarChart()
    sources.add_data(Reference(calc, min_col=10, min_row=6, max_row=6 + len(SOURCES)), titles_from_data=True)
    sources.set_categories(Reference(calc, min_col=9, min_row=7, max_row=6 + len(SOURCES)))
    xk.grafik_stili(sources, t, "Bizi nereden duydular", deger="sayi", yatay=True)
    xk.yerlestir(ws, sources, xk.hucre_araligi(14, 35, 11, 18))

    campaigns = BarChart()
    campaigns.add_data(Reference(calc, min_col=CAMPAIGN_BLOCK_COL + 2, min_row=6, max_row=6 + campaign_count), titles_from_data=True)
    campaigns.set_categories(Reference(calc, min_col=CAMPAIGN_BLOCK_COL + 1, min_row=7, max_row=6 + campaign_count))
    xk.grafik_stili(campaigns, t, "Kampanyalara göre talep sayısı", deger="sayi", yatay=True)
    xk.yerlestir(ws, campaigns, xk.hucre_araligi(2, 54, 11, 14))

    events = BarChart()
    events.add_data(Reference(calc, min_col=EVENT_BLOCK_COL + 2, min_row=6, max_row=6 + event_count), titles_from_data=True)
    events.set_categories(Reference(calc, min_col=EVENT_BLOCK_COL + 1, min_row=7, max_row=6 + event_count))
    xk.grafik_stili(events, t, "Etkinliklere göre kayıt sayısı", deger="sayi", yatay=True)
    xk.yerlestir(ws, events, xk.hucre_araligi(14, 54, 11, 14))

    xk.baski(ws, t, alt_metin="Aluplan web talepleri", alan="A1:Y68", tek_sayfa=True)
    return ws


def build_family_sheet(wb, t, family: str):
    """Newest request first: row n shows the family's n-th newest row of the "Talepler" table."""
    ws = wb.create_sheet(family[:31])
    xk.zemin(ws, t)
    xk.sayfa_basligi(ws, t, family, "Talepler sayfasından formülle gelir · en yeni talep en üstte", genislik=6)
    ws["B5"].value = "Talep sayısı"
    ws["B5"].font = xk.yazi(t, 9, kalin=True, renk=t.ara)
    ws["C5"].value = f'=COUNTIF(Talepler[Ürün Ailesi],"{family}")'
    ws["C5"].font = xk.yazi(t, 11, kalin=True)
    ws["C5"].alignment = Alignment(horizontal="left")
    widths = {header: width for header, width, _ in REQUEST_COLUMNS}
    xk.tablo_basligi(ws, t, HEADER_ROW, 2, [(header, widths[header]) for header in FAMILY_VIEW])
    ws.column_dimensions["A"].hidden = True
    for n in range(1, FAMILY_SHEET_ROWS + 1):
        row = HEADER_ROW + n
        # n-th largest matching row number = n-th newest request of this family (AGGREGATE skips the errors).
        # The file format needs the _xlfn. prefix; Excel shows the function as plain AGGREGATE.
        ws.cell(row, 1, f'=IF({n}>$C$5,"",_xlfn.AGGREGATE(14,6,(ROW(Talepler[Ürün Ailesi])-ROW(Talepler[[#Headers],[Ürün Ailesi]]))'
                        f'/(Talepler[Ürün Ailesi]="{family}"),{n}))')
        for c, header in enumerate(FAMILY_VIEW):
            cell = ws.cell(row, 2 + c, f'=IF($A{row}="","",INDEX(Talepler[{header}],$A{row})&"")')
            cell.alignment = Alignment(vertical="top", wrap_text=header in ("Notlar", "Ürünler"))
    xk.dondur(ws, f"A{FIRST_ROW}")
    xk.baski(ws, t, alt_metin="Aluplan web talepleri")
    return ws


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    def option(name: str) -> str | None:
        return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else None

    preview_dir, data_file = option("--onizle"), option("--veri")
    args = [a for a in args if a not in (preview_dir, data_file)]
    output = os.path.abspath(args[0] if args else "Aluplan Web Talepleri.xlsx")
    if data_file:
        data = json.loads(Path(data_file).read_text(encoding="utf-8"))
        requests, students, campaigns = data["talepler"], data["ogrenci"], data.get("kampanya", [])
        licences, events = data.get("lisans", []), data.get("etkinlik", [])
    else:
        requests, students = sample_requests() if "--ornek" in sys.argv else ([], [])
        campaigns, licences, events = [], [], []
    t = xk.tema("kurumsal")

    wb = Workbook()
    build_data_sheet(wb, t, "Talepler", "Talepler", REQUEST_COLUMNS, requests,
                     "Her talep bir satır. Bu tabloya yalnızca Power Automate akışı yazar.")
    build_data_sheet(wb, t, "Öğrenci İndirmeleri", "Ogrenci", STUDENT_COLUMNS, students,
                     "Öğrenci sürümü başvuruları. Bu tabloya yalnızca Power Automate akışı yazar.")
    build_data_sheet(wb, t, "Kampanya Talepleri", "Kampanya", CAMPAIGN_COLUMNS, campaigns,
                     "Kampanya formlarından gelen talepler. Ürün talepleriyle karışmaması için ayrı tutulur.")
    build_data_sheet(wb, t, "Lisans Yöneticileri", "LisansYoneticisi", LICENCE_COLUMNS, licences,
                     "Lisans yöneticisi bilgi formundan gelen bildirimler. Satış taleplerinden ayrı bir süreçtir.")
    build_data_sheet(wb, t, "Etkinlik Kayıtları", "Etkinlik", EVENT_COLUMNS, events,
                     "Webinar ve etkinlik kayıt formlarından gelen katılımcı kayıtları.")
    campaign_names, event_names = distinct(campaigns, "kampanya"), distinct(events, "etkinlik")
    build_calc_sheet(wb, t, campaign_names, event_names)
    dashboard = build_dashboard(wb, t, len(campaign_names), len(event_names))
    family_sheets = [build_family_sheet(wb, t, family) for family in FAMILIES]

    xk.sekme(dashboard, t.vurgu)
    for name in ("Talepler", "Öğrenci İndirmeleri", "Kampanya Talepleri", "Lisans Yöneticileri", "Etkinlik Kayıtları"):
        xk.sekme(wb[name], t.murekkep)
    for ws in family_sheets + [wb["Hesap"]]:
        xk.sekme(ws, t.ara)
    wb.move_sheet("Hesap", offset=len(wb.sheetnames))  # helper sheet goes last

    problems = xk.cakisma_denetimi(dashboard)
    if problems:
        raise SystemExit("Yerleşim sorunu:\n" + "\n".join(problems))
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    wb.save(output)
    engine = xk.excel_ile_kaydet(output)
    print(f"motor: {engine}")
    if preview_dir:
        for png in xk.onizle(output, preview_dir):
            print(png)
    print(output)


if __name__ == "__main__":
    main()
