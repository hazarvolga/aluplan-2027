/**
 * Intrinsic sizes of Akademi lesson screenshots (public/akademi/**), so lesson pages can set
 * width/height on every <img> and reserve their space (no layout shift while images load).
 * Output: src/data/akademi-image-sizes.json = { "/akademi/<path>": [width, height] }.
 * Usage: node scripts/build_akademi_image_sizes.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';

const root = 'public/akademi';
const output = 'src/data/akademi-image-sizes.json';

function pngSize(buf) {
  // IHDR chunk: width and height are big-endian uint32 at bytes 16 and 20.
  return buf.toString('ascii', 12, 16) === 'IHDR' ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : null;
}

function jpegSize(buf) {
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    // SOF0..SOF15 except DHT (C4), JPG (C8) and DAC (CC) carry the frame size.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return [buf.readUInt16BE(offset + 7), buf.readUInt16BE(offset + 5)];
    }
    offset += 2 + length;
  }
  return null;
}

function imageSize(file) {
  const buf = fs.readFileSync(file);
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return pngSize(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf);
  return null;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const sizes = {};
for (const file of walk(root).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort()) {
  const size = imageSize(file);
  if (size) sizes[`/${path.relative('public', file).split(path.sep).join('/')}`] = size;
}
const out = JSON.stringify(sizes, null, 0).replace(/\],"/g, '],\n"') + '\n';

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== out) {
    console.error(`${output} is out of date; run node scripts/build_akademi_image_sizes.mjs`);
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(output, out);
  console.log(`Generated sizes for ${Object.keys(sizes).length} Akademi images`);
}
