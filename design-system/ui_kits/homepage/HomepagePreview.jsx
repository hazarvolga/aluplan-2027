const ALU = window.AluplanDesignSystem_84a18c;
const data = window.previewData;
const LOGO = '../../assets/logo/aluplan-logo-white-filled.svg';
const live = (path) => /^https?:/.test(path) ? path : 'https://aluplan.com.tr' + path;
const actions = [
  { id: 'quote', kind: 'quote', label: 'Teklif İste', href: 'https://forms.office.com/r/hXhnKAG912', external: true },
  { id: 'trial', kind: 'trial', label: 'Ücretsiz Deneme', href: 'https://www.allplan.com/trial-or-subscription/', external: true },
];
const nav = [
  ['solutions','Çözümler','#solutions'], ['products','Ürünler','#products'], ['resources','Kaynaklar','#services'],
  ['references','Referanslar','https://aluplan.com.tr/references'], ['about','Hakkımızda','https://aluplan.com.tr/about'],
  ['contact','İletişim','https://aluplan.com.tr/contact'], ['support','Eğitim ve Destek','#services'],
].map(([id,label,href]) => ({ id,label,href }));
const groups = [
  ['Öğren ve yardım al',['Danışmanlık','Sertifika']],
  ['Yazılım ve lisans işlemleri',['Download','Connect: Giriş','Admin Lisans : Lisans Yöneticisi Bilgi Formu','CodeMeter WebDepot','Deklarasyon Formu']],
  ['Bilgi ve güncellemeler',['ALLPLAN FAQ','Blog Global','Canlı Webinarlar','BIM Rehberi','OPENBIM','Sistem Gereksinimleri','Tüm Gereksinimler','Sürüm Notları','IFC Export El Kitabı']],
  ['Partner erişimi',['Partner']],
];

