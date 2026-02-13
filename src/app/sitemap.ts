import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import { JobModel } from '@/models/Job'
import LobbyingEntityModel from '@/models/LobbyingEntity'
import { getAllPostSlugs } from '@/lib/blogUtils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.brussels'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/post-job`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/fairpay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/lobbying-entities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/lobbying-entities/interests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Seniority pages
  const seniorityPages: MetadataRoute.Sitemap = ['intern', 'junior', 'mid-level', 'senior'].map(s => ({
    url: `${baseUrl}/jobs?seniority=${s}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // Job pages
  let jobPages: MetadataRoute.Sitemap = []
  try {
    await dbConnect()
    const jobs = await JobModel.find(
      { slug: { $exists: true }, plan: { $nin: ['pending'] } },
      { slug: 1, createdAt: 1 }
    ).sort('-createdAt').limit(1000)

    const now = Date.now()
    jobPages = jobs.map((job: any) => {
      const ageInDays = (now - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      const priority = ageInDays < 7 ? 0.9 : ageInDays < 30 ? 0.7 : 0.5
      return {
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.createdAt),
        changeFrequency: 'weekly' as const,
        priority,
      }
    })
  } catch (e) {
    console.error('Error generating job sitemap entries:', e)
  }

  // Lobbying entity pages
  let entityPages: MetadataRoute.Sitemap = []
  try {
    await dbConnect()
    const entities = await LobbyingEntityModel.find({}, { slug: 1, updatedAt: 1 }).limit(5000)

    entityPages = entities.map((entity: any) => ({
      url: `${baseUrl}/lobbying-entities/${entity.slug}`,
      lastModified: entity.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))
  } catch (e) {
    console.error('Error generating entity sitemap entries:', e)
  }

  // Blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const slugs = getAllPostSlugs()
    blogPages = slugs.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  } catch {
    // Blog utils may not exist yet
  }

  return [...staticPages, ...seniorityPages, ...jobPages, ...entityPages, ...blogPages]
}
