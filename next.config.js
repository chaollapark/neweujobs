/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'logo.clearbit.com', 'www2.eurobrussels.com', 'bestinbrussels.eu'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    workerThreads: false,
    cpus: 1,
  },
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
