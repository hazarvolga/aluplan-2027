import re, os, json, shutil, pathlib

SRC = "/Users/hazarvolgaekiz/dev/lab/scrapling/exports/allplan_learnnow/Allplan_Temel_Modelleme_Egitimi"
REPO = "/Users/hazarvolgaekiz/dev/studio/aluplan-2027"
OUT_DATA = f"{REPO}/src/data/temel-modelleme"
OUT_IMG = f"{REPO}/public/akademi/temel-modelleme"
os.makedirs(OUT_DATA, exist_ok=True)
os.makedirs(OUT_IMG, exist_ok=True)

IMG_RE = re.compile(r'!\[[^\]]*\]\((?:\.\./)*assets/screenshots/([^)]+)\)')
copied = set()

def copy_img(fname):
    src = f"{SRC}/assets/screenshots/{fname}"
    if os.path.isfile(src):
        if fname not in copied:
            shutil.copy(src, f"{OUT_IMG}/{fname}")
            copied.add(fname)
        return f"/akademi/temel-modelleme/{fname}"
    return None

def extract_imgs(text):
    """Return (clean_text_without_img_md, [img_src_list])."""
    imgs = []
    for m in IMG_RE.finditer(text):
        p = copy_img(m.group(1))
        if p: imgs.append(p)
    clean = IMG_RE.sub('', text)
    # collapse whitespace
    clean = re.sub(r'[ \t]+', ' ', clean)
    clean = re.sub(r'\n{3,}', '\n\n', clean).strip()
    return clean, imgs

def split_sections(md):
    """Split on '## X.' headers → dict letter->body."""
    parts = re.split(r'\n## ([A-E])\. ', md)
    secs = {}
    # parts[0] is preamble
    for i in range(1, len(parts), 2):
        secs[parts[i]] = parts[i+1]
    return parts[0], secs

def parse_objectives(body):
    return [re.sub(r'\s+', ' ', l[2:].strip()) for l in body.splitlines() if l.strip().startswith('- ')]

def parse_steps(body):
    steps = []
    # split on '### '
    chunks = re.split(r'\n### ', '\n'+body)
    for c in chunks[1:]:
        lines = c.split('\n', 1)
        head = lines[0].strip()
        rest = lines[1] if len(lines) > 1 else ''
        time = ''
        heading = head
        m = re.match(r'([\d:\s–\-|]+)\|\s*(.*)', head)
        if m:
            time = m.group(1).replace('|','').strip()
            heading = m.group(2).strip()
        clean, imgs = extract_imgs(rest)
        steps.append({'time': time, 'heading': heading, 'body': clean, 'figures': imgs})
    return steps

def parse_commands(body):
    cmds = []
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith('|'): continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) < 4: continue
        if set(''.join(cells)) <= set(':- '): continue  # separator
        if cells[0].startswith('**Komut') or cells[0] == 'Komut / Araç Adı': continue
        name = re.sub(r'\*\*', '', cells[0]).strip()
        menu = re.sub(r'\*\*', '', cells[1]).strip()
        sc = re.sub(r'[`\*]', '', cells[2]).strip()
        desc = cells[3].strip()
        if name:
            cmds.append({'name': name, 'menu': menu, 'shortcut': sc, 'desc': desc})
    return cmds

VID_RE = re.compile(r'\[([^\]]+?)\s*\(`([^`]+)`\s*—\s*([\d.]+)\s*MB\)\]')
def parse_media(body):
    videos, pdfs, samples = [], [], []
    for m in VID_RE.finditer(body):
        title, fname, size = m.group(1).strip(), m.group(2), m.group(3)
        vm = re.search(r'vimeo_(\d+)', fname)
        videos.append({'title': title, 'file': fname, 'vimeoId': vm.group(1) if vm else '', 'sizeMB': float(size)})
    for m in re.finditer(r'PDF K\u0131lavuz:\s*`([^`]+)`', body):
        pdfs.append(m.group(1))
    for m in re.finditer(r'\u00d6rnek CAD/BIM Dosyas\u0131:\s*`([^`]+)`', body):
        samples.append(m.group(1))
    return {'videos': videos, 'pdfs': pdfs, 'samples': samples}

