import * as fs from 'fs';
import * as path from 'path';
import { retry, sleep } from './utils';

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'best-in-brussels');

export async function downloadImage(
  imageUrl: string | undefined,
  type: string,
  slug: string
): Promise<string | undefined> {
  if (!imageUrl) return undefined;

  try {
    // Ensure absolute URL
    const url = imageUrl.startsWith('http')
      ? imageUrl
      : `https://bestinbrussels.eu${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const dir = path.join(PUBLIC_DIR, type, slug);
    const filename = `logo${ext}`;
    const filepath = path.join(dir, filename);
    const publicPath = `/images/best-in-brussels/${type}/${slug}/${filename}`;

    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      return publicPath;
    }

    fs.mkdirSync(dir, { recursive: true });

    const buffer = await retry(async () => {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EUJobsBrussels/1.0)',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    });

    fs.writeFileSync(filepath, buffer);
    await sleep(500); // Gentle rate limiting for image downloads

    return publicPath;
  } catch (err) {
    console.warn(`  Failed to download image for ${slug}: ${(err as Error).message}`);
    return undefined;
  }
}
