"""/kaynaklar replaces the homepage services section and the Kaynaklar menu target."""

from pathlib import Path
from html.parser import HTMLParser
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/kaynaklar"
PAGE = ROOT / "src/app/kaynaklar/page.tsx"
VIEW = ROOT / "src/components/sections/ResourcesDirectory.tsx"
HOMEPAGE = json.loads((ROOT / "src/data/homepage.json").read_text(encoding="utf-8"))
HIDDEN_GROUP = "Partner erişimi"


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class ResourcesRouteTests(unittest.TestCase):
    def test_page_uses_release_metadata_and_is_hidden_while_the_release_is_off(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn(f"buildRelease2027Metadata('{ROUTE}')", source)
        self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{ROUTE}'))", source)
        self.assertIn("isReleaseContentEnabled()", source)
        self.assertIn("notFound()", source)

    def test_route_is_registered_for_the_sitemap(self):
        self.assertIn(f"path: '{ROUTE}'", read("src/lib/release-2027-routes.ts"))

    def test_temporary_preview_route_is_gone(self):
        self.assertFalse((ROOT / "src/app/preview/kaynaklar").exists())


class ResourcesLinkTests(unittest.TestCase):
    def test_menu_points_to_the_page_while_the_release_is_on(self):
        shell = read("src/components/shell/SiteShell.tsx")
        self.assertIn("isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'", shell)

    def test_mobile_drawer_lists_resources_before_references(self):
        shell = read("src/components/shell/SiteShell.tsx")
        drawer = shell[shell.index("Mobil Gezinme Menüsü"):]
        self.assertIn("isReleaseContentEnabled() ? '/kaynaklar' : '/#professional-services'", drawer)
        self.assertLess(drawer.index("/kaynaklar"), drawer.index('href="/references"'))

    def test_homepage_section_is_removed_for_the_release_and_kept_for_rollback(self):
        home = read("src/components/sections/HomepageView.tsx")
        self.assertRegex(home, r'\{!previewMaxHero\s*&&\s*<DebugComponentLabel\b[^>]*>\s*<ProfessionalServicesSection\s*/>\s*</DebugComponentLabel>\s*\}')


class ResourcesDirectoryTests(unittest.TestCase):
    def test_view_reads_the_homepage_service_data_without_copying_it(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertIn("getHomepageData", source)
        for service in HOMEPAGE["services"]:
            with self.subTest(service=service["title"]):
                self.assertNotIn(service["description"], source)
                self.assertNotIn(service["href"], source)

    def test_every_listed_service_resolves_and_twenty_one_remain_without_partner(self):
        titles = {service["title"] for service in HOMEPAGE["services"]}
        listed = [
            title
            for group in HOMEPAGE["serviceGroups"] if group["title"] != HIDDEN_GROUP
            for title in group["serviceTitles"]
        ]
        self.assertEqual([title for title in listed if title not in titles], [])
        self.assertEqual(len(listed), 21)

    def test_every_icon_is_bare_and_card_icons_sit_in_the_corner(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertNotIn("ServiceIcon", source)
        self.assertNotIn("alu-support-card__icon", source)
        cards = read("src/components/sections/SupportGridCards.tsx")
        tile = cards[cards.index("function Tile"):cards.index("export function SupportGridCards")]
        featured = read("src/components/sections/FeaturedSupportCards.tsx")
        for card in (tile, featured):
            self.assertIn("<BareIcon", card)
        css = (ROOT / "src/components/sections/ResourcesDirectory.module.css").read_text(encoding="utf-8")
        bare = css[css.index(".bareIcon"):].split("}")[0]
        self.assertNotIn("background", bare)
        self.assertNotIn("border", bare)

    def test_tile_groups_fill_their_last_row(self):
        css = (ROOT / "src/components/sections/ResourcesDirectory.module.css").read_text(encoding="utf-8")
        tiles = css[css.index(".tiles{"):].split("}")[0]
        self.assertIn("display:flex", tiles)
        self.assertIn("flex-wrap:wrap", tiles)
        self.assertNotIn("grid-template-columns", tiles)
        tile = css[css.index(".tile{"):].split("}")[0]
        self.assertIn("flex:1 1 18rem", tile)

    def test_learning_group_lists_the_video_library_and_training_centers(self):
        group = next(g for g in HOMEPAGE["serviceGroups"] if g["title"] == "Öğren ve yardım al")
        services = {s["title"]: s for s in HOMEPAGE["services"]}
        self.assertEqual(
            group["serviceTitles"],
            ["Video Kütüphanesi", "Kaydedilmiş Webinarlar", "Eğitim Merkezleri", "Teknik Destek", "Destek Platformu", "Danışmanlık", "Sertifika"],
        )
        pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
        for title, icon in (("Video Kütüphanesi", "circle-play"), ("Eğitim Merkezleri", "map-pin")):
            with self.subTest(service=title):
                service = services[title]
                self.assertEqual(service["icon"], icon)
                self.assertTrue(service["description"] and service["cta"])
        self.assertIn("/video-kutuphanesi", pages)
        self.assertEqual(services["Video Kütüphanesi"]["href"], "/video-kutuphanesi")
        self.assertEqual(services["Eğitim Merkezleri"]["href"], "/egitim-merkezlerimiz")
        self.assertIn("path: '/egitim-merkezlerimiz'", read("src/lib/release-2027-routes.ts"))

    def test_the_removed_training_card_is_gone(self):
        self.assertNotIn("Eğitim", {service["title"] for service in HOMEPAGE["services"]})

    def test_view_leaves_out_the_partner_group(self):
        self.assertIn(HIDDEN_GROUP, VIEW.read_text(encoding="utf-8"))

    def test_external_links_open_safely_in_a_new_tab(self):
        source = read("src/components/sections/SupportGridCards.tsx")
        self.assertIn('target="_blank"', source)
        self.assertIn('rel="noopener noreferrer"', source)

    def test_both_groups_use_same_shared_component(self):
        source = VIEW.read_text(encoding="utf-8")
        self.assertIn("<FeaturedSupportCards", source)
        self.assertNotIn("featuredTitles={FEATURED_SERVICES}", source)
        self.assertIn("<SupportGridCards", source)


RENDER_CARDS = r'''
const fs=require('fs'), vm=require('vm'), ts=require('typescript');
const React=require('react'), {renderToStaticMarkup}=require('react-dom/server');
function load(file) {
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const mod={exports:{}};
  function req(id) {
    if(id==='react'||id==='react/jsx-runtime') return require(id);
    if(id==='next/link') return {default:({children,...props})=>React.createElement('a',props,children)};
    if(id==='@/components/ui/AluIcon') return {AluIcon:({name})=>React.createElement('svg',{'data-icon':name,'aria-hidden':'true'})};
    if(id==='@/lib/site-shared') return {getHomepageData:()=>JSON.parse(fs.readFileSync('src/data/homepage.json','utf8'))};
    if(id==='./CompactPageHero') return {CompactPageHero:({children})=>React.createElement('div',null,children)};
    if(id==='./DebugComponentLabel') return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
    if(id.endsWith('.module.css')) return {default:new Proxy({}, {get:(_,key)=>String(key)})};
    if(id.startsWith('./')) return load('src/components/sections/'+id.slice(2)+'.tsx');
    throw Error('Unexpected import: '+id);
  }
  vm.runInThisContext('(function(exports,require,module){'+code+'})',{filename:file})(mod.exports,req,mod);
  return mod.exports;
}
const {SupportGridCards}=load('src/components/sections/SupportGridCards.tsx');
const {FeaturedSupportCards}=load('src/components/sections/FeaturedSupportCards.tsx');
const {ResourcesDirectory}=load('src/components/sections/ResourcesDirectory.tsx');
const data=JSON.parse(fs.readFileSync('src/data/homepage.json','utf8'));
const servicesFor=title=>data.serviceGroups.find(g=>g.title===title).serviceTitles.map(t=>data.services.find(s=>s.title===t));
const allSupport=servicesFor('Öğren ve yardım al'), names=['Teknik Destek','Destek Platformu'];
const featured=allSupport.filter(s=>names.includes(s.title)), support=allSupport.filter(s=>!names.includes(s.title)), info=servicesFor('Bilgi ve güncellemeler');
const render=(Component,services)=>renderToStaticMarkup(React.createElement(Component,{services}));
process.stdout.write(JSON.stringify({featured,support,info,featuredHtml:render(FeaturedSupportCards,featured),supportHtml:render(SupportGridCards,support),infoHtml:render(SupportGridCards,info),emptyHtml:render(SupportGridCards,[]),pageHtml:renderToStaticMarkup(React.createElement(ResourcesDirectory))}));
'''


class CardsParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.cards=[]; self.current=None; self.labels=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        if tag=='li': self.current={'text':'','class':attrs.get('class'),'links':[],'icons':[]}; self.cards.append(self.current)
        if self.current is not None and tag=='a': self.current['links'].append(attrs)
        if self.current is not None and tag=='svg': self.current['icons'].append(attrs.get('data-icon'))
    def handle_data(self,text):
        if self.current is not None: self.current['text']+=text
    def handle_endtag(self,tag):
        if tag=='li': self.current=None


class CardGroupParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.groups=[]; self.heading=None
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs); group=None
        if attrs.get('data-debug-label') in ('FeaturedSupportCards','SupportGridCards'):
            group={'label':attrs['data-debug-label'],'titles':[]}; self.groups.append(group)
        self.stack.append((tag,group))
        if tag=='h3': self.heading=''
    def handle_data(self,text):
        if self.heading is not None: self.heading+=text
    def handle_endtag(self,tag):
        if tag=='h3' and self.heading is not None:
            group=next((group for _,group in reversed(self.stack) if group),None)
            if group is not None: group['titles'].append(self.heading)
            self.heading=None
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index][0]==tag:
                del self.stack[index:]; break


class SupportGridCardsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result=subprocess.run(['node','-e',RENDER_CARDS],cwd=ROOT,capture_output=True,text=True,check=True)
        cls.render=json.loads(result.stdout)

    def test_real_groups_preserve_content_links_icons_and_debug_labels(self):
        for group,html_key in [('featured','featuredHtml'),('support','supportHtml'),('info','infoHtml')]:
            with self.subTest(group=group):
                parser=CardsParser(); parser.feed(self.render[html_key])
                self.assertEqual(parser.labels, ['FeaturedSupportCards' if group == 'featured' else 'SupportGridCards'])
                self.assertEqual(len(parser.cards),len(self.render[group]))
                by_title={service['title']:service for service in self.render[group]}
                for card in parser.cards:
                    matches=[s for title,s in by_title.items() if title in card['text']]
                    self.assertEqual(len(matches),1)
                    service=matches[0]
                    self.assertIn(service['description'],card['text']); self.assertIn(service['cta'],card['text'])
                    self.assertIn(service['icon'],card['icons'])
                    self.assertEqual(len(card['links']),1); self.assertEqual(card['links'][0]['href'],service['href'])
                    if service['href'].startswith('http'):
                        self.assertEqual(card['links'][0]['target'],'_blank')
                        self.assertEqual(card['links'][0]['rel'],'noopener noreferrer')
                if group=='featured':
                    self.assertEqual([card['class'] for card in parser.cards].count('featured'),2)
                else:
                    self.assertEqual([card['class'] for card in parser.cards].count('tile'),5 if group == 'support' else 9)

    def test_empty_services_render_no_cards(self):
        parser=CardsParser(); parser.feed(self.render['emptyHtml'])
        self.assertEqual(parser.cards,[])

    def test_resource_headings_use_shared_section_header_with_accessible_ids(self):
        page=self.render['pageHtml']
        expected=['Öğren ve yardım al', 'Yazılım ve lisans işlemleri', 'Bilgi ve güncellemeler']
        for index,title in enumerate(expected,1):
            with self.subTest(title=title):
                section_id=f'kaynak-grubu-{index}'
                match=re.search(rf'<section\b(?=[^>]*\bid="{section_id}")(?=[^>]*\baria-labelledby="{section_id}-title")[^>]*>(.*?)</section>',page,re.S)
                self.assertIsNotNone(match)
                html=match.group(1)
                heading=rf'<div data-debug-label="SectionHeader">.*?<h2\b[^>]*\bid="{section_id}-title"[^>]*>{re.escape(title)}</h2>'
                self.assertRegex(html,heading)
                self.assertEqual(len(re.findall(rf'<h2\b[^>]*\bid="{section_id}-title"',html)),1)

    def test_page_groups_use_independent_labels_with_correct_cards(self):
        page=self.render['pageHtml']
        learning=page.split('id="kaynak-grubu-1"',1)[1].split('</section>',1)[0]
        updates=page.split('id="kaynak-grubu-3"',1)[1].split('</section>',1)[0]
        for section, expected in ((learning, ['FeaturedSupportCards', 'SupportGridCards']), (updates, ['FeaturedSupportCards', 'SupportGridCards'])):
            parser=CardsParser(); parser.feed(section)
            self.assertEqual([label for label in parser.labels if label in ('FeaturedSupportCards','SupportGridCards')],expected)
            self.assertEqual(len(parser.cards),7 if section == learning else 9)
        self.assertIn('Teknik Destek',learning)
        self.assertNotIn('Teknik Destek',updates)
        groups=CardGroupParser(); groups.feed(updates)
        self.assertEqual(groups.groups[0]['titles'], ['ALLPLAN FAQ', 'Sistem Gereksinimleri'])
        original=next(group['serviceTitles'] for group in HOMEPAGE['serviceGroups'] if group['title']=='Bilgi ve güncellemeler')
        self.assertEqual(groups.groups[1]['titles'], [title for title in original if title not in groups.groups[0]['titles']])

    def test_license_group_promotes_requested_cards_and_preserves_all_content(self):
        section=self.render['pageHtml'].split('id="kaynak-grubu-2"',1)[1].split('</section>',1)[0]
        groups=CardGroupParser(); groups.feed(section)
        self.assertEqual([group['label'] for group in groups.groups], ['FeaturedSupportCards', 'SupportGridCards'])
        self.assertEqual(groups.groups[0]['titles'], ['Connect: Giriş', 'Deklarasyon Formu'])
        original=next(group['serviceTitles'] for group in HOMEPAGE['serviceGroups'] if group['title']=='Yazılım ve lisans işlemleri')
        self.assertEqual(groups.groups[1]['titles'], [title for title in original if title not in groups.groups[0]['titles']])
        parser=CardsParser(); parser.feed(section)
        self.assertEqual(len(parser.cards),5)
        services={service['title']:service for service in HOMEPAGE['services'] if service['title'] in original}
        for card,title in zip(parser.cards,groups.groups[0]['titles'] + groups.groups[1]['titles']):
            service=services[title]
            self.assertIn(title,card['text']); self.assertIn(service['description'],card['text']); self.assertIn(service['cta'],card['text'])
            self.assertIn(service['icon'],card['icons'])
            self.assertEqual(len(card['links']),1); self.assertEqual(card['links'][0]['href'],service['href'])
            if service['href'].startswith('http'):
                self.assertEqual(card['links'][0]['target'],'_blank'); self.assertEqual(card['links'][0]['rel'],'noopener noreferrer')


if __name__ == "__main__":
    unittest.main()
