import type { ProductEditionContent } from './product-edition-content';

// Turkish text of the "ALLPLAN Parametric – Edition Web Page" launch document (2027 Launch - Product Marketing Materials).
export const content: ProductEditionContent = {
  path: '/2027/parametric',
  name: 'Allplan Parametric',
  tagline: 'Parametrik inşaat mühendisliği yapıları için BIM yazılımı',
  lead: 'Allplan Parametric, inşaat mühendisliği yapılarının dört boyutlu parametrik modellenmesi ve detaylandırılması için özel işlevler sunar. Köprüleri, tünelleri, istinat duvarlarını, gürültü bariyerlerini ve prekast kirişli köprüleri modelleyin; parametrik modellemeyi ön germe, donatı, dokümantasyon, metraj ve koordine bilgi yönetimiyle birleştirin.',
  tags: ['Parametrik inşaat tasarımı', 'Köprü modelleme', 'Parametrik ön germe', 'Donatı detaylandırması', 'OpenBIM koordinasyonu'],
  overviewTitle: 'Parametrik inşaat mühendisliği yapıları için özel BIM çözümü',
  overview: [
    { label: 'Parametrik', title: 'İnşaat mühendisliği yapılarını parametrik hale getirin', text: 'Köprüler, tüneller, istinat duvarları, gürültü bariyerleri ve prekast kirişli köprüler dahil inşaat mühendisliği yapıları için özel dört boyutlu parametrik modelleme ve detaylandırma kullanın. İnşaat geometrisini özel bir parametrik iş akışında geliştirirken modelleme ve detaylandırma çalışmalarını aynı BIM proje ortamında tutun.' },
    { label: 'Entegrasyon', title: 'Ön germeyi ve donatıyı modelleyin', text: 'Ön germe tendonlarını doğrudan proje modelinde modelleyin; çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun. Özel donatı düzenleme paletlerini, varsayılan özniteliklerle yönlendirilen yerleştirmeyi ve geliştirilmiş otomatik kiriş ile perde donatısını kullanarak bağlantılı yapısal detaylandırma iş akışlarını destekleyin.' },
    { label: 'Koordinasyon', title: 'Bilgiyi yönetin, veriyi teslim edin', text: 'Model bilgisini Bilgi Paleti ile, referans verilen dokümanları Xref Manager ile yönetin. Cloud BIM Manager, metraj ve maliyetlendirme, çakışma tespiti, IFC koordinasyonu, harici veri kaynakları ve standart dosya arayüzlerini birleştirerek bağlantılı BIM bilgi iş akışlarını ve proje teslimatını destekleyin.' }
  ],
  benefitsTitle: 'Neden Allplan Parametric?',
  benefits: [
    { title: 'Özel parametrik inşaat modelleme', text: 'Köprüleri, tünelleri, istinat duvarlarını, gürültü bariyerlerini ve prekast kirişli köprüleri özel dört boyutlu parametrik işlevlerle modelleyin ve detaylandırın. Allplan Parametric, bu inşaat mühendisliği kapsamını temel 3B modelleme, 2B çizim, yapı bileşenleri ve koordine dokümantasyonla bir araya getirir.' },
    { title: 'Daha verimli modelleme ve dokümantasyon', text: 'Esnek yapı bileşenlerini, temel 3B modellemeyi ve kapsamlı 2B çizimi tek BIM iş akışında birleştirin. Dinamik konturlar, ilişkisel metin çıkma çizgileri ve görünüşlerde ile kesitlerde yapılandırılabilir nesne gösterimi; elle yapılan çizim düzeltmelerini azaltırken net ve ayrıntılı dokümantasyon hazırlamanıza yardımcı olur.' },
    { title: 'Bağlantılı bilgi ve metrajlar', text: 'BIM verilerini ve metrajları incelemek, filtrelemek ve düzenlemek için Cloud BIM Manager’ı kullanın. Modellenen ve modellenmeyen nesneler için hassas ve doğrulanabilir metraj ile maliyetlendirme oluşturun; tutarlı bilgi yönetimi için yapılandırılabilir mark numaralandırmayı ve hesaplanan öznitelikleri kullanın.' },
    { title: 'Açık ve koordine teslimat', text: 'Standart dosya arayüzleriyle veri alışverişi yapın; GIS bilgisini, 3B içeriği ve dokuları içe aktarın, görünüşlerde ve kesitlerde IFC referanslarıyla koordine olun. Geliştirilmiş IFC4 aktarımı, merkezi coğrafi referanslama, çakışma tespiti ve abonelik bulut hizmetleri bağlantılı proje iş akışlarını destekler.' }
  ],
  featuresTitle: 'Parametrik inşaat tasarımına güç veren teknoloji',
  featureGroups: [
    { label: 'Parametrik', items: [
      { title: 'Parametrik modelleme', text: 'İnşaat mühendisliği yapıları için özel dört boyutlu modelleme ve detaylandırma.' },
      { title: 'Köprü modelleme', text: 'Prekast kirişli köprüler dahil köprüleri modelleyin ve detaylandırın.' },
      { title: 'Tünel modelleme', text: 'Tünel yapılarını parametrik inşaat iş akışında modelleyin ve detaylandırın.' },
      { title: 'İstinat duvarları ve gürültü bariyerleri', text: 'İstinat duvarlarını ve gürültü bariyerlerini modelleyin ve detaylandırın.' },
      { title: 'Parametrik ön germe', text: 'Ön germe tendonlarını doğrudan proje modelinde modelleyin.' }
    ] },
    { label: 'Detaylandırma', items: [
      { title: 'Donatı tasarımı', text: 'Çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun.' },
      { title: 'Donatı düzenleme', text: 'Çubukları, grupları, hasırları ve etiketleri düzenlemek için 13 özel palet kullanın.' },
      { title: 'Varsayılan donatı öznitelikleri', text: 'Donatı yerleştirirken temel BIM bilgisini uygulayın.' },
      { title: 'Otomatik kiriş donatısı', text: 'Geliştirilmiş mesnet tanıma, ankraj ve bindirme yönetimi ile daha zengin etriye ve çubuk seçeneklerini kullanın.' },
      { title: 'Otomatik perde donatısı', text: 'Otomatik perde donatısı için 3B cisimleri girdi olarak kullanın.' }
    ] },
    { label: 'Dokümantasyon', items: [
      { title: '2B çizim', text: 'Hassas, özlü ve ayrıntılı çizimler oluşturun.' },
      { title: 'Reinforcement AI Drafter', text: 'Donatı etiketi yerleştirmeyi otomatikleştirerek elle yapılan açıklama işini azaltın.' },
      { title: 'İlişkisel metin çıkma çizgileri', text: 'Görünüşlerde ve kesitlerde metin çıkma çizgilerini değişen geometriye bağlı tutun.' },
      { title: 'Dinamik konturlar', text: 'Karmaşık eğrisel 3B nesneler için görünüşe bağlı konturları ve yakalamayı kullanın.' },
      { title: 'Görünüşlerde nesne gösterimi', text: 'SmartSymbols, PythonParts ve SmartParts nesnelerinin yatay görünüşlerde ve kesitlerde nasıl görüneceğini denetleyin.' }
    ] },
    { label: 'Yönetim', items: [
      { title: 'Cloud BIM Manager', text: 'BIM verilerini ve metrajları tek bir bulut destekli bilgi yönetimi ortamında inceleyin, filtreleyin ve düzenleyin.' },
      { title: 'Mark Numbering', text: 'Elemanları ortak özelliklere göre tarayın, gruplayın ve yapılandırılabilir, yeniden kullanılabilir numaralandırma şemalarıyla numaralandırın.' },
      { title: 'Metraj ve maliyetlendirme', text: 'Modellenen ve modellenmeyen nesneler için hassas ve doğrulanabilir metraj ile maliyetlendirme oluşturun.' },
      { title: 'BIM hazır araç ipuçları', text: 'Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini fareyle üzerine gelince doğrudan gösterin.' },
      { title: 'Referans öznitelikleri', text: 'Reference ID ve Reference Name değerlerini hesaplanan öznitelik olarak kullanın.' }
    ] },
    { label: 'Koordinasyon', items: [
      { title: 'Bilgi modelleme ve yönetimi', text: 'Model bilgisini Bilgi Paleti ile, referans verilen dokümanları Xref Manager ile yönetin.' },
      { title: 'Çakışma tespiti', text: 'Yumuşak ve sert çakışmaları belirleyin.' },
      { title: 'Gruplanmış donatı çakışmaları', text: 'Karmaşık modellerin daha net incelenmesi için donatı çakışmalarını gruplayın.' },
      { title: 'Kesitlerde ve görünüşlerde IFC Xref’leri', text: 'IFC dış referanslarını tam aktarım yapmadan görünüşlerde ve kesitlerde gösterin.' },
      { title: 'IFC4 aktarımı', text: 'IFC4 verilerini geliştirilmiş sınıflandırma ve coğrafi referanslama desteğiyle içe aktarın.' }
    ] },
    { label: 'Bağlantı', items: [
      { title: 'Harici veri kaynakları', text: 'GIS bilgisini, 3B içeriği ve dokuları GIS Connector ve Content Connector ile içe aktarın.' },
      { title: 'Dosya arayüzleri', text: 'IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, LandXML, DWG, DGN, SAF ve daha fazlası dahil arayüzlerle veri alışverişi yapın.' },
      { title: 'Merkezi coğrafi referanslama', text: 'Baz noktasını, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti’nde yönetin.' },
      { title: 'Abonelik bulut hizmetleri', text: 'Abonelik lisanslarıyla Bimplus bulut tabanlı BIM iş birliğini, proje ve ofis ekip çalışmasını, plan dağıtımını ve bulut destekli proje kaynaklarını kullanın.' },
      { title: 'Tasarım denetimi', text: 'Model denetimlerini Solibri Inside aracılığıyla Allplan içinde çalıştırın.' }
    ] }
  ]
};
