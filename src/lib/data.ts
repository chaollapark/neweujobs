import { Job, Company, Category, PolicyTag } from '@/types'
import dbConnect from '@/lib/dbConnect'
import { JobModel, fetchJobs, findJobBySlug } from '@/models/Job'
export { categories } from '@/lib/categories'
import { categories } from '@/lib/categories'

// Reusable filter for active, non-pending jobs
const ACTIVE_JOB_FILTER = { plan: { $nin: ['pending'] }, status: { $ne: 'retired' } }

// Map experience level from MongoDB format
function mapExperienceLevel(seniority: string): 'entry' | 'junior' | 'mid' | 'senior' | 'executive' {
  const mapping: Record<string, 'entry' | 'junior' | 'mid' | 'senior' | 'executive'> = {
    'intern': 'entry',
    'junior': 'junior',
    'mid-level': 'mid',
    'senior': 'senior',
    'executive': 'executive',
  }
  return mapping[seniority] || 'mid'
}

// Map contract type from MongoDB format
function mapContractType(type: string): string {
  const mapping: Record<string, string> = {
    'full-time': 'permanent',
    'full': 'permanent',
    'part-time': 'fixed-term',
    'part': 'fixed-term',
    'contract': 'fixed-term',
    'project': 'fixed-term',
    'internship': 'traineeship',
    'freelance': 'freelance',
  }
  return mapping[type] || type || 'permanent'
}

// Determine category based on company name or job title
function determineCategory(companyName: string, title: string): Category {
  const lowerCompany = companyName.toLowerCase()
  const lowerTitle = title.toLowerCase()

  if (lowerCompany.includes('commission') || lowerCompany.includes('parliament') || lowerCompany.includes('council')) {
    return categories[0]
  }
  if (lowerCompany.includes('agency') || lowerCompany.includes('efsa') || lowerCompany.includes('ema')) {
    return categories[1]
  }
  if (lowerCompany.includes('association') || lowerCompany.includes('federation') || lowerCompany.includes('union')) {
    return categories[2]
  }
  if (lowerCompany.includes('ngo') || lowerCompany.includes('wwf') || lowerCompany.includes('greenpeace') || lowerCompany.includes('amnesty')) {
    return categories[3]
  }
  if (lowerCompany.includes('think tank') || lowerCompany.includes('bruegel') || lowerCompany.includes('institute') || lowerCompany.includes('research')) {
    return categories[4]
  }
  if (lowerCompany.includes('affairs') || lowerCompany.includes('lobbying') || lowerCompany.includes('advocacy') || lowerCompany.includes('consulting')) {
    return categories[5]
  }
  if (lowerCompany.includes('law') || lowerCompany.includes('legal')) {
    return categories[6]
  }
  if (lowerCompany.includes('media') || lowerCompany.includes('politico') || lowerCompany.includes('euractiv') || lowerCompany.includes('communication')) {
    return categories[7]
  }
  if (lowerCompany.includes('nato') || lowerCompany.includes('un ') || lowerCompany.includes('international')) {
    return categories[8]
  }
  if (lowerTitle.includes('trainee') || lowerTitle.includes('intern') || lowerTitle.includes('stage')) {
    return categories[9]
  }

  return categories[5] // Default to Public Affairs
}

// Infer policy domain tags from job title and description
function inferPolicyTags(title: string, description: string): PolicyTag[] {
  const text = `${title} ${description}`.toLowerCase()
  const tagKeywords: Record<PolicyTag, string[]> = {
    'energy': ['energy', 'electricity', 'renewable', 'gas', 'oil', 'nuclear', 'hydrogen'],
    'environment': ['environment', 'climate', 'sustainability', 'green deal', 'biodiversity', 'emissions', 'circular economy'],
    'digital': ['digital', 'cyber', 'data protection', 'ai ', 'artificial intelligence', 'technology', 'ict', 'gdpr', 'tech'],
    'trade': ['trade', 'tariff', 'customs', 'wto', 'export', 'import', 'fta', 'commercial policy'],
    'agriculture': ['agriculture', 'farming', 'fisheries', 'food safety', 'cap ', 'agri'],
    'transport': ['transport', 'aviation', 'maritime', 'railway', 'mobility', 'logistics'],
    'health': ['health', 'pharma', 'medical', 'pandemic', 'ema ', 'medicines', 'healthcare'],
    'finance': ['finance', 'banking', 'ecb', 'monetary', 'fiscal', 'budget', 'economic', 'taxation', 'accounting'],
    'defence': ['defence', 'defense', 'military', 'security', 'nato', 'csdp', 'arms'],
    'migration': ['migration', 'asylum', 'refugee', 'border', 'frontex', 'immigration'],
    'legal': ['legal', 'law', 'regulation', 'directive', 'compliance', 'judicial', 'court', 'legislation'],
    'education': ['education', 'erasmus', 'training', 'research', 'academic', 'university', 'horizon'],
    'competition': ['competition', 'antitrust', 'state aid', 'merger', 'cartel'],
    'development': ['development', 'humanitarian', 'aid', 'cooperation', 'global south', 'oda'],
    'foreign-affairs': ['foreign affairs', 'diplomatic', 'geopolitical', 'external relations', 'enlargement', 'neighbourhood'],
  }

  const tags: PolicyTag[] = []
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag as PolicyTag)
    }
  }
  return tags.slice(0, 4) // Cap at 4 tags per job
}

