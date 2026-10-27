import Link from 'next/link';

import type { PageRecord } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { DirectoryCategoryIcon } from './DirectoryCategoryIcon';

type AboutEditorialSectionProps = {
  page: PageRecord;
};

export function AboutEditorialSection({ page }: AboutEditorialSectionProps) {
  const storySection = page.sections.find((section) => section.heading === 'Hikayemiz');
  const storyParagraphs = storySection?.items ?? [
    "Aluplan Program Sistemleri, 1995 yılından bu yana Türkiye'de ALLPLAN yazılımlarının tek yetkili distribütörü olarak hizmet vermektedir. Kurulduğumuz günden bu yana, mimari, mühendislik ve inşaat sektörünün dijital dönüşümüne öncülük ediyoruz.",
    "ALLPLAN'ın güçlü BIM çözümlerini Türkiye pazarına sunarak, binlerce projenin başarıyla tamamlanmasına katkıda bulunduk. Mimari tasarımdan yapısal analize, köprü mühendisliğinden prekast üretime kadar geniş bir yelpazede profesyonel yazılım çözümleri ve danışmanlık hizmetleri sunuyoruz.",
    "Deneyimli ve sertifikalı uzman kadromuzla, müşterilerimize sadece yazılım tedarik etmekle kalmıyor, aynı zamanda kapsamlı eğitim, teknik destek ve proje danışmanlığı hizmetleriyle yanlarında oluyoruz. İstanbul Ataşehir'deki merkez ofisimizden Türkiye genelindeki kamu kurumlarına, üniversitelere, mimarlık ve mühendislik ofislerine, inşaat firmalarına hizmet veriyoruz."
  ];

  const corporateMetrics = [
    { value: '29+', label: 'Yıllık Tecrübe', meta: '1995’ten Beri Türkiye Distribütörü' },
    { value: '500+', label: 'Aktif Müşteri', meta: 'Kamu, Kurumsal & Mühendislik Ofisleri' },
    { value: '50+', label: 'Uzman Kadro', meta: 'BIM Danışmanlığı & Teknik Destek' },
    { value: '10K+', label: 'Tamamlanan Proje', meta: 'Üstyapı, Köprü, Altyapı & Prekast' }
  ];

  const corporateValues = [
    {
      num: 'I',
      icon: 'target',
      title: 'Misyonumuz',
      description:
        page.sections.find((section) => section.heading === 'Misyonumuz')?.items[0] ??
        "Türkiye'de BIM teknolojilerinin yaygınlaşması ve mimari/mühendislik projelerinin dijital dönüşümüne öncülük etmek."
    },
    {
      num: 'II',
      icon: 'users',
      title: 'Müşteri Odaklılık',
      description:
        page.sections.find((section) => section.heading === 'Müşteri Odaklılık')?.items[0] ??
        'Müşterilerimizin başarısı bizim başarımızdır. Profesyonel destek ve danışmanlık hizmetimizle her zaman yanınızdayız.'
    },
    {
      num: 'III',
      icon: 'award',
      title: 'Kalite ve Uzmanlık',
      description:
        page.sections.find((section) => section.heading === 'Kalite ve Uzmanlık')?.items[0] ??
        'Sertifikalı uzman kadromuz ve sürekli eğitimlerimizle sektörün en kaliteli hizmetini sunuyoruz.'
    },
    {
      num: 'IV',
      icon: 'trending-up',
      title: 'Sürekli İnovasyon',
      description:
        page.sections.find((section) => section.heading === 'Sürekli İnovasyon')?.items[0] ??
        'Teknolojinin nabzını tutarak, en güncel çözümleri müşterilerimize sunmak için çalışıyoruz.'
    }
  ];

  const mapEmbed = page.embeds?.[0];

  return (
    <div className="alu-about-editorial">
      {/* 1. Corporate Key Metrics Ledger */}
      <section className="alu-about-metrics-band" aria-label="Kurumsal Göstergeler">
        <div className="alu-container">
          <div className="alu-about-metrics">
            {corporateMetrics.map((metric) => (
              <div key={metric.label} className="alu-about-metric">
                <span className="alu-about-metric__value">{metric.value}</span>
                <span className="alu-about-metric__label">{metric.label}</span>
                <span className="alu-about-metric__meta">{metric.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Asymmetric Editorial Story ("Hikayemiz") */}
      <section className="preview-section" aria-labelledby="about-story-heading">
        <div className="alu-container">
          <div className="alu-about-story">
            <aside className="alu-about-story__aside">
              <span className="preview-kicker">KURUMSAL PROFİL · 1995’TEN BUGÜNE</span>
              <h2 id="about-story-heading" className="alu-h1" style={{ margin: 0 }}>
                Hikayemiz
              </h2>
              <blockquote className="alu-about-quote">
                “Türkiye’de mimari, mühendislik ve altyapı projelerinin BIM tabanlı dijital dönüşümüne 1995 yılından bu yana kesintisiz liderlik ediyoruz.”
              </blockquote>

              <dl className="alu-about-chronicle">
                <div className="alu-about-chronicle__item">
                  <dt>1995</dt>
                  <dd>Aluplan Program Sistemleri kuruldu ve ALLPLAN Türkiye yetkili distribütörlüğü başladı.</dd>
                </div>
                <div className="alu-about-chronicle__item">
                  <dt>AEC &amp; INFRA</dt>
                  <dd>Mimari, yapısal mühendislik, köprü ve prekast disiplinlerinde uçtan uca BIM ekosistemi.</dd>
                </div>
                <div className="alu-about-chronicle__item">
                  <dt>ATAŞEHİR HQ</dt>
                  <dd>İstanbul merkez ofisimizden kamu kurumları, üniversiteler ve mühendislik ofislerine ulusal destek.</dd>
                </div>
              </dl>
            </aside>

            <div className="alu-about-story__prose">
              {storyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === 0 ? 'alu-about-story__lead' : 'alu-about-story__paragraph'}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Corporate Values Manifesto ("Değerlerimiz") */}
      <section className="preview-section preview-section--subtle" aria-labelledby="about-values-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-about-section-head">
            <div>
              <span className="preview-kicker">KURUMSAL İLKELER</span>
              <h2 id="about-values-heading" className="alu-h1" style={{ margin: 'var(--space-application-jsx-offset) 0 0 0' }}>
                Değerlerimiz
              </h2>
            </div>
            <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: 'var(--container-application-prose-narrow)' }}>
              Çalışmalarımızı şekillendiren temel ilkelerimiz
            </p>
          </div>

          <div className="alu-about-values">
            {corporateValues.map((value) => (
              <article key={value.title} className="alu-about-value-item">
                <div className="alu-about-value-item__top">
                  <span className="alu-about-value-item__roman">{value.num}</span>
                  <span className="alu-about-value-item__icon" aria-hidden="true">
                    <DirectoryCategoryIcon name={value.icon} />
                  </span>
                </div>
                <h3 className="alu-about-value-item__title">{value.title}</h3>
                <p className="alu-about-value-item__desc">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Headquarters & Interactive Map ("Ofisimiz") */}
      <section className="preview-section" aria-labelledby="about-office-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-about-section-head">
            <div>
              <span className="preview-kicker">MERKEZ OFİS &amp; LOKASYON</span>
              <h2 id="about-office-heading" className="alu-h1" style={{ margin: 'var(--space-application-jsx-offset) 0 0 0' }}>
                Ofisimiz
              </h2>
            </div>
            <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: 'var(--container-application-prose-compact)' }}>
              İstanbul Ataşehir&apos;deki modern ofisimizden Türkiye geneline hizmet veriyoruz
            </p>
          </div>

          <div className="alu-about-office">
            <div className="alu-about-office__info">
              <div className="alu-about-office__block">
                <span className="alu-about-office__eyebrow">ADRES</span>
                <h3 className="alu-h3" style={{ margin: 'var(--space-application-jsx-tight) 0 var(--space-application-jsx-regular) 0' }}>
                  Adres
                </h3>
                <p className="alu-body" style={{ margin: 0, lineHeight: 'var(--type-application-about-editorial)' }}>
                  Quick Tower – Workinton
                  <br />
                  İçerenköy Mah. Topçu İbrahim Sok.
                  <br />
                  8/10D No: 5
                  <br />
                  34752 Ataşehir / İstanbul
                </p>
              </div>

              <div className="alu-about-office__divider" />

              <div className="alu-about-office__block">
                <span className="alu-about-office__eyebrow">DOĞRUDAN ERİŞİM</span>
                <h3 className="alu-h3" style={{ margin: 'var(--space-application-jsx-tight) 0 var(--space-application-jsx-comfortable) 0' }}>
                  İletişim
                </h3>
                <dl className="alu-about-office__contact-list">
                  <div>
                    <dt>Telefon:</dt>
                    <dd>
                      <a className="alu-link" href="tel:+902162258441">
                        (+90) 216 225 84 41
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Email:</dt>
                    <dd>
                      <a className="alu-link" href="mailto:info@aluplan.com.tr">
                        info@aluplan.com.tr
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Çalışma Saatleri:</dt>
                    <dd>Pazartesi - Cuma: 09:00 - 18:00</dd>
                  </div>
                </dl>
              </div>

              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-comfortable)', marginTop: 'auto', paddingTop: 'var(--space-application-jsx-regular)' }}>
                <Link className="alu-button alu-button--primary alu-button--sm" href="/contact">
                  <span>İletişim Sayfasına Git</span>
                  <AluIcon name="arrow-right" size="sm" />
                </Link>
                <Link className="alu-button alu-button--secondary alu-button--sm" href="/references">
                  <span>Referanslarımızı İncele</span>
                </Link>
              </div>
            </div>

            {mapEmbed && (
              <div className="alu-about-office__map">
                <iframe
                  src={mapEmbed.src}
                  title={mapEmbed.title || 'Aluplan Ofis Konumu'}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