ART_RE = re.compile(r'### .*?Kaynak Makale \[`([^`]+)`\]:\s*(.*)')
def parse_articles(body):
    arts = []
    chunks = re.split(r'\n### [^\n]*?Kaynak Makale ', '\n'+body)
    for c in chunks[1:]:
        m = re.match(r'\[`([^`]+)`\]:\s*(.*)', c)
        if not m: continue
        aid = m.group(1); title = m.group(2).split('\n')[0].strip()
        rest = c.split('\n', 1)[1] if '\n' in c else ''
        # drop the 'Ayrı dosya bağlantısı' line
        rest = re.sub(r'\*Ayr\u0131 dosya ba\u011flant\u0131s\u0131:.*', '', rest)
        clean, imgs = extract_imgs(rest)
        clean = clean.replace('---','').strip()
        if len(clean) > 2500: clean = clean[:2500] + ' …'
        arts.append({'id': aid, 'title': title, 'body': clean, 'figures': imgs})
    return arts

SLUGMAP = {
 '01':'giris-bim-felsefesi','02':'proje-olusturma','03':'arayuz-incelemesi',
 '04':'cizim-dosyalari-yukseklik','05':'2d-olusturma-komutlari','06':'2d-duzenleme-komutlari',
 '07':'olculendirme','08':'aks-olusturma','09':'duvar-olusturma','10':'kapi-pencere',
 '11':'kolon-kiris','12':'doseme-olusturma','13':'merdiven-olusturma','14':'temel-olusturma',
 '15':'kat-kopyalama','16':'cati-elemanlari'}

index = []
for fn in sorted(os.listdir(f"{SRC}/dersler")):
    if not fn.endswith('.md'): continue
    no = fn[:2]
    md = open(f"{SRC}/dersler/{fn}", encoding='utf-8').read()
    h1 = re.search(r'# Ders \d+ —\s*(.*)', md)
    title_raw = h1.group(1).strip() if h1 else fn
    dur_m = re.search(r'\(`([^`]+)`\)', title_raw)
    duration = dur_m.group(1) if dur_m else ''
    title = re.sub(r'\s*\(`[^`]+`\)', '', title_raw)
    title = re.sub(r'^\d+-?\s*', '', title).strip()
    srcmod_m = re.search(r'Veri \u00c7ekirde\u011fi Mod\u00fcl\u00fc:\*\*\s*`([^`]+)`', md)
    srcmod = srcmod_m.group(1) if srcmod_m else ''
    _, secs = split_sections(md)
    lesson = {
        'no': int(no), 'slug': SLUGMAP.get(no, no), 'title': title,
        'duration': duration, 'sourceModule': srcmod,
        'objectives': parse_objectives(secs.get('A','')),
        'steps': parse_steps(secs.get('B','')),
        'commands': parse_commands(secs.get('C','')),
        'media': parse_media(secs.get('D','')),
        'articles': parse_articles(secs.get('E','')),
    }
    json.dump(lesson, open(f"{OUT_DATA}/{no}.json",'w'), ensure_ascii=False, indent=2)
    index.append({'no': lesson['no'],'slug':lesson['slug'],'title':title,'duration':duration,
                  'steps':len(lesson['steps']),'commands':len(lesson['commands']),
                  'figures':sum(len(s['figures']) for s in lesson['steps']),
                  'videos':len(lesson['media']['videos']),'articles':len(lesson['articles'])})

json.dump(index, open(f"{OUT_DATA}/_index.json",'w'), ensure_ascii=False, indent=2)
print(f"parsed {len(index)} lessons; copied {len(copied)} screenshots")
for it in index:
    print(f"  {it['no']:02d} {it['slug']:26} steps={it['steps']} cmds={it['commands']} fig={it['figures']} vid={it['videos']} art={it['articles']}")
