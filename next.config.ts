import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'sos.uenr.edu.gh' },
      { protocol: 'https', hostname: 'uenr.edu.gh' },
    ],
  },
}

export default nextConfig
