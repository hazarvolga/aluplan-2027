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
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
TEXT_KEYS = {'title', 'heading', 'description', 'subtitle', 'text', 'question', 'answer', 'label'}
RENDER_BODY_TEXT_KEYS = {'description', 'subtitle', 'text', 'question', 'answer'}


def audit_date():
    return date.today().isoformat()


def normalize(value):
    return re.sub(r'\W+', '', unicodedata.normalize('NFKC', value).casefold())


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.parts, self.headings, self.links = [], [], []
        self.heading_records, self.images, self.media_records = [], [], []
        self.main_parts, self.main_heading_records = [], []
        self.main_links, self.main_images, self.main_media_records = [], [], []
        self._main_depth = 0
        self._heading_level, self._heading_parts = None, []

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style'}:
            self.skip += 1
        attrs_dict = dict(attrs)
        if tag == 'main':
            self._main_depth += 1
        if not self.skip and tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
            if tag == 'h1':
                self.headings.append(tag)
            self._heading_level = int(tag[1])
            self._heading_parts = []
        if not self.skip and tag == 'a':
            self.links.append(attrs_dict.get('href', ''))
            if self._main_depth:
                self.main_links.append(attrs_dict.get('href', ''))
        if not self.skip and tag == 'img':
            self.images.append({'src': attrs_dict.get('src', ''), 'alt': attrs_dict.get('alt', '')})
            if self._main_depth:
                self.main_images.append({'src': attrs_dict.get('src', ''), 'alt': attrs_dict.get('alt', '')})
        if not self.skip and tag in {'video', 'source', 'iframe'} and attrs_dict.get('src'):
            media_tag = 'video' if tag == 'source' else tag
            self.media_records.append((media_tag, attrs_dict['src']))
            if self._main_depth:
                self.main_media_records.append((media_tag, attrs_dict['src']))

    def handle_endtag(self, tag):
        if self._heading_level and tag == f'h{self._heading_level}':
            heading_record = (self._heading_level, ' '.join(self._heading_parts).strip())
            self.heading_records.append(heading_record)
            if self._main_depth:
                self.main_heading_records.append(heading_record)
            self._heading_level, self._heading_parts = None, []
        if tag in {'script', 'style'}:
            self.skip = max(0, self.skip - 1)
        if tag == 'main':
            self._main_depth = max(0, self._main_depth - 1)

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)
            if self._main_depth:
                self.main_parts.append(data)
            if self._heading_level:
                self._heading_parts.append(data)


def is_subsequence(expected, actual):
    position = 0
    for value in actual:
        if position < len(expected) and normalize(value) == normalize(expected[position]):
            position += 1
    return position == len(expected)


def _canonical_embed(value):
    parts = urlsplit(value)
    if parts.netloc.lower() in {'youtube.com', 'www.youtube.com'} and parts.path.startswith('/embed/'):
        return f'https://www.youtube.com{parts.path}'
    return value


def _render_image_identity(src, root):
    from scripts.verify_sitewide_source_parity import _generated_image_identity, _unwrap_image
    return _generated_image_identity(_unwrap_image(src), root)


def _unwrapped_image_src(src):
    from scripts.verify_sitewide_source_parity import _unwrap_image
    return _unwrap_image(src)


