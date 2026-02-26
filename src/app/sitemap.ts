import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import { JobModel } from '@/models/Job'
import LobbyingEntityModel from '@/models/LobbyingEntity'
import BibConsultancy from '@/models/BibConsultancy'
import BibConsultant from '@/models/BibConsultant'
import BibLawFirm from '@/models/BibLawFirm'
import BibIntelligenceSystem from '@/models/BibIntelligenceSystem'
import BibDigitalTool from '@/models/BibDigitalTool'
import BibTrainer from '@/models/BibTrainer'
import BibSpecialistCategory from '@/models/BibSpecialistCategory'
import BibArticle from '@/models/BibArticle'
import BibEditorialPage from '@/models/BibEditorialPage'
import CareerGuide from '@/models/CareerGuide'

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
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    // Best in Brussels static pages
    { url: `${baseUrl}/best-in-brussels`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/best-in-brussels/consultancies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/best-in-brussels/consultants`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/best-in-brussels/law-firms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/intelligence-systems`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/digital-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/trainers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/specialists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/best-in-brussels/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
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
      { slug: 1, createdAt: 1, status: 1 }
    ).sort('-createdAt').limit(1000)

    const now = Date.now()
    jobPages = jobs.map((job: any) => {
      const isRetired = job.status === 'retired'
      const ageInDays = (now - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      const priority = isRetired ? 0.2 : ageInDays < 7 ? 0.9 : ageInDays < 30 ? 0.7 : 0.5
      return {
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.createdAt),
        changeFrequency: isRetired ? 'yearly' as const : 'weekly' as const,
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

  // Blog pages (career guides from MongoDB)
  let blogPages: MetadataRoute.Sitemap = []
  try {
    await dbConnect()
    const guides = await CareerGuide.find({}, { slug: 1, updatedAt: 1 }).lean()
    blogPages = guides.map((guide: any) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(guide.slug)}`,
      lastModified: guide.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Error generating blog sitemap entries:', e)
  }

  // Best in Brussels dynamic pages
  let bibPages: MetadataRoute.Sitemap = []
  try {
    await dbConnect()

    const [consultancies, consultants, lawFirms, intelligenceSystems, digitalTools, trainers, specialists, articles, editorials] = await Promise.all([
      BibConsultancy.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibConsultant.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibLawFirm.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibIntelligenceSystem.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibDigitalTool.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibTrainer.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibSpecialistCategory.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibArticle.find({}, { slug: 1, updatedAt: 1 }).lean(),
      BibEditorialPage.find({}, { slug: 1, updatedAt: 1 }).lean(),
    ])

    const mapSlugs = (items: any[], pathPrefix: string, priority: number) =>
      items.map((item: any) => ({
        url: `${baseUrl}/best-in-brussels/${pathPrefix}/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority,
      }))

    bibPages = [
      ...mapSlugs(consultancies, 'consultancies', 0.5),
      ...mapSlugs(consultants, 'consultants', 0.4),
      ...mapSlugs(lawFirms, 'law-firms', 0.5),
      ...mapSlugs(intelligenceSystems, 'intelligence-systems', 0.5),
      ...mapSlugs(digitalTools, 'digital-tools', 0.5),
      ...mapSlugs(trainers, 'trainers', 0.5),
      ...mapSlugs(specialists, 'specialists', 0.5),
      ...mapSlugs(articles, 'articles', 0.5),
      ...mapSlugs(editorials, 'guides', 0.4),
    ]
  } catch (e) {
    console.error('Error generating BIB sitemap entries:', e)
  }

  return [...staticPages, ...seniorityPages, ...jobPages, ...entityPages, ...blogPages, ...bibPages]
}
