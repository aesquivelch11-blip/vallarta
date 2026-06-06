import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const inputDir = 'src/assets/Menu';

async function main() {
  const files = await readdir(inputDir);
  const jpgs = files.filter(f => f.endsWith('.jpg'));

  if (jpgs.length === 0) {
    console.log('No JPG files found in', inputDir);
    return;
  }

  for (const file of jpgs) {
    const input = join(inputDir, file);
    const name = basename(file, extname(file));
    const output = join(inputDir, `${name}.webp`);

    try {
      await sharp(input)
        .webp({ quality: 82 })
        .toFile(output);

      const inputStat = await stat(input);
      const outputStat = await stat(output);
      const saved = (((inputStat.size - outputStat.size) / inputStat.size) * 100).toFixed(1);

      console.log(`${file} → ${name}.webp  (${saved}% smaller)`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err.message);
    }
  }

  console.log('\nDone. Commit the .webp files to src/assets/Menu/.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