def compare_render(route, expected, parser, root):
    failures = []
    visible = normalize(' '.join(parser.main_parts))

    def add(dimension, kind, expected_value, actual_value, pointer):
        failures.append({'route': route, 'dimension': dimension, 'kind': kind,
                         'expected': expected_value, 'actual': actual_value, 'pointer': pointer})

    actual_headings = [text for _, text in parser.main_heading_records]
    actual_h1s = [text for level, text in parser.main_heading_records if level == 1]
    if len(actual_h1s) != 1 or normalize(actual_h1s[0]) != normalize(expected['h1']):
        add('h1', 'count-or-value-mismatch', expected['h1'], actual_headings[:1], '/h1')
    if expected.get('enforceHeadingOrder', True) and not is_subsequence(expected['headings'], actual_headings):
        add('headings', 'order-or-value-mismatch', expected['headings'], actual_headings, '/headings')

    missing_text = [item for item in expected['bodyText'] if normalize(item) and normalize(item) not in visible]
    if missing_text:
        add('bodyText', 'missing', missing_text, [], '/bodyText')

    actual_links = {item.strip() for item in parser.main_links}
    missing_links = [item for item in expected['links'] if item.strip() not in actual_links]
    if missing_links:
        add('links', 'missing', missing_links, sorted(actual_links), '/links')
    scoped_links = actual_links
    expected_external_links = {
        item for item in expected.get('allowedExternalLinks', expected['links'])
        if item.startswith(('http://', 'https://'))
    }
    allowed_conversion_links = {
        'https://forms.office.com/r/hXhnKAG912',
        'https://www.allplan.com/trial-or-subscription/',
        'https://allplan.net.tr/tr',
        'mailto:info@aluplan.com.tr',
        'tel:+902162258441',
        'tel:+905432119442',
        'tel:+905494997379',
    }
    unexpected_external_links = sorted(
        item for item in scoped_links
        if item.startswith(('http://', 'https://'))
        and item not in expected_external_links
        and item not in allowed_conversion_links
    )
    if unexpected_external_links:
        add('links', 'unexpected-external', [], unexpected_external_links, '/links')
    expected_contact_links = {
        item.strip() for item in expected.get('allowedExternalLinks', expected['links'])
        if item.strip().startswith(('mailto:', 'tel:'))
    } | {item for item in allowed_conversion_links if item.startswith(('mailto:', 'tel:'))}
    unexpected_contact_links = sorted({
        item for item in scoped_links
        if item.startswith(('mailto:', 'tel:')) and item not in expected_contact_links
    })
    if unexpected_contact_links:
        add('links', 'unexpected-contact-target', [], unexpected_contact_links, '/links')
    unsafe_links = sorted({
        item for item in scoped_links
        if item.startswith('//')
        or (urlsplit(item.strip()).scheme and urlsplit(item.strip()).scheme.lower() not in {'http', 'https', 'mailto', 'tel'})
    })
    if unsafe_links:
        add('links', 'unsafe-or-unknown-scheme', [], unsafe_links, '/links')

    expected_images = {
        _render_image_identity(item['src'], root)
        for item in expected['images']
        if item.get('src')
    }
    actual_images = {_render_image_identity(item['src'].strip(), root) for item in parser.main_images if item['src']}
    missing_images = sorted(expected_images - actual_images)
    if missing_images:
        add('images', 'missing', missing_images, [], '/images')
    scoped_images = parser.main_images
    expected_external_images = {
        _unwrapped_image_src(item) for item in expected.get('allowedExternalImages', [])
        if _unwrapped_image_src(item).startswith(('http://', 'https://'))
    }
    unexpected_external_images = sorted({
        _unwrapped_image_src(item['src'].strip()) for item in scoped_images
        if _unwrapped_image_src(item.get('src', '').strip()).startswith(('http://', 'https://'))
        and _unwrapped_image_src(item['src'].strip()) not in expected_external_images
    })
    if unexpected_external_images:
        add('images', 'unexpected-external', [], unexpected_external_images, '/images')
    unsafe_images = sorted({
        item['src'].strip() for item in scoped_images
        if item.get('src') and (
            item['src'].strip().startswith('//')
            or (urlsplit(item['src'].strip()).scheme and urlsplit(item['src'].strip()).scheme.lower() not in {'http', 'https'})
        )
    })
    if unsafe_images:
        add('images', 'unsafe-or-unknown-scheme', [], unsafe_images, '/images')

    actual_videos = {src for tag, src in parser.main_media_records if tag == 'video'}
    expected_videos = set(expected['videos'])
    missing_videos = sorted(expected_videos - actual_videos)
    unexpected_videos = sorted(actual_videos - expected_videos)
    if missing_videos:
        add('videos', 'missing', missing_videos, [], '/videos')
    if unexpected_videos:
        add('videos', 'unexpected-editorial-video', [], unexpected_videos, '/videos')

    actual_embeds = {_canonical_embed(src) for tag, src in parser.main_media_records if tag == 'iframe'}
    expected_embeds = {_canonical_embed(src) for src in expected['embeds']}
    missing_embeds = sorted(expected_embeds - actual_embeds)
    if missing_embeds:
        add('embeds', 'missing', missing_embeds, [], '/embeds')
    scoped_iframes = {
        _canonical_embed(src)
        for tag, src in parser.main_media_records
        if tag == 'iframe'
    }
    unexpected_embeds = sorted(scoped_iframes - expected_embeds)
    if unexpected_embeds:
        add('embeds', 'unexpected', [], unexpected_embeds, '/embeds')

    first_expected_embed = next(
        (index for index, item in enumerate(parser.main_media_records)
         if item[0] == 'iframe' and _canonical_embed(item[1]) in expected_embeds),
        None,
    )
    if first_expected_embed is not None and any(
        tag == 'video' and src not in expected_videos
        for tag, src in parser.main_media_records[:first_expected_embed]
    ):
        add('mediaOrder', 'unsupported-media-before-source-embed', 'source embed first', parser.media_records, '/media')
    return failures


