export interface ReleaseNoteItem {
  title?: string;
  ribbon?: string;
  body: string;
  extraParagraphs?: string[];
  notice?: {
    label: string;
    body: string;
  };
  image?: string;
  video?: string;
  poster?: string;
}

export interface ReleaseNoteSubsection {
  heading?: string;
  groupLabel?: string;
  items: ReleaseNoteItem[];
}

export interface ReleaseNoteSection {
  id: string;
  tabLabel: string;
  tabSubtitle: string;
  heading: string;
  intro?: string;
  subsections: ReleaseNoteSubsection[];
}

export interface ReleaseNoteVersion {
  version: string;
  label: string;
  title: string;
  tagline: string;
  releaseDate: string;
  releaseDateIso: string;
  subtitle: string;
  intro: string;
  highlightsHeading: string;
  highlights: string[];
  sections: ReleaseNoteSection[];
}

export const RELEASE_NOTES_2027: readonly ReleaseNoteVersion[] = [
  {
    version: '2027-0-0',
    label: 'Allplan 2027-0-0',
    title: 'Allplan 2027 (28.10.2026)',
    tagline: 'Mühendislik ekipleri için daha fazla kontrol',
    releaseDate: '28.10.2026',
    releaseDateIso: '2026-10-28',
    subtitle:
      'Modelleme, detaylandırma, iş birliği ve standartlara uygun uygulama süreçleri için yapay zekâ destekli, mühendislik odaklı BIM üretim ve teslim platformu',
    intro:
      "Allplan 2027, mühendislik ekiplerine tasarım, detaylandırma ve teslim süreçleri üzerinde daha fazla kontrol sağlar. Yapay zekâ destekli araçlar; firmaların Allplan'ı kendi iş akışlarına göre özelleştirmesine, tekrarlayan donatı detaylandırma ve dokümantasyon görevlerini otomatikleştirmesine ve ihtiyaç duyduklarında uzman desteği almasına yardımcı olur. Aynı zamanda geliştirilen BIM bilgi iş akışları, ekiplerin proje verilerini, metrajları ve dokümantasyonu daha hızlı, tutarlı ve güvenilir biçimde yönetmesini sağlar.",
    highlightsHeading: 'TEMEL AVANTAJLAR:',
    highlights: [
      "Mühendisler için yapay zekâ. Allplan'ı ekibinizin gerçek çalışma biçimine göre özelleştirin.",
      'Donatı detaylandırma iş akışının daha büyük bölümünü otomatikleştirin.',
      'BIM bilgilerini kullanılabilir proje içgörülerine dönüştürün.'
    ],
    sections: [
      {
        id: 'allplan-ai-max',
        tabLabel: 'Allplan AI MAX',
        tabSubtitle: 'Yapay Zekâ Platformu',
        heading: 'Allplan AI MAX – Yapay zekâ destekli platform',
        intro: 'Günlük çizim, modelleme ve görselleştirme iş akışlarında verimliliği ve üretkenliği artırın.',
        subsections: [
          {
            heading: 'FİKİR GELİŞTİRME',
            items: [
              {
                title: 'AI Visualizer',
                ribbon: 'FİKİR GELİŞTİRME',
                body: 'Fotoğrafları, BIM ekran görüntülerini, eskizleri ve metin komutlarını; daha gelişmiş akıl yürütme ve çoklu görsel komutlarını destekleyen yeni difüzyon modelleriyle yüksek kaliteli tasarım görsellerine dönüştürür. Saatler yerine saniyeler içinde etkileyici görseller oluşturarak tasarımın erken aşamalarını hızlandırır, ortak tasarım iş akışlarını destekler ve müşterilerle iletişimi geliştirir.',
                image: '/assets/previews/allplan-max/csm_AI_Visualizer_Before_and_After_384986ee1d.png'
              }
            ]
          },
          {
            heading: 'DEĞERLENDİRME',
            items: [
              {
                title: 'AI BIM Analyst',
                ribbon: 'DEĞERLENDİRME',
                body: 'Komutlara ve proje bağlamına göre Allplan BIM modellerindeki verileri filtreler, seçer ve çıkararak değerli içgörüler üretir. Saatler süren manuel veri filtreleme ve rapor oluşturma işlemlerini dakikalar içinde verilen komutlarla gerçekleştirir; karar alma süreçlerini ve projenin genel durumunu iyileştirirken Allplan BIM modellerinin değerini en üst düzeye çıkarır.',
                video: '/assets/previews/allplan-max/AI-Bim-Analyst_02Cut.mp4',
                poster: '/assets/previews/allplan-max/AI-Bim-Analyst_02Cut.jpg'
              }
            ]
          },
          {
            heading: 'MODELLEME',
            items: [
              {
                title: 'AI BIM Modeler',
                ribbon: 'MODELLEME',
                body: 'Yaşam döngüsü değerlendirmesi (LCA) ve maliyet tahminleri için 2D kat planlarından otomatik olarak basit Allplan BIM modelleri oluşturur. Tasarımların BIM ortamında yeniden modellenmesi için gereken manuel iş yükünü önemli ölçüde azaltır ve milimetre hassasiyetinin gerekli olmadığı model tabanlı iş akışlarını hızlandırır.',
                image: '/assets/previews/allplan-max/csm_AI_BIM_Modeler4_4a3a8d2e3f.png'
              },
              {
                title: 'AI Formula Writer',
                ribbon: 'MODELLEME',
                body: 'AI Formula Writer, doğal dilde yazılmış açıklamaları, temel mantıklarına ilişkin anlaşılır açıklamalarla birlikte kullanıma hazır Allplan formüllerine dönüştürür. Allplan Formulas, değişiklikler yapıldığında modellerin otomatik olarak güncellenmesini veya etiketlerin oluşturulmasının otomatikleştirilmesini sağlar. Daha önce yalnızca uzmanların gerçekleştirebildiği karmaşık formül ifadeleri oluşturma ve mevcut formüllerin mantığını anlama işlemleri artık herkes tarafından kullanılabilir.',
                image: '/assets/previews/allplan-max/csm_AI_Formula_Writer_-_Best_Example_a1d355686c.png'
              },
              {
                title: 'Allplan MCP Server – IDE Entegrasyonu',
                ribbon: 'MODELLEME',
                body: "Allplan'ı harici “vibe-coding” ortamlarına bağlayarak PythonPart'ların ve otomatik iş akışlarının hızla geliştirilmesini sağlar. İleri düzey kullanıcılara ve geliştiricilere yeni özellikler ve özel bileşenler oluşturmak için yüksek hızlı bir betik geliştirme altyapısı sunar; daha karmaşık veya uzmanlaşmış otomasyon görevlerinde AI Parametric Modeler'ı tamamlar.",
                video: '/assets/previews/allplan-max/AI-Feature-Builder_08Cut.mp4',
                poster: '/assets/previews/allplan-max/AI-Feature-Builder_08Cut.jpg'
              }
            ]
          },
          {
            heading: 'DOKÜMANTASYON',
            items: [
              {
                title: 'AI Coach',
                ribbon: 'DOKÜMANTASYON',
                body: 'AI Coach, her kullanıcıyı ileri düzey bir kullanıcıya dönüştürür. Allplan/Frilo/Scia/SDS2 ile ilgili sorularınıza hızlı ve doğru yanıtlar alın. Sektörel uzmanlığı ve tüm bilgi bankamıza erişimi sayesinde AI Coach, 7/24 hizmet veren kurum içi AEC uzmanınızdır.',
                image: '/assets/previews/allplan-max/csm_AI_Coach_final_0bd4132638.png'
              },
              {
                title: 'AI Drafter',
                ribbon: 'DOKÜMANTASYON',
                body: 'Çakışmaları belirler; açıklama ve ölçülendirme çizgilerini, anotasyonların yerleşimini iyileştirmek üzere otomatik olarak yeniden konumlandırır. Böylece planların manuel olarak yeniden düzenlenmesi otomatik bir adıma dönüşür ve teslim için temiz, tutarlı ve okunabilir paftalar elde edilir. AI Drafter işlevi artık birden fazla ilişkisel etiketin tek seferde otomatik olarak oluşturulup yerleştirilmesini de sağlar. Etiketler, ilişkili oldukları elemana göre en uygun konuma yerleştirilir.',
                image: '/assets/previews/allplan-max/csm_AI_Drafter_Final_a89c4205be.png'
              }
            ]
          },
          {
            heading: 'Ajan Tabanlı Mühendislik',
            items: [
              {
                title: 'Allplan MCP Server – Ajan Entegrasyonu',
                ribbon: 'Ajan Tabanlı Mühendislik',
                body: "Allplan'ın yapay zekâ ajan platformlarına ve ajan tabanlı mühendislik iş akışlarına kolayca bağlanmasını sağlar. Proje ekiplerinin Allplan ile diğer araçlar arasında kendi otomasyonlarını oluşturmalarına ve büyük dil modellerinin (LLM) Allplan verilerine ve işlevlerine erişerek doğal dildeki soruları yanıtlamasına yardımcı olur. Kullanım için Allplan MCP Server'ı tercih ettiğiniz yapay zekâ ajan platformuna eklemeniz yeterlidir. Böylece müşteriler, Allplan'ı en az entegrasyon çabasıyla kullanırken ihtiyaçlarına en uygun yapay zekâ ajanı çözümünü seçme esnekliğine sahip olur.",
                video: '/assets/previews/allplan-max/AI-Workflow-Builder_09cut.mp4',
                poster: '/assets/previews/allplan-max/AI-Workflow-Builder_09cut.jpg'
              }
            ]
          }
        ]
      },
      {
        id: 'dijital-modelleme-genel-is-akislari',
        tabLabel: 'Dijital Modelleme',
        tabSubtitle: 'BIM, IFC ve Genel İş Akışları',
        heading: 'Dijital Modelleme ve Genel İş Akışları',
        subsections: [
          {
            heading: 'Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            groupLabel: 'Bina Modellemesi',
            items: [
              {
                title: 'Kapı/Pencere Boşluklarının Daha Kolay Oluşturulması ve Düzenlenmesi',
                ribbon: 'Bina Modellemesi',
                body: 'Kapı ve pencere boşluklarının, tutarlı bir Özellikler Paleti üzerinden doğrudan oluşturulmasını ve düzenlenmesini sağlayan birleşik bir iş akışı sunar. Eski iletişim kutularının yerini alarak daha hızlı ve sezgisel modelleme olanağı sağlar. Bu geliştirme, bina modelleme iş akışlarını sadeleştirir; favorileri ve tam geometrik kontrolü destekler, kullanılabilirliği önemli ölçüde artırır ve oluşturma işlemlerini iki kata kadar hızlandırır.'
              }
            ]
          },
          {
            groupLabel: 'Bilgi Modellemesi ve Yönetimi',
            items: [
              {
                title: 'Poz Numaralandırma',
                ribbon: 'Bilgi Modellemesi ve Yönetimi',
                body: 'Farklı türlerdeki tüm bina ve prefabrik elemanları ortak özelliklerine göre anında tarayan, gruplandıran ve numaralandıran; toleranslara dayalı gruplandırma, akıllı ön ekler/son ekler ve her benzersiz bileşene çakışmasız kimlik ataması sunan otomatik, birleşik ve tamamen yapılandırılabilir bir poz numaralandırma sistemidir. Yeni nesil bu iş akışı poz oluşturma sürecini önemli ölçüde hızlandırır, etiketleme iş yükünü azaltır, disiplinler arası iş birliğini güçlendirir ve her tasarım değişikliğinde otomatik yeniden numaralandırma yaparak tüm görünümlerin, listelerin ve ihale çıktılarının sürekli doğru kalmasını sağlar.',
                extraParagraphs: [
                  'Artık bir veya birden fazla poz numaralandırma şeması seçilerek favorilere kaydedilebilir. Kaydedilen şemalar farklı projelerde yüklenip yeniden kullanılabilir.',
                  'Poz numaralandırmasını etkileyen seçili geometrik öznitelikler (uzunluk, alan ve hacim gibi) için artık toleranslar tanımlanabilir. Böylece poz numarasının hesaplanması açısından önem taşımayan küçük öznitelik farklılıkları göz ardı edilebilir.'
                ],
                image: '/assets/previews/allplan-2027-screens/mark-numbering.jpg'
              },
              {
                title: 'Yeni Bilgi Tablosu – Bulut Tabanlı Bilgi Yönetimi',
                ribbon: 'Bilgi Modellemesi ve Yönetimi',
                body: 'BIM verilerinin ve metrajların incelenmesini, filtrelenmesini ve düzenlenmesini tek merkezde toplayan, bulut destekli yeni bir Bilgi Tablosu olan “Cloud BIM Manager”ı (Information Palette 2.0) sunar. Böylece bilgi yönetimi doğrudan Allplan içinde daha hızlı ve şeffaf bir iş akışıyla gerçekleştirilebilir. Bu modern veri katmanı, günlük metraj (QTO) ve BIM verisi yönetimini iyileştirmenin yanı sıra yeni bilgi yönetimi özelliklerinin daha hızlı sunulmasını ve aynı yeteneklerin gelecekteki Allplan bulut ve masaüstü çözümlerinde yeniden kullanılmasını sağlar. Böylece projeler sürekli yeniliklerden yararlanırken kullanıcılar en değerli kaynakları olan zamandan tasarruf eder.',
                image: '/assets/previews/allplan-2027-features/csm_Cloud_BIM_Manager_-_Grouping_c612c23a54.png'
              },
              {
                title: 'BIM Ready araç ipucu – Öznitelikleri gösteren nesne bilgileri',
                ribbon: 'Bilgi Modellemesi ve Yönetimi',
                body: 'Geliştirilmiş araç ipucu, mevcut CAD verilerinin yanı sıra nesne adı, malzeme ve önemli özel özellikler gibi seçili BIM özniteliklerini imleç nesnenin üzerine getirildiğinde doğrudan görüntüler. Kullanıcı veya proje bazında tamamen yapılandırılabilir öznitelik listeleri sunar ve büyük modellerde de hızlı yanıt verir. Bu geliştirme, bilgilerin doğrudan model üzerinden okunmasını kolaylaştırır, paletleri açma gereksinimini azaltır, öznitelikleri bağlam içinde sunarak BIM verilerinin kalitesini ve standartlara uygunluğunu artırır ve karmaşık BIM projeleriyle daha akıcı, verimli etkileşim kurulmasını sağlar.',
                image: '/assets/previews/allplan-2027-screens/element-tooltips.jpg'
              },
              {
                title: 'Uluslararası Hesaplama Kuralları (TRADE ve IQR Öznitelikleri)',
                ribbon: 'Bilgi Modellemesi ve Yönetimi',
                body: "Alan, hacim ve miktar hesaplamalarını şeffaf, yapılandırılabilir ve güvenli biçimde düzenlenebilir hâle getiren International Quantity Rules (IQR) ve TRADE yönetimini sunar. Bu yapı; bir kural düzenleyicisi, yönetilen TRADE katalogları ve sistem dosyalarına müdahale etmeden uyarlanabilen bölgesel başlangıç şablonlarıyla desteklenir. Yeni sistem sonuçlara duyulan güveni artırır, manuel geçersiz kılma işlemlerini ve “dosya üzerinde yetkisiz değişiklik” ihtiyacını azaltır, uluslararası ofislerin metraj çalışmalarını yerel normlarla uyumlu hâle getirmesini sağlar. Açık hesaplama kurallarını güçlü, grafik arayüz tabanlı özelleştirme olanaklarıyla birleştirerek Allplan'ı küresel kullanıma hazır bir BIM platformu konumuna taşır."
              }
            ]
          },
          {
            groupLabel: 'Birlikte Çalışabilirlik ve İş Birliği İş Akışları',
            items: [
              {
                title: 'Allplan Cowork',
                ribbon: 'Birlikte Çalışabilirlik ve İş Birliği',
                body: "Allplan Share'in yerini alan yeni bulut tabanlı iş birliği hizmetidir. Farklı konumlardaki ekiplerin güvenli ve güvenilir senkronizasyon, kararlı performans ve bulut üzerinden kolay kullanıcı/proje yönetimiyle aynı ortak proje durumu üzerinde çalışmasını sağlar. Bu modern iş birliği katmanı günlük çalışmalarda kararlılığı ve öngörülebilirliği artırır; yerel sunuculara duyulan ihtiyacı ortadan kaldırarak BT iş yükünü azaltır, kurum içi ve dışı iş ortaklarının sisteme dahil edilmesini hızlandırır ve küçük ekiplerden kurumsal ölçekli projelere kadar kolayca ölçeklenir.",
                notice: {
                  label: 'Önemli!',
                  body: "Allplan Cowork şu anda hâlâ geliştirme aşamasındadır ve bu nedenle henüz Allplan'ın resmî olarak yayımlanmış bir bileşeni değildir ve Allplan GmbH tarafından onaylanmamıştır. Bununla birlikte, bu seçeneğin yetenekleri hakkında ilk izlenimi edinmek isterseniz Allplan Cowork'u şimdiden sınırlı bir süre için test ve doğrulama amacıyla etkinleştirebilirsiniz. Bunun için Yardım seçeneğine, ardından Features Lab iletişim kutusuna tıklayın. Features Lab iletişim kutusunda, Allplan Cowork'u Etkinleştir seçeneğinin yanındaki onay kutusunu işaretleyin ve Allplan Cowork açıklamasında verilen bağlantıya tıklayarak deneme lisansını etkinleştirin."
                }
              },
              {
                title: 'TeamWork Ortamında Kesintisiz IFC Veri Alışverişi',
                ribbon: 'Birlikte Çalışabilirlik ve İş Birliği',
                body: 'TeamWork (Workgroup veya Cowork) senaryolarında IFC dışa aktarımı sırasında ekiplerin çalışmaya devam edebilmesini sağlar ve IFC içe aktarımının güvenliğini artırır. Böylece iş birliğindeki darboğazlar azalır ve çok kullanıcılı proje ortamlarında üretkenlik artar.'
              },
              {
                title: 'Kesitlerde/Görünümlerde IFC Harici Referansı',
                ribbon: 'Birlikte Çalışabilirlik ve İş Birliği',
                body: 'IFC harici referanslarının doğrudan görünüm ve kesitlerde görüntülenmesini destekler. Böylece referans verilen IFC modelleri tamamen içe aktarılmalarına gerek kalmadan türetilmiş çizimlerde, paftalarda ve yazdırma/dışa aktarma çıktılarında doğru şekilde görüntülenir. Referans IFC yapıları, yerel Allplan modelinizle birlikte bağlam içinde görüntülenebildiğinden bu yapılar üzerinde donatı detaylandırması yapılabilir; böylece openBIM koordinasyonu, disiplinler arası uyum ve günlük iş birliği geliştirilir.',
                image: '/assets/previews/allplan-2027-screens/ifc-xref.jpg'
              },
              {
                title: 'IFC4 İçe Aktarma Sertifikasyonu',
                ribbon: 'Birlikte Çalışabilirlik ve İş Birliği',
                body: 'IFC4 modelleri için güncel sınıflandırma ve coğrafi referanslama verilerinin içe aktarım desteğiyle daha yüksek kalitede openBIM iş birliği sunar. Veri kalitesini artırır ve temizleme iş yükünü azaltır; koordinasyon ve yeniden içe aktarma döngülerini kısaltır, kamu ihaleleri ve openBIM tabanlı projelerde yeterliliğinizi ve rekabet gücünüzü artırır.'
              },
              {
                title: 'Coğrafi Referans Ayarlarının Merkezi Yönetimi',
                ribbon: 'Birlikte Çalışabilirlik ve İş Birliği',
                body: "Coğrafi referans ayarlarını merkezi olarak yönetme olanağı sunar. Tüm temel coğrafi bilgileri, kullanıcı dostu tek bir Özellikler Paleti'nde toplayarak kullanıcıların proje koordinatlarını Baz noktası, Ölçüm noktası ve Allplan orijini üzerinden açıkça tanımlamasına ve kontrol etmesine imkân verir. IFC içe aktarma sürecini ileri bir seviyeye taşıyan ve daha özelleşmiş DWG/DGN/DXF dışa aktarma seçenekleri sunan, baştan sona iyileştirilmiş bir IFC iş akışı sağlar. Coğrafi referanslama iş akışlarını daha akıcı ve anlaşılır hâle getirir, veri hassasiyetini ve diğer uygulamalarla koordinat uyumunu artırır. Ayrıca coğrafi referanslı PDF dışa aktarımını mümkün kılar; böylece yetkili kurumlar ve proje paydaşları, uyumlu görüntüleyiciler üzerinden projenin konumunu ve koordinat bağlamını kolayca inceleyebilir.",
                image: '/assets/previews/allplan-2027-screens/georeferencing.jpg'
              }
            ]
          },
          {
            groupLabel: 'Genel',
            items: [
              {
                title: 'Geliştirilmiş İlişkisel Yazı Okları',
                ribbon: 'Genel',
                body: 'Görünüm ve kesitlerdeki ilişkisel etiketler için otomatik yazı okları sunar. Geometri değiştiğinde etiketlerle bağlantısını koruyan oklar etiketlerle birlikte oluşturulur ve güncellenir. Okların ağırlık merkezini, en yakın noktayı veya kullanıcı tarafından belirlenen özel bir konumu göstermesi seçilebilir. Bu geliştirme, güncellemelerden sonra ok eklemek ve yeniden oluşturmak için gereken manuel işi önemli ölçüde azaltarak günlük dokümantasyonda anotasyon iş akışlarını daha hızlı, düzenli ve güvenilir hâle getirir.',
                image: '/assets/previews/allplan-2027-screens/associative-leaders.jpg'
              },
              {
                title: 'Grafik Geçersiz Kılma – Pafta Elemanı Oluşturma',
                ribbon: 'Genel',
                body: 'Paftalarda her bir eleman için ayrı Grafik Geçersiz Kılma ayarları sunar. Önceki özellik iletişim kutusunun yerini alan özel “Grafik Geçersiz Kılma” özelliği de dahil olmak üzere, her pafta elemanı için farklı grafik geçersiz kılma kombinasyonlarının doğrudan Özellikler Paleti üzerinden atanmasını, önizlenmesini ve çıktısının alınmasını sağlar. Böylece tasarımcılar tek bir pafta üzerinde esnek sunum kontrolüne sahip olur; yalnızca görsel düzenleme amacıyla çizimlerin çoğaltılması veya değiştirilmesi önlenir ve dosya karmaşası azalır. Pafta düzeyindeki ayarların genel model görünümlerini etkilememesi ve dışa aktarılan çıktıların ekrandaki önizlemeyle birebir eşleşmesi de güvence altına alınır.'
              },
              {
                title: 'Genel 3D Nesneler için Dinamik Konturlar',
                ribbon: 'Genel',
                body: 'Genel 3D nesneler için görünüme bağlı dinamik konturlar sunar. Düzenlenmiş çelik profiller ve köprü yapıları gibi karmaşık eğrisel geometrilerin tüm standart görünüm pencerelerinde hassas kontur gösterimini ve yakalamayı sağlar. Bu geliştirme, kontur ve yakalama desteğini basit geometrik ilkel nesnelerin ötesine taşıyarak birleştirilmiş ve düzenlenmiş B-Rep biçimlerini de kapsar; gelişmiş 3D formların modellenmesini, detaylandırılmasını ve ölçülendirilmesini daha hassas ve sezgisel hâle getirir.',
                image: '/assets/previews/allplan-2027-screens/curved-contours.jpg'
              },
              {
                title: 'Yatay Görünüm ve Kesitlerde Nesnelerin Değişken Gösterimi',
                ribbon: 'Genel',
                body: "Nesnelerin (SmartSymbols, PythonPart'lar, SmartParts) yatay görünüm ve kesitlerde nasıl gösterileceği (kat planı gösterimi) üzerinde daha fazla kontrol sağlar. Bu sayede manuel çizim düzeltmeleri azalırken daha açık ve standartlarla uyumlu dokümantasyon üretilebilir.",
                image: '/assets/previews/allplan-2027-screens/object-representation.jpg'
              },
              {
                title: 'Toolscape Kullanıcı Arayüzü Yapılandırması',
                ribbon: 'Genel',
                body: "Siz Allplan'a uyum sağlamak yerine Allplan çalışma biçiminize uyum sağlasaydı nasıl olurdu? Toolscape Yapılandırması'nın temelinde bu fikir yer alır. Toolscape, Allplan'da tamamen özelleştirilebilir ve birleşik bir çalışma alanı vizyonumuzdur. Yıllar boyunca kullanıcılardan alınan geri bildirimlerle geliştirilen bu yapı, önceki tüm kullanıcı arayüzü yapılandırmalarının en iyi özelliklerini esnek bir çözümde bir araya getirir: İstenilen yere sabitlenebilen araç setleri, kişisel sıraya göre düzenlenebilen favoriler, genel arama ve gerçek iş akışlarını temel alan bir yapı. Allplan 2027 ile Toolscape, Toolscape deneyiminin merkezinde yer alan Toolboard'a odaklanan yeni bir yapılandırma seçeneği olarak sunuluyor. Bu deneyimi daha da geliştirmek ve daha fazla esneklik sağlamak için geri bildirimleri yakından takip edecek ve her ayrıntıyı iyileştireceğiz."
              },
              {
                title: 'Geliştirilmiş Ürün Kalitesi ve Kararlılığı',
                ribbon: 'Genel',
                body: 'Kararsızlıkları ve kullanıcıların sık karşılaştığı sorunları azaltmak amacıyla ürün kalitesinin iyileştirilmesine odaklanır. Kullanıcılar daha az kesinti ve iş kaybı riskiyle günlük çalışmalarında daha güvenilir bir deneyim elde eder.'
              },
              {
                title: 'Açıklık Katmanları Desteği',
                ribbon: 'Genel',
                body: "Açıklık katmanları artık hem Nesne Paleti'nde hem de Bilgi Paleti'nde (Cloud BIM Manager) doğrudan görüntülenebilir ve düzenlenebilir."
              },
              {
                title: 'Reference ID ve Reference Name Öznitelikleri',
                ribbon: 'Genel',
                body: '“Reference ID” ve “Reference Name” öznitelikleri artık hesaplanan öznitelikler olarak kullanılabilir.'
              },
              {
                title: 'Geliştirilmiş bSDD Sınıfı İçe Aktarımı',
                ribbon: 'Genel',
                body: 'Sınıf URI değerini depolamak için yeni “bSDD URI” özniteliği otomatik olarak doldurulur.'
              }
            ]
          }
        ]
      },
      {
        id: 'muhendislik-donati-detaylandirma',
        tabLabel: 'Mühendislik (Donatı)',
        tabSubtitle: 'Donatı Detaylandırma',
        heading: 'Mühendislik (Donatı Detaylandırma) İş Akışları',
        subsections: [
          {
            heading: 'Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'Anında BIM İş Akışları için Daha Akıllı Donatı Düzenleme ve Varsayılan Öznitelikler',
                ribbon: 'Donatı Detaylandırma',
                body: 'Donatı iş akışının tüm adımlarını kapsayan 13 yeni düzenleme paleti (donatı çubuğu yerleşimleri, donatı grupları, hasır donatı yerleşimi, donatı çubuğu ve hasır donatı etiketleri) ve daha hızlı, tutarlı donatı kurulumu sağlayan varsayılan öznitelik odaklı yerleştirme iş akışlarıyla donatı detaylandırmasını geliştirir. Bu iyileştirmeler tekrarlayan işleri, geçici çözüm adımlarını ve bekleme sürelerini önemli ölçüde azaltır. Donatıların düzenlenmesini, raporlanmasını ve dışa aktarılmasını kolaylaştırarak kullanıcıların günde binlerce tıklamadan tasarruf etmesini ve daha yüksek katma değerli işlere odaklanmasını sağlar. Ayrıca varsayılan donatı öznitelikleri otomatik olarak atanır; böylece temel BIM bilgileri hemen kullanılabilir hâle gelir ve ek manuel ayarlara gerek kalmadan donatı bilgilerinin filtrelenmesi, analiz edilmesi ve koordine edilmesi hızlanır.',
                image: '/assets/previews/allplan-2027-screens/reinforcement-modification.jpg'
              },
              {
                title: 'Daha Akıllı Kiriş ve Duvar Otomatik Donatısı – Daha Güvenilir, Daha Esnek, Daha Güçlü',
                ribbon: 'Donatı Detaylandırma',
                body: 'Modernize edilmiş Otomatik Kiriş Donatısı işleviyle otomatik donatı uygulamalarını geliştirir; daha akıllı mesnet tanıma, kenetlenme mantığı, bindirme yönetimi ve daha zengin etriye/donatı çubuğu seçenekleri sunar. Ayrıca Otomatik Duvar Donatısı için artık 3D cisimler girdi olarak kullanılabilir. Böylece 3D eleman tabanlı duvar detaylandırma iş akışları mümkün olur; tipik yerleşimlere uygunluk artar ve günlük projelerde kiriş ve duvar donatılarının uygulanması daha esnek ve verimli hâle gelir.',
                image: '/assets/previews/allplan-2027-screens/beam-reinforcement.jpg'
              },
              {
                title: 'Donatı AI Drafter',
                ribbon: 'Donatı Detaylandırma',
                body: 'Donatı çizimlerindeki manuel anotasyon iş yükünü azaltmak için donatı etiketlerinin yerleştirilmesini otomatikleştirir. Etiketleme iş akışlarını iyileştirir ve çizim hazırlığında önemli ölçüde zaman kazandırır.',
                image: '/assets/previews/allplan-2027-screens/reinforcement-ai-drafter.jpg'
              },
              {
                title: 'Grup Çakışmalarının Yönetimi',
                ribbon: 'Donatı Detaylandırma',
                body: 'Karmaşık donatı modellerinde çok sayıda münferit çakışmayı anlamak kısa sürede zorlaşabilir ve koordinasyon sürecini yavaşlatabilir. Yeni Grup Çakışması işlevi sayesinde genel durumu net biçimde takip etmek ve bilinçli düzenlemeler yapmak çok daha kolaydır.',
                image: '/assets/previews/allplan-2027-screens/clash-groups.jpg'
              }
            ]
          }
        ]
      },
      {
        id: 'yapim-is-akislari',
        tabLabel: 'Yapım İş Akışları',
        tabSubtitle: 'Şantiye ve Geoteknik',
        heading: 'Yapım İş Akışları',
        subsections: [
          {
            heading: 'Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'Yapım Aşamaları',
                ribbon: 'Yapım İş Akışları',
                body: 'Koordineli bir iş akışı içinde yapım aşamalarını simüle etmek için entegre araçlar sunar. Yapım sıralarının daha doğru temsil edilmesini sağlar, planlama güvenilirliğini artırır ve karmaşık şantiye koşullarının tek bir model üzerinden yönetilmesini destekler.',
                image: '/assets/previews/solutions/construction-web.jpg'
              },
              {
                title: 'Sondaj Verisi Girişi',
                ribbon: 'Yapım İş Akışları',
                body: 'Allplan ve DC-Software birleşmesinin ardından 2027 sürümü, tamamen entegre bir zemin tabakası iş akışı da sunar. Bu iş akışı, kullanıcıların sondaj verilerini doğrudan Allplan BIM ortamında hesaplanmış zemin tabakalarına dönüştürmesini sağlar; böylece uygulamalar arasında geçiş yapma veya yerel bir DC-Integra kurulumu bulundurma gereksinimi ortadan kalkar.',
                image: '/assets/previews/frilo/editions/frilo-geotechnics-soil-mechanics.jpg'
              }
            ]
          }
        ]
      },
      {
        id: 'altyapi-is-akislari',
        tabLabel: 'Altyapı İş Akışları',
        tabSubtitle: 'Civil, Road ve DTM',
        heading: 'Altyapı İş Akışları',
        subsections: [
          {
            heading: 'Allplan Civil – Yeni Özellikler ve İş Akışları',
            items: [
              {
                title: 'Her Şekilde Parametrik Izgara – Parametrik Dizi',
                ribbon: 'Allplan Civil',
                body: 'Altyapı yapıları için Parametrik Izgara özelliğini sunar. Bu özellik, çapraz çerçeveler, aydınlatma direkleri, kafes kiriş bileşenleri veya kolonlar gibi tekrarlanan elemanların yalnızca birkaç parametre kullanılarak referans çizgileri ve akslar boyunca yerleştirilmesine ve düzenlenmesine olanak tanır. Yeni iş akışı, girilen tüm verileri daha sonra düzenlenebilmek üzere saklar; hem “eleman sayısına göre” hem de “aralığa göre” dağıtımı destekler. Nesneleri silip yeniden oluşturmaya gerek kalmadan adım aralıklarının veya kilometraj değerlerinin kolayca değiştirilmesini sağlayarak hassas, tutarlı ve son derece verimli bir yerleşim sunar.',
                image: '/assets/previews/allplan-2027-features/csm_1.WEB_NEW-Automatic_Parametric_Axis_Grid_-_Kopie_3c6fb46745.png'
              }
            ]
          },
          {
            heading: 'Allplan Road ve DTM – Yeni Özellikler ve İş Akışları',
            items: [
              {
                title: 'İki Sayısal Arazi Modelini Birleştirme',
                ribbon: 'Allplan Road ve DTM',
                body: 'İki sayısal arazi modeli artık önemli ayrıntılar korunarak daha verimli biçimde birleştirilebilir. Bu özellik, arazi hazırlığında zaman kazandırır ve sonraki tasarım çalışmalarının doğruluğu için daha sağlam bir temel oluşturur.',
                image: '/assets/previews/allplan-civil-2027/civil-hero.jpg'
              },
              {
                title: 'Otomatik ve İlişkisel Yol Önizlemesi',
                ribbon: 'Allplan Road ve DTM',
                body: 'Tamamen ilişkisel ve gerçek zamanlı bir enkesit modelleme ortamı sunarak tasarımcıların her parametre değişikliğinin etkisini anında görmesini ve kontrol etmesini sağlar. Sonuç; kullanıcı güvenini artıran ve yeniden çalışma ihtiyacını azaltan daha hızlı, sezgisel ve tamamen BIM uyumlu bir iş akışıdır.'
              },
              {
                title: 'Düşey Trafik İşaretlemesi',
                ribbon: 'Allplan Road ve DTM',
                body: 'Geometriyi dikkate alan yerleştirme ve yönlendirme özellikleriyle düşey trafik işaretlemesinin daha otomatik yönetilmesini sağlar. Yol işaretlerinin tasarım doğruluğunu artırır ve güzergâh değiştiğinde gereken manuel düzenlemeleri azaltır.'
              }
            ]
          }
        ]
      },
      {
        id: 'ucuncu-taraf-gelistiriciler',
        tabLabel: 'Python API',
        tabSubtitle: 'Geliştirici Yenilikleri',
        heading: 'Üçüncü Taraf Geliştiricilere Yönelik Yenilikler',
        subsections: [
          {
            heading: 'Yeni veya Geliştirilmiş Python API Yetenekleri',
            items: [
              {
                title: 'PythonPart Sürüm Yönetimi',
                ribbon: 'Python API',
                body: 'PythonPart sürüm yönetimi, özel betiklerle oluşturulmuş nesneler güncellenirken kullanıcılara daha fazla kontrol sağlar. İstenmeyen model değişiklikleri riskini azaltır ve projelerin zaman içinde kararlı kalmasına yardımcı olur.',
                image: '/assets/previews/allplan-max/AI-Feature-Builder_08Cut.jpg'
              },
              {
                title: 'Allplan ve Projeyle İlgili Python API Olayları',
                ribbon: 'Python API',
                body: 'Olay tabanlı Python API tetikleyicileri artık Allplan ve projeyle ilgili önemli aşamalarda işlemleri otomatikleştirebilir. Kullanıcılar manuel iş yükünü azaltabilir, kalite kontrollerini otomatik olarak destekleyebilir ve daha akıllı arka plan iş akışları oluşturabilir.'
              },
              {
                title: 'PythonPart Bağlam Menüsünü Özelleştirme',
                ribbon: 'Python API',
                body: 'PythonPart bağlam menüleri artık en ilgili işlemlere daha kolay erişilebilmesi için özelleştirilebilir. Kullanıcılar daha akıcı bir iş akışı, araçlara daha hızlı erişim ve özel nesnelerle çalışırken daha iyi bir deneyim elde eder.'
              },
              {
                title: 'Python API ile 2D Çizim Oluşturmak için Ölçülendirme Nesneleri Desteği',
                ribbon: 'Python API',
                body: 'Otomatik 2D çizim üretimi için ölçülendirme nesneleri artık Python API aracılığıyla oluşturulabilir ve yönetilebilir. Bu özellik, tekrarlayan çizim işlerini azaltmaya ve daha hızlı, ölçeklenebilir dokümantasyon iş akışları oluşturmaya yardımcı olur.'
              }
            ]
          }
        ]
      },
      {
        id: 'bulut-odakli-yenilikler',
        tabLabel: 'Bulut Yenilikleri',
        tabSubtitle: 'Bimplus & Connect',
        heading: 'BULUT ODAKLI YENİLİKLER',
        subsections: [
          {
            heading: 'Bimplus',
            groupLabel: 'Allplan Bimplus – Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'BCF 3.0',
                ribbon: 'Allplan Bimplus',
                body: 'Sorunların daha iyi paylaşılması ve birlikte çalışabilirliğin geliştirilmesi için BCF 3.0 sürümünün tam içe ve dışa aktarım desteğini sağlar.',
                image: '/assets/previews/allplan-2027-screens/cloud-bim-manager.jpg'
              },
              {
                title: 'Örtüşüm Yöneticisinde Kırpma',
                ribbon: 'Allplan Bimplus',
                body: 'Netliği ve görselleştirmeyi iyileştirmek için paftanın/çizimin belirli bir alanını hassas biçimde tanımlamayı ve bu alana odaklanmayı sağlar.'
              },
              {
                title: 'Ortografik Görünüm',
                ribbon: 'Allplan Bimplus',
                body: '2D örtüşüm katmanları ile 3D modellerin daha iyi koordine edilmesini sağlar. Görünüm ayrıca Issue Manager sahnelerinde ve Project Slideshows sunumlarında saklanır ve BCF iş akışlarında dikkate alınır.'
              },
              {
                title: 'IFC Dosyasından Modele Aktarım',
                ribbon: 'Allplan Bimplus',
                body: 'Seçilen IFC dosyalarının Doküman Yönetimi bölümünden Modeller bölümüne sorunsuz biçimde aktarılmasını sağlar.'
              },
              {
                title: 'Bluebeam Entegrasyonu',
                ribbon: 'Allplan Bimplus',
                body: 'Almanya sunucuları için destek sunarak kullanıcıların ABD ve Almanya Bluebeam Studio sunucuları arasında seçim yapmasına olanak tanır.'
              }
            ]
          },
          {
            groupLabel: 'Allplan Bimplus Eklentileri – Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'MS Excel Uygulaması',
                ribbon: 'Allplan Bimplus Eklentileri',
                body: 'Artık Excel tablosunda yalnızca seçili nesnelerin görüntülenmesini ve bunlarla çalışılmasını sağlayan Dynamic View özelliğinin yanı sıra içe aktarma sırasında eksik yapı elemanı miktarlarını hesaplayan otomatik Temel Miktar Hesaplama özelliğini de içerir.'
              },
              {
                title: 'MS Excel SAF Uygulaması',
                ribbon: 'Allplan Bimplus Eklentileri',
                body: 'Optimizasyonlar ve uyumluluk iyileştirmeleri.'
              }
            ]
          },
          {
            groupLabel: 'Allplan Model Viewer – Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'Allplan Model Viewer Dosya Biçimleri',
                ribbon: 'Allplan Model Viewer',
                body: "Model Viewer artık IFC'ye ek olarak glTF, GLB ve OBJ dosya biçimlerini de destekler."
              }
            ]
          },
          {
            heading: 'Connect',
            groupLabel: 'Yeni veya Geliştirilmiş Özellikler ve İş Akışları',
            items: [
              {
                title: 'Project Space',
                ribbon: 'Allplan Connect',
                body: 'Pafta dosyalarının doğrudan Allplan içinden Allplan Connect aracılığıyla dağıtılmasını sağlar.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export function getReleaseNote2027(version: string): ReleaseNoteVersion | undefined {
  return RELEASE_NOTES_2027.find((entry) => entry.version === version);
}
