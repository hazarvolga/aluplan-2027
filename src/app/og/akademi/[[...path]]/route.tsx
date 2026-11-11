import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getAkademiPage, listAkademiPages } from '@/lib/akademi-pages';
import { isAkademiEnabled } from '@/lib/release-flags';

/** Share image (1200×630) for every Akademi page, pre-rendered at build time from the page catalog. */
export const dynamic = 'force-static';
export const dynamicParams = false;

const SIZE = { width: 1200, height: 630 } as const;
// Brand palette for the share card (fixed: social platforms show it outside the site's theme).
const INK = '#0b0f1a';
const PAPER = '#f5f7fa';
const MUTED = '#9aa3b2';
const ACCENT = '#d4693a';

function logoDataUri(): string {
  const svg = fs.readFileSync(path.join(process.cwd(), 'public/assets/logo/aluplan-logo-white-filled.svg'), 'utf8')
    .replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function generateStaticParams(): Array<{ path: string[] }> {
  if (!isAkademiEnabled()) return [];
  return listAkademiPages().map((page) => ({ path: page.path.split('/').filter(Boolean).slice(1) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }): Promise<Response> {
  const { path: segments = [] } = await params;
  const page = isAkademiEnabled() ? getAkademiPage(['/akademi', ...segments].join('/')) : undefined;
  if (!page) return new Response('Not found', { status: 404 });

  const titleSize = page.title.length > 60 ? 54 : page.title.length > 36 ? 64 : 76;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: INK, color: PAPER }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logoDataUri()} width={300} height={60} alt="" />
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: ACCENT }}>AKADEMİ</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 28, color: MUTED }}>{page.kicker}</div>
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 700, lineHeight: 1.1 }}>{page.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: MUTED }}>
          <div style={{ display: 'flex', width: 48, height: 4, background: ACCENT }} />
          <div style={{ display: 'flex' }}>ALLPLAN Türkçe eğitim · aluplan.com.tr/akademi</div>
        </div>
      </div>
    ),
    { ...SIZE, headers: { 'Cache-Control': 'public, max-age=86400, immutable' } },
  );
}
