import { notFound, redirect } from 'next/navigation';
import { isAkademiEnabled } from '@/lib/release-flags';

/**
 * Katalog ve öğrenme yolları artık /akademi içinde (#katalog). Eski adres,
 * süzgeç parametrelerini koruyarak oraya yönlendirir; paylaşılmış linkler kırılmaz.
 */
export default async function AkademiKatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ seviye?: string; rol?: string; sure?: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.seviye) params.set('seviye', sp.seviye);
  if (sp.rol) params.set('rol', sp.rol);
  if (sp.sure) params.set('sure', sp.sure);
  const qs = params.toString();
  redirect(`/akademi${qs ? `?${qs}` : ''}#katalog`);
}
