#!/usr/bin/env python3
"""
Extracts rich, structured layout data (popup videos, icon benefit cards,
core feature image/video grids, Cloud Services grids, Purchase Options grids,
multi-tab workflows with all tab images/videos, SCIA/SideImage split sections,
and FAQ accordions) directly from docs/00-inventory/interaction-source-evidence/
so zero popup videos, zero icons, and zero multi-tab assets are lost.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
EV_DIR = ROOT / "docs/00-inventory/interaction-source-evidence"

# Build basename lookup for public assets (preferring /assets/products/ and /assets/solutions/)
_BY_BASENAME = {}
for _p in sorted(PUBLIC_DIR.rglob("*")):
    if _p.is_file():
        _rel = "/" + str(_p.relative_to(PUBLIC_DIR)).replace("\\", "/")
        _b = _p.name.lower()
        if _b not in _BY_BASENAME or "/products/" in _rel:
            _BY_BASENAME[_b] = _rel


def resolve_asset(raw: str) -> str:
    if not raw:
        return ""
    s = (
        raw.strip()
        .replace("@/assets/", "/assets/")
        .replace("../../../src/assets/", "/assets/")
        .replace("@/images/", "/images/")
    )
    if s.startswith(("http://", "https://")):
        return s
    if (PUBLIC_DIR / s.lstrip("/")).is_file():
        return s
    b = Path(s).name.lower()
    if b in _BY_BASENAME:
        return _BY_BASENAME[b]
    return s


LUCIDE_TO_ALUICON = {
    "Map": "compass",
    "Database": "layers",
    "FileCode": "file-text",
    "Layers": "layers",
    "Cloud": "globe",
    "Globe": "globe",
    "Leaf": "sparkles",
    "Keyboard": "sliders",
    "Palette": "sparkles",
    "Moon": "sparkles",
    "AlertTriangle": "shield",
    "Info": "file-text",
    "Box": "boxes",
    "Bot": "sparkles",
    "Scissors": "ruler",
    "Eye": "compass",
    "Network": "layers",
    "Link": "external-link",
    "FileText": "file-text",
    "MousePointerClick": "zap",
    "Import": "arrow-right",
    "Home": "building-2",
    "PlayCircle": "circle-play",
    "Rocket": "zap",
    "KeyRound": "shield",
    "Lightbulb": "sparkles",
    "Cuboid": "boxes",
    "AlignStartVertical": "sliders",
    "Download": "file-text",
    "ArrowRightLeft": "arrow-right",
    "FileCheck": "check",
    "Building2": "building-2",
    "Briefcase": "layers",
}


def extract_balanced_block(txt: str, start_pos: int, open_ch="[", close_ch="]") -> str:
    idx = txt.find(open_ch, start_pos)
    if idx == -1:
        return ""
    depth = 0
    in_str = None
    esc = False
    for i in range(idx, len(txt)):
        ch = txt[i]
        if esc:
            esc = False
            continue
        if ch == "\\":
            esc = True
            continue
        if in_str:
            if ch == in_str:
                in_str = None
            continue
        if ch in ('"', "'", "`"):
            in_str = ch
            continue
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return txt[idx : i + 1]
    return ""


def find_const_array(txt: str, var_name: str) -> str:
    m = re.search(rf"const\s+{re.escape(var_name)}\s*(?::[^=]+)?=\s*\[", txt)
    if not m:
        return ""
    return extract_balanced_block(txt, m.end() - 1, "[", "]")


def split_top_level_objects(arr_txt: str) -> list:
    if not arr_txt:
        return []
    inner = arr_txt[1:-1]
    objs = []
    i = 0
    while i < len(inner):
        idx = inner.find("{", i)
        if idx == -1:
            break
        blk = extract_balanced_block(inner, idx, "{", "}")
        if not blk:
            break
        objs.append(blk)
        i = idx + len(blk)
    return objs


def split_top_level_strings(arr_txt: str) -> list:
    if not arr_txt:
        return []
    res = []
    for m in re.finditer(r'(["\'])((?:\\.|(?!\1).)*)\1', arr_txt, re.DOTALL):
        val = (
            m.group(2)
            .replace("\\n", " ")
            .replace('\\"', '"')
            .replace("\\'", "'")
            .strip()
        )
        if val:
            res.append(val)
    return res


def get_prop_str(obj_txt: str, prop: str) -> str:
    m = re.search(
        rf"\b{re.escape(prop)}\s*:\s*([\"\'])((?:\\.|(?!\1).)*)\1",
        obj_txt,
        re.DOTALL,
    )
    if m:
        return (
            m.group(2)
            .replace("\\n", " ")
            .replace('\\"', '"')
            .replace("\\'", "'")
            .strip()
        )
    return ""


def get_prop_ident(obj_txt: str, prop: str) -> str:
    m = re.search(rf"\b{re.escape(prop)}\s*:\s*([A-Za-z_][A-Za-z0-9_]*)", obj_txt)
    if m and m.group(1) not in {"true", "false", "null", "undefined"}:
        return m.group(1)
    return ""


def parse_imports(txt: str) -> dict:
    imp = {}
    for var, path in re.findall(
        r"import\s+(\w+)\s+from\s+[\"\']([^\"\']+)[\"\']", txt
    ):
        if "/assets/" in path or "/images/" in path:
            imp[var] = resolve_asset(path)
    return imp


def extract_youtube_id(url_or_id: str) -> str:
    if not url_or_id:
        return ""
    s = url_or_id.strip()
    m = re.search(r"(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([A-Za-z0-9_-]{6,})", s)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{6,15}", s):
        return s
    return ""


# Parse shared CloudServicesSection.tsx once
def _load_cloud_services():
    cs_path = EV_DIR / "components/sections/CloudServicesSection.tsx"
    txt = cs_path.read_text(encoding="utf-8")
    imp = parse_imports(txt)

    def parse_cs_array(var_name: str):
        objs = split_top_level_objects(find_const_array(txt, var_name))
        items = []
        for o in objs:
            title = get_prop_str(o, "title")
            desc = get_prop_str(o, "description")
            yt = get_prop_str(o, "youtubeId")
            img_id = get_prop_ident(o, "image")
            img_src = imp.get(img_id, "")
            items.append({
                "title": title,
                "description": desc,
                "imageSrc": img_src,
                "youtubeId": yt or None,
            })
        return items

    return {
        "default": parse_cs_array("defaultServices"),
        "civil": parse_cs_array("civilServices"),
    }


CLOUD_SERVICES_MAP = _load_cloud_services()

DEFAULT_WORKFLOW_LINKS = [
    {"text": "Sürümleri Görüntüle", "href": "/package-overview", "external": False, "color": "#8B5CF6"},
    {"text": "Tasarım için İş Akışları", "href": "/solutions/architecture#mimari-is-akislari", "external": False, "color": "#3B82F6"},
    {"text": "İnşaat Mühendisliği için İş Akışları", "href": "/solutions/structural#insaat-muhendisligi-is-akislari", "external": False, "color": "#10B981"},
    {"text": "Altyapı Mühendisliği için İş Akışları", "href": "/solutions/infrastructure#altyapi-muhendisligi-is-akislari", "external": False, "color": "#F59E0B"},
]


def parse_core_product_page(route: str, tsx_rel: str, cloud_variant: str = "default"):
    fpath = EV_DIR / tsx_rel
    txt = fpath.read_text(encoding="utf-8")
    imp = parse_imports(txt)

    # 1) Intro section
    intro_title = ""
    intro_bullets = []
    intro_yt = ""

    if route == "/products/allplan-ultimate":
        intro_title = "ALLPLAN Ultimate Nedir?"
        intro_yt = "tFnwOyX7ncI"
        intro_bullets = [
            "Üstün 3B modelleme, görselleştirme ve çıktı üretimi.",
            "Hızlı ve güvenilir metraj ve maliyetlendirme için entegre araçlar.",
            "Gelişmiş inşaat demiri (rebar) ve çelik birleşim modelleme yetenekleri.",
            "Yerinde dökme ve prekast beton elemanların tasarımı ve detaylandırılması.",
            "Kapsamlı zemin işleri, kazı ve temel modelleme araçları.",
            "Parametrik köprü ve tünel modelleme ile öngerilmeli sistemler.",
            "SCIA Engineer Concept Sürümü ile entegre yapısal analiz.",
            "Parametrik yol modellemesi, altyapı yerleşimi ve şantiye planlaması ile tüm proje ihtiyaçları için kapsamlı çözüm.",
        ]
    elif route == "/products/allplan-professional":
        intro_title = "ALLPLAN Professional Nedir?"
        intro_yt = "SnuaHSL18e8"
        intro_bullets = [
            "Üstün 3B modelleme, görselleştirme ve dokümantasyon araçları.",
            "Tutarlı ve güvenilir malzeme metrajı ve maliyet hesaplamaları.",
            "Gelişmiş 3B betonarme donatı ve çelik birleşim modelleme yetenekleri.",
            "Çoklu malzeme ve inşaat yöntemlerinin hassas koordinasyonu.",
            "Parametrik yol modelleme ve altyapı yerleşim araçları.",
            "Kapsamlı BIM iş akışları ve bulut tabanlı ekip çalışması.",
        ]
    elif route == "/products/allplan-concept":
        intro_title = "ALLPLAN Concept Nedir?"
        intro_yt = "SnuaHSL18e8"
        intro_bullets = [
            "Sezgisel 2B çizim, 3B BIM modelleme ve gerçekçi görselleştirme.",
            "Akıllı yapı bileşenleri ile hızlı konsept ve uygulama tasarımı.",
            "Doğrudan 3B modelden güvenilir metraj, raporlama ve pafta üretimi.",
            "Arazi modelleme, kentsel tasarım ve altyapı planlama araçları.",
            "ALLPLAN Cloud ve Bimplus ile kesintisiz ekip çalışması.",
        ]
    elif route == "/products/allplan-basic":
        intro_title = "ALLPLAN Basic Nedir?"
        intro_yt = "SnuaHSL18e8"
        intro_bullets = [
            "Hassas 2B çizim ve serbest 3B katı modelleme araçları.",
            "Harici CAD/BIM formatlarını (IFC, DWG, PDF, RVT) sorunsuz içe ve dışa aktarma.",
            "Gelişmiş çakışma tespiti ve kolay başlangıç için BIM Easy şablonları.",
            "ALLPLAN Bulut Hizmetleri ve Bimplus ile gerçek zamanlı proje iş birliği.",
        ]
    elif route == "/products/civil":
        intro_title = "ALLPLAN Civil Nedir?"
        intro_yt = "DTSdM7tSBlU"
        intro_bullets = [
            "Köprü, tünel, yol ve altyapı projeleri için uçtan uca parametrik BIM çözümü.",
            "Karmaşık geometriler, çift eğrilikli üstyapılar ve değişken kesitler için tam parametrik modelleme.",
            "Öngerme tendonları, inşaat aşamaları (4B) ve zaman bağımlı etkiler dahil entegre yapısal analiz.",
            "Uluslararası standartlara (Eurocode, AASHTO LRFD) uygun tasarım ve kod kontrolleri.",
            "Yüksek detaylı 3B betonarme donatı, çelik birleşimler ve prefabrik eleman modellemesi.",
            "Birleşik Dijital Arazi Modeli (DAM), kazı, zemin işleri ve şantiye planlaması.",
            "SCIA Engineer Concept Sürümü ile çok disiplinli yapısal analiz entegrasyonu.",
            "ALLPLAN Cloud ve Bimplus ile disiplinler arası bulut tabanlı openBIM iş birliği.",
        ]

    # 2) Benefits icon cards
    benefit_objs = split_top_level_objects(find_const_array(txt, "benefits"))
    benefit_items = []
    for o in benefit_objs:
        icon_id = get_prop_ident(o, "icon") or get_prop_ident(o, "image")
        icon_src = imp.get(icon_id, "") or resolve_asset(get_prop_str(o, "icon") or get_prop_str(o, "image"))
        subtitle = get_prop_str(o, "subtitle")
        title = get_prop_str(o, "title")
        desc = get_prop_str(o, "description")
        if not title and subtitle:
            title = subtitle
            subtitle = ""
        benefit_items.append({
            "iconSrc": icon_src,
            "subtitle": subtitle or None,
            "title": title,
            "description": desc,
        })

    benefits_titles = {
        "/products/allplan-ultimate": "ALLPLAN Ultimate'in Faydaları",
        "/products/allplan-professional": "ALLPLAN Professional'ın Faydaları",
        "/products/allplan-concept": "ALLPLAN Concept'in Faydaları",
        "/products/allplan-basic": "ALLPLAN Basic'in Faydaları",
        "/products/civil": "ALLPLAN Civil'in Faydaları",
    }

    # 3) Core Features grid (Fonksiyonellik Hızlı Bakış)
    cf_objs = split_top_level_objects(find_const_array(txt, "coreFeatures"))
    cf_items = []
    for o in cf_objs:
        title = get_prop_str(o, "title")
        desc = get_prop_str(o, "description")
        yt = get_prop_str(o, "youtubeId")
        img_id = get_prop_ident(o, "image")
        thumb_str = get_prop_str(o, "thumbnailUrl") or get_prop_str(o, "image")
        img_src = imp.get(img_id, "") or resolve_asset(thumb_str)
        cf_items.append({
            "title": title,
            "description": desc,
            "imageSrc": img_src,
            "youtubeId": yt or None,
        })

    # 4) Extra grids (Civil workflowCards, Cloud Services, Purchase Options)
    extra_grids = []

    if route == "/products/civil":
        wf_objs = split_top_level_objects(find_const_array(txt, "workflowCards"))
        wf_items = []
        for o in wf_objs:
            img_id = get_prop_ident(o, "image")
            wf_items.append({
                "title": get_prop_str(o, "title"),
                "description": get_prop_str(o, "description"),
                "imageSrc": imp.get(img_id, ""),
            })
        if wf_items:
            extra_grids.append({
                "kicker": "/ ALTYAPI VE KÖPRÜ SÜREÇLERİ",
                "title": "Çalışma Akışları",
                "columns": 3,
                "items": wf_items,
            })

    # Cloud Services grid
    cs_items = [dict(x) for x in CLOUD_SERVICES_MAP.get(cloud_variant, CLOUD_SERVICES_MAP["default"])]
    add_cs_objs = split_top_level_objects(find_const_array(txt, "additionalCloudServices"))
    for o in add_cs_objs:
        img_id = get_prop_ident(o, "image")
        cs_items.append({
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
            "imageSrc": imp.get(img_id, "") or resolve_asset(get_prop_str(o, "image")),
            "youtubeId": get_prop_str(o, "youtubeId") or None,
        })
    extra_grids.append({
        "kicker": "/ TÜM ABONELİKLERE DAHİL",
        "title": "ALLPLAN Bulut Hizmetleri",
        "subtitle": "Bulut tabanlı iş birliği, model görüntüleme, pafta dağıtımı ve yapay zeka destekli görselleştirme araçları.",
        "columns": 3,
        "items": cs_items,
    })

    # Purchase Options grid
    po_objs = split_top_level_objects(find_const_array(txt, "purchaseOptions"))
    po_items = []
    for o in po_objs:
        img_id = get_prop_ident(o, "image")
        thumb_str = get_prop_str(o, "thumbnailUrl") or get_prop_str(o, "image")
        po_items.append({
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
            "imageSrc": imp.get(img_id, "") or resolve_asset(thumb_str),
            "youtubeId": get_prop_str(o, "youtubeId") or None,
        })
    if po_items:
        extra_grids.append({
            "kicker": "/ OPSİYONEL EKLENTİ VE LİSANSLAR",
            "title": "Satın Alınabilir Seçenekler",
            "columns": 4 if len(po_items) >= 4 else 3,
            "items": po_items,
        })

    # 5) Split Callouts (SCIA Engineer on Ultimate and Civil)
    split_callouts = []
    if route in {"/products/allplan-ultimate", "/products/civil"}:
        scia_img = (
            "/assets/products/allplan-ultimate/scia-concept.jpg"
            if route == "/products/allplan-ultimate"
            else "/assets/products/civil/workflow-scia-civil.jpg"
        )
        split_callouts.append({
            "kicker": "/ ÜCRETSİZ LİSANS DAHİL",
            "title": "SCIA Engineer Concept Sürümü",
            "lead": "Bir yıllık ücretsiz SCIA Engineer Concept Sürümü lisansı dahildir",
            "subheading": "Gerçek çok disiplinli tasarım için entegre yapısal analiz",
            "description": "Birlikte çalışabilir BIM iş akışlarından yararlanmak ve yapısal analiz yeteneklerini genişletmek için ALLPLAN Ultimate ve ALLPLAN Civil abonelikleri, lider yapısal analiz çözümü SCIA Engineer Concept Sürümü'nün bir yıllık ücretsiz lisansını içerir. BIMPLUS ve AutoConverter üzerinden çift yönlü model senkronizasyonu ile analiz ve tasarım süreçlerinizi birleştirin.",
            "imageSrc": scia_img,
            "ctaText": "Dahil Olan Fonksiyonları İnceleyin",
            "ctaHref": "https://www.scia.net/en/scia-engineer/editions-comparison",
            "external": True,
        })

    # 6) FAQs
    faq_objs = split_top_level_objects(find_const_array(txt, "faqs"))
    faq_section = None
    if faq_objs:
        faq_section = {
            "title": "SSS - ALLPLAN Ultimate" if route == "/products/allplan-ultimate" else "SSS - ALLPLAN Civil",
            "items": [
                {
                    "question": get_prop_str(o, "question"),
                    "answer": get_prop_str(o, "answer"),
                }
                for o in faq_objs
            ],
        }

    return {
        "intro": {
            "kicker": "/ PAKET GENEL BAKIŞ",
            "title": intro_title,
            "bullets": intro_bullets,
            "videoEmbedUrl": f"https://www.youtube.com/embed/{intro_yt}",
        },
        "workflowLinks": DEFAULT_WORKFLOW_LINKS,
        "benefits": {
            "kicker": f"/ {len(benefit_items)} TEMEL AVANTAJ",
            "title": benefits_titles.get(route, "Faydalar"),
            "items": benefit_items,
        },
        "coreFeatures": {
            "kicker": "/ ÇEKİRDEK VE İLERİ YETENEKLER",
            "title": "Fonksiyonellik Hızlı Bakış",
            "subtitle": f"Toplam {len(cf_items)} modül ve işlev — video simgeli kartlara tıklayarak uygulama videolarını pop-up pencerede izleyebilirsiniz.",
            "columns": 4 if len(cf_items) >= 12 else 3,
            "items": cf_items,
        },
        "splitCallouts": split_callouts,
        "extraGrids": extra_grids,
        "faq": faq_section,
    }


def parse_workflow_tabs_from_tsx(txt: str, imp: dict, var_name: str = "workflowCategories"):
    arr_txt = find_const_array(txt, var_name)
    if not arr_txt:
        return []
    cat_objs = split_top_level_objects(arr_txt)
    categories = []
    for cobj in cat_objs:
        key = get_prop_str(cobj, "key") or f"tab-{len(categories)}"
        label = get_prop_str(cobj, "label")
        items_arr = extract_balanced_block(cobj, cobj.find("items:"), "[", "]")
        item_objs = split_top_level_objects(items_arr)
        items = []
        for iobj in item_objs:
            title = get_prop_str(iobj, "title")
            desc = get_prop_str(iobj, "description") or get_prop_str(iobj, "content")
            img_id = get_prop_ident(iobj, "image")
            img_src = imp.get(img_id, "") or resolve_asset(get_prop_str(iobj, "image"))
            vid_url = get_prop_str(iobj, "videoUrl")
            yt = extract_youtube_id(vid_url)
            if title:
                items.append({
                    "title": title,
                    "description": desc,
                    "imageSrc": img_src or None,
                    "youtubeId": yt or None,
                })
        if label and items:
            categories.append({
                "key": key,
                "label": label,
                "items": items,
            })
    return categories


def parse_allplan_aec():
    txt = (EV_DIR / "app/products/allplan-aec/page.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)

    # Parse tabFeatures.tabs[0] and [1] for Mimari and Yapısal Mühendislik
    tabs_arr = extract_balanced_block(txt, txt.find("tabs: ["), "[", "]")
    tab_objs = split_top_level_objects(tabs_arr)
    subtabs_by_idx = {}
    for idx, tobj in enumerate(tab_objs):
        st_arr = extract_balanced_block(tobj, tobj.find("subtabs:"), "[", "]")
        st_objs = split_top_level_objects(st_arr)
        subtabs_by_idx[idx] = [
            {
                "title": get_prop_str(s, "title"),
                "description": get_prop_str(s, "content"),
                "imageSrc": imp.get(get_prop_ident(s, "image"), ""),
            }
            for s in st_objs
        ]

    wf_cats = parse_workflow_tabs_from_tsx(txt, imp, "workflowCategories")
    # Prepend Mimari and Strüktürel Mühendislik which used tabFeatures.tabs[0/1].subtabs.map(...)
    full_cats = [
        {"key": "mimari", "label": "Mimari Tasarım", "items": subtabs_by_idx.get(0, [])},
        {"key": "str", "label": "Strüktürel Mühendislik", "items": subtabs_by_idx.get(1, [])},
    ] + wf_cats

    b_objs = split_top_level_objects(find_const_array(txt, "benefitsItems"))
    benefits = [
        {
            "iconSrc": imp.get(get_prop_ident(o, "image"), ""),
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
        }
        for o in b_objs
    ]

    return {
        "intro": {
            "kicker": "/ BİNA VE ALTYAPI İÇİN TEK PLATFORM",
            "title": "ALLPLAN NEDİR?",
            "bullets": [
                "Allplan, tüm proje aşamaları boyunca tasarım ve inşaat sürecini destekleyen ve entegre eden mimari, mühendislik ve inşaat için disiplinler arası BIM yazılım çözümüdür.",
                "Mimari ve iç mimariden yapısal ve MEP mühendisliğine, inşaat ve köprü mühendisliğine, donatılı betonarme ve prekast detaylandırmadan şantiye planlamasına kadar tek platform.",
                "Konseptten ayrıntılı inşaat paftalarına kadar tüm disiplinlerde verimli iş akışlarını desteklemek için güçlü araçlar.",
                "Verimli iş birliği ve daha başarılı teslimler için entegre bulut teknolojisi.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/tFnwOyX7ncI",
        },
        "benefits": {
            "kicker": "/ 6 TEMEL AVANTAJ",
            "title": "ALLPLAN AEC Faydaları",
            "items": benefits,
        },
        "workflowTabs": {
            "kicker": "/ DİSİPLİNLER ARASI İŞ AKIŞLARI",
            "title": "Allplan AEC'nin Özellikleri ve İş Akışları",
            "subtitle": "Mimari, Strüktürel Mühendislik, Altyapı, Prekast, Şantiye Planlaması ve Bulut İş Birliği modülleri.",
            "categories": full_cats,
        },
    }


def parse_precast_pages(route: str):
    is_detail = route == "/products/precast-detail"
    rel = "app/products/precast-detail/ClientPage.tsx" if is_detail else "app/products/precast/page.tsx"
    txt = (EV_DIR / rel).read_text(encoding="utf-8")
    imp = parse_imports(txt)

    b_var = "benefitItems" if is_detail else "benefits"
    b_objs = split_top_level_objects(find_const_array(txt, b_var))
    benefits = [
        {
            "iconSrc": imp.get(get_prop_ident(o, "image"), ""),
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
        }
        for o in b_objs
    ]

    if is_detail:
        cats = parse_workflow_tabs_from_tsx(txt, imp, "workflowCategories")
    else:
        def parse_feat_arr(vname):
            return [
                {
                    "title": get_prop_str(o, "title"),
                    "description": get_prop_str(o, "description"),
                    "imageSrc": imp.get(get_prop_ident(o, "image"), ""),
                }
                for o in split_top_level_objects(find_const_array(txt, vname))
            ]

        cats = [
            {"key": "structural", "label": "Structural Precast (Yapısal Prekast)", "items": parse_feat_arr("structuralFeatures")},
            {"key": "walls", "label": "Precast Walls (Prekast Duvarlar)", "items": parse_feat_arr("wallFeatures")},
            {"key": "slabs", "label": "Precast Slabs (Prekast Döşemeler)", "items": parse_feat_arr("slabFeatures")},
        ]

    res_objs = split_top_level_objects(find_const_array(txt, "resources"))
    res_items = []
    for o in res_objs:
        raw_lnk = get_prop_str(o, "link") or get_prop_str(o, "href") or "#"
        if raw_lnk == "#":
            raw_lnk = "https://info.allplan.com/en/precast/construction-trend.html"
        res_items.append({
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "subtitle"),
            "imageSrc": imp.get(get_prop_ident(o, "image"), ""),
            "href": raw_lnk,
            "ctaText": get_prop_str(o, "buttonText") or "İncele / İndir",
            "external": True,
        })

    return {
        "intro": {
            "kicker": "/ PREFABRİK BETON TASARIM VE ÜRETİM",
            "title": "ALLPLAN PRECAST NEDİR?",
            "bullets": [
                "Allplan Precast, yapısal prefabrik elemanların, prefabrik duvarların ve döşemelerin yüksek düzeyde otomatik ve hassas tasarımını sağlar.",
                "Etkileyici 3B tekliften, doğru üretim verilerini içeren hassas 3B prekast modele kesintisiz geçiş.",
                "Maksimum üretkenliğe olanak tanıyan otomatik pafta, donatı ve fikstür iş akışları.",
                "Akıllı kalite güvencesi ile ERP ve MES sistemleri için güvenilir üretim verileri.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/AaFWnMNTgVs",
        },
        "workflowLinks": DEFAULT_WORKFLOW_LINKS if not is_detail else None,
        "benefits": {
            "kicker": "/ 6 TEMEL AVANTAJ",
            "title": "Allplan Precast'ın Faydaları",
            "items": benefits,
        },
        "workflowTabs": {
            "kicker": "/ OTOMATİK PREKAST İŞ AKIŞLARI",
            "title": "Allplan Precast Özellikleri",
            "subtitle": "Yapısal prekast elemanlar, duvarlar ve döşemeler için özelleşmiş otomasyon araçları.",
            "categories": cats,
        },
        "extraGrids": [
            {
                "kicker": "/ REHBER VE DOKÜMANLAR",
                "title": "Prekast Kaynakları",
                "columns": 3,
                "items": res_items,
            }
        ] if res_items else [],
    }


def parse_allplan_2026():
    txt = (EV_DIR / "app/products/allplan-2026/page.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)
    groups_arr = find_const_array(txt, "groups")
    group_objs = split_top_level_objects(groups_arr)
    extra_grids = []
    for gobj in group_objs:
        gtitle = get_prop_str(gobj, "title")
        f_arr = extract_balanced_block(gobj, gobj.find("features:"), "[", "]")
        f_objs = split_top_level_objects(f_arr)
        items = []
        for fobj in f_objs:
            title = get_prop_str(fobj, "title")
            subtitle = get_prop_str(fobj, "desc")
            pkg = get_prop_str(fobj, "package")
            img_id = get_prop_ident(fobj, "img")
            vid_url = get_prop_str(fobj, "videoUrl")
            yt = extract_youtube_id(vid_url)
            det_arr = extract_balanced_block(fobj, fobj.find("details:"), "[", "]")
            bullets = split_top_level_strings(det_arr)
            items.append({
                "title": title,
                "subtitle": subtitle,
                "description": bullets[0] if bullets else subtitle,
                "bullets": bullets[1:] if len(bullets) > 1 else [],
                "badge": f"Dahil Olduğu Paket: {pkg}" if pkg else None,
                "imageSrc": imp.get(img_id, ""),
                "youtubeId": yt or None,
            })
        extra_grids.append({
            "kicker": "/ ALLPLAN 2026 YENİLİKLERİ",
            "title": gtitle,
            "columns": 2,
            "items": items,
        })
    return {
        "extraGrids": extra_grids,
    }


def parse_allplan_2026_yenilikler():
    txt = (EV_DIR / "app/products/allplan-2026-yenilikler/page.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)

    tab_defs = [
        ("architecture", "Architecture (Mimari)", "ArchitectureContent"),
        ("engineering", "Engineering (Mühendislik)", "EngineeringContent"),
        ("infrastructure", "Infrastructure (Altyapı)", "InfrastructureContent"),
        ("prefabrication", "Prefabrication & Construction (Prekast & İnşaat)", "PrefabricationContent"),
    ]
    categories = []
    for key, label, comp_name in tab_defs:
        m = re.search(rf"const\s+{comp_name}\s*=\s*\(\)\s*=>\s*\(", txt)
        if not m:
            continue
        next_m = re.search(r"\nconst\s+\w+\s*=|\nexport\s+default", txt[m.end() :])
        comp_block = txt[m.end() : m.end() + next_m.start()] if next_m else txt[m.end() :]
        # Find each <SideImageSection ... />
        items = []
        for sm in re.finditer(r"<SideImageSection\b(.*?)/>", comp_block, re.DOTALL):
            props = sm.group(1)
            title = ""
            tm = re.search(r'\btitle="([^"]+)"', props)
            if tm:
                title = tm.group(1)
            sub = ""
            subm = re.search(r'\bsubtitle="([^"]+)"', props)
            if subm:
                sub = subm.group(1)
            desc = ""
            dm = re.search(r'\bdescription="([^"]+)"', props)
            if dm:
                desc = dm.group(1)
            img_id = ""
            im = re.search(r"\bimageSrc=\{(\w+)\}", props)
            if im:
                img_id = im.group(1)
            yt = ""
            ym = re.search(r'href:\s*"https://www\.youtube\.com/watch\?v=([A-Za-z0-9_-]+)"', props)
            if ym:
                yt = ym.group(1)
            # Extract content string or <p> tags
            paragraphs = []
            cm_str = re.search(r'\bcontent="([^"]+)"', props)
            if cm_str:
                paragraphs.append(cm_str.group(1))
            else:
                for pm in re.finditer(r"<p[^>]*>(.*?)</p>", props, re.DOTALL):
                    ptxt = re.sub(r"<[^>]+>", "", pm.group(1)).replace("&quot;", '"').replace("&apos;", "'")
                    ptxt = re.sub(r"\s+", " ", ptxt).strip()
                    if ptxt:
                        paragraphs.append(ptxt)
            for lm in re.finditer(r"<li[^>]*>(.*?)</li>", props, re.DOTALL):
                ltxt = re.sub(r"<[^>]+>", "", lm.group(1)).strip()
                if ltxt:
                    paragraphs.append(f"• {ltxt}")
            items.append({
                "title": title,
                "subtitle": desc,
                "badge": sub or None,
                "description": paragraphs[0] if paragraphs else desc,
                "bullets": paragraphs[1:] if len(paragraphs) > 1 else [],
                "imageSrc": imp.get(img_id, ""),
                "youtubeId": yt or None,
            })
        if items:
            categories.append({
                "key": key,
                "label": label,
                "items": items,
            })

    return {
        "intro": {
            "kicker": "/ GENEL BAKIŞ · NEDEN ALLPLAN 2026?",
            "title": "Mimarlar, mühendisler, üreticiler ve inşaat profesyonelleri için verimlilik ve iş birliğini yeniden tanımlıyor",
            "bullets": [
                "Akıllı bulut tabanlı iş birliği ile tüm proje yaşam döngüsü boyunca koordinasyon",
                "Disiplinler arası üstün birlikte çalışabilirlik, tasarımdan mühendislik iş akışlarına kesintisiz entegrasyon",
                "Gelişmiş otomasyon ve doğruluk ile sağlam modelleme süreçleri",
                "Yenilikçi ve sürdürülebilir projeler, daha düşük çevresel etki",
                "Ölçeklenebilirlik ve esneklik, ekiplerin çevik ve hızlı yanıt verebilmesini garanti eder",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/60vUWS-MEdw",
        },
        "workflowTabs": {
            "kicker": "/ 4 DİSİPLİNDE 27 YENİ ÖZELLİK",
            "title": "ALLPLAN 2026 – ANA ÖZELLİKLER VE GELİŞTİRMELER",
            "subtitle": "Sekmeler arasında geçiş yaparak Mimari, Mühendislik, Altyapı ve Prekast/İnşaat yeniliklerini ve uygulama videolarını inceleyin.",
            "categories": categories,
        },
    }


def parse_allplan_cloud_services():
    txt = (EV_DIR / "app/products/allplan-cloud-services/page.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)
    b_objs = split_top_level_objects(find_const_array(txt, "benefitsItems"))
    items = []
    for o in b_objs:
        img_id = get_prop_ident(o, "image")
        vid = get_prop_str(o, "videoUrl")
        yt = extract_youtube_id(vid)
        lnk = get_prop_str(o, "link")
        items.append({
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
            "imageSrc": imp.get(img_id, ""),
            "youtubeId": yt or None,
            "href": lnk or None,
            "ctaText": get_prop_str(o, "buttonText") or ("Devamını Oku" if lnk else None),
            "external": get_prop_ident(o, "external") == "true" or (lnk.startswith("http") if lnk else False),
        })
    return {
        "intro": {
            "kicker": "/ ENTEGRE BULUT EKOSİSTEMİ",
            "title": "ALLPLAN Cloud Nedir?",
            "bullets": [
                "ALLPLAN Cloud, tüm ALLPLAN aboneliklerine varsayılan olarak dahil edilen, ALLPLAN masaüstü ile bulut uygulamalarını birbirine bağlayan entegre bir çözümdür.",
                "Güçlü bulut tabanlı BIM iş birliği platformu, ekip çalışması araçları, çizim/plan yönetimi ve dağıtım araçları ile verimli ofis içi ekip çalışması imkanlarından faydalanın.",
                "Statik analiz çözümleriyle veri alışverişi, IFC dosyalarının hızlı görselleştirilmesi ve 2D dokümantasyon entegrasyonu için özel bulut uygulamaları.",
                "ALLPLAN Cloud, tasarımdan üretime iş akışlarınızı optimum verimlilik için geliştirir.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/DTSdM7tSBlU",
        },
        "splitCallouts": [
            {
                "kicker": "/ SÜREÇ HARİTASI",
                "title": "Her tasarım aşamasında ALLPLAN Bulut Hizmetleri",
                "description": "ALLPLAN Cloud, BIMPLUS'ın işlevselliğini ve ALLPLAN Share, ALLPLAN Exchange ve ALLPLAN Workgroup Manager gibi ürünleri içerir. Ayrıca statik analiz çözümleriyle entegrasyon için Autoconverter, hızlı IFC model görüntüleme için ALLPLAN Model Viewer ve Bluebeam Bağlantısı gibi ek uygulamalar da dahildir.",
                "imageSrc": imp.get("imgServiceMap", "/assets/products/allplan-cloud-services/cloud-service-map.jpg"),
            }
        ],
        "coreFeatures": {
            "kicker": "/ 9 BULUT UYGULAMASI VE HİZMETİ",
            "title": "ALLPLAN Bulut Hizmetleri şunları içerir:",
            "columns": 3,
            "items": items,
        },
    }


def parse_allplan_bimplus():
    txt = (EV_DIR / "app/products/allplan-bimplus/ClientPage.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)

    b_objs = split_top_level_objects(find_const_array(txt, "benefitsItems"))
    benefits = [
        {
            "iconSrc": imp.get(get_prop_ident(o, "image"), ""),
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
        }
        for o in b_objs
    ]

    cats = parse_workflow_tabs_from_tsx(txt, imp, "workflowCategories")

    vs_objs = split_top_level_objects(find_const_array(txt, "videoSections"))
    extra_grids = []
    for vobj in vs_objs:
        stitle = get_prop_str(vobj, "title")
        ssub = get_prop_str(vobj, "subtitle")
        f_arr = extract_balanced_block(vobj, vobj.find("features:"), "[", "]")
        f_bullets = split_top_level_strings(f_arr)
        it_arr = extract_balanced_block(vobj, vobj.find("items:"), "[", "]")
        it_objs = split_top_level_objects(it_arr)
        v_items = []
        for io in it_objs:
            vtitle = get_prop_str(io, "title")
            vurl = get_prop_str(io, "videoUrl")
            yt = extract_youtube_id(vurl)
            v_items.append({
                "title": vtitle,
                "description": ssub,
                "bullets": f_bullets,
                "imageSrc": f"https://img.youtube.com/vi/{yt}/hqdefault.jpg" if yt else "",
                "youtubeId": yt or None,
            })
        if v_items:
            extra_grids.append({
                "kicker": "/ UYGULAMA VİDEOLARI",
                "title": f"Bimplus — {stitle}",
                "subtitle": ssub,
                "columns": 3,
                "items": v_items,
            })

    return {
        "intro": {
            "kicker": "/ OPENBIM BULUT PLATFORMU",
            "title": "BIMPLUS Nedir?",
            "bullets": [
                "BIMPLUS, inşaat projelerinde yer alan tüm disiplinler için açık BIM model bazlı veri ve proje iş birliği platformudur.",
                "Proje verilerine her yerden, her zaman erişin, tüm bilgi ihtiyaçlarınızı doğru kişilere verimli bir şekilde iletin ve proje ortaklarıyla gerçek zamanlı iş birliği yapın.",
                "Herhangi bir inşaat sektörü yazılımından proje verilerini kolayca dahil edin, birleştirin, koordine edin, inceleyin ve merkezi bir modelde etkili bir şekilde yönetin.",
                "Tüm aşamalarda BIM tabanlı projeleri yönetin ve kontrol edin, etkili sorun yönetimi ve güçlü görselleştirme araçlarını kullanarak revizyonları ve görevleri kolayca takip edin.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/DTSdM7tSBlU",
        },
        "benefits": {
            "kicker": "/ 6 TEMEL AVANTAJ",
            "title": "ALLPLAN Bimplus Avantajları",
            "items": benefits,
        },
        "workflowTabs": {
            "kicker": "/ 5 KATEGORİDE İŞ AKIŞLARI",
            "title": "Bimplus İş Akışları ve Yetenekleri",
            "categories": cats,
        },
        "extraGrids": extra_grids,
    }


def parse_allplan_bulut_hizmetleri_solution():
    txt = (EV_DIR / "components/solutions/AllplanBulutContent.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)

    def parse_feat_list(var_name: str):
        objs = split_top_level_objects(find_const_array(txt, var_name))
        items = []
        for o in objs:
            title = get_prop_str(o, "title")
            desc = get_prop_str(o, "desc")
            sub = get_prop_str(o, "subtitle")
            pkg = get_prop_str(o, "package")
            img_id = get_prop_ident(o, "img")
            vurl = get_prop_str(o, "videoUrl")
            yt = extract_youtube_id(vurl)
            det_arr = extract_balanced_block(o, o.find("details:"), "[", "]")
            bullets = split_top_level_strings(det_arr)
            items.append({
                "title": title,
                "subtitle": f"{desc} — {sub}" if desc and sub else (sub or desc),
                "badge": f"Dahil Olduğu Paket: {pkg}" if pkg else None,
                "description": bullets[0] if bullets else sub,
                "bullets": bullets[1:] if len(bullets) > 1 else [],
                "imageSrc": imp.get(img_id, ""),
                "youtubeId": yt or None,
            })
        return items

    return {
        "extraGrids": [
            {
                "kicker": "/ ALLPLAN 2026 GENEL YENİLİKLER",
                "title": "Genel Ana Özellikler ve Tüm Kullanıcılar için Geliştirmeler",
                "columns": 2,
                "items": parse_feat_list("features"),
            },
            {
                "kicker": "/ ALLPLAN CLOUD YENİLİKLERİ",
                "title": "ALLPLAN Cloud ve İş Birliği Geliştirmeleri",
                "columns": 2,
                "items": parse_feat_list("cloudFeatures"),
            },
        ]
    }


def parse_ax3000():
    txt = (EV_DIR / "app/products/ax3000/ClientPage.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)

    spec_objs = split_top_level_objects(find_const_array(txt, "specificFunctions"))
    add_objs = split_top_level_objects(find_const_array(txt, "additionalFunctions"))
    benefits = [
        {
            "iconSrc": imp.get(get_prop_ident(o, "icon"), ""),
            "subtitle": "/ BELİRLİ FONKSİYONLAR",
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
        }
        for o in spec_objs
    ] + [
        {
            "iconSrc": imp.get(get_prop_ident(o, "icon"), ""),
            "subtitle": "/ EK FONKSİYONLAR",
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description") or "Plan öngörünümü ve gelişmiş pafta kontrolü.",
        }
        for o in add_objs
    ]

    mod_objs = split_top_level_objects(find_const_array(txt, "specialModules"))
    mod_items = [
        {
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
            "imageSrc": imp.get(get_prop_ident(o, "image"), ""),
            "href": get_prop_str(o, "link"),
            "ctaText": "Devamını oku",
            "external": False,
        }
        for o in mod_objs
    ]

    return {
        "intro": {
            "kicker": "/ TÜRK STANDARTLARINA UYUMLU MEP BIM",
            "title": "Türk Standartları ve Tümleşik MEP Çözümü",
            "bullets": [
                "TS 825 Bileşen Arayüzü",
                "Isıtma Modülünde Kat, Yön ve İşletme Zamlarının Otomatik Hesabı",
                "Türkiye İklim Verileri",
                "EKB yazılımı BEP Yönetmeliğine göre",
                "Soğutma Hesabı Türkiye İklim Verilerine göre",
            ],
        },
        "splitCallouts": [
            {
                "kicker": "/ 25 YILLIK CAD DENEYİMİ",
                "title": "Deneyim Kazandırır & Tümleşik Kullanım",
                "description": "AX3000'in Bina Tesisatı çözümünde lider konuma gelmesi CAD pazarındaki 25 yıllık deneyimin sonucudur. Sıhhi Tesisat, Isıtma, Havalandırma, Soğutma, EKB ve Elektrik tesisatı için çok seçenekli özel çözümler üretebilirsiniz.",
                "imageSrc": imp.get("simulason", "/assets/solutions/ax3000/simulason.jpg"),
            },
            {
                "kicker": "/ VERİ YÖNETİMİ",
                "title": "Optimum Veri Yönetimi",
                "description": "AX-3000 yerleşim plan içindeki verileri en uygun ve anlaşılır şekilde sıralayarak projenizi yönetmenizi kolaylaştırır.",
                "imageSrc": imp.get("untitled3", "/assets/solutions/ax3000/Untitled-3.png"),
            },
        ],
        "benefits": {
            "kicker": f"/ {len(benefits)} FONKSİYON",
            "title": "Belirli ve Ek Fonksiyonlar",
            "items": benefits,
        },
        "extraGrids": [
            {
                "kicker": "/ ÖZEL MODÜLLER",
                "title": "AX3000 Özel Modüller",
                "columns": 3,
                "items": mod_items,
            }
        ],
    }


def parse_sds2_home():
    txt = (EV_DIR / "app/products/sds2-home/ClientPage.tsx").read_text(encoding="utf-8")
    cat_objs = split_top_level_objects(find_const_array(txt, "benefitCategories"))
    benefits = []
    for cobj in cat_objs:
        ctitle = get_prop_str(cobj, "title")
        it_arr = extract_balanced_block(cobj, cobj.find("items:"), "[", "]")
        bullets = split_top_level_strings(it_arr)
        benefits.append({
            "iconSrc": "/assets/solutions/steel/reasons/automated_workflows.png",
            "subtitle": ctitle,
            "title": ctitle.replace("/ ", ""),
            "description": " • ".join(bullets),
        })

    return {
        "intro": {
            "kicker": "/ SDS2 ULTIMATE",
            "title": "SDS2 ULTIMATE NEDİR?",
            "bullets": [
                "SDS2 Ultimate, günlük projelerinde hassasiyet ve verimlilik arayan detaylandırıcılar için geliştirilen, sektör lideri çelik detaylandırma yazılımıdır.",
                "Otomatik bağlantı tasarımı, kapsamlı 3B modelleme ve BIM ile CNC sistemleriyle sorunsuz entegrasyon.",
                "İş akışlarını optimize eder, maliyetli hataları azaltır ve üretime hazır, doğru çizimler sunar.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/oKqf6wjm9tg",
        },
        "benefits": {
            "kicker": "/ 5 YETENEK KATEGORİSİ",
            "title": "Fonksiyonellik Hızlı Bakış — SDS2 Ultimate",
            "items": benefits,
        },
    }


def parse_solution_page_with_tabs_and_reasons(route: str, tsx_rel: str, wf_var: str = ""):
    txt = (EV_DIR / tsx_rel).read_text(encoding="utf-8")
    imp = parse_imports(txt)

    r_objs = split_top_level_objects(find_const_array(txt, "reasons"))
    reasons = [
        {
            "iconSrc": imp.get(get_prop_ident(o, "image"), ""),
            "title": get_prop_str(o, "title"),
            "description": get_prop_str(o, "description"),
        }
        for o in r_objs
    ]

    s_objs = split_top_level_objects(find_const_array(txt, "stats"))
    stats = [
        {
            "value": get_prop_str(o, "value"),
            "label": get_prop_str(o, "label"),
            "description": get_prop_str(o, "description"),
        }
        for o in s_objs
    ]

    ch_objs = split_top_level_objects(find_const_array(txt, "challenges"))
    challenges = [get_prop_str(o, "text") for o in ch_objs if get_prop_str(o, "text")]

    cats = parse_workflow_tabs_from_tsx(txt, imp, wf_var) if wf_var else []

    yt_matches = re.findall(r"youtube\.com/embed/([A-Za-z0-9_-]{6,})", txt)
    intro_yt = yt_matches[0] if yt_matches else ""

    # Extract PostHeroSection title & paragraphs
    intro_title = "ALLPLAN BIM İş Akışı Tanıtımı"
    intro_bullets = []
    ph_title_m = re.search(r'<PostHeroSection[^>]*\btitle="([^"]+)"', txt)
    if ph_title_m:
        intro_title = ph_title_m.group(1)
        ph_idx = txt.find("<PostHeroSection")
        ph_arr = extract_balanced_block(txt, txt.find("paragraphs=", ph_idx), "[", "]")
        intro_bullets = split_top_level_strings(ph_arr)
    else:
        h3_m = re.search(r"<h3[^>]*>([^<]+)</h3>", txt)
        if h3_m:
            intro_title = h3_m.group(1).strip()
            for pm in re.finditer(r"<p[^>]*>([^<]+)</p>", txt):
                pt = pm.group(1).strip()
                if pt:
                    intro_bullets.append(pt)

    res = {}
    if intro_yt or intro_bullets:
        res["intro"] = {
            "kicker": "/ ÇÖZÜM GENEL BAKIŞ",
            "title": intro_title,
            "bullets": intro_bullets,
            "videoEmbedUrl": f"https://www.youtube.com/embed/{intro_yt}" if intro_yt else None,
        }
    if stats:
        res["stats"] = stats
    if challenges:
        res["challenges"] = challenges
    if reasons:
        res["benefits"] = {
            "kicker": f"/ {len(reasons)} GEREKÇE",
            "title": "Neden ALLPLAN?",
            "items": reasons,
        }
    if cats:
        res["workflowTabs"] = {
            "kicker": "/ UÇTAN UCA BIM SÜREÇLERİ",
            "title": "Disiplin İş Akışları ve Modül Detayları",
            "subtitle": "Sekmeler arasında geçiş yaparak her aşamadaki görsel ve teknik yetenekleri inceleyin.",
            "categories": cats,
        }
    return res


def parse_webinar_page():
    txt = (EV_DIR / "app/solutions-v2/training/webinar/page.tsx").read_text(encoding="utf-8")
    imp = parse_imports(txt)
    w_objs = split_top_level_objects(find_const_array(txt, "recordedWebinars"))
    items = []
    for o in w_objs:
        img_id = get_prop_ident(o, "image")
        yt = get_prop_str(o, "youtubeId")
        items.append({
            "title": get_prop_str(o, "title"),
            "badge": get_prop_str(o, "date") or None,
            "description": get_prop_str(o, "description"),
            "imageSrc": imp.get(img_id, ""),
            "youtubeId": yt if len(yt) == 11 else None,
        })
    return {
        "extraGrids": [
            {
                "kicker": "/ WEBINAR ARŞİVİ",
                "title": "Kaydedilmiş Webinarlar",
                "subtitle": "Kaçırdığınız veya tekrar izlemek istediğiniz webinar kayıtlarımız.",
                "columns": 3,
                "items": items,
            }
        ]
    }


def parse_references_page():
    txt = (EV_DIR / "app/references/page.tsx").read_text(encoding="utf-8")
    ref_objs = split_top_level_objects(find_const_array(txt, "references"))
    cat_objs = split_top_level_objects(find_const_array(txt, "categories"))

    category_icon_map = {
        "Mimari Ofis": "building",
        "Mühendislik Ofisi (Alt Yapı)": "hardhat",
        "Mühendislik Ofisi (Üst Yapı)": "hardhat",
        "İnşaat Şirketleri": "building-2",
        "Müteahhit": "hardhat",
        "Kamu Kurumları": "landmark",
        "Meslek Odaları": "users",
        "Prefabrik": "building-2",
        "Universite": "graduation-cap",
    }

    items = []
    for o in ref_objs:
        name = get_prop_str(o, "name")
        cat = get_prop_str(o, "category")
        if name and cat:
            items.append({
                "name": name,
                "category": cat,
                "iconName": category_icon_map.get(cat, "building"),
            })

    categories = []
    for o in cat_objs:
        cid = get_prop_str(o, "id")
        label = get_prop_str(o, "label")
        if not cid:
            continue
        count = len(items) if cid == "all" else sum(1 for item in items if item["category"] == cid)
        categories.append({
            "id": cid,
            "label": label,
            "iconName": "layers" if cid == "all" else category_icon_map.get(cid, "building"),
            "count": count,
        })

    return {
        "referencesDirectory": {
            "kicker": "/ REFERANS PORTFÖYÜ · 9 SEKTÖREL KATEGORİ",
            "title": "BIM Odaklı İş Ortaklarımız ve Referans Müşterilerimiz",
            "subtitle": "Mimarlık, mühendislik ve inşaat (AEC) sektöründe, BIM (Building Information Modeling) uzmanlığımızı tercih eden iş ortaklarımızdan bazıları. Dijital tasarım, model tabanlı çalışma ve veri odaklı süreçlerde birlikte değer yarattığımız referans müşterilerimizi inceleyin.",
            "categories": categories,
            "items": items,
        }
    }


def parse_faq_page():
    return {
        "faqDirectory": {
            "kicker": "/ YARDIM MERKEZİ · SIKÇA SORULAN SORULAR",
            "title": "Lisanslama, Cloud ve Ürün Yaşam Döngüsü Rehberi",
            "subtitle": "Sekmeler arasında geçiş yaparak Allplan abonelik sistemi, ALLPLAN Cloud hizmetleri, Serviceplus dönüşümü, Workgroup işbirliği ve ürün yaşam döngüsü politikalarını inceleyin.",
            "categories": [
                {
                    "id": "subscription",
                    "label": "Genel & Abonelik",
                    "iconName": "help-circle",
                    "title": "Genel Abonelik (Subscription) SSS",
                    "subtitle": "Allplan abonelik sistemi, ödeme seçenekleri ve iptal koşulları hakkında bilgiler.",
                    "items": [
                        {
                            "question": "Abonelik (Subscription) nedir?",
                            "answer": "Abonelik, yazılım ve hizmetlere belirli bir süre için (aylık, yıllık veya 3 yıllık) erişim sağladığınız bir sözleşme türüdür.",
                        },
                        {
                            "question": "Abonelik ile neleri elde ederim?",
                            "answer": "Abonelik süresince aşağıdakilere erişim sağlarsınız:",
                            "bullets": [
                                "Satın alınan süre boyunca seçilen yazılım sürümüne erişim",
                                "BIMPLUS dahil ALLPLAN Cloud hizmetleri",
                                "Verimli ofis içi takım çalışması araçları",
                                "Ağ ve şirket sınırları ötesinde takım çalışması",
                                "Çizim ve planların yönetimi ve dağıtımı",
                                "Pazar lideri ürün entegrasyonları (Solibri Inside, AutoConverter)",
                                "Teknik Destek ekiplerine erişim",
                                "Online eğitim kaynakları",
                                "Yeni yazılım sürümlerine anında erişim",
                            ],
                        },
                        {
                            "question": "Abonelik süresi ne kadardır ve yenilemek istemezsem ne olur?",
                            "answer": "Abonelik süreleri ve iptal bildirim koşulları:",
                            "bullets": [
                                "Abonelik Süreleri: Aylık abonelik, Yıllık abonelik, 3 Yıllık abonelik",
                                "İptal Bildirimi (Aylık): 1 ay önceden bildirim",
                                "İptal Bildirimi (Yıllık / 3 Yıllık): 3 ay önceden bildirim",
                                "Tüm abonelikler, başlangıç süresine göre otomatik olarak yenilenir.",
                            ],
                        },
                        {
                            "question": "Ödemeyi nasıl yapabilirim?",
                            "answer": "Ödemeler 1 yıllık veya 3 yıllık dönemler halinde yapılabilir. Ödeme yöntemleri ülkeye göre değişmekle birlikte genellikle Kredi Kartı veya Havale/EFT (SEPA) şeklindedir. Ödeme, tüm abonelik süresi için peşin alınır.",
                        },
                        {
                            "question": "Aboneliğimi iptal edersem ne olur?",
                            "answer": "Aboneliğiniz iptal edilene kadar devam eder. Süre sonunda, yazılıma ve hizmetlere erişiminiz otomatik olarak sona erer.",
                        },
                        {
                            "question": "Yazılıma erişmek için başka seçeneğim var mı?",
                            "answer": "Evet, belirli ürünler için Kalıcı Lisans (Perpetual License) seçeneği mevcuttur:",
                            "bullets": [
                                "ALLPLAN Ultimate",
                                "ALLPLAN Civil",
                                "ALLPLAN Precast",
                            ],
                            "note": "Not: İlk yıl zorunlu Serviceplus sözleşmesi gereklidir. Bu lisanslar ALLPLAN Cloud erişimini içermez.",
                        },
                        {
                            "question": "Aboneliğin temel avantajları nelerdir?",
                            "answer": "ALLPLAN Abonelik modelinin öne çıkan avantajları:",
                            "bullets": [
                                "Esneklik",
                                "Düşük başlangıç maliyeti",
                                "Her zaman en son yazılım sürümüne erişim",
                                "ALLPLAN Cloud hizmetlerinin dahil olması",
                                "Teknik destek uzmanlığına erişim",
                            ],
                        },
                    ],
                },
                {
                    "id": "cloud",
                    "label": "Cloud Hizmetleri",
                    "iconName": "cloud",
                    "title": "ALLPLAN Cloud SSS",
                    "subtitle": "Bulut depolama, Bimplus ve entegre hizmetler hakkında detaylar.",
                    "items": [
                        {
                            "question": "Abonelikle birlikte ne kadar Cloud depolama alanı alırım?",
                            "answer": "ALLPLAN Cloud ile birlikte 10 GB depolama alanı dahildir. İsterseniz ek 100 GB depolama alanı satın alabilirsiniz.",
                        },
                        {
                            "question": "Hangi ALLPLAN Cloud hizmetleri dahildir?",
                            "answer": "Temel Hizmetler ve Entegrasyonlar:",
                            "bullets": [
                                "BIMPLUS ile model görüntüleme/yönetimi",
                                "ALLPLAN Workgroup Manager (ofis içi takım çalışması)",
                                "ALLPLAN Share (ağlar arası/şirketler arası takım çalışması)",
                                "ALLPLAN Exchange (çizim/plan yönetimi ve dağıtımı)",
                                "Entegrasyon: Solibri Inside (model kontrolü)",
                                "Entegrasyon: AutoConverter (yapısal analiz araçları entegrasyonu)",
                            ],
                        },
                        {
                            "question": "Cloud hizmetlerini kullanmak zorunda mıyım?",
                            "answer": "Hayır. Cloud hizmetleri abonelikle birlikte sunulur ancak kullanımı tamamen isteğe bağlıdır.",
                        },
                        {
                            "question": "Workgroup Manager, Allplan Cloud hizmetlerine dahil mi?",
                            "answer": "Evet, dahildir.",
                        },
                        {
                            "question": "BIMPLUS aboneliğe nasıl uygulanır?",
                            "answer": "BIMPLUS, abonelik lisansınıza zaten dahildir. Ayrıca bağımsız bir ürün olarak da kullanılmaya devam edecektir.",
                        },
                    ],
                },
                {
                    "id": "conversion",
                    "label": "Lisans Dönüşümü",
                    "iconName": "refresh-cw",
                    "title": "Serviceplus'tan Aboneliğe Geçiş",
                    "subtitle": "Mevcut kalıcı lisansınızı abonelik modeline dönüştürme süreci.",
                    "items": [
                        {
                            "question": "ALLPLAN Aboneliğine geçtiğimde ne olur?",
                            "answer": "Serviceplus lisansınızı aboneliğe dönüştürdüğünüzde:",
                            "bullets": [
                                "Mevcut lisansınız ALLPLAN Abonelik lisansına dönüştürülür.",
                                "Tüm ALLPLAN Cloud Hizmetlerine tam erişim kazanırsınız.",
                                "Teknik Destek ve Online Eğitim kaynaklarına erişiminiz devam eder.",
                                "Yeni sürümlere anında erişirsiniz.",
                            ],
                        },
                        {
                            "question": "Kalıcı lisansımı kaybeder miyim?",
                            "answer": "Evet. ALLPLAN Aboneliğine geçtiğinizde, kalıcı lisans üzerindeki haklarınız ve erişiminiz sona erer; bunun yerine güncel ve kapsamlı abonelik avantajlarına sahip olursunuz.",
                        },
                        {
                            "question": "Abonelik taahhüt süresi nedir?",
                            "answer": "Mevcut Serviceplus müşterileri için 12 aylık abonelik sözleşmesi yapılır. Ayrıca, abonelik yenileme fiyatınız 2 yıl boyunca sabitlenir.",
                        },
                        {
                            "question": "Desteklenmeyen eski sürümleri kullanmanın riskleri nelerdir?",
                            "answer": "Teknik olarak mümkün olsa da, desteklenmeyen yazılım kullanmak şu riskleri taşır:",
                            "bullets": [
                                "Güvenlik açıkları",
                                "Stabilite sorunları",
                                "Performans problemleri",
                                "Veri uyumluluğu sorunları",
                            ],
                        },
                    ],
                },
                {
                    "id": "workgroup",
                    "label": "Workgroup & İşbirliği",
                    "iconName": "users",
                    "title": "Workgroup Manager & Gelecek",
                    "subtitle": "İşbirliği araçlarının geleceği ve uyumluluk süreçleri.",
                    "items": [
                        {
                            "question": "Workgroup Manager, Share ve Exchange yeni lisanslar için nasıl sunulacak?",
                            "answer": "1 Ekim 2023 itibariyle, bu hizmetler sadece Abonelik (Subscription) ile sunulmaktadır. Yeni kalıcı lisanslarda bu özellikler mevcut değildir.",
                        },
                        {
                            "question": "Kalıcı lisansım ile mevcut Workgroup Manager'ı kullanmaya devam edebilir miyim?",
                            "answer": "Mevcut kalıcı lisanslar için uyumluluk ve bakım takvimi:",
                            "bullets": [
                                "Workgroup Manager: ALLPLAN 2027 sürümüne kadar uyumludur. Ekim 2027'de bakımı ve desteği sona erecektir.",
                                "Exchange & Share: Ekim 2026'da bakımı ve desteği sona erecektir.",
                            ],
                            "note": "Not: Gelecek özellikler ve entegrasyonlar sadece Abonelik modelinde geliştirilmeye devam edecektir.",
                        },
                        {
                            "question": "Mevcut Workgroup Manager iş akışlarımızın geleceği ne olacak?",
                            "answer": "İşbirliği, proje teslimi için hayati önem taşır. Yerel (LAN) ve global (WAN) işbirliği çözümleri gelişmeye devam edecektir:",
                            "bullets": [
                                "Workgroup Manager 2027'ye kadar bağımsız ürün olarak kalacaktır.",
                                "LAN çözümünün sürekli iyileştirilmesi devam edecektir.",
                                "Share (WAN) ve BIMPLUS entegrasyonları ile \"Allplan Cloud\" çatısı altında daha kapsamlı ve güvenli bir işbirliği platformu hedeflenmektedir.",
                            ],
                        },
                    ],
                },
                {
                    "id": "lifecycle",
                    "label": "Ürün Yaşam Döngüsü",
                    "iconName": "shield",
                    "title": "Ürün Yaşam Döngüsü (Product Lifecycle)",
                    "subtitle": "Versiyon onayı, bakım aşamaları ve teknik destek kapsamı politikaları. (13 Ocak 2025'ten itibaren geçerlidir)",
                    "ctaText": "Learn more: ALLPLAN product lifecycle policy",
                    "ctaHref": "https://www.allplan.com/product-lifecycle/",
                    "items": [
                        {
                            "question": "Bu ürün yaşam döngüsü politikasının kapsamı nedir?",
                            "answer": "Bu politika 13 Ocak 2025 tarihi itibariyle geçerlidir ve ALLPLAN'ın masaüstü ürünlerini (ALLPLAN, FRILO, DC-Software), SCIA ve SDS2 ürünlerinin şimdiki ve gelecek versiyonlarını kapsar. ALLPLAN 2024 ve önceki sürümleri kapsayan eski politikaların yerini alır.",
                        },
                        {
                            "question": "Ürün Bakımı (Product Maintenance) ve Sürüm Desteği (Version Support) arasındaki fark nedir?",
                            "answer": "İki kavram farklı hizmet katmanlarını ifade eder:",
                            "bullets": [
                                "Ürün Bakımı: Belirli bir sürümün bulunduğu bakım aşamasına bağlı olarak kullanıcının bekleyebileceği yazılım güncelleme türlerini tanımlar.",
                                "Sürüm Desteği: Teknik Destek ile iletişim kurma yollarını ve sağlanan hizmetleri tanımlar.",
                            ],
                        },
                        {
                            "question": "Hangi bakım hizmetleri hangi aşamaya dahildir?",
                            "answer": "Ürün Bakım Hizmetleri aşama karşılaştırma tablosu:",
                            "table": {
                                "headers": ["Ürün Bakım Hizmetleri", "Current (Güncel)", "Supported (Desteklenen)", "Retired (Emekli)"],
                                "rows": [
                                    ["Yeni özellikler", "✓", "-", "-"],
                                    ["İyileştirmeler", "✓", "-", "-"],
                                    ["Bakım düzeltmeleri*", "✓", "✓", "-"],
                                    ["Yeni ortamları sertifikalandırma", "✓", "-", "-"],
                                    ["ALLPLAN Cloud Bağlantısı (Direct Interface)", "✓", "✓", "-"],
                                ],
                            },
                            "note": "* ALLPLAN, hataların ve eksikliklerin düzeltilmesini, kullanıcılar üzerindeki etkilerini ve diğer kriterleri göz önünde bulundurarak kendi takdirine bağlı olarak önceliklendirir.",
                        },
                        {
                            "question": "Hangi teknik destek hizmetleri hangi aşamaya dahildir?",
                            "answer": "Teknik Destek Hizmetleri aşama karşılaştırma tablosu:",
                            "table": {
                                "headers": ["Teknik Destek Hizmetleri", "Current (Güncel)", "Supported (Desteklenen)", "Retired (Emekli)"],
                                "rows": [
                                    ["Destek kaynakları (online)", "✓", "✓", "-"],
                                    ["Eğitim materyalleri (online)", "✓", "✓", "-"],
                                    ["Olay bildirimi (Telefon, mail, ticket)", "✓", "✓", "-"],
                                    ["Hizmet talepleri (Service requests)", "✓", "✓", "-"],
                                    ["İndirmeler (Downloads)", "✓", "✓", "-"],
                                ],
                            },
                        },
                        {
                            "question": "Ana Sürüm (Major Version) nedir? Ne sıklıkla yayınlanır?",
                            "answer": "Yeni (büyük) özellikler, geliştirmeler veya değişiklikler içeren sürümdür. Sürüm numarasının en solundaki rakam değiştiğinde anlaşılır (Örn. ALLPLAN 2025'ten ALLPLAN 2026'ya geçiş). Yayınlanma sıklığı: Genellikle yılda bir kez.",
                        },
                        {
                            "question": "Ara Sürüm (Minor Version) nedir? Ne sıklıkla yayınlanır?",
                            "answer": "Küçük özellikler, stabilite, performans veya güvenlik iyileştirmeleri içeren sürümdür. Sürüm numarasının sağındaki rakamlar değiştiğinde anlaşılır (Örn. 2025-0-1 veya 2025-1-0). Yayınlanma sıklığı: Genellikle yılda birkaç kez (ürün hattına göre değişir).",
                        },
                    ],
                },
            ],
        }
    }


def parse_how_to_assign_page():
    return {
        "faqDirectory": {
            "kicker": "/ REHBER & DESTEK · CONNECT 2.0 LİSANSLAMA",
            "title": "Sıkça Sorulan Sorular & İşlemler",
            "subtitle": "Yeni nesil bulut tabanlı lisanslama sisteminde en çok ihtiyaç duyulan yönetim adımları.",
            "categories": [
                {
                    "id": "assign",
                    "label": "Lisans Atama & İade Adımları",
                    "iconName": "key",
                    "title": "Allplan Connect 2.0 Lisans Yönetim Rehberi",
                    "subtitle": "Yönetici lisans atama, ALLPLAN ID oluşturma ve 10Duke lisans iade süreçleri.",
                    "items": [
                        {
                            "question": "Ekip üyelerine nasıl lisans atanır? (Yönetici Adımları)",
                            "answer": "Yönetici olarak ekip üyelerine lisans atamak oldukça basittir:",
                            "bullets": [
                                "1. Giriş Yapın: Yönetici (Admin) hesabınızla Allplan Connect portalına (connect.allplan.com) giriş yapın.",
                                "2. Davet Edin: Menüden \"Ekip Üyeleri\" (Team members) bölümüne giderek lisans vereceğiniz kişileri e-posta adresleriyle kurum ağınıza (Company Network) davet edin.",
                                "3. Panoyu Açın: Menüdeki \"Admin\" sekmesi altından \"Lisanslama Panosu\" (Licensing Dashboard) alanına tıklayın.",
                                "4. Lisansı Atayın: Panoda listelenen kullanıcıların yanındaki kutucuğu işaretleyerek havuzdaki boş lisanslarınızı tek tıkla atayın.",
                            ],
                        },
                        {
                            "question": "Kullanıcıların ALLPLAN ID oluşturma adımları nelerdir?",
                            "answer": "Kullanıcıların ALLPLAN ID (Allplan Connect/Bimplus hesabı) oluşturmaları için şu 3 basit adımı izlemesi yeterlidir:",
                            "bullets": [
                                "01. Daveti Yanıtlayın veya Kayıt Olun: Kurum yöneticinizden gelen davet e-postasındaki bağlantıya tıklayın ya da doğrudan Allplan Connect sayfasına giderek \"Kayıt Ol\" (Register) seçeneğini seçin.",
                                "02. Bilgileri Doldurun: Kurumsal e-posta adresinizi (bu e-posta sizin kalıcı ALLPLAN ID'niz olacaktır) ve belirlediğiniz şifreyi girerek kayıt formunu eksiksiz doldurun.",
                                "03. Hesabı Doğrulayın: Kayıt işleminden hemen sonra e-posta adresinize gönderilen doğrulama bağlantısına 24 saat içinde tıklayarak hesabınızı aktifleştirin.",
                            ],
                        },
                        {
                            "question": "10Duke sisteminde lisans iadesi adımları nelerdir?",
                            "answer": "Bir lisansı kullanıcıdan geri alarak şirket havuzuna iade etmek için:",
                            "bullets": [
                                "1. Yönetici hesabınızla Allplan Connect portalına giriş yapın.",
                                "2. Admin sekmesi altından \"Lisanslama Panosu\"na (Licensing Dashboard) gidin.",
                                "3. Lisansını geri almak istediğiniz kullanıcının yanındaki onay kutucuğunun işaretini (tik) kaldırın.",
                            ],
                            "note": "Bilgi: 10Duke bulut lisanslama sisteminde eski yöntemlerdeki gibi bilgisayar başından yapılan fiziksel bir \"iade\" işlemi yoktur; süreç tamamen yöneticiler tarafından merkezden anlık olarak yönetilir. İşlemi yaptığınız anda lisans şirketinizin boş lisans havuzuna geri döner.",
                        },
                    ],
                }
            ],
        }
    }


def parse_sketchup_converter_page():
    return {
        "intro": {
            "kicker": "/ EKLENTİ GENEL BAKIŞ · SKETCHUP & LUMION ENTEGRASYONU",
            "title": "SketchUp dosyalarıyla optimize edilmiş veri alışverişi",
            "bullets": [
                "SketchUp Converter eklentisi ile, dokular dahil bir 3B modeli Allplan’a kolayca aktarabilirsiniz. Bu şekilde, örneğin SketchUp Deposundan tüm yüzeyleri içeren bitkileri, insanları, mobilyaları, araçları vb. Allplan’a aktarabilir ve bunları görselleştirmeniz için kullanabilirsiniz.",
                "Mevcut SketchUp sürümleri desteklenmektedir. SketchUp dışa aktarımı, Lumion görselleştirme yazılımıyla optimum bir iş akışı için uyarlanmıştır. Basit Allplan makrolarını ayrıntılı Lumion nesneleriyle (ağaçlar, arabalar, ışıklar, vb.) değiştirebilirsiniz.",
            ],
            "videoEmbedUrl": "https://www.youtube.com/embed/dsFgV9-aAyI",
        },
        "workflowTabs": {
            "kicker": "/ VERİ ALIŞVERİŞİ ÖZELLİKLERİ",
            "title": "SketchUp Export & Import Yetenekleri",
            "subtitle": "Dışa aktarma (Export) ve içe aktarma (Import) iş akışlarının teknik detayları.",
            "categories": [
                {
                    "key": "export",
                    "label": "SketchUp Export",
                    "items": [
                        {
                            "title": "SketchUp ve Lumion Dışa Aktarım (Export)",
                            "description": "Allplan modellerini bileşen ve grup hiyerarşisini koruyarak SketchUp ve Lumion ortamına aktarın:",
                            "bullets": [
                                "• Makro tanımları SketchUp bileşenleri olarak, makro yer değiştirmeleri SketchUp örnekleri olarak dışa aktarılır",
                                "• SketchUp sürüm 2019’a kadar dışa aktarın (Allplan sadece 2017 / 2018’e kadar)",
                                "• Önceden seçilmiş elemanların dışa aktarımı",
                                "• Dışa aktarılan skp dosyasının otomatik hata kontrolü ve düzeltilmesi; bu, Lumion’a anında aktarılabileceği anlamına gelir",
                                "• Allplan’dan 3B katılar isteğe bağlı olarak SketchUp grupları olarak birleştirilebilir",
                            ],
                            "imageSrc": "",
                            "youtubeId": "XcIPUX2nF4c",
                        }
                    ],
                },
                {
                    "key": "import",
                    "label": "SketchUp Import",
                    "items": [
                        {
                            "title": "Dokular ve Katı Gövdelerle İçe Aktarım (Import)",
                            "description": "SketchUp 3D Warehouse modellerini UV dokuları ve katı geometrileriyle Allplan'a aktarın:",
                            "bullets": [
                                "• SketchUp sürümlerinin 2016, 2017, 2018, 2019 içe aktarımı Allplan 2018, 2019’da da mümkündür",
                                "• Yüzeyler her zaman üçgenleştirilmez, üçgenleme isteğe bağlı olarak ayarlanabilir",
                                "• Gövdeler yüzey grupları olarak değil, katı gövdeler olarak içe aktarılır",
                                "• Dokular, .surf dosyaları olarak içe aktarılır ve oluşturulur (UV koordinatlı olanlar dahil)",
                            ],
                            "imageSrc": "",
                            "youtubeId": "xIDepYtmsIw",
                        }
                    ],
                },
            ],
        },
        "extraGrids": [
            {
                "kicker": "/ UYGULAMA VİDEOLARI",
                "title": "Tanıtım Videoları",
                "subtitle": "SketchUp Converter eklentisinin Allplan ve Lumion iş akışı videoları.",
                "columns": 3,
                "items": [
                    {
                        "title": "ALLPLAN Add-On SketchUpConverter - Export Allplan zu Lumion",
                        "description": "Allplan makrolarının SketchUp üzerinden Lumion bileşenlerine dönüştürülmesi.",
                        "imageSrc": "",
                        "youtubeId": "XcIPUX2nF4c",
                    },
                    {
                        "title": "ALLPLAN Add-On SketchUpConverter - Import Allplan UV Texturen",
                        "description": "UV koordinatlı dokuların .surf dosyaları olarak Allplan'a aktarılması.",
                        "imageSrc": "",
                        "youtubeId": "xIDepYtmsIw",
                    },
                    {
                        "title": "ALLPLAN Add-On SketchUpConverter - Import Allplan",
                        "description": "SketchUp 3B katı modellerinin Allplan ortamına doğrudan aktarımı.",
                        "imageSrc": "",
                        "youtubeId": "QUTYgmyfu3o",
                    },
                ],
            }
        ],
        "splitCallouts": [
            {
                "kicker": "/ LİSANS VE GEREKSİNİMLER",
                "title": "Lisans ve Gereksinimler",
                "lead": "Tek kullanıcı lisansı, mevcut Allplan lisansına bağlıdır.",
                "subheading": "Sistem Gereksinimleri: Allplan 2020 – 2024 · Diller: Almanca, İngilizce",
                "description": "Eklentiyi yükledikten sonra deneme sürümünü 14 gün ücretsiz olarak kullanabilirsiniz.",
                "imageSrc": "/assets/solutions/cds/license.jpg",
                "ctaText": "Setup İndir",
                "ctaHref": "https://cdssieber.sharepoint.com/:f:/g/Ev_G2db5WVVBvMEN-Adhz24Bk5f3rEvFCQu77iLTTCIynw?e=qkPdri",
                "external": True,
            }
        ],
    }


def parse_quick_start_page():
    return {
        "intro": {
            "kicker": "/ HIZLI BAŞLANGIÇ REHBERİ · OPEN BIM & AI DESTEKLİ",
            "title": "Allplan 2026 Kapsamlı Başlangıç Rehberi",
            "bullets": [
                "Bu kılavuz, Allplan BIM yazılımının profesyonel düzeydeki kullanımını, Open BIM iş akışlarını ve Allplan 2026 yeniliklerini derinlemesine ele alır.",
                "Mimarlar, mühendisler ve inşaat profesyonelleri için tasarımdan inşaya (Design to Build) bütünleşik bir süreç sunar.",
                "Open BIM Uyumlu (IFC 4.3, BCF, IDS) ve AI Destekli iş akışları.",
            ],
        },
        "workflowTabs": {
            "kicker": "/ DİSİPLİN REHBERİ · 4 ANA MODÜL",
            "title": "Modüller ve Profesyonel İş Akışları",
            "subtitle": "Disiplinlere özel yetenekler, Allplan 2026 yenilikleri ve en iyi uygulama yöntemleri.",
            "categories": [
                {
                    "key": "architecture",
                    "label": "Mimari",
                    "items": [
                        {
                            "title": "Allplan Architecture — Tasarım Özgürlüğü ve Hassas Dokümantasyon",
                            "badge": "Mimari BIM",
                            "description": "Üstün modelleme yetenekleri ile karmaşık geometrileri kolayca oluşturun. Tutarlı şablonlar ile projeleri hızla görselleştirin ve hataları en aza indirin.",
                            "bullets": [
                                "• Temel Özellikler: Çok katmanlı duvar ve bitiş modelleme, akıllı oda filtreleri ve metraj",
                                "• Allplan 2026 ile Yeni: Çok katmanlı dikey bitişler, gerçekçi geometri, kural tabanlı dağıtım ve 3D süpürgelik modellemesi",
                                "• Verimlilik ve Doğruluk: 3D modelleme ile teslimatlarda %50 daha fazla doğruluk, %30 daha fazla üretkenlik ve %70 daha verimli metraj/maliyetlendirme",
                                "• Parametrik Tasarım: Parametrik nesneler ve Visual Scripting ile tekrarlayan görevlerin otomasyonu",
                                "• Open BIM Entegrasyonu: IFC veri alışverişi ve BCF tabanlı çakışma yönetimi ile disiplinler arası sorunsuz işbirliği",
                            ],
                            "imageSrc": "",
                        }
                    ],
                },
                {
                    "key": "engineering",
                    "label": "Mühendislik",
                    "items": [
                        {
                            "title": "Allplan Engineering — Yapısal Analiz, Donatı ve Çelik Detaylandırma",
                            "badge": "Yapısal BIM",
                            "description": "Dökme yerinde beton, prekast, çelik ve ahşap dahil olmak üzere tüm malzemeleri optimize edin. Donatı ve çelik yapıların hızlı tasarımı için otomatik çözümler kullanın.",
                            "bullets": [
                                "• Otomatik Donatı: Kolon donatı PythonPart'ı gibi araçlarla tekrarlayan elemanları saniyeler içinde donatın; çap, aralık ve bindirme boylarını parametrik yönetin",
                                "• Gelişmiş Veri Değişimi: 50'den fazla dosya formatı desteği, SCIA AutoConverter ve SAF formatı ile yapısal analiz yazılımlarına kayıpsız aktarım",
                                "• Çelik Yapı Detaylandırma (SDS2): SDS2 entegrasyonu ile çelik yapıların modellemesinden imalatına uçtan uca akıllı bağlantı tasarımı",
                            ],
                            "imageSrc": "",
                        }
                    ],
                },
                {
                    "key": "infrastructure",
                    "label": "Altyapı",
                    "items": [
                        {
                            "title": "Infrastructure & Civil — Yol, Köprü ve Tünel Projeleri İçin Parametrik Modelleme",
                            "badge": "Altyapı & Civil",
                            "description": "Case Study — Porto Metro \"Ruby Line\": Karmaşık tünel kesitleri (NATM ve Aç-Kapa) için LandXML aks verileri Bimplus üzerinden içe aktarılarak modellendi. Tünel duvarlarındaki kazıklar (piles) PythonParts kullanılarak otomatikleştirildi.",
                            "bullets": [
                                "• \"Etkileşimleri 3D model olmadan görselleştirmek inanılmaz derecede zor olurdu.\" — QUADRANTE",
                                "• Arazi Etüdü & Point Cloud: Scalypso gibi entegre araçlarla saha nokta bulutu (Point Cloud) verilerini işleyin ve mevcut durumun hassas envanterini (As-built) oluşturun",
                                "• Şantiye Planlama: Kule vinç gibi şantiye ekipmanlarını yerleştirin, çarpışma tespiti yapın ve basit kaldırma analizleri gerçekleştirin",
                            ],
                            "imageSrc": "",
                        }
                    ],
                },
                {
                    "key": "precast",
                    "label": "Prekast",
                    "items": [
                        {
                            "title": "Allplan Precast — Otomatik Prekast Detaylandırma ve Üretim (CAM) Verisi",
                            "badge": "Prekast & Üretim",
                            "description": "Vaka Çalışması — BFU (Rütihof): Önceden kağıt planlar (2D) ve manuel kontrollerle yürüyen süreç, Allplan IFC-Assistant ile tamamen dijitalleşti. BFU, sadece 9 ayda 10.000m² döşeme ve 1.100m² duvar elemanını detaylandırıp üretti.",
                            "bullets": [
                                "• Hata oranında ciddi düşüş ve üretime hazır otomatik shop drawingler",
                                "• Otomatik Atölye Çizimleri: Donatı, armatür ve boyutlandırma dahil yüksek düzeyde otomatik kalıp planları oluşturun",
                                "• Üretim Entegrasyonu: Duvar ve döşemeleri fabrika kapasitesine göre otomatik bölün ve CAM verilerini gönderin",
                            ],
                            "imageSrc": "",
                        }
                    ],
                },
            ],
        },
        "extraGrids": [
            {
                "kicker": "/ OPEN BIM VE İŞBİRLİĞİ · BIMPLUS & BCF",
                "title": "Adım Adım Çakışma Çözümü (Clash Resolution) & IFC Güvenliği",
                "subtitle": "Proje paydaşları arasında verimsiz e-posta trafiği yerine Bimplus entegrasyonu ile merkezi koordinasyon.",
                "columns": 3,
                "items": [
                    {
                        "title": "1. Çakışma Tespiti & 2. BCF Sorunu Oluşturma",
                        "badge": "Adım 01–02",
                        "description": "Modelde Check > Clash Detection komutunu çalıştırın. Tespit edilen çakışmayı seçin, Issue Manager üzerinden konum, ekran görüntüsü ve sorumlu ekleyerek BCF sorunu oluşturun.",
                        "imageSrc": "",
                    },
                    {
                        "title": "3. Bimplus Senkronizasyonu & 4. Çözüm Doğrulama",
                        "badge": "Adım 03–04",
                        "description": "Sorunu buluta gönderin; diğer disiplinler (ör: MEP mühendisi) kendi yazılımlarında anında görür. Çözüldüğünde Bimplus'ta \"Resolved\" olarak işaretlenir ve Allplan'da kapatılır.",
                        "imageSrc": "",
                    },
                    {
                        "title": "IFC Veri Güvenliği & Partner Entegrasyonları",
                        "badge": "Open BIM",
                        "description": "Nitelik Eşleme (Mapping) ile Allplan niteliklerini IFC Pset'lerine doğru eşleyin ve IDS ile otomatik kontrol edin.",
                        "bullets": [
                            "• Partner Entegrasyonları: SCIA Engineer, Frilo, Bluebeam, SDS2, Redshift",
                        ],
                        "imageSrc": "",
                    },
                ],
            },
            {
                "kicker": "/ PROFESYONEL İPUÇLARI",
                "title": "5 Profesyonel İpucu",
                "subtitle": "Allplan projelerinde veri kalitesini ve modelleme hızını artıran temel prensipler.",
                "columns": 3,
                "items": [
                    {
                        "title": "1. Veri Kaybını Önleyin",
                        "badge": "İpucu 01",
                        "description": "IFC dışa aktarımda \"Attribute Mapping\" ve \"Yalnızca Atanan Nitelikleri Aktar\" seçeneklerini kullanın.",
                        "imageSrc": "",
                    },
                    {
                        "title": "2. Otomasyon Kullanın",
                        "badge": "İpucu 02",
                        "description": "Tekrarlayan işler için PythonParts veya Visual Scripting scriptlerini devreye sokun.",
                        "imageSrc": "",
                    },
                    {
                        "title": "3. Parametrik Yönetim",
                        "badge": "İpucu 03",
                        "description": "Revizyonları hızlandırmak için yol ve altyapı projelerinde parametrik modellemeyi tercih edin.",
                        "imageSrc": "",
                    },
                    {
                        "title": "4. BCF ile Koordinasyon",
                        "badge": "İpucu 04",
                        "description": "Bimplus entegrasyonu ile çakışmaları e-posta yerine BCF üzerinden yönetin.",
                        "imageSrc": "",
                    },
                    {
                        "title": "5. Entegre Analiz",
                        "badge": "İpucu 05",
                        "description": "SCIA AutoConverter kullanarak modelinizi analiz yazılımlarına tek tıkla aktarın.",
                        "imageSrc": "",
                    },
                ],
            },
            {
                "kicker": "/ VAKA ÇALIŞMALARI & YENİLİKLER",
                "title": "Gerçek Hayat Senaryoları ve Allplan 2026 Yenilikleri",
                "subtitle": "Uluslararası referans projeler ve Allplan 2026'nın öne çıkan mimari/yapısal yetenekleri.",
                "columns": 3,
                "items": [
                    {
                        "title": "Zürih \"The Circle\"",
                        "badge": "Architecture",
                        "description": "1 Milyar İsviçre frangı yatırım ve 180.000 m² alan. Allplan ile tamamen BIM olarak planlanan devasa kompleks; büyük model verilerinin yönetimi ve disiplinler arası koordinasyon başarısı.",
                        "imageSrc": "",
                    },
                    {
                        "title": "Porto Metro \"Ruby Line\"",
                        "badge": "Infrastructure",
                        "description": "Tünel, viyadük ve istasyonların karmaşık etkileşimi. LandXML entegrasyonu ve 3D görselleştirme sayesinde çakışmasız tasarım ve parametrik revizyon imkanı.",
                        "imageSrc": "",
                    },
                    {
                        "title": "Rütihof (BFU)",
                        "badge": "Precast",
                        "description": "Manuel 2D süreçlerden tam otomatik BIM'e geçiş. 10.000m² döşeme sadece 9 ayda üretildi; kağıt paftalar yerine dijital ve hatasız üretim.",
                        "imageSrc": "",
                    },
                    {
                        "title": "Öncelik Tabanlı Bağlantılar (PBC)",
                        "badge": "Allplan 2026",
                        "description": "Özel bileşenler ile yapı elemanları arasında otomatik ve akıllı birleşimler.",
                        "imageSrc": "",
                    },
                    {
                        "title": "Gelişmiş Bitiş Modellemesi",
                        "badge": "Allplan 2026",
                        "description": "Gerçekçi geometriye sahip çok katmanlı dikey bitişler ve süpürgelikler.",
                        "imageSrc": "",
                    },
                ],
            },
        ],
    }



def build_all_structured_pages() -> dict:
    structured = {}

    # 1. Core 5 Allplan Edition Pages
    structured["/products/allplan-ultimate"] = parse_core_product_page(
        "/products/allplan-ultimate", "app/products/allplan-ultimate/page.tsx", "default"
    )
    structured["/products/allplan-professional"] = parse_core_product_page(
        "/products/allplan-professional", "app/products/allplan-professional/page.tsx", "default"
    )
    structured["/products/allplan-concept"] = parse_core_product_page(
        "/products/allplan-concept", "app/products/allplan-concept/page.tsx", "default"
    )
    structured["/products/allplan-basic"] = parse_core_product_page(
        "/products/allplan-basic", "app/products/allplan-basic/page.tsx", "default"
    )
    structured["/products/civil"] = parse_core_product_page(
        "/products/civil", "app/products/civil/page.tsx", "civil"
    )

    # 2. Other Product Pages
    structured["/products/allplan-aec"] = parse_allplan_aec()
    structured["/products/precast"] = parse_precast_pages("/products/precast")
    structured["/products/precast-detail"] = parse_precast_pages("/products/precast-detail")
    structured["/products/allplan-2026"] = parse_allplan_2026()
    structured["/products/allplan-2026-yenilikler"] = parse_allplan_2026_yenilikler()
    structured["/products/allplan-cloud-services"] = parse_allplan_cloud_services()
    structured["/products/allplan-bimplus"] = parse_allplan_bimplus()
    structured["/products/ax3000"] = parse_ax3000()
    structured["/products/sds2-home"] = parse_sds2_home()

    # 3. Solution Pages with Multi-Tab Workflows, Reason Icon Grids, and Popup Videos
    structured["/solutions/allplan-bulut-hizmetleri"] = parse_allplan_bulut_hizmetleri_solution()
    structured["/solutions/architecture"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/architecture", "app/solutions/architecture/page.tsx", "workflowCategories"
    )
    structured["/solutions/structural"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/structural", "app/solutions/structural/page.tsx", "structuralCategories"
    )
    structured["/solutions/infrastructure"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/infrastructure", "app/solutions/infrastructure/page.tsx", "infrastructureCategories"
    )
    structured["/solutions/mep"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/mep", "app/solutions/mep/page.tsx", "mepCategories"
    )
    structured["/solutions/road-railway"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/road-railway", "app/solutions/road-railway/page.tsx", "workflowCategories"
    )
    structured["/solutions/site-planning"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/site-planning", "app/solutions/site-planning/page.tsx", "workflowCategories"
    )
    structured["/solutions/bridge-design"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/bridge-design", "app/solutions/bridge-design/page.tsx", ""
    )
    structured["/solutions/precast"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/precast", "app/solutions/precast/ClientPage.tsx", ""
    )
    structured["/solutions/steel"] = parse_solution_page_with_tabs_and_reasons(
        "/solutions/steel", "app/solutions/steel/page.tsx", ""
    )
    structured["/solutions-v2/training/webinar"] = parse_webinar_page()
    structured["/references"] = parse_references_page()
    structured["/solutions-v2/faq"] = parse_faq_page()
    structured["/solutions-v2/connect-license/how-to-assign"] = parse_how_to_assign_page()
    structured["/solutions/addons/sketchup-converter"] = parse_sketchup_converter_page()
    structured["/solutions-v2/training/quick-start"] = parse_quick_start_page()

    return structured


if __name__ == "__main__":
    data = build_all_structured_pages()
    print(f"Built structured layout for {len(data)} routes:")
    for k, v in sorted(data.items()):
        nb = len((v.get("benefits") or {}).get("items", []))
        ncf = len((v.get("coreFeatures") or {}).get("items", []))
        ntabs = len((v.get("workflowTabs") or {}).get("categories", []))
        ntab_items = sum(len(c["items"]) for c in (v.get("workflowTabs") or {}).get("categories", []))
        nextra = sum(len(g["items"]) for g in v.get("extraGrids", []))
        print(
            f"  {k:42s} -> benefits={nb:2d}, coreFeatures={ncf:2d}, tabs={ntabs} ({ntab_items:2d} items), extraGridItems={nextra:2d}"
        )
