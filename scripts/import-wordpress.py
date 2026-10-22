"""One-off importer: converts the legacy WordPress/Elementor pages into the
structured JSON content used by the React site, and downloads/optimises images.

Usage:
    mkdir -p .wp-export
    curl -s "https://cgsul.org/wp-json/wp/v2/pages?per_page=100" -o .wp-export/api_pages_1.json
    python3 scripts/import-wordpress.py .wp-export .

Requires: pip install beautifulsoup4 lxml pillow
Output:   src/content/generated/*.json and public/media/*.webp
"""
import json, os, re, sys, html as htmllib, hashlib, urllib.request, io
from bs4 import BeautifulSoup, NavigableString, Tag
from PIL import Image

CRAWL, PROJ = sys.argv[1], sys.argv[2]
OUT = os.path.join(PROJ, 'src', 'content', 'generated')
MEDIA = os.path.join(PROJ, 'public', 'media')
os.makedirs(OUT, exist_ok=True); os.makedirs(MEDIA, exist_ok=True)
CACHE = os.path.join(CRAWL, 'imgcache'); os.makedirs(CACHE, exist_ok=True)

pages = {p['slug']: p for p in json.load(open(os.path.join(CRAWL, 'api_pages_1.json')))}

# ---------------------------------------------------------------- slugs / routes
DIGEST = {  # old slug -> (new slug, date)
    'energy-as-a-human-right': ('energy-as-a-human-right', '2026-04-01'),
    'understanding-climate-justice': ('understanding-climate-justice', '2026-03-16'),
    'the-rise-of-green-bond': ('the-rise-of-green-bonds', '2025-10-09'),
    'critical-minerals-in-the-deep-sea': ('critical-minerals-in-the-deep-sea', '2025-09-11'),
    'how-environmental-law-sustainability-consulting-across-the-developed-world': ('environmental-law-and-sustainability-consulting', '2025-08-28'),
    'climate-induced-migration': ('climate-induced-migration', '2025-08-19'),
    'driving-net-zero-through-the-law': ('driving-net-zero-through-the-law', '2025-08-05'),
    'minimizing-sustainability-risk': ('minimizing-sustainability-risk-in-shipping', '2025-07-23'),
    'material-risks-in-sustainability': ('material-risks-and-the-role-of-boards', '2025-07-08'),
    'sustainability-in-sports': ('sustainability-risk-in-sport', '2025-06-23'),
    'if-the-law': ('if-the-law-saved-us-before', '2025-06-09'),
}
TROVE = {  # old slug -> new slug (ordered as on the live site)
    'u-s-military-intervention-in-venezuela': 'us-intervention-in-venezuela-energy-markets',
    'france-leads-the-way': 'france-leads-the-way-on-sustainable-fashion',
    'african-developnment-bank': 'afdb-and-aiib-strengthen-collaboration',
    'legal-expectation-for-cop30': 'legal-expectations-for-cop30',
}
# old slug -> (new slug, category, icon, featured)
DOMAINS = {
    'climate-change-law': ('climate-change-law', 'Climate & Energy', 'CloudSunRain', True),
    'energy-law': ('energy-law', 'Climate & Energy', 'Zap', True),
    'net-zero-law': ('net-zero', 'Climate & Energy', 'Leaf', True),
    'climate-finance-and-energy-transition': ('climate-finance-and-energy-transition', 'Climate & Energy', 'BatteryCharging', False),
    'climate-justice': ('climate-justice', 'Climate & Energy', 'Scale', False),
    'ghg-accounting': ('ghg-accounting', 'Climate & Energy', 'Calculator', False),
    'super-pollutants': ('super-pollutants', 'Climate & Energy', 'Factory', False),
    'ai-climate-change': ('ai-and-climate-change', 'Climate & Energy', 'Cpu', False),
    'corporate-governance': ('corporate-governance', 'Governance & Rights', 'Landmark', True),
    'human-right-and-law': ('human-rights', 'Governance & Rights', 'HeartHandshake', True),
    'public-health-law': ('public-health', 'Governance & Rights', 'Stethoscope', False),
    'international-labor-law': ('international-labour-law', 'Governance & Rights', 'HardHat', False),
    'geopolitical-anti-esg-law-policy': ('geopolitics-and-anti-esg', 'Governance & Rights', 'Globe2', False),
    'global-north-south-sustainable-development': ('global-south-global-north-divide', 'Governance & Rights', 'ArrowLeftRight', False),
    'sustainable-finance-law': None,  # a programme, not a domain
    'global-economy-finance': ('global-economy-and-finance', 'Finance & Trade', 'TrendingUp', False),
    'international-law': ('international-investment-law', 'Finance & Trade', 'Briefcase', False),
    'international-trade-law-and-policy': ('international-trade-law-and-policy', 'Finance & Trade', 'Ship', False),
    'international-law-and-policy': ('international-law-and-policy', 'Finance & Trade', 'Gavel', False),
    'supply-chain': ('supply-chain', 'Finance & Trade', 'Network', False),
    'international-environmental-law': ('international-environmental-law', 'Nature & Resources', 'Earth', False),
    'nature-and-biodiversity-law': ('nature-and-biodiversity', 'Nature & Resources', 'Bird', False),
    'natural-resources-law': ('natural-resources', 'Nature & Resources', 'Mountain', False),
    'critical-minerals-2': ('critical-minerals', 'Nature & Resources', 'Gem', True),
    'circular-economy': ('circular-economy', 'Nature & Resources', 'Recycle', False),
    'waste-management': ('waste-management', 'Nature & Resources', 'Trash2', False),
    'water-plastic-pollution': ('water-and-plastic-pollution', 'Nature & Resources', 'Droplets', False),
    'water-and-effluent-law': ('water-and-effluent', 'Nature & Resources', 'Waves', False),
    'international-waters': ('international-waters', 'Nature & Resources', 'Anchor', False),
    'sustainable-food-agriculture-law': ('food-and-agriculture', 'Sectors & Industries', 'Wheat', False),
    'maritime-shipping': ('maritime-and-shipping', 'Sectors & Industries', 'Ship', False),
    'sustainable-aviation': ('sustainable-aviation', 'Sectors & Industries', 'Plane', False),
    'sport-sustainability': ('sport-and-sustainability', 'Sectors & Industries', 'Trophy', False),
    'sustainable-fashion': ('sustainable-fashion', 'Sectors & Industries', 'Shirt', False),
}
DOMAINS = {k: v for k, v in DOMAINS.items() if v}
PROGRAMS = {
    'sustainable-finance-law': ('sustainable-finance-law', 'Landmark'),
    'international-trade-law': ('international-trade-law-and-development', 'Globe2'),
    'just-transition': ('just-transition', 'Users'),
    'sustainability-in-african-context-2': ('sustainability-in-the-african-context', 'Sprout'),
}
STATIC_ROUTES = {
    '': '/', 'home-cgsl': '/', 'overview': '/about', 'our-history': '/about/history',
    'sustainability-at-cgsl': '/about/sustainability-at-cgsl', 'board-of-directors': '/people?team=board',
    'global-executive-team': '/people', 'sustainability-domains': '/domains',
    'lex-commons-sustainability-law': '/lex-commons', 'training': '/training',
    'programs-initiative': '/programs', 'advisory-services': '/advisory',
    'legsus-trove': '/publications/trove', 'legsus-digest': '/publications/digest', 'legus-digest': '/publications/digest',
    'legsus-review-2': '/publications/review', 'case-studies': '/publications/case-studies',
    'white-papers': '/publications/white-papers', 'proposals': '/publications/proposals',
    'annual-reports': '/about/annual-reports', 'financials': '/about/financials',
    'volunteer-with-us': '/get-involved/volunteer', 'collaborations': '/get-involved/partner',
    'donate': '/donate', 'contact-2': '/contact', 'climate-finance': '/publications/trove',
}

