import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getCompanyBySlug, getJobsByCompany } from '@/lib/data'
import JobCard from '@/components/jobs/JobCard'

export const revalidate = 60

interface CompanyDetailPageProps {
  params: Promise<{ city: string; slug: string }>
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { city, slug } = await params
  const company = await getCompanyBySlug(slug, city)

  if (!company) {
    return { title: 'Company Not Found' }
  }

  return {
    title: `${company.name} - Jobs & Company Profile`,
    description: `View open positions and learn about ${company.name}. ${company.industry} in ${company.location}.`,
    openGraph: {
      title: `${company.name} - EU Jobs`,
      description: `View open positions at ${company.name}`,
      url: `https://eujobs.co/${city}/companies/${company.slug}`,
      siteName: 'EU Jobs',
      type: 'website',
    },
  }
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { city, slug } = await params
  const [company, companyJobs] = await Promise.all([
    getCompanyBySlug(slug, city),
    getJobsByCompany(slug, city),
  ])

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Company Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-300 mb-6">
            <Link href={`/${city}`} className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${city}/companies`} className="hover:text-white">Companies</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{company.name}</span>
          </nav>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-eu-blue font-bold text-3xl">
                {company.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                {company.verified && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">&#10003; Verified</span>
                )}
              </div>
              <p className="text-gray-300 mt-2">{company.industry}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-300">
                <span>{company.location}</span>
                {company.size && <span>{company.size} employees</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* About */}
            {company.description && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {company.name}</h2>
                <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
              </div>
            )}

            {/* Open Positions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Open Positions ({companyJobs.length})
              </h2>

              {companyJobs.length > 0 ? (
                <div className="space-y-4">
                  {companyJobs.map(job => (
                    <JobCard key={job.id} job={job} citySlug={city} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No open positions at the moment.</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Check back soon for new opportunities.
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Company Info</h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Industry</span>
                  <p className="font-medium text-gray-900 dark:text-white">{company.industry}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                  <p className="font-medium text-gray-900 dark:text-white">{company.location}</p>
                </div>
                {company.size && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Company Size</span>
                    <p className="font-medium text-gray-900 dark:text-white">{company.size} employees</p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Website</span>
                    <p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-eu-blue hover:underline font-medium"
                      >
                        {company.website.replace('https://', '').replace('http://', '')}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <Link href="/alerts" className="btn-secondary w-full block text-center">
                  Set Job Alert
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
