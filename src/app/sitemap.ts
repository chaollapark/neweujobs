import { MetadataRoute } from 'next'

export const revalidate = 3600

const CATEGORY_SLUGS = [
  'eu-institutions', 'eu-agencies', 'trade-associations', 'ngos',
  'think-tanks', 'public-affairs', 'law-firms', 'media',
  'international-orgs', 'traineeships',
]

const BIB_SECTIONS = [
  'consultancies', 'consultants', 'law-firms', 'intelligence-systems',
  'digital-tools', 'trainers', 'specialists', 'articles', 'guides',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.co'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/post-job`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/fairpay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/lobbying-entities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/lobbying-entities/interests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/career-guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/alerts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/best-in-brussels`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Best-in-Brussels section pages
  const bibPages: MetadataRoute.Sitemap = BIB_SECTIONS.map(section => ({
    url: `${baseUrl}/best-in-brussels/${section}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic pages from DB
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    const dbConnect = (await import('@/lib/dbConnect')).default
    await dbConnect()

    const { JobModel } = await import('@/models/Job')

    // Job pages
    const jobs = await JobModel.find(
      { status: { $ne: 'retired' }, plan: { $nin: ['pending'] } }
    ).select('slug updatedAt').lean()

    const jobPages: MetadataRoute.Sitemap = jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Company pages (distinct company slugs)
    const companyNames = await JobModel.distinct('companyName', {
      companyName: { $exists: true, $ne: '' },
      plan: { $nin: ['pending'] },
      status: { $ne: 'retired' },
    })
    const companyPages: MetadataRoute.Sitemap = companyNames.map((name: string) => {
      const slug = (name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
      return {
        url: `${baseUrl}/companies/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })

    dynamicPages = [...jobPages, ...companyPages]
  } catch (error) {
    console.log('Sitemap: DB not available, using static pages only')
  }

  return [...staticPages, ...categoryPages, ...bibPages, ...dynamicPages]
}