def route_for(old_slug):
    if old_slug in DIGEST: return '/publications/digest/' + DIGEST[old_slug][0]
    if old_slug in TROVE: return '/publications/trove/' + TROVE[old_slug]
    if old_slug in DOMAINS: return '/domains/' + DOMAINS[old_slug][0]
    if old_slug in PROGRAMS: return '/programs/' + PROGRAMS[old_slug][0]
    return STATIC_ROUTES.get(old_slug)

def map_href(href):
    if not href: return None
    href = href.strip()
    m = re.match(r'https?://(www\.)?cgsul\.org/?([^?#]*)', href)
    if m:
        slug = m.group(2).strip('/').split('/')[-1] if m.group(2) else ''
        if 'wp-content' in href: return href
        r = route_for(slug)
        return r or href
    return href

# ---------------------------------------------------------------- images
IMAGES = {}
def localize(src, max_w=1600, kind='img'):
    if not src: return None
    src = src.replace('\\/', '/')
    if src.startswith('//'): src = 'https:' + src
    if src in IMAGES: return IMAGES[src]
    base = os.path.splitext(os.path.basename(src.split('?')[0]))[0].lower()
    base = re.sub(r'[^a-z0-9]+', '-', base).strip('-')[:60]
    name = f"{base}-{hashlib.md5(src.encode()).hexdigest()[:6]}.webp"
    dest = os.path.join(MEDIA, name)
    if not os.path.exists(dest):
        cache = os.path.join(CACHE, hashlib.md5(src.encode()).hexdigest())
        if not os.path.exists(cache):
            req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                data = urllib.request.urlopen(req, timeout=60).read()
            except Exception as e:
                print('IMG FAIL', src, e); IMAGES[src] = None; return None
            open(cache, 'wb').write(data)
        im = Image.open(cache)
        im = im.convert('RGBA') if im.mode in ('P', 'LA', 'RGBA') else im.convert('RGB')
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        im.save(dest, 'WEBP', quality=78, method=6)
    IMAGES[src] = '/media/' + name
    return IMAGES[src]

