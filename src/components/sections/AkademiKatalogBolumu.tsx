import type { ReactElement } from 'react';
import { SectionHeader } from './SectionHeader';
import { akademiProgram, levelModules } from '@/data/akademi-content';
import { lessonsForModule, ogrenmeYollari, type AkademiRol } from '@/data/akademi-mufredat-haritasi';
import { AkademiOgrenmeYollari } from './AkademiOgrenmeYollari';
import { AkademiKatalogFiltre, type KatalogKarti } from './AkademiKatalogFiltre';
import styles from './AkademiKatalog.module.css';

interface Props {
  seviye?: string;
  rol?: string;
  sure?: string;
  /** Süzgeç bağlantılarının işaret edeceği taban adres (ör. /akademi). */
  baseHref: string;
}

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
      levelTitle: akademiProgram.levels.find((level) => level.slug === 'temel')?.title ?? '',
      hours: 12,
      href: '/akademi/arazi-modelleme',
      dersSayisi: araziDers,
      roller: rollerFor('arazi'),
    });
  }
  return cards;
}

/** Katalog bloğu: rol-yolları (statik) + süzgeç/modül listesi (client, smooth). */
export function AkademiKatalogBolumu({ seviye, rol, sure, baseHref }: Props): ReactElement {
  const cards = buildCards();
  const levels = akademiProgram.levels.map((level) => ({ slug: level.slug, title: level.title }));

  return (
    <>
      <section id="katalog" className={styles.band} aria-labelledby="katalog-yollar">
        <div className="alu-container">
          <SectionHeader
            id="katalog-yollar"
            kicker="MESLEKİ ROL"
            title="Rolünüze göre müfredat"
            lead="Herkes Temeller seviyesinde ortak başlar; rolünüz ileri modüllerde ayrışır (çoğu yakında). Rolünüzü seçin, size uygun modülleri görün. İlerleme bu tarayıcıda kaydedilir."
          />
          <AkademiOgrenmeYollari yollar={ogrenmeYollari()} baseHref={baseHref} />
        </div>
      </section>

      <AkademiKatalogFiltre cards={cards} levels={levels} baseHref={baseHref} initial={{ seviye, rol, sure }} />
    </>
  );
}