function Section({ id, subtle=false, children }) {
  return <section id={id} className={'preview-section' + (subtle ? ' preview-section--subtle' : '')}><ALU.Container size="xl"><ALU.Stack gap="lg">{children}</ALU.Stack></ALU.Container></section>;
}
function PreviewHeader() {
  return <>
    <div className="preview-ribbon"><ALU.Container size="xl" className="preview-ribbon__inner">
      <ALU.Text as="span" variant="caption">Tasarım sistemi önizlemesi · Nihai tasarım veya entegrasyon değil</ALU.Text>
      <ALU.Text as="span" variant="caption" tone="secondary">Mega menü, arama ve tema kontrolü bu kesitte uygulanmadı.</ALU.Text>
    </ALU.Container></div>
    <ALU.SiteHeader logoSrc={LOGO} homeHref="#top" navItems={nav} label="Ana menü önizlemesi" />
  </>;
}
function Hero() {
  return <section className="preview-hero" id="top"><ALU.Container size="xl"><div className="preview-hero__grid">
    <ALU.Stack gap="lg">
      <span className="preview-kicker">/ ALLPLAN 2026 · Giriş ve kimlik</span>
      <ALU.Heading level={1} size="display" className="preview-hero__title">DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI</ALU.Heading>
      <ALU.Text variant="body-lg" tone="secondary" prose>Yenilikçi AEC iş akışları, otomasyon ve bulut tabanlı iş birliği ile daha başarılı projeler.</ALU.Text>
      <ALU.CtaGroup actions={actions} priority="equal" showDestination={true} />
    </ALU.Stack>
    <div className="preview-hero__media" aria-label="Mevcut hero videosu için ayrılan alan">
      <div className="preview-hero__mark" aria-hidden="true">⌜</div>
      <ALU.Heading level={2} size="h4">Mevcut hero videosu</ALU.Heading>
      <ALU.Text variant="body-sm" tone="secondary">hero-bim.mp4 / hero-poster.jpg · Bu kesitte medya alanı temsilidir.</ALU.Text>
    </div>
  </div></ALU.Container></section>;
}
function QuickLinks() {
  return <ALU.Container size="xl"><nav className="preview-quicklinks" aria-label="Hızlı erişimler">
    {data.quickLinks.map(([label,href])=><ALU.Link key={href} href={live(href)} external variant="standalone">{label}</ALU.Link>)}
  </nav></ALU.Container>;
}
function RolesProducts() {
  const [roleId,setRoleId]=React.useState(data.roles[0].id);
  const role=data.roles.find(r=>r.id===roleId);
  const related={architect:['basic','concept'],engineer:['professional','ultimate','civil'],precast:['precast']}[roleId]||[];
  return <Section id="products" subtle>
    <span className="preview-kicker">Rol ve ürün seçimi</span>
    <ALU.Heading level={2}>Rolünüzü seçin</ALU.Heading>
    <ALU.Text variant="body-lg" tone="secondary">Rol seçimi yönlendirmeyi değiştirir; altı ürün her seçimde görünür kalır.</ALU.Text>
    <ALU.RoleSelector legend="Çalışma alanınız" roles={data.roles.map(r=>({id:r.id,label:r.label,description:r.title}))} value={roleId} onChange={setRoleId} name="homepage-role" />
    <div className="preview-role-copy"><ALU.Stack gap="md">
      <ALU.Heading level={3}>{role.title}</ALU.Heading><ALU.Text tone="secondary">{role.description}</ALU.Text>
      <ALU.Link href={live(role.href)} external variant="standalone">Bu akışı detaylı incele</ALU.Link>
    </ALU.Stack><ALU.Grid minItemWidth="13rem">{role.features.map(x=><ALU.Card key={x} variant="outlined" title={x} titleLevel={4} />)}</ALU.Grid></div>
    <ALU.Grid minItemWidth="17rem" className="preview-products-grid">{data.products.map(p=><div key={p.id} className={'preview-product' + (related.includes(p.id)?' preview-product--related':'')}>
      <ALU.ProductCard name={p.title} vendor="ALLPLAN" summary={p.description} href={live(p.href)} roles={related.includes(p.id)?['İlgili yol']:[]} linkLabel="canlı ürün sayfası" />
    </div>)}</ALU.Grid>
  </Section>;
}
function SolutionsLink() {
  return <Section id="solutions">
    <span className="preview-kicker">Çözüm alanları · Bu kesitte kompakt</span>
    <ALU.Heading level={2}>Tek platform. Tüm disiplinler.</ALU.Heading>
    <ALU.Grid minItemWidth="15rem">{data.solutions.map(s=><ALU.Card key={s.title} variant="outlined" title={s.title} eyebrow={<ALU.Text variant="mono" tone="secondary">{s.subtitle}</ALU.Text>} footer={<ALU.Link href={live(s.href)} external variant="standalone">{s.cta}</ALU.Link>}><ALU.Text variant="body-sm" tone="secondary">{s.description}</ALU.Text></ALU.Card>)}</ALU.Grid>
  </Section>;
}
function Packages() {
  const meta=data.packageAccess;
  return <Section id="package-comparison" subtle>
    <div className="preview-section-heading"><ALU.Stack gap="md">
      <span className="preview-kicker">{meta.eyebrow}</span>
      <ALU.Heading level={2}>{meta.title}</ALU.Heading>
      <ALU.Text variant="body-lg" tone="secondary" prose>{meta.description}</ALU.Text>
    </ALU.Stack><ALU.Button href={live(meta.href)} external variant="secondary">{meta.cta}</ALU.Button></div>
    <ALU.Grid minItemWidth="17rem" className="preview-package-grid">{data.packages.map(p=><ALU.ResourceCard key={p.id} kind="pdf" title={p.title} description={p.description} href={live(meta.href)} language="TR" />)}</ALU.Grid>
  </Section>;
}
function service(name){return data.services.find(s=>s.title===name)}
function serviceProps(s){return {title:s.title,description:s.description,actions:[{id:s.title,label:s.cta,href:live(s.href),external:true}]}}
function Services(){const primary=['Eğitim','Teknik Destek','Destek Platformu'];return <Section id="services" subtle>
  <span className="preview-kicker">Profesyonel hizmetler</span>
  <ALU.Heading level={2}>Öğrenme, destek ve bilgi kaynakları</ALU.Heading>
  <ALU.Text variant="body-lg" tone="secondary" prose>Eğitim, Teams desteği ve ticket platformu ilk görünümde; kalan kayıtlar görevlerine göre gruplanır.</ALU.Text>
  <ALU.Grid columns={3} className="preview-services-primary">{primary.map(n=><ALU.SupportCard key={n} {...serviceProps(service(n))} icon={n==='Eğitim'?'graduation-cap':'life-buoy'} />)}</ALU.Grid>
  <div>{groups.map(([title,names],i)=><details className="preview-service-group" key={title} open={i===0}><summary>{title}<ALU.Text as="span" variant="caption" tone="secondary">{names.length} kayıt</ALU.Text></summary><ALU.Grid minItemWidth="17rem">{names.map(n=><ALU.SupportCard key={n} {...serviceProps(service(n))} />)}</ALU.Grid></details>)}</div>
  <div className="preview-note"><ALU.Text variant="body-sm" tone="secondary" className="preview-meta">Toplam 20 mevcut hizmet/kaynak kaydı korunur. Bu prototip form göndermez; hedefler canlı kaynağa yeni sekmede açılır.</ALU.Text></div>
  </Section>}
