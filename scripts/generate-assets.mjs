/**
 * Manforge asset generation script.
 *
 * Source: assets/manforge-icon-original.png (1254×1254)
 * Outputs: assets/images/{icon, android-icon-foreground, android-icon-monochrome,
 *           splash-icon, favicon, logo-in-app}.png
 *
 * Run from repo root: node scripts/generate-assets.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'assets/manforge-icon-original.png';
const OUT = 'assets/images';

await mkdir(OUT, { recursive: true });

// ─── Step 1: trim the black canvas border ────────────────────────────────────
// sharp.trim() removes pixels matching the corner pixel colour (black border).
console.log('Trimming canvas border…');
const trimmed = await sharp(SRC)
  .trim({ background: '#000000', threshold: 10 })
  .toBuffer();

// ─── Step 2: standard resized icons ──────────────────────────────────────────
const STANDARD = [
  { file: 'icon.png',                     size: 1024, label: 'App icon (iOS + Android)' },
  { file: 'android-icon-foreground.png',  size: 512,  label: 'Android adaptive foreground' },
  { file: 'splash-icon.png',              size: 512,  label: 'Splash screen logo' },
  { file: 'favicon.png',                  size: 48,   label: 'Web favicon' },
];

for (const { file, size, label } of STANDARD) {
  await sharp(trimmed)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${file}`);
  console.log(`✓ ${label} → ${OUT}/${file} (${size}×${size})`);
}

// ─── Step 3: monochrome (Android adaptive 2-colour / notification) ────────────
// Greyscale + threshold: dark stone → black, bright emblem → white.
// Android treats this as a tinted mask.
await sharp(trimmed)
  .greyscale()
  .threshold(60)
  .resize(432, 432, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/android-icon-monochrome.png`);
console.log(`✓ Android monochrome → ${OUT}/android-icon-monochrome.png (432×432)`);

// ─── Step 4: in-app emblem on transparent background ─────────────────────────
// Extract the copper emblem, making the dark stone background transparent.
// Strategy: write the luminance mask value DIRECTLY into the alpha channel of
// each pixel via raw buffer manipulation (sharp's composite dest-in requires the
// mask to already carry an alpha channel, which threshold() doesn't produce).
const THRESHOLD = 80; // pixels with greyscale >= 80 → opaque; < 80 → transparent
//   80 keeps the bright emblem highlights; raise to 100+ if stone still shows
const TARGET = 256;

// Base image: resized, RGBA
const baseRaw = await sharp(trimmed)
  .resize(TARGET, TARGET, { fit: 'cover' })
  .ensureAlpha()  // guarantees 4-channel output (RGBA)
  .raw()
  .toBuffer();

// Luminance mask: resized, 1-channel greyscale (after threshold → 0 or 255)
const maskRaw = await sharp(trimmed)
  .resize(TARGET, TARGET, { fit: 'cover' })
  .greyscale()      // 1 channel output
  .threshold(THRESHOLD)
  .raw()
  .toBuffer();

// Write mask value as each pixel's alpha channel
for (let i = 0; i < TARGET * TARGET; i++) {
  baseRaw[i * 4 + 3] = maskRaw[i]; // maskRaw[i] is 0 or 255
}

await sharp(baseRaw, { raw: { width: TARGET, height: TARGET, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/logo-in-app.png`);
console.log(`✓ In-app emblem (transparent bg) → ${OUT}/logo-in-app.png (${TARGET}×${TARGET})`);

console.log('\nAll assets generated. Inspect outputs, especially logo-in-app.png.');
console.log('If the emblem looks clipped or has too much halo, edit THRESHOLD (line ~55) and re-run.');
