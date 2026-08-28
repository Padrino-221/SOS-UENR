import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const url = await uploadToCloudinary(buffer, {
      folder: 'spms-documents',
      resource_type: 'raw',
      format: 'pdf',
    })

    return NextResponse.json({
      url,
      name: file.name,
    })
  } catch (error) {
    console.error('[SPMS Upload] Cloudinary error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
