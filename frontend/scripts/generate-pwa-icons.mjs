import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const sourceIcon = path.join(publicDir, "icon.png");

const iconOutputs = [
  { filename: "pwa-192x192.png", size: 192 },
  { filename: "pwa-512x512.png", size: 512 },
  { filename: "apple-touch-icon.png", size: 180 },
  { filename: "favicon-32x32.png", size: 32 },
  { filename: "favicon-16x16.png", size: 16 },
];

async function ensureSourceIcon() {
  try {
    await fs.access(sourceIcon);
  } catch {
    throw new Error(`Missing source icon at ${sourceIcon}`);
  }
}

async function generateIcon({ filename, size }) {
  const outputPath = path.join(publicDir, filename);

  await sharp(sourceIcon)
    .resize(size, size, {
      fit: "contain",
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0,
      },
    })
    .png()
    .toFile(outputPath);
}

async function main() {
  await ensureSourceIcon();
  await Promise.all(iconOutputs.map(generateIcon));
  console.log(
    `Generated ${iconOutputs.length} PWA icons from ${path.basename(sourceIcon)}.`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
