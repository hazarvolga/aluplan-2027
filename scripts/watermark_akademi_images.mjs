/**
 * Stamps a small source watermark ("aluplan.com.tr/akademi") onto Akademi lesson screenshots
 * (public/akademi/**), bottom-right, semi-transparent. Tiny icons are left as they are.
 *
 * Idempotent: scripts/akademi-watermark-manifest.json records the sha256 of every processed
 * (or deliberately skipped) file; a file whose hash is already recorded is not stamped again.
 * New or replaced images are stamped on the next run.
 *
 * Usage: node scripts/watermark_akademi_images.mjs           # stamp new images, update manifest
 *        node scripts/watermark_akademi_images.mjs --check   # fail if any image is not processed
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = 'public/akademi';
const MANIFEST = 'scripts/akademi-watermark-manifest.json';
const TEXT = 'aluplan.com.tr/akademi';
const MIN_WIDTH = 240;
const MIN_HEIGHT = 120;

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const readManifest = () => (fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {});

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const images = () => walk(ROOT).filter((file) => /\.(png|jpe?g)$/i.test(file)).sort();
const key = (file) => `/${path.relative('public', file).split(path.sep).join('/')}`;

function overlaySvg(width, height) {
  const fontSize = Math.round(Math.min(18, Math.max(11, width * 0.018)));
  const padX = Math.round(fontSize * 0.6);
  const boxW = Math.round(TEXT.length * fontSize * 0.58 + padX * 2);
  const boxH = Math.round(fontSize * 1.6);
  const x = width - boxW - Math.round(fontSize * 0.5);
  const y = height - boxH - Math.round(fontSize * 0.5);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="2" fill="#0b0f1a" fill-opacity="0.55"/>` +
      `<text x="${x + boxW / 2}" y="${y + boxH / 2}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" ` +
      `fill="#ffffff" fill-opacity="0.9" text-anchor="middle" dominant-baseline="central">${TEXT}</text></svg>`,
  );
}

async function stamp(sharp, file) {
  const input = fs.readFileSync(file);
  const { width, height, format } = await sharp(input).metadata();
  if (!width || !height || width < MIN_WIDTH || height < MIN_HEIGHT) return { buf: input, stamped: false };
  const piped = sharp(input).composite([{ input: overlaySvg(width, height), top: 0, left: 0 }]);
  const buf = format === 'jpeg' ? await piped.jpeg({ quality: 88 }).toBuffer() : await piped.png({ compressionLevel: 9 }).toBuffer();
  return { buf, stamped: true };
}

async function main() {
  const manifest = readManifest();
  const pending = images().filter((file) => manifest[key(file)] !== sha256(fs.readFileSync(file)));

  if (process.argv.includes('--check')) {
    if (pending.length) {
      console.error(`${pending.length} Akademi image(s) without a watermark, e.g. ${key(pending[0])}; run node scripts/watermark_akademi_images.mjs`);
      process.exitCode = 1;
    }
    return;
  }

  // sharp ships with Next.js; resolve it from there instead of adding a dependency.
  const require = createRequire(import.meta.url);
  const sharp = require(require.resolve('sharp', { paths: [path.dirname(require.resolve('next/package.json'))] }));
  let stamped = 0;
  for (const file of pending) {
    const result = await stamp(sharp, file);
    if (result.stamped) {
      fs.writeFileSync(file, result.buf);
      stamped += 1;
    }
    manifest[key(file)] = sha256(result.buf);
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0).replace(/","/g, '",\n"') + '\n');
  console.log(`Watermarked ${stamped} image(s); ${pending.length - stamped} small image(s) recorded as-is.`);
}

await main();
