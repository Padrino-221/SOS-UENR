import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() ?? 'jpg'
    const url = await uploadToCloudinary(buffer, {
      folder: 'site-uploads',
      resource_type: 'image',
      format: ext,
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[Upload] Cloudinary error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
