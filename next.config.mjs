/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add static file handling optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Improve static file serving
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@thirdweb-dev/react', '@thirdweb-dev/sdk'],
  },
}

export default nextConfig