def validate_route_records(expected_routes, records):
    counts = {route: 0 for route in expected_routes}
    for record in records:
        route = record.get('route')
        counts[route] = counts.get(route, 0) + 1
    failures = []
    for route in sorted(expected_routes):
        if counts.get(route, 0) == 0:
            failures.append({'route': route, 'dimension': 'route', 'kind': 'missing-route-record'})
        elif counts[route] > 1:
            failures.append({'route': route, 'dimension': 'route', 'kind': 'duplicate-route-record'})
    return failures


def _collect_strings(value, keys):
    found = []
    if isinstance(value, dict):
        for key, child in value.items():
            if key in keys and isinstance(child, str) and child:
                found.append(child)
            found.extend(_collect_strings(child, keys))
    elif isinstance(value, list):
        for child in value:
            found.extend(_collect_strings(child, keys))
    return found


def is_exact_inactive_interaction_candidate(pointer):
    workflow = re.fullmatch(
        r'/workflowTabs/categories/(\d+)/items/(\d+)/(title|subtitle|description)',
        pointer,
    )
    if workflow:
        category_index, item_index = map(int, workflow.group(1, 2))
        return category_index > 0 or item_index > 0
    faq = re.fullmatch(r'/faqDirectory/categories/(\d+)(?:/.*)?', pointer)
    return bool(faq and int(faq.group(1)) > 0)


def interaction_candidate_digest(candidates):
    ordered = sorted(candidates, key=lambda item: (item['pointer'], item['text']))
    payload = json.dumps(ordered, ensure_ascii=False, separators=(',', ':'))
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()


def classify_interaction_candidates(route, candidates, policies):
    policy = policies.get(route)
    exact_inactive = all(
        is_exact_inactive_interaction_candidate(item['pointer'])
        for item in candidates
    )
    policy_matches = bool(
        policy
        and exact_inactive
        and policy.get('count') == len(candidates)
        and policy.get('sha256') == interaction_candidate_digest(candidates)
    )
    return (candidates, []) if policy_matches else ([], candidates)


def is_public_file(path):
    public_root = (ROOT / 'public').resolve()
    target = (public_root / path.lstrip('/')).resolve()
    return public_root in target.parents and target.is_file()


