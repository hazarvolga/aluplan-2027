import Link from 'next/link';
import { getAllPlaylists } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

const allPlaylists = getAllPlaylists();
const playlistByUrl = new Map(allPlaylists.map((playlist) => [playlist.url, playlist]));

const VIDEO_LIBRARY_ITEMS: { title: string; description: string; url: string }[] = [
  {
    title: 'Allplan 2026',
    description: 'Allplan 2026 sürümü için hazırlanmış kapsamlı eğitim videoları ve yenilikler.',
    url: 'https://youtube.com/playlist?list=PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x&si=BSEJvgjsQWgbIwVe'
  },
  {
    title: 'Youtube Allplan English',
    description: 'Allplan global İngilizce içerikleri, uluslararası örnekler ve eğitimler.',
    url: 'https://www.youtube.com/@ALLPLANEnglish'
  },
  {
    title: 'Youtube Allplan Global',
    description: 'Dünya genelinden Allplan kullanıcı hikayeleri ve küresel etkinlikler.',
    url: 'https://www.youtube.com/@ALLPLANglobal'
  },
  {
    title: 'Youtube Allplan Precast',
    description: 'Prekast beton tasarımı ve üretimi üzerine özelleşmiş Almanca/İngilizce içerikler.',
    url: 'https://www.youtube.com/c/AllplanPrecast'
  },
  {
    title: 'Allplan ile Tanışın: Tüm Disiplinler İçin Temel Eğitim Videoları',
    description: 'Allplan 2024 sürümü ile gelen tüm yeniliklerin Türkçe anlatımı.',
    url: '/solutions-v2/training/video-library/hello-allplan-2024'
  },
  {
    title: 'Allplan Add On Geometry Tools',
    description: 'Topografik ve geometrik düzenleme araçları, arazi modelleme eğitimleri.',
    url: '/solutions-v2/training/video-library/addon-geometry'
  },
  {
    title: 'AX3000 - MEP & Enerji',
    description: 'Mekanik, Elektrik, Tesisat ve Enerji Kimlik Belgesi (EKB) eğitimleri.',
    url: '/solutions-v2/training/video-library/ax3000'
  },
  {
    title: 'Youtube CDS Allplan Add-On',
    description: 'CDS (Campus Delivery System) ve eklenti geliştirmeleri üzerine videolar.',
    url: '#'
  },
  {
    title: 'Allplan Road Design Workflow',
    description: 'Yol tasarımı iş akışları ve yol modülü eğitim videoları.',
    url: '/solutions-v2/training/video-library/road-design'
  },
  {
    title: 'Allplan Bridge Workflows',
    description: 'Köprü tasarımı süreçleri ve BIM entegrasyonu.',
    url: '/solutions-v2/training/video-library/bridge-workflows'
  },
  {
    title: 'Campus Tutorials (Deutsch)',
    description: 'Öğrenciler için detaylı Almanca eğitim serisi.',
    url: '/solutions-v2/training/video-library/campus-de'
  },
  {
    title: 'Campus Tutorials (English)',
    description: 'Öğrenciler için kapsamlı İngilizce eğitim serisi.',
    url: '/solutions-v2/training/video-library/campus-en'
  },
  {
    title: 'Allplan Bridge',
    description: 'Allplan Bridge modülünün genel tanıtımı ve özellikleri.',
    url: '#'
  },
  {
    title: 'Allplan Bridge Tutorials',
    description: 'Adım adım köprü modelleme ve analiz rehberleri.',
    url: '#'
  },
  {
    title: 'SDS2 Detaylandırma',
    description: 'SDS2 ürün tanıtımı ve lansman videoları.',
    url: '/solutions-v2/training/video-library/sds2-intro'
  },
  {
    title: 'Konut İnşaatı İş Akışları',
    description: 'Konut proje teslimi, tasarım ve şantiye planlama süreçleri.',
    url: '/solutions-v2/training/video-library/konut-insaati'
  },
  {
    title: 'Bridge Workflow 2022',
    description: '2022 Köprü tasarımı ve iş akışları eğitim serisi.',
    url: '/solutions-v2/training/video-library/bridge-workflow-2022'
  },
  {
    title: 'Otomatik Donatı (PythonPart)',
    description: 'Otomatik donatılandırma ve PythonPart araçları kullanımı.',
    url: '/solutions-v2/training/video-library/otomatik-donati'
  },
  {
    title: 'ALLPLAN QuickStart: Buildings',
    description: 'Allplan ile bina modellemeye hızlı başlangıç rehberi (9 Ders).',
    url: '/solutions-v2/training/video-library/quickstart-buildings'
  },
  {
    title: 'ALLPLAN for Reinforcement',
    description: 'Betonarme detaylandırma, donatı modelleme ve raporlama eğitimleri (18 Video).',
    url: '/solutions-v2/training/video-library/allplan-reinforcement'
  },
  {
    title: 'Allplan Campus Tutorials 2019-2022',
    description: 'Öğrenciler için kapsamlı Almanca eğitim serisi (2019-2022).',
    url: '/solutions-v2/training/video-library/campus-tutorials-2019-2022'
  },
  {
    title: 'ALLPLAN Pythonparts Youtube Kanalı',
    description: 'PythonParts ile parametrik obje geliştirme ve script örnekleri.',
    url: '#'
  }
];

