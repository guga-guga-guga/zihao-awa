import { readdir, stat } from 'node:fs/promises'
import { extname, join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public')
const IMAGES_DIR = join(PUBLIC_DIR, 'images')
const QUALITY = 78
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080

async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await collectImages(full)))
    } else if (['.png', '.jpg', '.jpeg'].includes(extname(entry.name).toLowerCase())) {
      results.push(full)
    }
  }
  return results
}

async function main() {
  const files = await collectImages(IMAGES_DIR)
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const info = await stat(file)
    totalBefore += info.size

    const image = sharp(file)
    const meta = await image.metadata()

    let pipeline = image
    if (meta.width > MAX_WIDTH || meta.height > MAX_HEIGHT) {
      pipeline = pipeline.resize({
        width: Math.min(meta.width, MAX_WIDTH),
        height: Math.min(meta.height, MAX_HEIGHT),
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    const outFile = file.replace(/\.[^.]+$/, '.webp')
    const outMeta = await pipeline
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outFile)

    totalAfter += outMeta.size
    console.log(
      `${relative(IMAGES_DIR, file)} -> ${relative(IMAGES_DIR, outFile)} ` +
      `${(info.size / 1024).toFixed(0)}KB -> ${(outMeta.size / 1024).toFixed(0)}KB`,
    )
  }

  console.log('\nDone.')
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