def render_expectation(page):
    """Build the renderer contract from source-verified generated data."""
    layout = page.get('structuredLayout') or {}
    has_content_blocks = bool(layout.get('contentBlocks'))
    rendered_layout = {
        'contentBlocks': layout['contentBlocks'],
        'faqDirectory': layout.get('faqDirectory'),
    } if has_content_blocks else {}

    headings = [page.get('h1', '')]
    allowed_external_links = _collect_strings(page, {'href', 'ctaHref'})
    allowed_external_images = [
        src for src in _collect_strings(page, {'src', 'imageSrc', 'iconSrc', 'poster'})
        if src and not src.endswith(('.mp4', '.webm'))
    ]
    for youtube_id in _collect_strings(page, {'youtubeId'}):
        allowed_external_images.extend([
            f'https://img.youtube.com/vi/{youtube_id}/hqdefault.jpg',
            f'https://img.youtube.com/vi/{youtube_id}/mqdefault.jpg',
        ])
    links, images, embeds = [], [], []
    page_photos = [item for item in page.get('images', []) if item.get('src') and not item.get('isIcon')]
    if page.get('section') != 'legal' and page_photos:
        images.append({'src': page_photos[0]['src'], 'alt': ''})
    path = page.get('path', '')

    navigation = json.loads((ROOT / 'src/data/navigation.json').read_text())
    solution_directory = navigation.get('solutionDirectory', {})
    solution_hub = next(
        (group for group in solution_directory.get('groups', []) if group.get('hubPath') == path),
        None,
    )
    playlist = None
    if page.get('playlistId'):
        playlist = json.loads((ROOT / 'src/data/playlists.json').read_text()).get(page['playlistId'])

    def walk(value, parent_key=''):
        if isinstance(value, list):
            for item in value:
                walk(item, parent_key)
        elif isinstance(value, dict):
            for key, child in value.items():
                if isinstance(child, str):
                    if key in {'title', 'heading', 'label'} and clean_heading(child):
                        headings.append(child)
                    elif key in {'href', 'ctaHref'} and child:
                        links.append(child)
                    elif key in {'imageSrc', 'iconSrc'} and child:
                        images.append({'src': child, 'alt': ''})
                    elif key == 'videoEmbedUrl' and child:
                        embeds.append(child)
                walk(child, key)

    if path == '/':
        home = json.loads((ROOT / 'src/data/homepage.json').read_text())
        active_role = home.get('roles', [{}])[0]
        for collection in ('products', 'solutions', 'services', 'innovations'):
            for item in home.get(collection, []):
                title = item.get('title') or item.get('label') or item.get('name')
                if title:
                    headings.append(title)
                image = item.get('image') or item.get('logo')
                if image:
                    images.append({'src': image, 'alt': ''})
                href = item.get('href')
                if href:
                    links.append(href)
        rendered_layout = {
            'heroContent': home.get('heroContent'),
            'activeRole': active_role,
            'products': home.get('products'),
            'solutions': home.get('solutions'),
            'services': home.get('services'),
            'innovations': home.get('innovations'),
        }
    elif path == '/solutions':
        intro = solution_directory.get('catalogIntro') or {}
        if intro.get('title'):
            headings.append(intro['title'])
        for group in solution_directory.get('groups', []):
            headings.append(group['title'])
            for item in group.get('catalogItems', []):
                headings.append(item['title'])
                links.append(item['href'])
                if item.get('image'):
                    images.append({'src': item['image']['src'], 'alt': ''})
        rendered_layout = {
            'catalogIntro': intro,
            'groups': [
                {'title': group.get('title'), 'catalogItems': group.get('catalogItems', [])}
                for group in solution_directory.get('groups', [])
            ],
        }
    elif solution_hub:
        for item in solution_hub.get('hubItems', []):
            headings.append(item['title'])
            links.append(item['href'])
        rendered_layout = {'hubItems': solution_hub.get('hubItems', [])}
    elif playlist:
        videos = playlist.get('videos', [])
        current = videos[0] if videos else None
        headings.append(playlist['title'])
        if current:
            headings.append(current['title'])
            embeds.append(f"https://www.youtube.com/embed/{current['id']}")
            links.append(f"https://www.youtube.com/watch?v={current['id']}")
        for item in videos:
            thumbnail = f"https://img.youtube.com/vi/{item['id']}/mqdefault.jpg"
            images.append({'src': thumbnail, 'alt': ''})
            allowed_external_images.append(thumbnail)
        rendered_layout = {'playlist': playlist}
    elif path == '/solutions-v2/training/video-library':
        library = json.loads((ROOT / 'src/data/video-library.json').read_text())
        headings.append(library['title'])
        links.append(library['subscribe']['href'])
        for item in library.get('items', []):
            headings.append(item['title'])
            links.append(item['url'])
        rendered_layout = {'videoLibrary': library}
    elif path in {'/about', '/contact'}:
        embeds.extend([
            item['src'] if isinstance(item, dict) else item
            for item in (page.get('embeds') or [])
            if (isinstance(item, str) and item) or (isinstance(item, dict) and item.get('src'))
        ])
        rendered_layout = {'sections': page.get('sections', [])}
    elif has_content_blocks:
        walk(rendered_layout)
    elif layout:
        intro = layout.get('intro') or {}
        if intro.get('title'):
            headings.append(intro['title'])
        if intro.get('videoEmbedUrl'):
            embeds.append(intro['videoEmbedUrl'])
        for item in layout.get('workflowLinks') or []:
            if item.get('href'):
                links.append(item['href'])
        for item in layout.get('stats') or []:
            if item.get('label'):
                headings.append(item['label'])
        if layout.get('challenges'):
            headings.append('Günümüz Projelerinde Karşılaşılan Temel Zorluklar')

        split_items = layout.get('splitCallouts') or []
        top_split = [item for item in split_items if item.get('title') != 'Lisans ve Gereksinimler' and 'SCIA Engineer' not in item.get('title', '')]
        bottom_split = [item for item in split_items if item not in top_split]

        def collect_split(items):
            for item in items:
                if item.get('title'):
                    headings.append(item['title'])
                if item.get('subheading'):
                    headings.append(item['subheading'])
                for key in ('ctaHref',):
                    if item.get(key):
                        links.append(item[key])
                for key in ('imageSrc',):
                    if item.get(key):
                        images.append({'src': item[key], 'alt': ''})

        collect_split(top_split)
        benefits = layout.get('benefits') or {}
        if benefits.get('title'):
            headings.append(benefits['title'])
        for item in benefits.get('items') or []:
            if item.get('title'):
                headings.append(item['title'])
            if item.get('iconSrc'):
                images.append({'src': item['iconSrc'], 'alt': ''})

        for grid_key in ('coreFeatures',):
            grid = layout.get(grid_key) or {}
            if grid.get('title'):
                headings.append(grid['title'])
            for item in grid.get('items') or []:
                if item.get('title'):
                    headings.append(item['title'])
                if item.get('imageSrc'):
                    images.append({'src': item['imageSrc'], 'alt': ''})

        workflow = layout.get('workflowTabs') or {}
        if workflow.get('title'):
            headings.append(workflow['title'])
        active_tab = (workflow.get('tabs') or [None])[0]
        if active_tab:
            if active_tab.get('title'):
                headings.append(active_tab['title'])
            if active_tab.get('imageSrc'):
                images.append({'src': active_tab['imageSrc'], 'alt': ''})

        for grid in layout.get('extraGrids') or []:
            if grid.get('title'):
                headings.append(grid['title'])
            for item in grid.get('items') or []:
                if item.get('title'):
                    headings.append(item['title'])
                if item.get('imageSrc'):
                    images.append({'src': item['imageSrc'], 'alt': ''})
                if item.get('href'):
                    links.append(item['href'])
        collect_split(bottom_split)
        faq = layout.get('faq') or {}
        if faq.get('title'):
            headings.append(faq['title'])
        rendered_layout = {
            'intro': intro,
            'stats': layout.get('stats'),
            'challenges': layout.get('challenges'),
            'topSplit': top_split,
            'benefits': benefits,
            'coreFeatures': layout.get('coreFeatures'),
            'activeWorkflowTab': active_tab,
            'extraGrids': layout.get('extraGrids'),
            'bottomSplit': bottom_split,
            'faq': faq,
        }
    elif path not in {'/search', '/about', '/contact', '/solutions-v2/connect-license/activation'}:
        sections = page.get('sections', [])
        stat_sections = [item for item in sections if item.get('statValue')]
        spec_sections = [item for item in sections if not item.get('statValue') and not item.get('image')]
        featured_sections = [item for item in sections if not item.get('statValue') and item.get('image')]
        rendered_sections = stat_sections + spec_sections + featured_sections
        for section in rendered_sections:
            if section.get('heading'):
                headings.append(section['heading'])
        rendered_layout = {'sections': rendered_sections}
        for item in page_photos[1:]:
            images.append({'src': item['src'], 'alt': ''})

    return {
        'h1': page.get('h1', ''),
        'headings': [item for item in headings if item],
        'bodyText': [item['text'] for item in render_body_text_records(rendered_layout)],
        'links': sorted(set(links)),
        'images': images,
        'videos': [item.get('src', '') for item in page.get('videos', []) if item.get('src')],
        'embeds': sorted(set(embeds)),
        'allowedExternalLinks': sorted(set(allowed_external_links + links)),
        'allowedExternalImages': sorted(set(allowed_external_images)),
        'enforceHeadingOrder': (
            has_content_blocks
            or bool(layout)
            or path == '/solutions'
            or bool(solution_hub)
            or bool(playlist)
            or path == '/solutions-v2/training/video-library'
            or (path != '/' and bool(page.get('sections')))
        ),
    }


