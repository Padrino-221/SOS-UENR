import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getSession } from '@/lib/auth'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

async function compressImage(buffer: Buffer, mimeType: string): Promise<{ buf: Buffer; format: string }> {
  if (mimeType === 'image/svg+xml' || mimeType === 'image/gif') {
    return { buf: buffer, format: mimeType === 'image/gif' ? 'gif' : 'svg' }
  }

  // Dynamic import to avoid type issues with sharp in isolatedModules mode
  const sharp = (await import('sharp')).default
  const image = sharp(buffer)
  const metadata = await image.metadata()

  const maxWidth = 1600
  const resizeOpts: { width?: number; withoutEnlargement: boolean } = { withoutEnlargement: true }
  if (metadata.width && metadata.width > maxWidth) {
    resizeOpts.width = maxWidth
  }

  if (mimeType === 'image/webp') {
    const buf = await image.resize(resizeOpts).webp({ quality: 80 }).toBuffer()
    return { buf, format: 'webp' }
  }

  const buf = await image.resize(resizeOpts).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
  return { buf, format: 'jpg' }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 })
  }

  if (file.type && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const originalBuffer = Buffer.from(bytes)

    const { buf: compressedBuffer, format } = await compressImage(originalBuffer, file.type)

    const url = await uploadToCloudinary(compressedBuffer, {
      folder: 'site-uploads',
      resource_type: 'image',
      format,
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[Upload] Cloudinary error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
