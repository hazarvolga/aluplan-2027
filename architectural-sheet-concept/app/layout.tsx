import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '../tokens/primitives.css';
import '../tokens/semantic.css';
import '../tokens/component-aliases.css';
import '../components/responsive.generated.css';

const sans = localFont({ src: [
  { path: '../public/fonts/Manrope-400_800-normal-latin.woff2', weight: '400 800', style: 'normal' },
  { path: '../public/fonts/Manrope-400_800-normal-latin-ext.woff2', weight: '400 800', style: 'normal' },
], display: 'swap', variable: '--alu-font-sans', preload: true, fallback: ['Arial'], adjustFontFallback: 'Arial' });
const mono = localFont({ src: [
  { path: '../public/fonts/IBMPlexMono-400-normal-latin.woff2', weight: '400', style: 'normal' },
  { path: '../public/fonts/IBMPlexMono-400-normal-latin-ext.woff2', weight: '400', style: 'normal' },
], display: 'swap', variable: '--alu-font-mono', preload: true, fallback: ['Courier New'], adjustFontFallback: false });
export const metadata: Metadata = {
  title: 'Aluplan / Mimari pafta bileşen sistemi',
  description: 'Aluplan için bağımsız mimari pafta konsepti: tema tokenları ve tekrar kullanılabilir çizim bileşenleri.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" data-theme="sheet" data-mode="dark" className={`${sans.variable} ${mono.variable}`}><body>{children}</body></html>;
}
