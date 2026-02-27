/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    domains: ['images.unsplash.com', 'logo.clearbit.com', 'www2.eurobrussels.com', 'bestinbrussels.eu'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
