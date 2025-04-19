/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media-stream.b-cdn.net'],
    unoptimized: true
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 