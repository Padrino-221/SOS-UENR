import sharp from 'sharp'

const SRC = 'public/SCHOOL OF SCIENCES LOGO OFFICIAL NEW.jpg.jpeg'

// 1. Load as raw RGBA
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// 2. Knock out the white background (soft ramp so anti-aliased edges stay smooth)
let minX = width
let minY = height
let maxX = -1
let maxY = -1

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const m = Math.min(r, g, b)

    let a = 255
    if (m >= 250) a = 0
    else if (m > 235) a = Math.round((255 * (250 - m)) / 15)

    data[i + 3] = Math.min(data[i + 3], a)

    if (a > 0) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
}

if (maxX < 0) throw new Error('Everything became transparent — threshold too aggressive')

const boxW = maxX - minX + 1
const boxH = maxY - minY + 1
console.log(`Source ${width}x${height} → emblem bbox ${boxW}x${boxH} at (${minX},${minY})`)

// 3. Extract the emblem, then centre it in a square transparent canvas
const emblem = await sharp(data, { raw: { width, height, channels } })
  .extract({ left: minX, top: minY, width: boxW, height: boxH })
  .png()
  .toBuffer()

await sharp(emblem)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('src/app/icon.png')

await sharp(emblem)
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('src/app/apple-icon.png')

// Full-size transparent logo for the site header/footer
await sharp(emblem)
  .resize(600, 731, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/logo-transparent.png')

console.log('Wrote src/app/icon.png (512), src/app/apple-icon.png (180), public/logo-transparent.png (600)')
