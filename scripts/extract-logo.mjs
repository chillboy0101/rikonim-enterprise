import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_FILE = path.join(process.cwd(), 'company profile.png');
const PREFERRED_LOGO_FILE = path.join(process.cwd(), 'logo.png');
const OUT_DIR = path.join(process.cwd(), 'public', 'brand');
const OUT_FILE = path.join(OUT_DIR, 'logo.png');

function clampInt(value, min, max) {
  const v = Number.isFinite(value) ? Math.floor(value) : min;
  const safeMax = Number.isFinite(max) ? max : min;
  const safeMin = Number.isFinite(min) ? min : 0;
  const hi = Math.max(safeMin, safeMax);
  const lo = Math.min(safeMin, safeMax);
  return Math.max(lo, Math.min(hi, v));
}

async function cropToContentPng(inputFile) {
  const img = sharp(inputFile);
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error('Unable to read image metadata');

  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  let bottomLimit = info.height;
  for (let y = info.height - 1; y >= 0; y--) {
    let blackish = 0;
    const rowOffset = y * info.width * 4;
    for (let x = 0; x < info.width; x++) {
      const i = rowOffset + x * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a > 200 && r < 20 && g < 20 && b < 20) blackish++;
    }

    if (blackish / info.width > 0.985) {
      bottomLimit = y;
      continue;
    }
    break;
  }

  for (let y = 0; y < bottomLimit; y++) {
    const rowOffset = y * info.width * 4;
    for (let x = 0; x < info.width; x++) {
      const i = rowOffset + x * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Treat near-white as background, keep everything else.
      if (a > 10 && (r < 248 || g < 248 || b < 248)) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) {
    return sharp(inputFile).png({ quality: 100 }).toBuffer();
  }

  const pad = 10;
  const left = clampInt(minX - pad, 0, width - 1);
  const top = clampInt(minY - pad, 0, height - 1);
  const right = clampInt(maxX + pad, 0, width - 1);
  const bottom = clampInt(maxY + pad, 0, height - 1);
  const cropWidth = clampInt(right - left + 1, 1, width - left);
  const cropHeight = clampInt(bottom - top + 1, 1, height - top);

  return sharp(inputFile)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .png({ quality: 100 })
    .toBuffer();
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const hasOutputLogo = await fileExists(OUT_FILE);
  if (hasOutputLogo) {
    console.log(`[logo] Using existing: ${path.relative(process.cwd(), OUT_FILE)}`);
    return;
  }

  const hasPreferredLogo = await fileExists(PREFERRED_LOGO_FILE);
  if (hasPreferredLogo) {
    await fs.copyFile(PREFERRED_LOGO_FILE, OUT_FILE);
    console.log(`[logo] Using provided logo: ${path.relative(process.cwd(), OUT_FILE)}`);
    return;
  }

  const hasSource = await fileExists(SOURCE_FILE);
  if (!hasSource) {
    console.warn(`[logo] Source image not found: ${SOURCE_FILE}`);
    return;
  }

  const img = sharp(SOURCE_FILE);
  const meta = await img.metadata();

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (!width || !height) {
    console.warn('[logo] Unable to read source image metadata.');
    return;
  }

  const left = clampInt(width * 0.12, 0, width - 1);
  const top = clampInt(height * 0.02, 0, height - 1);
  const cropWidth = clampInt(width * 0.76, 1, width - left);
  const cropHeight = clampInt(height * 0.115, 1, height - top);

  try {
    const buffer = await sharp(SOURCE_FILE)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize({ height: 96, fit: 'contain', background: '#ffffff' })
      .png({ quality: 100 })
      .toBuffer();

    await fs.writeFile(OUT_FILE, buffer);
    console.log(`[logo] Generated: ${path.relative(process.cwd(), OUT_FILE)}`);
  } catch (err) {
    try {
      const safeWidth = clampInt(width, 1, width);
      const fallbackHeight = clampInt(260, 1, height);
      const buffer = await sharp(SOURCE_FILE)
        .extract({ left: 0, top: 0, width: safeWidth, height: fallbackHeight })
        .resize({ height: 96, fit: 'contain', background: '#ffffff' })
        .png({ quality: 100 })
        .toBuffer();

      await fs.writeFile(OUT_FILE, buffer);
      console.log(`[logo] Generated (fallback): ${path.relative(process.cwd(), OUT_FILE)}`);
    } catch {
      const hasExisting = await fileExists(OUT_FILE);
      if (hasExisting) {
        console.warn('[logo] Logo regeneration failed; using existing public/brand/logo.png');
        return;
      }
      console.warn('[logo] Logo regeneration failed and no existing logo found; continuing without generating logo.');
      console.warn(err);
      return;
    }
  }
}

main().catch((err) => {
  console.error('[logo] Failed to generate logo:', err);
});
