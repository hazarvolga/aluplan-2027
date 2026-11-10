'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';
import { ROL_ADLARI, type AkademiRol } from '@/data/akademi-roller';
import styles from './AkademiKatalog.module.css';

/**
 * Rol kartları gibi dışarıdaki bileşenler, süzgeci tam sayfa yenilemeden
 * güncellemek için bu olayı tetikler. detail, mevcut süzgece birleştirilir.
 */
export const AKADEMI_FILTRE_EVENT = 'akademi:filtre';
export interface AkademiFiltrePatch {
  seviye?: string;
  rol?: string;
  sure?: string;
}

export interface KatalogKarti {
  code: string;
  title: string;
  levelSlug: string;
  levelTitle: string;
  hours: number;
  href: string;
  dersSayisi: number;
  roller: readonly AkademiRol[];
}

export interface KatalogSeviye {
  slug: string;
  title: string;
}

interface Filters {
  seviye?: string;
  rol?: string;
  sure?: string;
}

const SURE_BUCKETS = [
  { slug: 'kisa', label: '≤ 8 Saat', test: (h: number) => h <= 8 },
  { slug: 'orta', label: '9–12 Saat', test: (h: number) => h >= 9 && h <= 12 },
  { slug: 'uzun', label: '13+ Saat', test: (h: number) => h >= 13 },
];

const ROL_SLUGS: readonly AkademiRol[] = ['mimar', 'statik', 'altyapi', 'prekast', 'bim-yonetici', 'teknik-ressam'];

function buildUrl(baseHref: string, filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.seviye) params.set('seviye', filters.seviye);
  if (filters.rol) params.set('rol', filters.rol);
  if (filters.sure) params.set('sure', filters.sure);
  const qs = params.toString();
  return `${baseHref}${qs ? `?${qs}` : ''}#katalog`;
}

/**
 * Katalog süzgeçleri + modül listesi. Süzgece tıklayınca tüm sayfa yenilenmez:
 * liste client-side süzülür, URL history ile güncellenir (paylaşılabilir kalır),
 * yalnızca liste yumuşak bir geçişle değişir. JS yoksa bağlantılar yine çalışır.
 */
export function AkademiKatalogFiltre({
  cards,
  levels,
  baseHref,
  initial,
}: {
  cards: readonly KatalogKarti[];
  levels: readonly KatalogSeviye[];
  baseHref: string;
  initial: Filters;
}): ReactElement {
  const [filters, setFilters] = useState<Filters>(initial);
  const { seviye, rol, sure } = filters;
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Rol kartları gibi dış bileşenler süzgeci olayla sürer: birleştir, URL'i
  // güncelle, listeyi yumuşakça göster. Tam sayfa yenileme olmaz.
  useEffect(() => {
    function onFiltre(event: Event): void {
      const detail = (event as CustomEvent<AkademiFiltrePatch>).detail;
      if (!detail) return;
      const next: Filters = { ...filtersRef.current, ...detail };
      setFilters(next);
      try {
        window.history.replaceState(null, '', buildUrl(baseHref, next));
      } catch {
        // History yoksa süzme yine çalışır, yalnız adres güncellenmez.
      }
      document
        .getElementById('katalog-modul')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.addEventListener(AKADEMI_FILTRE_EVENT, onFiltre);
    return () => window.removeEventListener(AKADEMI_FILTRE_EVENT, onFiltre);
  }, [baseHref]);

  function pick(key: keyof Filters, value?: string) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      // Modifiye tıklamalar (yeni sekme vb.) normal bağlantı davranışını korusun.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const next: Filters = { ...filters, [key]: value };
      setFilters(next);
      try {
        window.history.replaceState(null, '', buildUrl(baseHref, next));
      } catch {
        // History yoksa süzme yine çalışır, yalnız adres güncellenmez.
      }
    };
  }

  const filtered = cards.filter((card) => {
    if (seviye && card.levelSlug !== seviye) return false;
    if (rol && !card.roller.includes(rol as AkademiRol)) return false;
    if (sure) {
      const bucket = SURE_BUCKETS.find((b) => b.slug === sure);
      if (bucket && !bucket.test(card.hours)) return false;
    }
    return true;
  });
  const filterKey = `${seviye ?? ''}|${rol ?? ''}|${sure ?? ''}`;

  return (
    <>
      <section className={styles.band} aria-labelledby="katalog-suzgec">
        <div className="alu-container">
          <SectionHeader id="katalog-suzgec" kicker="SÜZGEÇLER" title="Modülleri süzün" />
          <FilterRow label="Seviye">
            <Chip href={buildUrl(baseHref, { ...filters, seviye: undefined })} active={!seviye} onClick={pick('seviye', undefined)}>Tümü</Chip>
            {levels.map((level) => (
              <Chip key={level.slug} href={buildUrl(baseHref, { ...filters, seviye: level.slug })} active={seviye === level.slug} onClick={pick('seviye', level.slug)}>
                {level.title}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Mesleki rol">
            <Chip href={buildUrl(baseHref, { ...filters, rol: undefined })} active={!rol} onClick={pick('rol', undefined)}>Tüm roller</Chip>
            {ROL_SLUGS.map((role) => (
              <Chip key={role} href={buildUrl(baseHref, { ...filters, rol: role })} active={rol === role} onClick={pick('rol', role)}>
                {ROL_ADLARI[role]}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Modül süresi">
            <Chip href={buildUrl(baseHref, { ...filters, sure: undefined })} active={!sure} onClick={pick('sure', undefined)}>Tüm süreler</Chip>
            {SURE_BUCKETS.map((bucket) => (
              <Chip key={bucket.slug} href={buildUrl(baseHref, { ...filters, sure: bucket.slug })} active={sure === bucket.slug} onClick={pick('sure', bucket.slug)}>
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
          <p className={styles.srStatus} role="status">{filtered.length} modül listeleniyor.</p>
          {filtered.length === 0 ? (
            <p className={styles.empty}>
              Seçtiğiniz süzgece uyan modül yok.{' '}
              <a className={styles.clear} href={`${baseHref}#katalog`} onClick={pick('seviye', undefined)}>Süzgeci temizle</a>.
            </p>
          ) : (
            <ul key={filterKey} className={styles.grid} data-animate="true">
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
    </>
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

function Chip({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}): ReactElement {
  return (
    <a
      className={styles.chip}
      href={href}
      data-active={active ? 'true' : 'false'}
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
