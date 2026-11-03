import type { ProductEditionContent } from './product-edition-content';

// Turkish text of the "ALLPLAN Rebar - Edition Web Page" launch document (2027 Launch - Product Marketing Materials).
export const content: ProductEditionContent = {
  path: '/2027/rebar',
  name: 'Allplan Rebar',
  tagline: 'Donatı detaylandırması için BIM yazılımı',
  lead: 'Allplan Rebar; donatı tasarımını, detaylandırmasını, dokümantasyonunu, metrajı ve proje koordinasyonunu tek bir odaklı BIM çözümünde buluşturur. Çubuk, hasır ve BAMTEC donatısı oluşturun, yapay zekâ destekli ve otomatik detaylandırma iş akışlarından yararlanın; koordine donatı çizimlerini ve bilgilerini teslim edin.',
  tags: ['Donatı detaylandırması', 'Otomatik donatı', 'Donatı dokümantasyonu', 'Metraj', 'OpenBIM koordinasyonu'],
  overviewTitle: 'Donatı detaylandırmasına odaklanan BIM çözümü',
  overview: [
    { label: 'Donatı', title: 'Donatıyı detaylandırın', text: 'Çubuk donatı, hasır donatı ve BAMTEC halılarını özel bir donatı iş akışında oluşturun ve detaylandırın. Donatı işlevlerini, eğriler ve yüzeyler için temel 3B modelleme araçlarıyla ve kapsamlı 2B çizim araçlarıyla birleştirerek etkileyici, özlü ve ayrıntılı çizimler hazırlayın.' },
    { label: 'Otomasyon', title: 'Değiştirin ve otomatikleştirin', text: 'Çubuklar, gruplar, hasırlar ve etiketler için 13 donatı düzenleme paletini kullanın. Varsayılan özniteliklerle yönlendirilen yerleştirme temel BIM bilgisini otomatik sağlar; geliştirilmiş otomatik kiriş ve perde donatısı, daha zengin etriye, çubuk, ankraj, bindirme ve mesnet tanıma seçenekleriyle esnek detaylandırma sunar.' },
    { label: 'Dokümantasyon', title: 'Akıllı dokümantasyon', text: 'Otomatik donatı etiketi yerleştirme, etiketlerin ve ölçü çizgilerinin yapay zekâ destekli yeniden konumlandırılması, ilişkisel metin çıkma çizgileri ve görünüşlerde ile kesitlerde yapılandırılabilir nesne gösterimi ile daha net çizimler hazırlayın. Dinamik konturlar ve yakalama, karmaşık eğrisel 3B nesneleri daha doğru ele alır.' },
    { label: 'Koordinasyon', title: 'Koordine edin ve teslim edin', text: 'Bilgileri ve metrajları Cloud BIM Manager ile yönetin; çakışma tespiti ve IFC Xref’leri ile bağlam içinde koordinasyon yapın, standart arayüzlerle veri alışverişi sağlayın. Abonelik bulut hizmetleri BIM iş birliğini, proje ve ofis ekip çalışmasını, çizim dağıtımını ve ortak proje kaynaklarını destekler.' }
  ],
  benefitsTitle: 'Neden Allplan Rebar?',
  benefits: [
    { title: 'Daha hızlı donatı detaylandırma', text: 'Çubuk, hasır ve BAMTEC donatısını donatı işine göre tasarlanmış iş akışlarıyla oluşturun. Özel düzenleme paletleri, geliştirilmiş otomatik kiriş ve perde donatısı ile Reinforcement AI Drafter; model geliştirme ve çizim hazırlığı sırasında tekrarlayan düzenlemeyi ve elle yapılan açıklamaları azaltır.' },
    { title: 'Daha eksiksiz BIM bilgisi', text: 'Donatı yerleştirirken varsayılan öznitelikleri uygulayarak temel BIM bilgisini filtreleme, analiz, koordinasyon, raporlama ve dışa aktarma için hazır hale getirin. Cloud BIM Manager, BIM verilerinin ve metrajların incelenmesini, filtrelenmesini ve düzenlenmesini tek yerde toplar.' },
    { title: 'Daha net, daha uyarlanabilir dokümantasyon', text: 'Otomatik ilişkisel metin çıkma çizgileri, görünüşlerde ve kesitlerde yapılandırılabilir nesne gösterimi ve karmaşık eğrisel nesneler için dinamik konturlarla desteklenen hassas 2B çizimler oluşturun. AI Drafter, daha temiz plan düzenleri için etiketleri ve ölçü çizgilerini otomatik yeniden konumlandırır.' },
    { title: 'Bağlantılı OpenBIM teslimatı', text: 'Donatıyı referans verilen IFC modelleri bağlamında koordine edin, coğrafi referanslamayı tek yerde yönetin ve geliştirilmiş IFC4 aktarımını kullanın. Dosya arayüzleri, çakışma yönetimi, metraj ve abonelik bulut hizmetleri; detaylandırmadan plan dağıtımına kadar bağlantılı proje teslimatını destekler.' }
  ],
  featuresTitle: 'Donatı detaylandırmasına güç veren teknoloji',
  featureGroups: [
    { label: 'Detaylandırma', items: [
      { title: 'Donatı tasarımı', text: 'Çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun.' },
      { title: 'Donatı düzenleme', text: 'Çubukları, grupları, hasırları ve etiketleri düzenlemek için 13 özel palet kullanın.' },
      { title: 'Varsayılan donatı öznitelikleri', text: 'Donatı yerleştirirken temel BIM bilgisini otomatik uygulayın.' },
      { title: 'Otomatik kiriş donatısı', text: 'Geliştirilmiş mesnet tanıma, ankraj ve bindirme yönetimi ile daha zengin etriye ve çubuk seçeneklerini kullanın.' },
      { title: 'Otomatik perde donatısı', text: 'Otomatik perde donatısı için 3B cisimleri girdi olarak kullanın.' }
    ] },
    { label: 'Dokümantasyon', items: [
      { title: 'Reinforcement AI Drafter', text: 'Donatı etiketi yerleştirmeyi otomatikleştirerek elle yapılan açıklama işini azaltın.' },
      { title: 'AI Drafter', text: 'Çakışmaları vurgulayın; etiketleri ve ölçü çizgilerini otomatik yeniden konumlandırın.' },
      { title: '2B çizim', text: 'Hassas, özlü ve ayrıntılı çizimler oluşturun.' },
      { title: 'İlişkisel metin çıkma çizgileri', text: 'Görünüşlerde ve kesitlerde metin çıkma çizgilerini değişen geometriye bağlı tutun.' },
      { title: 'Dinamik konturlar', text: 'Karmaşık eğrisel 3B nesneler için görünüşe bağlı konturları ve yakalamayı kullanın.' }
    ] },
    { label: 'Yönetim', items: [
      { title: 'Cloud BIM Manager', text: 'BIM verilerini ve metrajları tek bir bulut destekli bilgi yönetimi ortamında inceleyin, filtreleyin ve düzenleyin.' },
      { title: 'Mark Numbering', text: 'Elemanları ortak özelliklere göre tarayın, gruplayın ve yapılandırılabilir, yeniden kullanılabilir numaralandırma şemalarıyla numaralandırın.' },
      { title: 'BIM hazır araç ipuçları', text: 'Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini fareyle üzerine gelince doğrudan gösterin.' },
      { title: 'Referans öznitelikleri', text: 'Reference ID ve Reference Name değerlerini hesaplanan öznitelik olarak kullanın.' },
      { title: 'Açıklık katmanları', text: 'Açıklık katmanlarını hem Nesne Paleti’nde hem de Bilgi Paleti’nde görüntüleyin ve düzenleyin.' }
    ] },
    { label: 'Koordinasyon', items: [
      { title: 'Çakışma tespiti', text: 'Yumuşak ve sert çakışmaları belirleyin.' },
      { title: 'Gruplanmış donatı çakışmaları', text: 'Karmaşık modellerin daha net incelenmesi için donatı çakışmalarını gruplayın.' },
      { title: 'Kesitlerde ve görünüşlerde IFC Xref’leri', text: 'IFC dış referanslarını tam aktarım yapmadan görünüşlerde ve kesitlerde gösterin.' },
      { title: 'IFC4 aktarımı', text: 'IFC4 verilerini geliştirilmiş sınıflandırma ve coğrafi referanslama desteğiyle içe aktarın.' },
      { title: 'Merkezi coğrafi referanslama', text: 'Baz noktasını, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti’nde yönetin.' }
    ] },
    { label: 'Bağlantı ve otomasyon', items: [
      { title: 'Dosya arayüzleri', text: 'IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, DWG, DGN, SAF ve daha fazlası dahil arayüzlerle veri alışverişi yapın.' },
      { title: 'PythonPart sürümleme', text: 'Özel komut dosyalı nesnelerin güncellemelerini daha fazla denetimle yönetin.' },
      { title: 'Python API olayları', text: 'Allplan ve proje olaylarında eylemleri otomatikleştirin.' },
      { title: 'Python ile yazdırma düzeni otomasyonu', text: 'Python API ile yazdırma düzeni işlemlerini ve 2B çizim üretimini otomatikleştirin.' },
      { title: 'Abonelik bulut hizmetleri', text: 'Abonelik lisanslarıyla Bimplus iş birliğini, proje ve ofis ekip çalışmasını, plan dağıtımını ve bulut destekli proje kaynaklarını kullanın.' }
    ] },
    { label: 'Yapay zekâ desteği', items: [
      { title: 'AI BIM Analyst', text: 'BIM verilerini istemlere ve proje bağlamına göre filtreleyin, seçin ve çıkarın.' },
      { title: 'AI BIM Modeler', text: 'Yaşam döngüsü değerlendirmesi (LCA) ve maliyet tahminleri için 2B kat planlarından basit Allplan 3B BIM modelleri üretin.' },
      { title: 'AI Formula Writer', text: 'Düz dille yazılmış tanımları kullanıma hazır Allplan formüllerine dönüştürün.' },
      { title: 'AI Coach', text: 'Allplan, FRILO, SCIA ve SDS2 sorularına yapay zekâ tabanlı bilgi asistanından yanıt alın.' },
      { title: 'AI Visualizer', text: 'Fotoğraflardan, BIM ekran görüntülerinden, eskizlerden ve metin istemlerinden tasarım görselleştirmeleri oluşturun.' }
    ] }
  ]
};
