import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/employer-dashboard/', '/job-success/', '/job-cancel/'],
      },
    ],
    sitemap: 'https://eujobs.co/sitemap.xml',
  }
}
