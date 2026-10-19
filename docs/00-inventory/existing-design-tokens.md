# Mevcut tasarım değerleri

Kaynak: `../aluplan-2026/styles/globals.css`, `tailwind.config.ts`, `app/layout.tsx`. Bu belge Faz 0 envanteridir; Faz 4 design system kurulmamıştır.

- Gövde/sans: Inter, system-ui, sans-serif.
- Display: Space Grotesk, Inter, system-ui, sans-serif.
- Mono: IBM Plex Mono, Menlo, monospace.
- Font yükleme: Google Fonts CSS import; Inter 100–900, Space Grotesk 300–700, IBM Plex Mono 400/500/600.
- Viewport themeColor: #0a0e27; bu değer sayfa arka planıyla aynı kabul edilmez.
- Dark mode: class; ThemeProvider varsayılan dark ve sistem tercihi etkin.
- Container: ortalanmış, 2rem padding, 2xl 1400px.
- Radius: lg var(--radius), md -2px, sm -4px.
- Başlık sınıfları: h1 text-5xl md:text-6xl lg:text-7xl; h2 text-4xl md:text-5xl; h3 text-3xl md:text-4xl.
- Section: py-12 md:py-16.
- Accordion animasyonu: 0.2s ease-out.
- CSS dışındaki bileşen özel renk/font/spacing sınıfları için kaynak referansları ayrıca incelenmelidir; bu tablo tüm bileşen override envanteri değildir.

## :root

| Token | Kaynaktaki değer |
|---|---|
| `--background` | `0 0% 100%` |
| `--foreground` | `220 20% 12%` |
| `--card` | `0 0% 100%` |
| `--card-foreground` | `220 20% 12%` |
| `--popover` | `0 0% 100%` |
| `--popover-foreground` | `220 20% 12%` |
| `--primary` | `217 91% 60%` |
| `--primary-foreground` | `0 0% 100%` |
| `--secondary` | `220 10% 95%` |
| `--secondary-foreground` | `220 18% 12%` |
| `--muted` | `220 10% 96%` |
| `--muted-foreground` | `220 14% 25%` |
| `--accent` | `210 100% 40%` |
| `--accent-foreground` | `0 0% 100%` |
| `--destructive` | `0 84.2% 60.2%` |
| `--destructive-foreground` | `0 0% 100%` |
| `--border` | `220 12% 90%` |
| `--input` | `220 12% 90%` |
| `--ring` | `217 91% 60%` |
| `--radius` | `0.25rem` |
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-md` | `0 4px 12px -2px rgb(0 0 0 / 0.08)` |
| `--shadow-lg` | `0 8px 24px -4px rgb(0 0 0 / 0.12)` |
| `--shadow-xl` | `0 16px 48px -8px rgb(0 0 0 / 0.16)` |
| `--shadow-technical` | `0 0 0 1px hsl(45 92% 62% / 0.1), 0 8px 24px -4px hsl(45 92% 62% / 0.15)` |
| `--graphite-950` | `220 20% 8%` |
| `--graphite-900` | `220 18% 12%` |
| `--graphite-800` | `220 16% 16%` |
| `--steel-300` | `220 10% 75%` |
| `--steel-400` | `220 8% 60%` |
| `--steel-600` | `220 10% 32%` |
| `--steel-800` | `220 14% 20%` |
| `--midnight-950` | `232 59% 10%` |
| `--midnight-900` | `223 46% 11%` |
| `--midnight-800` | `231 38% 16%` |

## .dark

| Token | Kaynaktaki değer |
|---|---|
| `--background` | `0 0% 2%` |
| `--foreground` | `0 0% 98%` |
| `--card` | `0 0% 4%` |
| `--card-foreground` | `0 0% 98%` |
| `--popover` | `0 0% 4%` |
| `--popover-foreground` | `0 0% 98%` |
| `--primary` | `217 91% 60%` |
| `--primary-foreground` | `0 0% 100%` |
| `--secondary` | `0 0% 10%` |
| `--secondary-foreground` | `0 0% 98%` |
| `--muted` | `0 0% 10%` |
| `--muted-foreground` | `0 0% 70%` |
| `--accent` | `212 96% 60%` |
| `--accent-foreground` | `0 0% 100%` |
| `--destructive` | `0 62.8% 30.6%` |
| `--destructive-foreground` | `0 0% 98%` |
| `--border` | `0 0% 12%` |
| `--input` | `0 0% 12%` |
| `--ring` | `217 91% 60%` |
| `--graphite-950` | `220 20% 8%` |
| `--graphite-900` | `220 18% 12%` |
| `--graphite-800` | `220 16% 16%` |
| `--steel-300` | `220 10% 75%` |
| `--steel-400` | `220 8% 60%` |
| `--steel-600` | `220 10% 32%` |
| `--steel-800` | `220 14% 20%` |
| `--midnight-950` | `0 0% 2%` |
| `--midnight-900` | `0 0% 4%` |
| `--midnight-800` | `0 0% 6%` |
