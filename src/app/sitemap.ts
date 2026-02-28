import { MetadataRoute } from 'next'

// Make sitemap dynamic to avoid build-time DB connection issues
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.co'

  // Static pages only - dynamic pages fetched at runtime
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/post-job`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/fairpay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/lobbying-entities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/best-in-brussels`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Try to fetch dynamic entries, but don't fail build if DB unavailable
  let dynamicPages: MetadataRoute.Sitemap = []
  
  try {
    const dbConnect = (await import('@/lib/dbConnect')).default
    await dbConnect()
    
    const { JobModel } = await import('@/models/Job')
    const jobs = await JobModel.find({ status: 'active' }).select('slug updatedAt').lean()
    
    dynamicPages = jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // DB not available during build - that's OK, sitemap will be generated at runtime
    console.log('Sitemap: DB not available, using static pages only')
  }

  return [...staticPages, ...dynamicPages]
}