export function VideoLibraryHubSection() {
  return (
    <section className="preview-section" aria-labelledby="all-playlists-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-regular)' }}>
          <span className="preview-kicker">GÖRSEL EĞİTİM · VİDEO KÜTÜPHANESİ</span>
          <h2 id="all-playlists-heading" className="alu-h1">
            Önerilen Oynatma Listeleri ve Kanallar
          </h2>
          <p className="alu-body preview-meta" style={{ maxWidth: 'var(--container-application-meta)' }}>
            Sizin için derlediğimiz en popüler ve faydalı video kaynak liste ve kanalları.
          </p>
        </div>

        <div className="alu-yt-banner">
          <div className="alu-yt-banner__watermark" aria-hidden="true">
            <AluIcon name="youtube" size="lg" />
          </div>
          <div className="alu-yt-banner__content">
            <div className="alu-yt-banner__badge">
              <span className="alu-yt-banner__badge-icon">
                <AluIcon name="youtube" size="sm" />
              </span>
              <span>Resmi Kanal</span>
            </div>
            <h3 className="alu-yt-banner__title">
              Allplan Türkiye YouTube Kanalına Abone Olun
            </h3>
            <p className="alu-yt-banner__desc">
              En yeni eğitim videoları, ipuçları, webinar kayıtları ve sektörel gelişmelerden anında haberdar olmak için kanalımıza abone olmayı unutmayın.
            </p>
          </div>
          <div className="alu-yt-banner__action">
            <a
              href="https://www.youtube.com/@AllplanTurkey?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="alu-yt-subscribe-btn"
            >
              <AluIcon name="youtube" size="md" />
              <span>ABONE OL</span>
            </a>
          </div>
        </div>

        <div className="alu-yt-grid">
          {VIDEO_LIBRARY_ITEMS.map((item, idx) => {
            const isInternal = item.url.startsWith('/solutions-v2');
            const isExternal = item.url.startsWith('http');
            const matchedPlaylist = isInternal ? playlistByUrl.get(item.url) : undefined;
            const cardClassName = `alu-yt-card${
              isInternal ? ' alu-yt-card--internal' : ''
            }`;

            const cardInner = (
              <>
                <div className="alu-yt-card__top">
                  <div className="alu-yt-card__icon">
                    <AluIcon name="youtube" size="lg" />
                  </div>
                  {matchedPlaylist && (
                    <span className="alu-yt-card__count">
                      {matchedPlaylist.count} Video
                    </span>
                  )}
                </div>

                <h3 className="alu-yt-card__title">{item.title}</h3>

                <p className="alu-yt-card__desc">{item.description}</p>

                <div className="alu-yt-card__footer">
                  <span>İzleme Listesini İncele</span>
                  <AluIcon name="external-link" size="sm" />
                </div>

                <div className="alu-yt-card__watermark" aria-hidden="true">
                  <AluIcon name="circle-play" size="lg" />
                </div>
              </>
            );

            if (isInternal) {
              return (
                <Link key={`${item.title}-${idx}`} href={item.url} className={cardClassName}>
                  {cardInner}
                </Link>
              );
            }

            return (
              <a
                key={`${item.title}-${idx}`}
                href={item.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={cardClassName}
              >
                {cardInner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