def full_size(src):
    """Strip WordPress size suffix (-1024x683) and elementor thumbs to get originals."""
    return re.sub(r'-\d{2,4}x\d{2,4}(?=\.\w+$)', '', src)

# ---------------------------------------------------------------- inline html
ALLOWED = {'a', 'strong', 'em', 'sup', 'sub', 'br'}
RENAME = {'b': 'strong', 'i': 'em'}

def inline_html(el):
    s = _inline(el)
    s = s.replace('\xa0', ' ').replace('\u200b', '')
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'<strong>\s*</strong>', '', s)
    # move whitespace outside of inline tags: "<em> word </em>" -> " <em>word</em> "
    s = re.sub(r'<(strong|em|a[^>]*)>\s+', lambda m: ' <' + m.group(1) + '>', s)
    s = re.sub(r'\s+</(strong|em|a)>', lambda m: '</' + m.group(1) + '> ', s)
    return re.sub(r'\s+', ' ', s).strip()

def _inline(el):
    out = []
    for c in el.children:
        if isinstance(c, NavigableString):
            out.append(htmllib.escape(str(c), quote=False)); continue
        if not isinstance(c, Tag): continue
        name = RENAME.get(c.name, c.name)
        if name in ('script', 'style', 'img', 'svg'): continue
        inner = _inline(c)
        if name == 'a':
            href = map_href(c.get('href'))
            if href and not href.startswith('#'):
                out.append(f'<a href="{htmllib.escape(href)}">{inner}</a>'); continue
            out.append(inner); continue
        if name == 'br': out.append('<br>'); continue
        if name in ALLOWED and inner.strip():
            out.append(f'<{name}>{inner}</{name}>'); continue
        out.append(inner)
    return ''.join(out)

def text_of(h):
    return re.sub(r'\s+', ' ', BeautifulSoup(h, 'lxml').get_text()).strip()

