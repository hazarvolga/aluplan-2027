'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, readConsent, setGoogleAnalyticsDisabled, useCookieConsent } from '@/lib/consent';
import { hasWritableAcceptance, startCloudflareAnalytics } from '@/lib/cloudflare-analytics';
import { isVercelInsightsEnabled } from '@/lib/release-flags';

export function ConsentScripts() {
  const consent = useCookieConsent();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const allowed = consent === 'accepted' && readConsent() === 'accepted' && hasWritableAcceptance() && readConsent() === 'accepted';
    setGoogleAnalyticsDisabled(!allowed);
    setAnalyticsAllowed(allowed);
    if (allowed) startCloudflareAnalytics(process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN, true);
  }, [consent]);

  if (consent !== 'accepted') return null;
  if (!analyticsAllowed) return null;

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
