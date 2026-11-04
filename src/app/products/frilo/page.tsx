import { DebugComponentLabel } from '@/components/sections/DebugComponentLabel';
import type { Metadata } from 'next';
import hero from '@/components/sections/ProductPage.module.css';
import { ProductHero } from '@/components/sections/ProductHero';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { GroupHeader } from '@/components/sections/GroupHeader';
import { friloGeoNewsImage, friloNewsImage } from '@/lib/frilo-geo-images';
import { friloEditionNews } from '@/data/frilo-editions-2027';
import { ProductContentSection, ProductEditionsBand, ProductFaq, ProductTabNav } from '@/components/sections/ProductPageParts';
import { friloCapabilities, friloFaq } from './content';
import { FeatureRow, FeatureRowList } from '@/components/sections/FeatureRow';
import { geotechnics } from '@/data/frilo-geotechnics-2027';
import { notFound } from 'next/navigation';
import { PreviewClosingSection } from '@/components/sections/PreviewClosingSection';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/products/frilo');
}
const editions = [
  { title: 'FRILO Concept', link: { href: 'https://www.allplan.com/en-US/shop/products/frilo/frilo-concept', label: 'Sürümü inceleyin ↗' }, items: ['Basit konut yapıları için eksiksiz iş akışı', 'Kat bazında yük aktarımı için bina modeli', 'Sürekli kirişler, döşemeler, kolonlar ve temeller', 'Mertek, aşık ve çatı sistemlerinin tasarımı', 'Eurocode ve DIN kapsamında yığma ve ahşap duvar kontrolleri'] },
  { title: 'FRILO Professional Concrete', link: { href: 'https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-concrete', label: 'Sürümü inceleyin ↗' }, items: ['Beton ve yığma yapılar için araçlar', 'Gelişmiş betonarme bileşen tasarımı', 'Zımbalama, konsollar, yarım eklemler ve basınç çubuğu–çekme bağı modelleri', 'Çatlak genişliği kontrolleriyle ayrıntılı donatı düzenleri', 'FBC / BIM Connector'] },
  { title: 'FRILO Professional Steel', link: { href: 'https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-steel', label: 'Sürümü inceleyin ↗' }, items: ['Çelik tasarımına özel araçlar', 'Çelik kirişler, kolonlar, çerçeveler ve kafes sistemler', 'Yanal burulmalı burkulma ve stabilite kontrolleri', 'Çelik birleşimler, kiriş mesnetleri, çaprazlar ve kaynaklar', 'FBC / BIM Connector'] },
  { title: 'FRILO Professional Timber', link: { href: 'https://www.allplan.com/en-US/shop/products/frilo/frilo-professional-timber', label: 'Sürümü inceleyin ↗' }, items: ['Ahşap yapı tasarımına odaklanan araçlar', 'Ahşap kirişler, kafesler ve çerçeve sistemleri', 'Tutkallı lamine kirişler ve çapraz lamine ahşap kirişler', 'Eğik dişli, çekme ve kırlangıç kuyruğu birleşimleri', 'FBC / BIM Connector'] },
  { title: 'FRILO Ultimate', link: { href: 'https://www.allplan.com/en-US/shop/products/frilo/frilo-ultimate', label: 'Sürümü inceleyin ↗' }, items: ['Beton, çelik, ahşap ve yığma modüllerine tam erişim', 'Karma malzemeli yapılar için 2B ve 3B çerçeve sistemleri', 'Gelişmiş temel mühendisliği ve zemin–yapı kontrolleri', 'Farklı malzemelerde kapsamlı bileşen ve detay kontrolleri', 'BIMPLUS ile ALLPLAN, SCIA ve diğer araçlara bağlantılar'] },
];
function friloEditionImage(title: string) {
  const slug = title.toLowerCase().replaceAll(' ', '-');
  return { src: `/assets/previews/frilo/editions/${slug}.jpg`, alt: '' };
}