function Bimflex(){const item=data.bimflex;return <Section id="bimflex">
  <div className="preview-bimflex">
    <ALU.Stack gap="lg" className="preview-bimflex__content">
      <span className="preview-kicker">{item.eyebrow}</span>
      <img className="preview-bimflex__logo" src={item.logo.src} alt={item.logo.alt} />
      <ALU.Text variant="mono" tone="secondary">{item.label}</ALU.Text>
      <ALU.Heading level={2}>{item.title}</ALU.Heading>
      <ALU.Heading level={3} size="h4">{item.claim}</ALU.Heading>
      <ALU.Text variant="body-lg" tone="secondary" prose>{item.description}</ALU.Text>
      <ALU.Text variant="caption" tone="secondary">{item.relationship}</ALU.Text>
      <div><ALU.Button href={live(item.href)} external variant="primary">{item.cta}</ALU.Button></div>
    </ALU.Stack>
    <div className="preview-bimflex__media">{item.media.map((media,index)=><figure key={media.src} className={'preview-bimflex__figure preview-bimflex__figure--'+(index+1)}><img src={media.src} alt={media.alt}/><figcaption aria-hidden="true">{media.alt}</figcaption></figure>)}</div>
  </div>
  </Section>}
function Innovations(){const meta=data.innovationsMeta;return <Section id="innovations" subtle>
  <div className="preview-section-heading"><ALU.Stack gap="md">
    <span className="preview-kicker">{meta.eyebrow} · {meta.version}</span>
    <ALU.Heading level={2}>{meta.title}</ALU.Heading>
    <ALU.Text variant="body-lg" tone="secondary" prose>{meta.description}</ALU.Text>
  </ALU.Stack><ALU.Button href={live(meta.href)} external variant="secondary">{meta.cta}</ALU.Button></div>
  <ALU.Grid columns={3} className="preview-innovations-grid">{data.innovations.map(item=><ALU.Card key={item.id} variant="outlined" title={item.title} titleLevel={3} eyebrow={<ALU.Badge tone="neutral">{item.badge}</ALU.Badge>}><ALU.Text tone="secondary">{item.description}</ALU.Text></ALU.Card>)}</ALU.Grid>
  </Section>}
function Footer(){const columns=[{id:'products',heading:'Ürünler',links:data.products.map(p=>({id:p.id,label:p.title,href:live(p.href),external:true}))},{id:'company',heading:'Kurumsal',links:[['references','Referanslar','/references'],['about','Hakkımızda','/about'],['contact','İletişim','/contact']].map(([id,label,href])=>({id,label,href:live(href),external:true}))},{id:'legal',heading:'Yasal',links:[['privacy','Gizlilik Politikası','/gizlilik-politikasi'],['terms','Kullanım Şartları','/kullanim-sartlari'],['kvkk','KVKK','/kvkk']].map(([id,label,href])=>({id,label,href:live(href),external:true}))}];return <ALU.SiteFooter logoSrc={LOGO} homeHref="#top" columns={columns} legal="Aluplan ana sayfa tasarım sistemi önizlemesi · Yayın tasarımı değildir." />}
function App(){if(!ALU||!data)return <p className="preview-loading">Bileşen veya içerik verisi yüklenemedi.</p>;return <div className="preview-shell"><a className="alu-skip-link" href="#main">İçeriğe geç</a><PreviewHeader/><main id="main"><Hero/><QuickLinks/><RolesProducts/><SolutionsLink/><Packages/><Services/><Bimflex/><Innovations/></main><Footer/></div>}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