# ---------------------------------------------------------------- block walker
def blocks_of(html):
    soup = BeautifulSoup(html, 'lxml')
    blocks = []
    def para(el):
        kids = [k for k in el.children if not (isinstance(k, NavigableString) and not k.strip())]
        full = inline_html(el)
        if not full: return
        txt = text_of(full)
        first = kids[0] if kids else None
        if isinstance(first, Tag) and first.name in ('strong', 'b'):
            lead = first.get_text(' ', strip=True)
            if lead and len(lead) < 140:
                if len(lead) >= len(txt) - 1:
                    blocks.append({'type': 'heading', 'level': 3, 'text': lead.rstrip(':')}); return
                if len(lead.split()) <= 14 and not lead.endswith(('.', ',')) and not re.match(r'^[\(\[]?\w[\)\.]?$', lead):
                    blocks.append({'type': 'heading', 'level': 3, 'text': lead.rstrip(':')})
                    rest = inline_html(el).split('</strong>', 1)[-1].strip()
                    if text_of(rest): blocks.append({'type': 'paragraph', 'html': rest})
                    return
        blocks.append({'type': 'paragraph', 'html': full})
    def walk(el):
        for c in el.children:
            if not isinstance(c, Tag): continue
            n = c.name
            if n in ('script', 'style', 'noscript', 'svg', 'form', 'iframe'): continue
            if n in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
                t = re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).replace('​', '').strip()
                if t: blocks.append({'type': 'heading', 'level': min(4, max(2, int(n[1]))), 'text': t, 'raw': n})
                continue
            if n == 'p': para(c); continue
            if n in ('ul', 'ol'):
                items = [inline_html(li) for li in c.find_all('li', recursive=False)]
                items = [i for i in items if text_of(i)]
                if items: blocks.append({'type': 'list', 'ordered': n == 'ol', 'items': items})
                continue
            if n == 'blockquote':
                h = inline_html(c)
                if h: blocks.append({'type': 'quote', 'html': h})
                continue
            if n == 'img':
                src = c.get('data-src') or c.get('src')
                if src: blocks.append({'type': 'image', 'src': src, 'alt': c.get('alt', '')})
                continue
            if n == 'a' and c.find('img') and not c.get_text(strip=True):
                walk(c); continue
            # bare text inside elementor text-editor wrappers
            own = ''.join(str(s) for s in c.find_all(string=True, recursive=False)).strip()
            if own and n == 'div' and not c.find(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol']):
                blocks.append({'type': 'paragraph', 'html': inline_html(c)}); continue
            walk(c)
    walk(soup.body or soup)
    return blocks

FOOTER_MARKERS = ('footer.png', 'WhatsApp-Image')
def until(blocks, pred):
    out = []
    for b in blocks:
        if pred(b): break
        out.append(b)
    return out

def strip_footer(blocks):
    return until(blocks, lambda b: (b['type'] == 'image' and any(m in b['src'] for m in FOOTER_MARKERS))
                 or (b['type'] == 'heading' and b['text'] in ('About CGSL',)))

def is_heading(b, *names):
    return b['type'] == 'heading' and any(b['text'].lower().startswith(n.lower()) for n in names)

def clean_body(blocks):
    out = []
    for b in blocks:
        if b['type'] == 'paragraph':
            t = text_of(b['html'])
            if t.startswith('Lorem ipsum') or not t or t in ('.',): continue
        b.pop('raw', None)
        if b['type'] == 'heading':
            b['level'] = 2 if b['level'] <= 2 else 3
            t = b['text'].strip().rstrip(':').strip().replace('Marintime', 'Maritime')
            if t.isupper() and len(t) > 6:
                t = ' '.join(w if w in ('AN', 'A') and False else w.capitalize() for w in t.lower().split())
                t = re.sub(r'\b(And|Of|The|To|In|For|A|An|On)\b', lambda m: m.group(0).lower(), t)
                t = re.sub(r'^([\d.\s]*)([a-z])', lambda m: m.group(1) + m.group(2).upper(), t)
            b['text'] = t
        if b['type'] == 'image':
            loc = localize(full_size(b['src']))
            if not loc: continue
            b['src'] = loc
        if out and out[-1] == b: continue
        out.append(b)
    return out

def merge_references(blocks):
    """Reference lists were pasted with hard line-wraps; re-join continuation lines."""
    out, in_refs = [], False
    for b in blocks:
        if b['type'] == 'heading':
            in_refs = b['text'].strip().lower() in ('references', 'sources', 'sources:', 'endnotes', 'notes', 'bibliography')
            out.append(b); continue
        if in_refs and b['type'] == 'paragraph':
            t = text_of(b['html'])
            starts_new = bool(re.search(r'\(\d{4}[a-z]?\)|^\[\d+\]|^\d+\.', t[:140]))
            if not starts_new and out and out[-1]['type'] == 'paragraph' and out[-1].get('ref'):
                out[-1]['html'] += ' ' + b['html']; continue
            b['ref'] = True
        out.append(b)
    for b in out: b.pop('ref', None)
    return out

def promote_paragraph_headings(blocks, names):
    out = []
    for b in blocks:
        if b['type'] == 'paragraph' and text_of(b['html']).strip().rstrip(':').lower() in names:
            out.append({'type': 'heading', 'level': 2, 'text': text_of(b['html']).rstrip(':')}); continue
        out.append(b)
    return out

def excerpt(blocks, n=220):
    for b in blocks:
        if b['type'] == 'paragraph':
            t = text_of(b['html'])
            if len(t) > 80:
                return (t[:n].rsplit(' ', 1)[0] + '…') if len(t) > n else t
    return ''

def reading_time(blocks):
    words = sum(len(text_of(b.get('html', '') or ' '.join(b.get('items', [])) or b.get('text', '')).split()) for b in blocks)
    return max(1, round(words / 220))

# ---------------------------------------------------------------- articles
articles = []
for old, (slug, date) in DIGEST.items():
    raw = strip_footer(blocks_of(pages[old]['content']['rendered']))
    raw = until(raw, lambda b: is_heading(b, 'Previous Articles'))
    hero = next((b for b in raw if b['type'] == 'image'), None)
    caption = None
    heads = [i for i, b in enumerate(raw) if b['type'] == 'heading']
    title_i = heads[0]
    title = raw[title_i]['text']
    subtitle = None
    if ':' in title and len(title) > 70:
        title, subtitle = [s.strip() for s in title.split(':', 1)]
    authors_i = next((i for i in range(title_i + 1, min(title_i + 3, len(raw))) if raw[i]['type'] == 'heading' and raw[i]['text'].startswith('-')), None)
    authors_txt = raw[authors_i]['text'].lstrip('- ').strip() if authors_i is not None else ''
    authors = [a.strip() for a in re.split(r',| and ', authors_txt) if a.strip()]
    for b in raw[:title_i]:
        if b['type'] == 'paragraph' and 'Image Credit' in b['html']: caption = text_of(b['html'])
    body = raw[(authors_i if authors_i is not None else title_i) + 1:]
    body = promote_paragraph_headings(body, {'abstract', 'introduction', 'conclusion', 'references', 'sources', 'endnotes'})
    body = merge_references(clean_body(body))
    for b in body:  # articles use a single, flat section hierarchy
        if b['type'] == 'heading': b['level'] = 2
    articles.append({
        'slug': slug, 'series': 'digest', 'title': title.replace('Marintime', 'Maritime'), 'subtitle': subtitle, 'authors': authors,
        'date': date, 'image': localize(full_size(hero['src'])) if hero else None, 'imageCaption': caption,
        'excerpt': excerpt(body), 'readingMinutes': reading_time(body), 'body': body, 'legacyUrl': pages[old]['link'],
    })

for old, slug in TROVE.items():
    raw = strip_footer(blocks_of(pages[old]['content']['rendered']))
    raw = until(raw, lambda b: is_heading(b, 'Previous Editions'))
    hero = next((b for b in raw if b['type'] == 'image'), None)
    title_i = next(i for i, b in enumerate(raw) if b['type'] == 'heading')
    body = clean_body(raw[title_i + 1:])
    body = promote_paragraph_headings(body, {'sources', 'references'})
    body = merge_references(body)
    for b in body:
        if b['type'] == 'heading': b['level'] = 2
    articles.append({
        'slug': slug, 'series': 'trove', 'title': raw[title_i]['text'], 'subtitle': None, 'authors': ['CGSL Editorial Team'],
        'date': None, 'image': localize(full_size(hero['src'])) if hero else None, 'imageCaption': None,
        'excerpt': excerpt(body), 'readingMinutes': reading_time(body), 'body': body, 'legacyUrl': pages[old]['link'],
    })
article_by_old = {**{o: s for o, (s, _) in DIGEST.items()}, **TROVE}

# ---------------------------------------------------------------- domains & programmes
def related_links(old):
    s = BeautifulSoup(pages[old]['content']['rendered'], 'lxml')
    out = []
    for a in s.find_all('a'):
        m = re.match(r'https?://cgsul\.org/([^/]+)/?', a.get('href') or '')
        if m and m.group(1) in article_by_old:
            sl = article_by_old[m.group(1)]
            if sl not in out: out.append(sl)
    return out

def tidy_title(t):
    t = t.replace('Marinetime', 'Maritime').replace('Labor Law', 'Labour Law') if t else t
    return t

domains = []
for old, (slug, cat, icon, featured) in DOMAINS.items():
    raw = strip_footer(blocks_of(pages[old]['content']['rendered']))
    raw = until(raw, lambda b: is_heading(b, 'Publications'))
    hero = next((b for b in raw if b['type'] == 'image'), None)
    title_i = next(i for i, b in enumerate(raw) if b['type'] == 'heading')
    rest = raw[title_i + 1:]
    tagline = None
    if rest and rest[0]['type'] in ('paragraph', 'heading'):
        t0 = rest[0].get('text') or text_of(rest[0]['html'])
        if len(t0) < 170:
            tagline = t0.rstrip(' .'); rest = rest[1:]
    body = clean_body(rest)
    domains.append({
        'slug': slug, 'title': tidy_title(raw[title_i]['text']).rstrip(':').strip(), 'tagline': tagline, 'category': cat, 'icon': icon,
        'featured': featured, 'image': localize(full_size(hero['src'])) if hero else None,
        'summary': excerpt(body, 180), 'body': body, 'related': related_links(old), 'legacyUrl': pages[old]['link'],
    })

programs = []
for old, (slug, icon) in PROGRAMS.items():
    raw = strip_footer(blocks_of(pages[old]['content']['rendered']))
    raw = until(raw, lambda b: is_heading(b, 'Publications'))
    hero = next((b for b in raw if b['type'] == 'image'), None)
    title_i = next(i for i, b in enumerate(raw) if b['type'] == 'heading')
    body = clean_body(raw[title_i + 1:])
    # strip numbering like "1.  " from headings, drop trailing colons
    for b in body:
        if b['type'] == 'heading':
            b['text'] = re.sub(r'^\d+\.\s*', '', b['text']).rstrip(':').strip()
    programs.append({
        'slug': slug, 'title': raw[title_i]['text'], 'icon': icon,
        'image': localize(full_size(hero['src'])) if hero else None,
        'summary': excerpt(body, 200), 'body': body, 'related': related_links(old), 'legacyUrl': pages[old]['link'],
    })

# ---------------------------------------------------------------- people
def parse_people(old):
    s = BeautifulSoup(pages[old]['content']['rendered'], 'lxml')
    people, group = [], 'executive'
    seen = set()
    for el in s.find_all(['h1', 'h2']):
        t = el.get_text(' ', strip=True)
        if el.name == 'h1':
            if 'Intern' in t: group = 'intern'
            continue
        name = t
        if name in seen or name == 'About CGSL': continue
        # find the card container that holds role, bio and email
        card = el
        for _ in range(12):
            card = card.parent
            if card is None: break
            if card.find(string=re.compile(r'Email:')) and len(card.find_all('h2')) >= 1:
                break
        if card is None: continue
        role_el = el.find_next('p')
        role = role_el.get_text(' ', strip=True) if role_el else ''
        img = el.find_previous('img')
        email_a = card.find('a', href=re.compile('^mailto:'))
        email = email_a['href'].replace('mailto:', '').strip() if email_a else None
        bio_paras = []
        for d in card.find_all(['div', 'p']):
            own = d.get_text('\n', strip=True)
            if len(own) > 200 and not d.find(['div']) and own not in bio_paras:
                bio_paras.append(own)
        bio_text = max(bio_paras, key=len) if bio_paras else ''
        paras = [re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n|\n', bio_text) if p.strip()]
        seen.add(name)
        people.append({'name': name, 'role': role, 'group': group, 'email': email,
                       'photoSrc': img.get('data-src') or img.get('src') if img else None, 'bio': paras})
    return people

people = parse_people('global-executive-team')
board_names = {p['name'] for p in parse_people('board-of-directors')}
FIX_ROLE = {'Cheif Operating Officer': 'Chief Operating Officer'}
for p in people:
    p['slug'] = re.sub(r'[^a-z0-9]+', '-', p['name'].lower().replace('dr. ', '')).strip('-')
    p['role'] = FIX_ROLE.get(p['role'], p['role'])
    p['board'] = p['name'] in board_names
    src = p.pop('photoSrc')
    p['photo'] = localize(full_size(src), max_w=640) if src else None

# ---------------------------------------------------------------- write
def dump(name, data):
    with open(os.path.join(OUT, name), 'w') as f:
        json.dump(data, f, indent=1, ensure_ascii=False)

dump('articles.json', articles)
dump('domains.json', domains)
dump('programs.json', programs)
dump('people.json', people)

# Page hero images used by hand-written pages
HERO = {
    'home': 'https://cgsul.org/wp-content/uploads/2026/01/sustain.jpg',
    'homeHero': 'https://cgsul.org/wp-content/uploads/2026/01/zac-wolff-baXCV2qg9Ew-unsplash-scaled.jpg',
    'energy': 'https://cgsul.org/wp-content/uploads/2026/01/energy.png',
    'footerArt': 'https://cgsul.org/wp-content/uploads/2026/03/footer-img.png',
    'overview': 'https://cgsul.org/wp-content/uploads/2026/01/riccardo-annandale-7e2pe9wjL9M-unsplash.jpg',
    'history': 'https://cgsul.org/wp-content/uploads/2026/03/antique-book-shelf-vintage-background-1-scaled.jpg',
    'programs': 'https://cgsul.org/wp-content/uploads/elementor/thumbs/Programs-landing-rk3zvn23pfghzrnlis5ks7lahqp094yrtmrusifm0w.png',
    'domains': 'https://cgsul.org/wp-content/uploads/elementor/thumbs/alex-eckermann-ofdFj1bUKQw-unsplash-scaled-rhqgkr8fglg45lvkihznbcaw8deoc5t0hxdzrh0rcg.jpg',
    'lexCommons': 'https://cgsul.org/wp-content/uploads/elementor/thumbs/sungrow-emea-ceTSHQ0qars-unsplash-scaled-rhqgk4oawkl8eysc688lnhztz4hv7fbgetqc8ty7hs.jpg',
    'training': 'https://cgsul.org/wp-content/uploads/2026/03/Training-landing.png',
    'advisory': 'https://cgsul.org/wp-content/uploads/2026/03/Trainings-1-1.png',
    'review': 'https://cgsul.org/wp-content/uploads/elementor/thumbs/charlesdeluvio-Lks7vei-eAg-unsplash-scaled-rihe4fz795yppqbnht6jfin3h5kpwz0wn51dh0z4vk.jpg',
    'caseStudies': 'https://cgsul.org/wp-content/uploads/2026/01/case.jpg',
    'whitePapers': 'https://cgsul.org/wp-content/uploads/2026/01/whitepaper.jpg',
    'proposals': 'https://cgsul.org/wp-content/uploads/2026/01/proposal.jpg',
    'annualReports': 'https://cgsul.org/wp-content/uploads/2026/01/annualreport.jpg',
    'financials': 'https://cgsul.org/wp-content/uploads/2026/01/financials-1.jpg',
    'sustainability': 'https://cgsul.org/wp-content/uploads/2026/01/sustain.jpg',
    'volunteer': 'https://cgsul.org/wp-content/uploads/2026/01/joel-swick-antip5BML7A-unsplash-scaled.jpg',
    'volunteer2': 'https://cgsul.org/wp-content/uploads/2026/01/austin-kehmeier-lyiKExA4zQA-unsplash-scaled.jpg',
    'partner': 'https://cgsul.org/wp-content/uploads/2026/03/partner-with-us-1.png',
    'donate': 'https://cgsul.org/wp-content/uploads/2026/03/Donate.jpeg',
    'logo': 'https://cgsul.org/wp-content/uploads/2026/01/logo-removebg-preview.png',
    'logoLight': 'https://cgsul.org/wp-content/uploads/2026/03/footer.png',
}
hero_out = {}
for k, v in HERO.items():
    hero_out[k] = localize(v, max_w=1920 if k not in ('logo', 'logoLight') else 600)
dump('images.json', hero_out)
print('articles', len(articles), 'domains', len(domains), 'programs', len(programs), 'people', len(people))
print('images', len([v for v in IMAGES.values() if v]), 'failed', [k for k, v in IMAGES.items() if not v])