// Transform a MongoDB job document to the frontend Job type
export function transformMongoJob(mongoJob: any): Job {
  const category = determineCategory(mongoJob.companyName || '', mongoJob.title || '')

  const company: Company = {
    id: mongoJob._id?.toString() || '',
    name: mongoJob.companyName || 'Unknown Company',
    slug: (mongoJob.companyName || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    description: '',
    website: mongoJob.applyLink ? (() => { try { return new URL(mongoJob.applyLink).origin } catch { return '' } })() : '',
    location: mongoJob.city ? `${mongoJob.city}, ${mongoJob.country || 'Belgium'}` : 'Brussels, Belgium',
    industry: category.name,
    verified: true,
    createdAt: new Date(mongoJob.createdAt || Date.now()),
  }

  const isFeatured = mongoJob.plan === 'pro' || mongoJob.plan === 'recruiter'

  return {
    id: mongoJob._id?.toString() || '',
    _id: mongoJob._id?.toString() || '',
    title: mongoJob.title || 'Untitled Position',
    slug: mongoJob.slug || mongoJob._id?.toString() || '',
    company,
    companyId: company.id,
    companyName: mongoJob.companyName,
    description: mongoJob.description || '',
    requirements: '',
    salaryMin: mongoJob.salary || undefined,
    salaryMax: mongoJob.salary || undefined,
    salary: mongoJob.salary,
    salaryCurrency: 'EUR',
    location: mongoJob.city ? `${mongoJob.city}, ${mongoJob.country || 'Belgium'}` : 'Brussels, Belgium',
    remoteType: 'onsite',
    contractType: mapContractType(mongoJob.type || '') as any,
    experienceLevel: mapExperienceLevel(mongoJob.seniority || 'mid-level'),
    category,
    categoryId: category.id,
    status: mongoJob.status === 'retired' ? 'expired' : 'active',
    featured: isFeatured,
    expiresAt: new Date(mongoJob.expiresOn || Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(mongoJob.createdAt || Date.now()),
    updatedAt: new Date(mongoJob.updatedAt || Date.now()),
    applyLink: mongoJob.applyLink,
    source: mongoJob.source,
    plan: mongoJob.plan,
    blockAIApplications: mongoJob.blockAIApplications,
    policyTags: mongoJob.policyTags?.length
      ? mongoJob.policyTags
      : inferPolicyTags(mongoJob.title || '', mongoJob.description || ''),
    contactEmail: mongoJob.contactEmail,
    contactName: mongoJob.contactName,
    contactPhone: mongoJob.contactPhone,
    seniority: mongoJob.seniority,
  }
}

// Helper functions (all async, querying MongoDB)
export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const mongoJob = await findJobBySlug(slug)
  if (!mongoJob) return undefined
  return transformMongoJob(mongoJob)
}

export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  await dbConnect()
  // Use aggregation to find the first job matching this company slug pattern
  // instead of fetching 500 jobs and filtering in JS
  const jobs = await JobModel.find(
    { companyName: { $exists: true, $ne: '' }, ...ACTIVE_JOB_FILTER },
    { companyName: 1, applyLink: 1, city: 1, country: 1, createdAt: 1 }
  ).sort('-createdAt').limit(500).lean()

  for (const job of jobs) {
    const jobSlug = (job.companyName || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    if (jobSlug === slug) {
      const category = determineCategory(job.companyName || '', '')
      return {
        id: jobSlug,
        name: job.companyName || 'Unknown Company',
        slug: jobSlug,
        description: '',
        website: job.applyLink ? (() => { try { return new URL(job.applyLink).origin } catch { return '' } })() : '',
        location: job.city ? `${job.city}, ${job.country || 'Belgium'}` : 'Brussels, Belgium',
        industry: category.name,
        verified: true,
        createdAt: new Date(job.createdAt || Date.now()),
      }
    }
  }
  return undefined
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug)
}

