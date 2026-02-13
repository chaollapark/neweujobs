import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getJobBySlug } from '@/lib/data'
import { POLICY_TAG_LABELS, PolicyTag } from '@/types'

export const revalidate = 60

interface JobDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)

  if (!job) {
    return { title: 'Job Not Found - EU Jobs Brussels' }
  }

  return {
    title: `${job.title} at ${job.company.name} - EU Jobs Brussels`,
    description: job.description.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: `${job.title} at ${job.company.name}`,
      description: job.description.replace(/<[^>]*>/g, '').slice(0, 160),
      url: `https://eujobs.brussels/jobs/${job.slug}`,
      siteName: 'EU Jobs Brussels',
      type: 'website',
    },
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  const job = await getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const formatSalary = () => {
    if (!job.salaryMin) return null
    if (job.salaryMin === job.salaryMax) {
      return `\u20AC${job.salaryMin.toLocaleString()}/month`
    }
    return `\u20AC${job.salaryMin.toLocaleString()} - \u20AC${job.salaryMax?.toLocaleString()}/year`
  }

  const getContractLabel = (type: string) => {
    const labels: Record<string, string> = {
      'permanent': 'Permanent',
      'fixed-term': 'Fixed Term',
      'traineeship': 'Traineeship',
      'freelance': 'Freelance',
      'temporary-agent': 'Temporary Agent',
      'contract-agent': 'Contract Agent',
    }
    return labels[type] || type
  }

  const getRemoteLabel = (type: string) => {
    const labels: Record<string, string> = {
      'onsite': 'On-site',
      'hybrid': 'Hybrid',
      'remote': 'Remote',
    }
    return labels[type] || type
  }

  const getExperienceLabel = (level: string) => {
    const labels: Record<string, string> = {
      'entry': 'Entry Level',
      'junior': 'Junior (1-3 years)',
      'mid': 'Mid-Level (3-5 years)',
      'senior': 'Senior (5+ years)',
      'executive': 'Executive / Director',
    }
    return labels[level] || level
  }

  const applyUrl = job.applyLink
    ? job.applyLink.startsWith('mailto:')
      ? job.applyLink
      : job.applyLink.startsWith('http')
        ? job.applyLink
        : `https://${job.applyLink}`
    : job.contactEmail
      ? `mailto:${job.contactEmail}`
      : null

  const getDeadlineUrgency = () => {
    if (!job.expiresAt) return null
    const now = Date.now()
    const expiresMs = new Date(job.expiresAt).getTime()
    const daysLeft = Math.floor((expiresMs - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return null
    if (daysLeft === 0) return { label: 'Expiring today', className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
    if (daysLeft === 1) return { label: '1 day left', className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
    if (daysLeft <= 3) return { label: `${daysLeft} days left`, className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' }
    if (daysLeft <= 7) return { label: `${daysLeft} days left`, className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' }
    return null
  }

  const deadline = getDeadlineUrgency()

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description.replace(/<[^>]*>/g, ''),
    datePosted: new Date(job.createdAt).toISOString(),
    validThrough: new Date(job.expiresAt).toISOString(),
    employmentType: job.contractType === 'permanent' ? 'FULL_TIME' : 'CONTRACT',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.website || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    ...(job.salaryMin && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salaryMin,
          unitText: 'YEAR',
        },
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-eu-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/jobs" className="hover:text-eu-blue">Jobs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Job Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-xl bg-eu-blue flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {job.company.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {job.featured && (
                      <span className="badge-yellow text-xs">Featured</span>
                    )}
                    {deadline && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${deadline.className}`}>
                        {deadline.label}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                  <Link
                    href={`/companies/${job.company.slug}`}
                    className="text-xl text-eu-blue hover:underline"
                  >
                    {job.company.name}
                  </Link>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="badge-blue">{job.location}</span>
                    <span className="badge-green">{getContractLabel(job.contractType)}</span>
                    <span className="badge-purple">{getRemoteLabel(job.remoteType)}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {getExperienceLabel(job.experienceLevel)}
                    </span>
                  </div>

                  {/* Policy Tags */}
                  {job.policyTags && job.policyTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.policyTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        >
                          {POLICY_TAG_LABELS[tag as PolicyTag] || tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <div
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h2>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            {/* Contact Info */}
            {(job.contactEmail || job.contactPhone) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {job.contactName && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Contact:</span>
                      <span>{job.contactName}</span>
                    </div>
                  )}
                  {job.contactEmail && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Email:</span>
                      <a href={`mailto:${job.contactEmail}`} className="text-eu-blue hover:underline">
                        {job.contactEmail}
                      </a>
                    </div>
                  )}
                  {job.contactPhone && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Phone:</span>
                      <a href={`tel:${job.contactPhone}`} className="text-eu-blue hover:underline">
                        {job.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About Company */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {job.company.name}</h2>
              {job.company.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{job.company.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{job.company.location}</span>
                {job.company.size && <span>{job.company.size} employees</span>}
                <span>{job.company.industry}</span>
              </div>
              <Link
                href={`/companies/${job.company.slug}`}
                className="inline-block mt-4 text-eu-blue font-medium hover:underline"
              >
                View company profile &rarr;
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              {applyUrl ? (
                <a
                  href={applyUrl}
                  target={applyUrl.startsWith('mailto:') ? undefined : '_blank'}
                  rel={applyUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="btn-primary w-full mb-4 text-lg py-4 block text-center"
                >
                  Apply Now
                </a>
              ) : (
                <button className="btn-primary w-full mb-4 text-lg py-4 opacity-50 cursor-not-allowed" disabled>
                  Apply Now
                </button>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Salary</span>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatSalary() || 'Competitive'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contract Type</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{getContractLabel(job.contractType)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Experience Level</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{getExperienceLabel(job.experienceLevel)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Work Type</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{getRemoteLabel(job.remoteType)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                  <p className="font-semibold">
                    <Link href={`/categories/${job.category.slug}`} className="text-eu-blue hover:underline">
                      {job.category.name}
                    </Link>
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Posted</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(job.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Expires</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(job.expiresAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {deadline && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${deadline.className}`}>
                      {deadline.label}
                    </span>
                  )}
                </div>
                {job.policyTags && job.policyTags.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Policy Areas</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {job.policyTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {POLICY_TAG_LABELS[tag as PolicyTag] || tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-3">Share this job</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://eujobs.brussels/jobs/${job.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 text-center"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://eujobs.brussels/jobs/${job.slug}`)}&text=${encodeURIComponent(`${job.title} at ${job.company.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 text-center"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
