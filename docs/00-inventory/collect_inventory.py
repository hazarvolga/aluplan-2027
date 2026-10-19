"""Read-only source/live inventory. Writes only beside this script; never submits forms."""
import csv, hashlib, json, re, time, urllib.request, urllib.parse
from datetime import datetime
from zoneinfo import ZoneInfo
import xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[2]
OLD = ROOT.parent / 'aluplan-2026'
OUT = Path(__file__).resolve().parent
BASE = 'https://aluplan.com.tr'
SKIP = {'.git', '.next', 'node_modules', '.agent', '.vscode'}
MEDIA = {'.jpg','.jpeg','.png','.webp','.avif','.svg','.gif','.ico','.pdf','.doc','.docx','.xls','.xlsx','.zip','.mp4','.webm','.mov','.mp3','.woff','.woff2','.ttf','.otf'}

def walk(folder):
    for item in sorted(folder.iterdir()):
        if item.is_symlink() or item.name in SKIP or item.name.startswith('.env'):
            continue
        if item.is_dir():
            yield from walk(item)
        elif item.is_file():
            yield item

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024*1024), b''):
            h.update(chunk)
    return h.hexdigest()

class DOM(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag':'root','attrs':{},'children':[]}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = {'tag':tag,'attrs':dict(attrs),'children':[]}
        self.stack[-1]['children'].append(node)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i]['tag'] == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, data):
        self.stack[-1]['children'].append(data)

def txt(node):
    if isinstance(node,str): return node
    if node['tag'] in {'script','style','noscript'}: return ''
    return ''.join(txt(x) for x in node['children'])

def form_record(node):
    allowed = {'name','type','id','required','minlength','maxlength','min','max','pattern','placeholder','autocomplete','action','method','aria-label','for'}
    def clean(item):
        if isinstance(item, str): return item
        if item['tag'] in {'script','style'}: return None
        return {'tag':item['tag'], 'attributes':{k:v for k,v in item['attrs'].items() if k in allowed}, 'children':[clean(c) for c in item['children'] if not isinstance(c,dict) or c['tag'] not in {'script','style'}]}
    return clean(node)

SENSITIVE = re.compile(r'(?:-----BEGIN [A-Z ]*PRIVATE KEY|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|(?:password|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["\']?[^\s"\']{8,})', re.I)

def extract(html):
    parser = DOM(); parser.feed(html)
    result = {key:[] for key in ['headings','text_nodes','links','buttons','images','media','embeds','forms','meta','metadata_links','schema','scripts']}
    result['title'] = ''
    def visit(node, location='content', excluded=False):
        if isinstance(node,str):
            if not excluded and node.strip(): result['text_nodes'].append(node)
            return
        tag, attrs = node['tag'], node['attrs']
        location = tag if tag in {'header','footer','nav'} else location
        excluded = excluded or tag in {'script','style','head','noscript'}
        record = {'attributes':attrs,'text':txt(node),'location':location}
        if re.fullmatch('h[1-6]',tag): result['headings'].append({'level':int(tag[1]),'text':txt(node)})
        if tag == 'title': result['title'] = txt(node)
        if tag == 'a': result['links'].append(record)
        if tag == 'button': result['buttons'].append(record)
        if tag == 'img': result['images'].append(record)
        if tag in {'video','audio','source','track'}: result['media'].append({'tag':tag,**record})
        if tag in {'iframe','object','embed'}: result['embeds'].append({'tag':tag,**record})
        if tag == 'form': result['forms'].append(form_record(node))
        if tag == 'meta': result['meta'].append(attrs)
        if tag == 'link': result['metadata_links'].append(attrs)
        if tag == 'script':
            if attrs.get('type') == 'application/ld+json': result['schema'].append(''.join(x for x in node['children'] if isinstance(x,str)))
            if attrs.get('src'): result['scripts'].append(attrs['src'])
        for child in node['children']: visit(child,location,excluded)
    visit(parser.root)
    return result

