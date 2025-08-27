/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
   images: {
    unoptimized: false, // ✅ use Next.js optimizer
    domains: [
      "res.cloudinary.com",   // Cloudinary
      "ik.imagekit.io",       // ImageKit
      "hebbkx1anhila5yf.public.blob.vercel-storage.com" // Vercel Blob
    ],
  },
}

export default nextConfig
