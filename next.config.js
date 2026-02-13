/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'logo.clearbit.com', 'www2.eurobrussels.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    workerThreads: false,
    cpus: 1,
  },
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