def get(url):
    start = time.monotonic()
    try:
        req = urllib.request.Request(url, headers={'User-Agent':'Aluplan-Inventory/1.0 (read-only migration audit)'})
        with urllib.request.urlopen(req,timeout=25) as response:
            body = response.read(12*1024*1024+1)
            truncated = len(body)>12*1024*1024
            return {'url':url,'final_url':response.url,'status':response.status,'content_type':response.headers.get('Content-Type',''),'bytes':len(body),'truncated':truncated,'seconds':round(time.monotonic()-start,3),'body':body.decode('utf-8',errors='replace')}
    except Exception as exc:
        return {'url':url,'status':getattr(exc,'code',None),'error':str(exc),'location':getattr(exc,'headers',{}).get('Location')}

def save(name,value):
    (OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def main():
    files = list(walk(OLD))
    source = []
    routes = {}
    for file in files:
        rel = file.relative_to(OLD).as_posix()
        if file.suffix in {'.tsx','.ts','.js','.css','.txt','.html','.json'} and file.stat().st_size < 2000000 and not any(s in rel for s in ['lock.','build_log','search-index']):
            if rel.split('/')[0] in {'app','components','content','data','lib','services','styles'}:
                text = file.read_text(errors='replace')
                source.append((rel,text))
        if rel.startswith('app/') and file.name in {'page.tsx','route.ts'}:
            parts = [p for p in file.parent.relative_to(OLD/'app').parts if not p.startswith('(')]
            url = '/' + '/'.join(parts)
            routes[url] = {'path':url,'source':rel,'kind':'page' if file.name=='page.tsx' else 'endpoint','depth':len(parts),'parent':'/'+'/'.join(parts[:-1]) if parts else None}
    source_refs = []
    for rel,text in source:
        matches = []
        for line_no,line in enumerate(text.splitlines(),1):
            if re.search(r'href\s*[:=]|src\s*[:=]|<h[1-6]|<form|<input|<button|<iframe|fetch\(|metadata|canonical|onClick',line):
                # Never record environment values or probable secret-bearing assignments.
                if re.search(r'password|secret|api.?key|token|authorization',line,re.I):
                    matches.append({'line':line_no,'text':'[sensitive-looking source omitted; inspect locally if needed]'})
                else: matches.append({'line':line_no,'text':line})
        source_refs.append({'file':rel,'references':matches})
    save('source-references.json',source_refs)
    # Keep source text documents complete, without rewriting content.
    content = [{'file':rel,'text':text} for rel,text in source if rel.startswith('content/') and rel.endswith('.txt') and not SENSITIVE.search(text)]
    save('source-content-texts.json',content)
    save('excluded-content.json',[{'file':rel,'reason':'sensitive-pattern match; content not recorded'} for rel,text in source if rel.startswith('content/') and rel.endswith('.txt') and SENSITIVE.search(text)])
    assets = []
    for file in files:
        if file.suffix.lower() in MEDIA:
            rel = file.relative_to(OLD).as_posix()
            uses = [name for name,body in source if rel in body or ('/'+rel) in body or file.name in body]
            assets.append({'path':rel,'bytes':file.stat().st_size,'sha256':digest(file),'source_reference_candidates':uses,'reference_method':'literal path or basename; not runtime use proof','variant':'live-versiyon snapshot' if rel.startswith('live-versiyon/') else 'source'})
    save('asset-inventory.json',assets)
    infrastructure = {path:get(BASE+path) for path in ['/robots.txt','/sitemap.xml','/llms.txt']}
    save('live-discovery.json',infrastructure)
    discovered = set()
    sitemap_queue = [BASE+'/sitemap.xml']
    sitemap_seen = set()
    sitemap_errors = []
    while sitemap_queue and len(sitemap_seen)<50:
        sitemap_url = sitemap_queue.pop(0)
        if sitemap_url in sitemap_seen: continue
        sitemap_seen.add(sitemap_url)
        entry = infrastructure['/sitemap.xml'] if sitemap_url == BASE+'/sitemap.xml' else get(sitemap_url)
        try:
            xml = ET.fromstring(entry.get('body',''))
            locations = [x.text.strip() for x in xml.iter() if x.tag.split('}')[-1]=='loc' and x.text]
            if xml.tag.split('}')[-1]=='sitemapindex':
                sitemap_queue.extend(u for u in locations if urllib.parse.urlsplit(u).netloc=='aluplan.com.tr')
            else: discovered.update(locations)
        except ET.ParseError as error:
            sitemap_errors.append({'url':sitemap_url,'error':str(error)})
    save('sitemap-discovery-status.json',{'visited':sorted(sitemap_seen),'pending':sitemap_queue,'errors':sitemap_errors})
    discovered |= {BASE+path for path,record in routes.items() if record['kind']=='page' and '[' not in path}
    pages = []
    visited = set()
    for round_no in range(4):
        batch = sorted(url for url in discovered-visited if urllib.parse.urlsplit(url).netloc=='aluplan.com.tr')
        if not batch: break
        with ThreadPoolExecutor(max_workers=3) as pool:
            for response in pool.map(get,batch):
                visited.add(response['url'])
                body = response.pop('body','')
                if 'text/html' in response.get('content_type',''):
                    response.update(extract(body))
                    response['html_sha256'] = hashlib.sha256(body.encode()).hexdigest()
                    for link in response['links']:
                        target = urllib.parse.urljoin(response['final_url'],link['attributes'].get('href',''))
                        split = urllib.parse.urlsplit(target)
                        link['resolved_url'] = target
                        link['internal'] = split.netloc == 'aluplan.com.tr'
                        if split.scheme=='https' and split.netloc=='aluplan.com.tr' and not split.query and not Path(split.path).suffix and not split.path.startswith('/api/'):
                            discovered.add(urllib.parse.urlunsplit((split.scheme,split.netloc,split.path,'','')))
                pages.append(response)
                print(response['status'],response['url'],flush=True)
    incoming = {page['url']:[] for page in pages}
    for page in pages:
        for link in page.get('links',[]):
            target = link['resolved_url'].split('#')[0]
            if target in incoming: incoming[target].append(page['url'])
    for page in pages:
        page['incoming_pages'] = sorted(set(incoming[page['url']]))
        page['orphan_candidate'] = not page['incoming_pages'] and page['url'] != BASE+'/'
    groups = {}
    for page in pages:
        if page.get('text_nodes'):
            key = hashlib.sha256(''.join(page['text_nodes']).encode()).hexdigest()
            groups.setdefault(key,[]).append(page['url'])
    result = {'captured_at':datetime.now(ZoneInfo('Europe/Istanbul')).isoformat(),'phase':'0','completeness':'partial; dynamic UI, external links and all media destinations not verified','base_url':BASE,'routes':list(routes.values()),'pages':pages,'duplicate_text_groups':[v for v in groups.values() if len(v)>1],'assets_file':'asset-inventory.json','source_references_file':'source-references.json','source_content_file':'source-content-texts.json','unvisited':sorted(discovered-visited)}
    save('content-inventory.json',result)
    with (OUT/'url-map.csv').open('w',newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['existing_url','proposed_url','source_file','status','final_url','title','depth','parent','change'])
        for page in pages:
            path = urllib.parse.urlsplit(page['url']).path
            route = routes.get(path,{})
            writer.writerow([page['url'],page['url'],route.get('source',''),page.get('status',''),page.get('final_url',''),page.get('title',''),route.get('depth',''),route.get('parent',''),'preserve; not implemented'])
    print(json.dumps({'routes':len(routes),'pages':len(pages),'assets':len(assets),'source_documents':len(content),'unvisited':len(result['unvisited'])}))

if __name__ == '__main__': main()