def clean_heading(value):
    return bool(value and len(normalize(value)) >= 2)


def text_records(value, pointer='', parent_key=''):
    if isinstance(value, dict):
        for key, item in value.items():
            yield from text_records(item, f'{pointer}/{key}', key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from text_records(item, f'{pointer}/{index}', parent_key)
    elif isinstance(value, str) and parent_key in TEXT_KEYS and len(normalize(value)) >= 24:
        yield {'pointer': pointer, 'text': value}


def render_body_text_records(value, pointer='', parent_key=''):
    if isinstance(value, dict):
        for key, item in value.items():
            yield from render_body_text_records(item, f'{pointer}/{key}', key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from render_body_text_records(item, f'{pointer}/{index}', parent_key)
    elif isinstance(value, str) and parent_key in RENDER_BODY_TEXT_KEYS and len(normalize(value)) >= 2:
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
    interaction_policy = json.loads(
        (ROOT / 'tests/fixtures/render_interaction_policy.json').read_text()
    )['policies']
    expectations = {route: render_expectation(page) for route, page in pages.items()}
    results = []
    for route, page in pages.items():
        requested_url = base_url.rstrip('/') + route
        record = {'route': route, 'requestedUrl': requested_url}
        try:
            with opener.open(requested_url, timeout=30) as response:
                body = response.read()
                record['httpStatus'] = response.status
                record['finalUrl'] = response.geturl()
                record['redirected'] = response.geturl() != requested_url
            parser = PageText()
            parser.feed(body.decode('utf-8'))
            visible = normalize(' '.join(parser.main_parts))
            candidates = list(text_records(page.get('structuredLayout') or {}))
            missing = [item for item in candidates if normalize(item['text']) not in visible]
            failures = compare_render(route, expectations[route], parser, ROOT)
            approved_missing, unapproved_missing = classify_interaction_candidates(
                route, missing, interaction_policy
            )
            approved_differences = []
            if approved_missing:
                approved_differences.append({
                    'route': route,
                    'dimension': 'interactiveInitialHtml',
                    'kind': 'verified-inactive-control-content',
                    'expected': approved_missing,
                    'actual': [],
                    'pointer': '/structuredLayout',
                })
            if unapproved_missing:
                failures.append({
                    'route': route,
                    'dimension': 'interactiveInitialHtml',
                    'kind': 'unapproved-missing-source-content',
                    'expected': unapproved_missing,
                    'actual': [],
                    'pointer': '/structuredLayout',
                })
            if route in interaction_policy and not approved_missing:
                failures.append({
                    'route': route,
                    'dimension': 'interactiveInitialHtml',
                    'kind': 'stale-or-mismatched-interaction-policy',
                    'expected': interaction_policy[route],
                    'actual': {
                        'count': len(missing),
                        'sha256': interaction_candidate_digest(missing),
                    },
                    'pointer': '/structuredLayout',
                })
            if record['redirected']:
                failures.append({
                    'route': route,
                    'dimension': 'route',
                    'kind': 'unexpected-redirect',
                    'expected': requested_url,
                    'actual': record['finalUrl'],
                    'pointer': '/route',
                })
            unresolved_internal_links = sorted(set(
                urlsplit(link).path for link in parser.main_links
                if link.startswith('/') and not link.startswith('//')
                and urlsplit(link).path not in pages
                and not is_public_file(urlsplit(link).path)
            ))
            if unresolved_internal_links:
                failures.append({
                    'route': route,
                    'dimension': 'links',
                    'kind': 'unresolved-internal-target',
                    'expected': [],
                    'actual': unresolved_internal_links,
                    'pointer': '/links',
                })
            record.update({'htmlSha256': hashlib.sha256(body).hexdigest(),
                           'h1Count': sum(level == 1 for level, _ in parser.main_heading_records),
                           'headingRecords': parser.main_heading_records,
                           'mediaRecords': parser.main_media_records,
                           'failures': failures,
                           'approvedDifferences': approved_differences,
                           'status': 'failure' if failures else 'approved_difference' if approved_differences else 'pass',
                           'structuredTextCandidates': len(candidates),
                           'notInInitialHtml': missing,
                           'emptyStructuredSections': list(empty_sections(page.get('structuredLayout') or {})),
                           'localPageLinksWithoutRecord': unresolved_internal_links})
        except Exception as exc:
            record['error'] = f'{type(exc).__name__}: {exc}'
            record['status'] = 'failure'
        results.append(record)
    route_record_failures = validate_route_records(set(expectations), results)
    return {'date': audit_date(), 'baseUrl': base_url,
            'method': 'All 110 source-backed routes fetched from loopback; ordered headings, source text, links, image identities, native video and embeds compared against initial HTML.',
            'limitations': [
                'Missing HTML text may be available after interaction; not automatically lost content.',
                'Initial HTML does not prove post-hydration interaction behavior; representative interaction contracts are tested separately.',
                'Text hidden behind a known interaction is recorded as an approved difference, not silently passed.',
                'Empty extracted sections require original source confirmation; may be optional/inactive.',
                'No live-site crawl, source execution or form submission.',
            ], 'routeRecordFailures': route_record_failures,
            'summary': {'routes': len(results),
                'analyzedRoutes': sum('h1Count' in r for r in results),
                'fetchErrors': sum('error' in r for r in results),
                'redirectedRoutes': sum(bool(r.get('redirected')) for r in results),
                'http200': sum(r.get('httpStatus') == 200 for r in results),
                'singleH1': sum(r.get('h1Count') == 1 for r in results),
                'routesWithStructuredTextAbsentFromHtml': sum(bool(r.get('notInInitialHtml')) for r in results),
                'structuredTextsAbsentFromHtml': sum(len(r.get('notInInitialHtml', [])) for r in results),
                'emptyStructuredSections': sum(len(r.get('emptyStructuredSections', [])) for r in results),
                'passedRoutes': sum(r.get('status') == 'pass' for r in results),
                'approvedDifferenceRoutes': sum(r.get('status') == 'approved_difference' for r in results),
                'failedRoutes': sum(r.get('status') == 'failure' for r in results) + len(route_record_failures),
                'failures': sum(len(r.get('failures', [])) for r in results) + len(route_record_failures)},
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
    sys.exit(1 if result['summary']['fetchErrors'] or result['summary']['failures'] else 0)
