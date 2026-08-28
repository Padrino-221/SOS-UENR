import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Upload a buffer to Cloudinary.
 * Returns the secure URL of the uploaded asset.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw'
    format?: string
    public_id?: string
  } = {},
): Promise<string> {
  const { folder = 'uploads', resource_type = 'image', format, public_id } = options

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        format,
        public_id,
        access_mode: 'public',
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed'))
        resolve(result.secure_url)
      },
    )

    uploadStream.end(buffer)
  })
}
