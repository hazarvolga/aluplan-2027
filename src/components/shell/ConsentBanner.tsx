'use client';

import React from 'react';
import Link from 'next/link';
import { useConsentReady, useCookieConsent, writeConsent } from '@/lib/consent';

/**
 * Cookie/KVKK consent banner. Rendered once at the root so it appears on every
 * chrome variant (site shell and akademi shell alike), as the law requires.
 */
export function ConsentBanner() {
  const cookieConsent = useCookieConsent();
  const consentLoaded = useConsentReady();

  if (!consentLoaded || cookieConsent !== null) return null;

  const handleConsent = (choice: 'accepted' | 'rejected') => writeConsent(choice);

  return (
    <aside className="alu-cookie-banner" aria-label="Çerez Tercihleri">
      <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
        <p className="alu-body-sm" style={{ margin: 0 }}>
          Deneyiminizi iyileştirmek ve site trafiğini analiz etmek için çerezleri kullanıyoruz. Analitik çerezler yalnızca açık onayınızla etkinleştirilir. Detaylı bilgi için{' '}
          <Link href="/gizlilik-politikasi" className="alu-link">
            Gizlilik Politikası
          </Link>{' '}
          ve{' '}
          <Link href="/kvkk" className="alu-link">
            KVKK Aydınlatma Metni
          </Link>{' '}
          sayfalarını inceleyebilirsiniz.
        </p>
        <div className="alu-cluster" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="alu-button alu-button--secondary alu-button--sm"
            onClick={() => handleConsent('rejected')}
          >
            Yalnız Zorunlu Çerezler
          </button>
          <button
            type="button"
            className="alu-button alu-button--primary alu-button--sm"
            onClick={() => handleConsent('accepted')}
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </aside>
  );
}