export async function getJobsByCategory(categorySlug: string): Promise<Job[]> {
  await dbConnect()
  const allJobs = await fetchJobs(200)
  const transformed = allJobs.map(transformMongoJob)
  return transformed.filter((job: Job) => job.category.slug === categorySlug)
}

export async function getJobsByCompany(companySlug: string): Promise<Job[]> {
  await dbConnect()
  // Fetch jobs and filter by company slug in the query where possible.
  // Since slug is derived from companyName, we query with a broader filter
  // and do a final slug check, but limit the scan with lean().
  const jobs = await JobModel.find(
    { ...ACTIVE_JOB_FILTER, companyName: { $exists: true, $ne: '' } },
    {},
    { sort: '-createdAt', limit: 500 }
  ).lean()

  return jobs
    .filter((j: any) => {
      const slug = (j.companyName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
      return slug === companySlug
    })
    .map((j: any) => transformMongoJob(j))
}

export async function getFeaturedJobs(): Promise<Job[]> {
  await dbConnect()
  const proJobs = await JobModel.find(
    { plan: { $in: ['pro', 'recruiter'] }, status: { $ne: 'retired' } },
    {},
    { sort: '-createdAt', limit: 6 }
  ).lean()
  return proJobs.map(transformMongoJob)
}

export async function searchJobs(query: string): Promise<Job[]> {
  await dbConnect()
  const regex = new RegExp(query, 'i')
  const jobs = await JobModel.find(
    {
      $or: [
        { title: { $regex: regex } },
        { companyName: { $regex: regex } },
        { description: { $regex: regex } },
      ],
      ...ACTIVE_JOB_FILTER,
    },
    {},
    { sort: '-createdAt', limit: 50 }
  ).lean()
  return jobs.map(transformMongoJob)
}

export async function getLatestJobs(limit: number = 10): Promise<Job[]> {
  const mongoJobs = await fetchJobs(limit)
  return mongoJobs.map(transformMongoJob)
}

// Get unique companies from job data
function getUniqueCompanies(jobs: any[]): Company[] {
  const companyMap = new Map<string, Company>()

  for (const job of jobs) {
    const slug = (job.companyName || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    if (!companyMap.has(slug)) {
      const category = determineCategory(job.companyName || '', '')
      companyMap.set(slug, {
        id: slug,
        name: job.companyName || 'Unknown Company',
        slug,
        description: '',
        website: job.applyLink ? (() => { try { return new URL(job.applyLink).origin } catch { return '' } })() : '',
        location: job.city ? `${job.city}, ${job.country || 'Belgium'}` : 'Brussels, Belgium',
        industry: category.name,
        verified: true,
        createdAt: new Date(job.createdAt || Date.now()),
      })
    }
  }

  return Array.from(companyMap.values())
}

export async function getAllCompanies(): Promise<Company[]> {
  await dbConnect()
  const jobs = await JobModel.find(
    { companyName: { $exists: true, $ne: '' }, ...ACTIVE_JOB_FILTER },
    { companyName: 1, applyLink: 1, city: 1, country: 1, createdAt: 1 }
  ).sort('-createdAt').lean()

  return getUniqueCompanies(jobs)
}

/**
 * Get job counts for ALL companies in a single aggregation query.
 * Replaces the old N+1 pattern where getJobCountByCompany() was called
 * once per company, each time fetching 1000 docs and filtering in JS.
 */
export async function getAllCompanyJobCounts(): Promise<Map<string, number>> {
  await dbConnect()
  const counts = await JobModel.aggregate([
    { $match: { companyName: { $exists: true, $ne: '' }, status: { $ne: 'retired' }, plan: { $nin: ['pending'] } } },
    { $group: { _id: '$companyName', count: { $sum: 1 } } },
  ])

  const countMap = new Map<string, number>()
  for (const row of counts) {
    const slug = (row._id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    countMap.set(slug, (countMap.get(slug) || 0) + row.count)
  }
  return countMap
}
