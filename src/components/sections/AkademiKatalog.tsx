import type { ReactElement, ReactNode } from 'react';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { akademiProgram, levelModules } from '@/data/akademi-content';
import { lessonsForModule, ogrenmeYollari, ROL_ADLARI, type AkademiRol } from '@/data/akademi-mufredat-haritasi';
import { AkademiOgrenmeYollari } from './AkademiOgrenmeYollari';
import styles from './AkademiKatalog.module.css';

interface Filters {
  seviye?: string;
  rol?: string;
  sure?: string;
}

interface KatalogKarti {
  code: string;
  title: string;
  levelSlug: string;
  levelTitle: string;
  hours: number;
  href: string;
  dersSayisi: number;
  roller: readonly AkademiRol[];
}

const SURE_BUCKETS = [
  { slug: 'kisa', label: '≤ 8 Saat', test: (h: number) => h <= 8 },
  { slug: 'orta', label: '9–12 Saat', test: (h: number) => h >= 9 && h <= 12 },
  { slug: 'uzun', label: '13+ Saat', test: (h: number) => h >= 13 },
];

const ROL_SLUGS: readonly AkademiRol[] = ['mimar', 'statik', 'altyapi', 'prekast', 'bim-yonetici', 'teknik-ressam'];

function rollerFor(code: string): readonly AkademiRol[] {
  const set = new Set<AkademiRol>();
  for (const lesson of lessonsForModule(code)) {
    for (const role of lesson.roles) set.add(role);
  }
  return [...set];
}

function buildCards(): readonly KatalogKarti[] {
  const cards: KatalogKarti[] = [];
  for (const level of akademiProgram.levels) {
    for (const mod of levelModules(level)) {
      cards.push({
        code: mod.code,
        title: mod.title,
        levelSlug: level.slug,
        levelTitle: level.title,
        hours: mod.hours,
        href: `/akademi/${level.slug}/${mod.slug}`,
        dersSayisi: lessonsForModule(mod.code).length,
        roller: rollerFor(mod.code),
      });
    }
  }
  const araziDers = lessonsForModule('arazi').length;
  if (araziDers > 0) {
    cards.push({
      code: 'Arazi',
      title: 'Arazi Modelleme',
      levelSlug: 'temel',
      levelTitle: 'Temel',
      hours: 12,
      href: '/akademi/arazi-modelleme',
      dersSayisi: araziDers,
      roller: rollerFor('arazi'),
    });
  }
  return cards;
}

function buildHref(current: Filters, key: keyof Filters, value?: string): string {
  const next: Filters = { ...current, [key]: value };
  const params = new URLSearchParams();
  if (next.seviye) params.set('seviye', next.seviye);
  if (next.rol) params.set('rol', next.rol);
  if (next.sure) params.set('sure', next.sure);
  const qs = params.toString();
  return `/akademi/katalog${qs ? `?${qs}` : ''}`;
}

export function AkademiKatalog({ seviye, rol, sure }: Filters): ReactElement {
  const current: Filters = { seviye, rol, sure };
  const cards = buildCards();
  const filtered = cards.filter((card) => {
    if (seviye && card.levelSlug !== seviye) return false;
    if (rol && !card.roller.includes(rol as AkademiRol)) return false;
    if (sure) {
      const bucket = SURE_BUCKETS.find((b) => b.slug === sure);
      if (bucket && !bucket.test(card.hours)) return false;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <CompactPageHero
        kicker="ALUPLAN AKADEMİ"
        title="Eğitim Kataloğu ve Öğrenme Yolları"
        lead="Seviyeye, mesleki role ve modül süresine göre süzün. Seçtiğiniz süzgeç adrese (URL) yansır; ekip arkadaşlarınızla paylaşabilirsiniz."
      />

      <section className={styles.band} aria-labelledby="katalog-yollar">
        <div className="alu-container">
          <SectionHeader
            id="katalog-yollar"
            kicker="ÖĞRENME YOLLARI"
            title="Rol bazlı sıralı yollar"
            lead="Her yol, ilgili disiplinin izlemesi gereken sıralı modülleri gösterir. İlerleme bu tarayıcıda kaydedilir."
          />
          <AkademiOgrenmeYollari yollar={ogrenmeYollari()} />
        </div>
      </section>

      <section className={styles.band} aria-labelledby="katalog-suzgec">
        <div className="alu-container">
          <SectionHeader id="katalog-suzgec" kicker="SÜZGEÇLER" title="Modülleri süzün" />
          <FilterRow label="Seviye">
            <Chip href={buildHref(current, 'seviye', undefined)} active={!seviye}>Tümü</Chip>
            {akademiProgram.levels.map((level) => (
              <Chip key={level.slug} href={buildHref(current, 'seviye', level.slug)} active={seviye === level.slug}>
                {level.title}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Mesleki rol">
            <Chip href={buildHref(current, 'rol', undefined)} active={!rol}>Tüm roller</Chip>
            {ROL_SLUGS.map((role) => (
              <Chip key={role} href={buildHref(current, 'rol', role)} active={rol === role}>
                {ROL_ADLARI[role]}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Modül süresi">
            <Chip href={buildHref(current, 'sure', undefined)} active={!sure}>Tüm süreler</Chip>
            {SURE_BUCKETS.map((bucket) => (
              <Chip key={bucket.slug} href={buildHref(current, 'sure', bucket.slug)} active={sure === bucket.slug}>
                {bucket.label}
              </Chip>
            ))}
          </FilterRow>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="katalog-modul">
        <div className="alu-container">
          <SectionHeader
            id="katalog-modul"
            kicker="MODÜLLER"
            title={`Modül ve kurs listesi (${filtered.length})`}
            lead={filtered.length === cards.length ? undefined : 'Süzgece uyan modüller.'}
          />
          {filtered.length === 0 ? (
            <p className={styles.empty}>
              Seçtiğiniz süzgece uyan modül yok. <a className={styles.clear} href="/akademi/katalog">Süzgeci temizle</a>.
            </p>
          ) : (
            <ul className={styles.grid}>
              {filtered.map((card) => (
                <li key={card.code} className={styles.card}>
                  <a className={styles.cardLink} href={card.href}>
                    <span className={styles.cardTop}>
                      <span className={styles.cardCode}>{card.code} · {card.levelTitle}</span>
                      <span className={styles.cardHours}>
                        {card.dersSayisi > 0 ? `${card.dersSayisi} ders` : 'Yakında'} · {card.hours} saat
                      </span>
                    </span>
                    <span className={styles.cardTitle}>{card.title}</span>
                    {card.roller.length > 0 && (
                      <span className={styles.cardRoles}>
                        {card.roller.map((role) => ROL_ADLARI[role]).join(' · ')}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div className={styles.filterRow}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.chips}>{children}</div>
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }): ReactElement {
  return (
    <a className={styles.chip} href={href} data-active={active ? 'true' : 'false'} aria-current={active ? 'true' : undefined}>
      {children}
    </a>
  );
}
