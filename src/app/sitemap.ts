import { MetadataRoute } from 'next'

export const revalidate = 3600

const BASE_URL = 'https://eujobs.co'

// Sanitize slug for XML sitemap — encode chars that break XML parsing
function safeSlug(slug: string): string {
  if (!slug) return ''
  return encodeURIComponent(slug)
    .replace(/%2F/g, '/')  // keep path separators
    .replace(/%40/g, '@')
    .replace(/%3A/g, ':')
}

const CATEGORY_SLUGS = [
  'eu-institutions', 'eu-agencies', 'trade-associations', 'ngos',
  'think-tanks', 'public-affairs', 'law-firms', 'media',
  'international-orgs', 'traineeships',
]

const BIB_SECTIONS = [
  'consultancies', 'consultants', 'law-firms', 'intelligence-systems',
  'digital-tools', 'trainers', 'specialists', 'articles', 'guides',
]

const BIB_MODELS: Record<string, { model: string; pathPrefix: string }> = {
  consultancies: { model: 'BibConsultancy', pathPrefix: 'best-in-brussels/consultancies' },
  consultants: { model: 'BibConsultant', pathPrefix: 'best-in-brussels/consultants' },
  'law-firms': { model: 'BibLawFirm', pathPrefix: 'best-in-brussels/law-firms' },
  'intelligence-systems': { model: 'BibIntelligenceSystem', pathPrefix: 'best-in-brussels/intelligence-systems' },
  'digital-tools': { model: 'BibDigitalTool', pathPrefix: 'best-in-brussels/digital-tools' },
  trainers: { model: 'BibTrainer', pathPrefix: 'best-in-brussels/trainers' },
  specialists: { model: 'BibSpecialistCategory', pathPrefix: 'best-in-brussels/specialists' },
  articles: { model: 'BibArticle', pathPrefix: 'best-in-brussels/articles' },
  guides: { model: 'BibEditorialPage', pathPrefix: 'best-in-brussels/guides' },
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/jobs`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/companies`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/post-job`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/fairpay`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/lobbying-entities`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/lobbying-entities/interests`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/career-guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/alerts`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/best-in-brussels`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // BIB section listing pages
  const bibListPages: MetadataRoute.Sitemap = BIB_SECTIONS.map(section => ({
    url: `${BASE_URL}/best-in-brussels/${section}`,
    lastModified: now,
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

    const jobPages: MetadataRoute.Sitemap = jobs
      .filter((job: any) => job.slug)
      .map((job: any) => ({
        url: `${BASE_URL}/jobs/${safeSlug(job.slug)}`,
        lastModified: job.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    // Company pages
    const companyNames = await JobModel.distinct('companyName', {
      companyName: { $exists: true, $ne: '' },
      plan: { $nin: ['pending'] },
      status: { $ne: 'retired' },
    })
    const companyPages: MetadataRoute.Sitemap = companyNames
      .filter((name: string) => name)
      .map((name: string) => {
        const slug = (name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '')
        return {
          url: `${BASE_URL}/companies/${safeSlug(slug)}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }
      })

    // Lobbying entity pages
    const LobbyingEntityModel = (await import('@/models/LobbyingEntity')).default
    const entities = await LobbyingEntityModel.find({}).select('slug').lean()
    const entityPages: MetadataRoute.Sitemap = entities
      .filter((e: any) => e.slug)
      .map((e: any) => ({
        url: `${BASE_URL}/lobbying-entities/${safeSlug(e.slug)}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    // Career guide pages (org career guides — ~12,000)
    const OrgCareerGuideModel = (await import('@/models/OrgCareerGuide')).default
    const guides = await OrgCareerGuideModel.find({}).select('slug generatedAt').lean()
    const guidePages: MetadataRoute.Sitemap = guides
      .filter((g: any) => g.slug)
      .map((g: any) => ({
        url: `${BASE_URL}/career-guides/${safeSlug(g.slug)}`,
        lastModified: g.generatedAt || now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    // Blog posts (career_guides collection — ~15)
    const CareerGuideModel = (await import('@/models/CareerGuide')).default
    const blogs = await CareerGuideModel.find({}).select('slug updatedAt').lean()
    const blogPages: MetadataRoute.Sitemap = blogs
      .filter((b: any) => b.slug)
      .map((b: any) => ({
        url: `${BASE_URL}/blog/${safeSlug(b.slug)}`,
        lastModified: b.updatedAt || now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))

    // BIB individual detail pages
    let bibDetailPages: MetadataRoute.Sitemap = []
    for (const [, config] of Object.entries(BIB_MODELS)) {
      try {
        const mod = await import(`@/models/${config.model}`)
        const Model = mod.default || mod[config.model]
        if (Model) {
          const items = await Model.find({}).select('slug').lean()
          const pages = items
            .filter((item: any) => item.slug)
            .map((item: any) => ({
              url: `${BASE_URL}/${config.pathPrefix}/${safeSlug(item.slug)}`,
              lastModified: now,
              changeFrequency: 'monthly' as const,
              priority: 0.5,
            }))
          bibDetailPages = [...bibDetailPages, ...pages]
        }
      } catch {
        // Model not available, skip
      }
    }

    // Niche pages
    const { Niche } = await import('@/models/Niche')
    const niches = await Niche.find({ enabled: true }).select('slug').lean()
    const nichePages: MetadataRoute.Sitemap = niches
      .filter((n: any) => n.slug)
      .map((n: any) => ({
        url: `${BASE_URL}/${safeSlug(n.slug)}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    dynamicPages = [...jobPages, ...companyPages, ...entityPages, ...guidePages, ...blogPages, ...bibDetailPages, ...nichePages]
  } catch (error) {
    console.log('Sitemap: DB not available, using static pages only')
  }

  return [...staticPages, ...categoryPages, ...bibListPages, ...dynamicPages]
}
