'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/lib/consent';
import { isVercelInsightsEnabled } from '@/lib/release-flags';

const GA_MEASUREMENT_ID = 'G-DQYT0D9MQ5';

export function ConsentScripts() {
  const consent = useCookieConsent();

  useEffect(() => {
    // Google's opt-out flag stops an already loaded gtag when consent is withdrawn.
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = consent !== 'accepted';
  }, [consent]);

  if (consent !== 'accepted') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
      {isVercelInsightsEnabled() && (
        <>
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
          <Script src="/_vercel/speed-insights/script.js" strategy="afterInteractive" />
        </>
      )}
    </>
  );
}
