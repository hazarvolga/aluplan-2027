#!/usr/bin/env python3
"""Read-only S05 local HTML/data comparison. Candidate gaps are not automatic losses."""
import argparse
from datetime import date
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import unicodedata
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, build_opener

ROOT = Path(__file__).resolve().parents[1]
TEXT_KEYS = {'title', 'heading', 'description', 'subtitle', 'text', 'question', 'answer', 'label'}


def audit_date():
    return date.today().isoformat()


def normalize(value):
    return re.sub(r'\W+', '', unicodedata.normalize('NFKC', value).casefold())


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.parts, self.headings, self.links = [], [], []

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style'}:
            self.skip += 1
        if not self.skip and tag == 'h1':
            self.headings.append(tag)
        if not self.skip and tag == 'a':
            self.links.append(dict(attrs).get('href', ''))

    def handle_endtag(self, tag):
        if tag in {'script', 'style'}:
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def text_records(value, pointer='', parent_key=''):
    if isinstance(value, dict):
        for key, item in value.items():
            yield from text_records(item, f'{pointer}/{key}', key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from text_records(item, f'{pointer}/{index}', parent_key)
    elif isinstance(value, str) and parent_key in TEXT_KEYS and len(normalize(value)) >= 24:
        yield {'pointer': pointer, 'text': value}


def empty_sections(value, pointer=''):
    if isinstance(value, dict):
        if value.get('items') == [] and any(value.get(key) for key in ['title', 'heading']):
            yield {'pointer': pointer, 'title': value.get('title') or value.get('heading')}
        for key, item in value.items():
            yield from empty_sections(item, f'{pointer}/{key}')
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from empty_sections(item, f'{pointer}/{index}')


def is_loopback(url):
    parts = urlsplit(url)
    return parts.scheme in {'http', 'https'} and parts.hostname in {'127.0.0.1', 'localhost', '::1'}


class LoopbackRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not is_loopback(newurl):
            raise ValueError('Redirect outside loopback preview rejected')
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def audit(base_url):
    if not is_loopback(base_url):
        raise ValueError('Only loopback preview URLs are allowed')
    opener = build_opener(LoopbackRedirectHandler())
    pages = json.loads((ROOT / 'src/data/pages.json').read_text())
    results = []
    for route, page in pages.items():
        requested_url = base_url.rstrip('/') + route
        record = {'route': route, 'requestedUrl': requested_url}
        try:
            with opener.open(requested_url, timeout=30) as response:
                body = response.read()
                record['status'] = response.status
                record['finalUrl'] = response.geturl()
                record['redirected'] = response.geturl() != requested_url
            parser = PageText()
            parser.feed(body.decode('utf-8'))
            visible = normalize(' '.join(parser.parts))
            candidates = list(text_records(page.get('structuredLayout') or {}))
            missing = [item for item in candidates if normalize(item['text']) not in visible]
            record.update({'htmlSha256': hashlib.sha256(body).hexdigest(),
                           'h1Count': len(parser.headings),
                           'structuredTextCandidates': len(candidates),
                           'notInInitialHtml': missing,
                           'emptyStructuredSections': list(empty_sections(page.get('structuredLayout') or {})),
                           'localPageLinksWithoutRecord': sorted(set(
                               urlsplit(link).path for link in parser.links
                               if link.startswith('/') and not link.startswith('//')
                               and urlsplit(link).path not in pages
                               and not (ROOT / 'public' / urlsplit(link).path.lstrip('/')).is_file()
                           ))})
        except Exception as exc:
            record['error'] = f'{type(exc).__name__}: {exc}'
        results.append(record)
    return {'date': audit_date(), 'baseUrl': base_url,
            'method': 'All local data routes fetched; script/style excluded; normalized long structured text compared against initial HTML. No hydration/tab clicks in this scan.',
            'limitations': [
                'Missing HTML text may be available after interaction; not automatically lost content.',
                'Text presence does not establish correct order, media pairing, visibility or full content parity.',
                'Local links without a data record may be intentional redirects; separate HTTP check required.',
                'Empty extracted sections require original source confirmation; may be optional/inactive.',
                'No live-site crawl, source execution or form submission.',
            ], 'summary': {'routes': len(results),
                'analyzedRoutes': sum('h1Count' in r for r in results),
                'fetchErrors': sum('error' in r for r in results),
                'redirectedRoutes': sum(bool(r.get('redirected')) for r in results),
                'http200': sum(r.get('status') == 200 for r in results),
                'singleH1': sum(r.get('h1Count') == 1 for r in results),
                'routesWithStructuredTextAbsentFromHtml': sum(bool(r.get('notInInitialHtml')) for r in results),
                'structuredTextsAbsentFromHtml': sum(len(r.get('notInInitialHtml', [])) for r in results),
                'emptyStructuredSections': sum(len(r.get('emptyStructuredSections', [])) for r in results)},
            'routes': results}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:3001')
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    if not is_loopback(args.base_url):
        parser.error('Only loopback preview URLs are allowed')
    result = audit(args.base_url)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['summary'], ensure_ascii=False, indent=2))
    sys.exit(1 if result['summary']['fetchErrors'] else 0)
