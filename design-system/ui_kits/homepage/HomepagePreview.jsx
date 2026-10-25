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
function PreviewHeader({ mode, onToggleMode }) {
  return <>
    <div className="preview-ribbon"><ALU.Container size="xl" className="preview-ribbon__inner">
      <ALU.Text as="span" variant="caption">Tasarım sistemi önizlemesi · Antrasit ({mode === 'dark' ? 'Koyu' : 'Açık'} Mod)</ALU.Text>
      <div className="preview-ribbon__controls">
        <ALU.Text as="span" variant="caption" tone="secondary">Mega menü ve arama tam uygulama katmanında (Faz 6) bağlanır.</ALU.Text>
        <ALU.Button variant="secondary" size="sm" onClick={onToggleMode}>
          {mode === 'dark' ? 'Açık Modu Gör' : 'Koyu Modu Gör'}
        </ALU.Button>
      </div>
    </ALU.Container></div>
    <ALU.SiteHeader logoSrc={LOGO} homeHref="#top" navItems={nav} label="Ana menü önizlemesi" />
  </>;
}
const heroTags = [
  'CLOUD NATIVE', 'BIM LEVEL 3', 'PARAMETRIC', 'AUTOMATION', 'INTEROPERABILITY',
  'AX3000', 'PYTHONPARTS', 'OPENBIM', 'REAL-TIME', 'PRECAST', 'CIVIL', 'BRIDGE',
  '@CONNECTION', 'DATA_NODE',
];
function Hero() {
  return <section className="preview-hero" id="top"><ALU.Container size="xl"><div className="preview-hero__grid">
    <ALU.Stack gap="lg">
      <span className="preview-kicker">/ ALLPLAN 2026 · Giriş ve kimlik</span>
      <ALU.Heading level={1} size="display" className="preview-hero__title">DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI</ALU.Heading>
      <ALU.Text variant="body-lg" tone="secondary" prose>Yenilikçi AEC iş akışları, otomasyon ve bulut tabanlı iş birliği ile daha başarılı projeler.</ALU.Text>
      <ALU.CtaGroup actions={actions} priority="equal" showDestination={true} />
      <details className="preview-service-group">
        <summary>Mevcut teknik etiketler <ALU.Text as="span" variant="caption" tone="secondary">14 kayıt</ALU.Text></summary>
        <div className="preview-quicklinks">
          {heroTags.map((tag) => <ALU.Badge key={tag} tone="neutral">{tag}</ALU.Badge>)}
        </div>
      </details>
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
function Footer() {
  const columns = [
    {
      id: 'products',
      heading: 'Ürünler',
      links: data.products.map(p => ({ id: p.id, label: p.title, href: live(p.href), external: true })),
    },
    {
      id: 'solutions',
      heading: 'ÇÖZÜMLER',
      links: [
        ['building', 'BİNA TASARIMI', '/solutions-v2/building-design'],
        ['infrastructure', 'ALTYAPI TASARIMI', '/solutions-v2/infrastructure'],
        ['construction', 'İNŞAAT PLANLAMASI', '/solutions-v2/construction'],
        ['addons', 'EKLENTİLER', '/solutions-v2/addons'],
        ['other', 'DİĞER ÜRÜNLER', '/solutions-v2/other'],
      ].map(([id, label, href]) => ({ id, label, href: live(href), external: true })),
    },
    {
      id: 'contact',
      heading: 'İletişim & Kurumsal',
      links: [
        ['address', 'Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul', 'https://aluplan.com.tr/contact', true],
        ['tel1', '(+90) 216 225 84 41', 'tel:+902162258441', false],
        ['tel2', '(+90) 543 211 94 42', 'tel:+905432119442', false],
        ['tel3', '(+90) 549 499 73 79', 'tel:+905494997379', false],
        ['mail', 'info@aluplan.com.tr', 'mailto:info@aluplan.com.tr', false],
        ['references', 'Referanslar', 'https://aluplan.com.tr/references', true],
        ['about', 'Hakkımızda', 'https://aluplan.com.tr/about', true],
      ].map(([id, label, href, external]) => ({ id, label, href, external })),
    },
    {
      id: 'legal-social',
      heading: 'Yasal & Sosyal Medya',
      links: [
        ['privacy', 'Gizlilik Politikası', live('/gizlilik-politikasi'), true],
        ['terms', 'Kullanım Şartları', live('/kullanim-sartlari'), true],
        ['kvkk', 'KVKK', live('/kvkk'), true],
        ['facebook', 'Facebook', 'https://www.facebook.com/Allplan.Turkey', true],
        ['twitter', 'Twitter', 'https://twitter.com/Allplan_Turkey', true],
        ['linkedin', 'LinkedIn', 'https://www.linkedin.com/company/allplan-turkey/', true],
        ['instagram', 'Instagram', 'https://www.instagram.com/allplan_turkey/', true],
        ['youtube', 'YouTube', 'https://www.youtube.com/c/AllplanTurkey', true],
        ['credit', 'Design & Develop by Hazar Volga Ekiz', 'https://hazarvolga.com.tr', true],
      ].map(([id, label, href, external]) => ({ id, label, href, external })),
    },
  ];
  return <ALU.SiteFooter logoSrc={LOGO} homeHref="#top" columns={columns} legal="© 2026 Aluplan Program Sistemleri · 1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri. · Design & Develop by Hazar Volga Ekiz" />;
}
function App() {
  const [mode, setMode] = React.useState('dark');
  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.setAttribute('data-mode', next);
  };
  if (!ALU || !data) return <p className="preview-loading">Bileşen veya içerik verisi yüklenemedi.</p>;
  return <div className="preview-shell"><a className="alu-skip-link" href="#main">İçeriğe geç</a><PreviewHeader mode={mode} onToggleMode={toggleMode}/><main id="main"><Hero/><QuickLinks/><RolesProducts/><SolutionsLink/><Packages/><Services/><Bimflex/><Innovations/></main><Footer/></div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