function FriloPreview() {
  if (!isReleaseContentEnabled()) notFound();
  return <div>
    <DebugComponentLabel name="ProductHero"><ProductHero eyebrow="FRILO · YAPI ANALİZİ" title="Bileşen odaklı yapı analizi ve tasarım" description="FRILO; beton, çelik, ahşap ve yığma yapıların bileşen odaklı analizi ve tasarımı için BIM bağlantıları ve Eurocode ile DIN temelli araçlar sunar." image="/assets/previews/frilo/frilo-hero.jpg" highlights={['İhtiyaçlarınıza uygun araç seti', 'Yapı bileşenleri için hesaplar', 'Düzenli hesap raporları', 'Diğer araçlarla iş birliği']} actions={[{ label: 'Teklif isteyin ↗', href: MAIN_QUOTE_FORM_URL, variant: 'primary' }]} /></DebugComponentLabel>
    <DebugComponentLabel name="ProductEditionsBand"><ProductEditionsBand title="FRILO sürümleri" variant="cards" editions={editions.map(edition => ({ ...edition, image: friloEditionImage(edition.title) }))} /></DebugComponentLabel>
    <DebugComponentLabel name="ProductEditionsBand"><ProductEditionsBand id="frilo-geotechnics" variant="cards" kicker="FRILO GEOTECHNICS · SÜRÜMLER" title="FRILO Geotechnics sürümleri" lead={geotechnics.lead} editions={geotechnics.editions.map(edition => ({ title: edition.name, description: edition.intro, image: friloEditionImage(edition.name) }))} /></DebugComponentLabel>
    <DebugComponentLabel name="ProductTabNav"><ProductTabNav label="FRILO sayfa bölümleri" links={[{href:'#frilo-overview',label:'Genel bakış'},{href:'#frilo-geotechnics',label:'Geoteknik'},{href:'#frilo-capabilities',label:'Yetenekler'},{href:'#frilo-stories',label:'Başarı hikâyeleri'},{href:'#frilo-faq',label:'Sık sorulan sorular'}]} /></DebugComponentLabel>
    <DebugComponentLabel name="friloOverview (özel)"><section id="frilo-overview" className={`${hero.sectionBand} ${hero.contentSection}`}><div className={`alu-container ${hero.overview}`}><div><SectionHeader kicker="FRILO · GENEL BAKIŞ" title="FRILO’ya genel bakış" /><p>FRILO, beton, çelik, ahşap ve yığma yapılar için Eurocode ve DIN ile uyumlu, bileşen odaklı bir yapı analizi ve tasarım çözümüdür. Yapı mühendisleri gerçekçi yapı davranışını modelleyebilir, kritik bileşenleri kontrol edebilir ve sonuçları şeffaf, denetlenebilir biçimde belgelendirebilir.</p><p>FRILO 2027 ile FRILO Connections, bağlantı türlerini zaman kazandıran raporlama ile tek bir araçta birleştirir; CLT+ çapraz lamine ahşap döşemeler için 2B tasarım sunar ve AI Coach sorulara anında destek sağlar.</p><a className={hero.textLink} href="/2027/features">2027 yeniliklerini inceleyin ↗</a></div><img src="/assets/previews/frilo/source/03.jpg" alt="Geniş açıklıklı, çapraz kolonlu bir bina iç mekânı" width="750" height="400" loading="lazy" /></div></section></DebugComponentLabel>
    <div className="alu-container alu-stack" style={{gap:"var(--space-stack-xl)"}}>
    <DebugComponentLabel name="ProductContentSection"><ProductContentSection id="frilo-capabilities" kicker="FRILO · YETENEKLER" title="Öne çıkan yetenekler"><FeatureRowList>{friloCapabilities.map((item,index)=><FeatureRow key={item.title} index={index} title={item.title} mediaFit="contain" media={<img src={`/assets/previews/frilo/source/${item.image}`} alt={`FRILO: ${item.title} görseli`} width="1536" height="864" loading="lazy" />}><p>{item.description}</p></FeatureRow>)}</FeatureRowList></ProductContentSection></DebugComponentLabel>
    <DebugComponentLabel name="ProductContentSection"><ProductContentSection kicker="FRILO · 2027" title="2027 yenilikleri" labelledBy="frilo-updates-title"><div className={hero.updatesGrid}>{[
      ['FRILO Connections', 'Çelik bağlantı türleri için birleşik iş akışı ve zaman kazandıran raporlama.', '/assets/previews/allplan-2027-features/csm_frilo-whats-new-page-feature-1_6c7ac67a26.png'],
      ['Çapraz lamine ahşap tasarımı', 'CLT+ ile çapraz lamine ahşap döşemelerin tasarımı.', '/assets/previews/allplan-2027-features/csm_frilo-whats-new-page-feature-2_2e7fdee657.png'],
      ['AI Coach', 'FRILO içinde konuşmaya dayalı destek.', '/assets/previews/allplan-2027-features/csm_frilo-whats-new-page-feature-3_806d573e37.jpg'],
    ].map(([title, description, image]) => <article className={hero.updateCard} key={title}><img src={image} alt={`${title} ürün görseli`} loading="lazy" /><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>{friloEditionNews.map((edition, index) => <section key={edition.name} className={hero.newsGroup} aria-label={edition.newsTitle}><GroupHeader index={index} title={edition.newsTitle} count={edition.features.length} unit="yenilik" /><div className={hero.updatesGrid}>{edition.features.map((feature, featureIndex) => <article className={hero.updateCard} key={feature.title}><img src={friloNewsImage(edition.name, featureIndex)} alt={`${edition.name}: ${feature.title} ekran görüntüsü`} width="1200" height="675" loading="lazy" /><div><h3>{feature.title}</h3><p>{feature.text}</p></div></article>)}</div></section>)}</ProductContentSection></DebugComponentLabel>
    <DebugComponentLabel name="friloGeotechnicsNews (özel)"><div id="frilo-geotechnics-2027" className={hero.contentSection}><SectionHeader kicker="FRILO GEOTECHNICS · 2027" title="FRILO Geotechnics 2027 yenilikleri" />{geotechnics.editions.filter(edition => edition.newsTitle).map((edition, index) => <section key={edition.name} className={hero.newsGroup} aria-label={edition.newsTitle!}><GroupHeader index={index} title={edition.newsTitle!} count={edition.features.length} unit="yenilik" /><div className={hero.updatesGrid}>{edition.features.map((feature, featureIndex) => <article className={hero.updateCard} key={feature.title}><img src={friloGeoNewsImage(edition.name, featureIndex)} alt={`${edition.name}: ${feature.title} ekran görüntüsü`} width="1200" height="675" loading="lazy" /><div><h3>{feature.title}</h3><p>{feature.text}</p></div></article>)}</div></section>)}</div></DebugComponentLabel>
    <DebugComponentLabel name="ProductContentSection"><ProductContentSection id="frilo-stories" kicker="FRILO · PROJELER" title="Müşteri projeleri"><div className={hero.stories}><article><img src="/assets/previews/frilo/source/09.jpg" alt="Schwabenhof West ofis yapısı" width="1000" height="563" loading="lazy" /><h3>Schwabenhof West</h3><p>Heilbronn’daki Schwabenhof West ofis kompleksi köprü benzeri taşıyıcı döşemesiyle dikkat çeker. Statik analiz ve tasarımdan sorumlu Wulle Lichti Walz mühendislik ofisi, döşemenin geniş açıklığına rağmen kat yüksekliğinde duvar benzeri kirişler kullanmadan çözüm geliştirmek zorundaydı.</p><a href="https://www.allplan.com/blog/schwabenhof-wests-eye-catching-bridge-like-slab/" aria-label="Projeyi inceleyin: Schwabenhof West">Projeyi inceleyin ↗</a></article><article><img src="/assets/previews/frilo/source/10.jpg" alt="Geceleri aydınlatılmış proje binası" width="1000" height="563" loading="lazy" /><h3>Betona bir övgü</h3><p>Wulle Lichti Walz GmbH danışman mühendisleri bu yapının statik analizi ve tasarımından sorumluydu. Ekip, hem FRILO hem de ALLPLAN kullandığı yaklaşımına ilişkin deneyimlerini paylaşıyor.</p><a href="https://www.allplan.com/blog/a-love-letter-to-concrete/" aria-label="Projeyi inceleyin: Betona bir övgü">Projeyi inceleyin ↗</a></article></div></ProductContentSection></DebugComponentLabel>
    <DebugComponentLabel name="ProductFaq"><ProductFaq id="frilo-faq" kicker="FRILO · SSS" items={friloFaq} accordionClasses /></DebugComponentLabel>
    </div><DebugComponentLabel name="PreviewClosingSection"><PreviewClosingSection id="frilo-closing" title="FRILO hakkında görüşelim" items={[{title:'Uzmanla görüşün',paragraphs:['Projelerinize uygun FRILO sürümü hakkında bilgi alın.'],action:{label:'Teklif isteyin',href:MAIN_QUOTE_FORM_URL}},{title:'FRILO’yu deneyin',paragraphs:['FRILO’yu 14 gün ücretsiz deneyin. Deneme, değerlendirme ve ticari olmayan kullanım içindir; iptal işlemi gerektirmez.'],action:{label:'Ücretsiz deneme',href:'https://connect2.allplan.com/auth/get-trial?product=frilo'}}]} /></DebugComponentLabel>
  </div>;
}

export default function Release2027Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/products/frilo')) }} />
      <FriloPreview />
    </>
  );
}
