import Link from 'next/link'
import { getAllCompanies, getAllCompanyJobCounts } from '@/lib/data'

export const revalidate = 60

const COMPANIES_PER_PAGE = 30

interface CompaniesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  // Fetch companies and job counts in parallel — single aggregation instead of N+1
  const [companies, jobCounts] = await Promise.all([
    getAllCompanies(),
    getAllCompanyJobCounts(),
  ])

  const companiesWithCounts = companies.map((company) => ({
    ...company,
    jobCount: jobCounts.get(company.slug) || 0,
  }))

  const totalPages = Math.ceil(companiesWithCounts.length / COMPANIES_PER_PAGE)
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE
  const paginatedCompanies = companiesWithCounts.slice(startIndex, startIndex + COMPANIES_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
          <p className="text-gray-300">
            Discover top employers in the EU bubble ({companiesWithCounts.length} companies)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map(company => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:border-eu-blue border-2 border-transparent dark:border-gray-700 dark:hover:border-eu-blue transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-eu-blue flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {company.name}
                    </h2>
                    {company.verified && (
                      <span className="text-blue-500 flex-shrink-0" title="Verified">&#10003;</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{company.industry}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{company.location}</p>
                  <p className="text-sm text-eu-blue font-medium mt-2">
                    {company.jobCount} open position{company.jobCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {paginatedCompanies.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No companies found</h3>
            <p className="text-gray-600 dark:text-gray-300">Check back soon for new employers.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-10">
            {currentPage > 1 && (
              <Link
                href={`/companies?page=${currentPage - 1}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-eu-blue transition-colors"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                typeof item === 'string' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <Link
                    key={item}
                    href={`/companies?page=${item}`}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      item === currentPage
                        ? 'bg-eu-blue text-white border-eu-blue'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-eu-blue'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}

            {currentPage < totalPages && (
              <Link
                href={`/companies?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-eu-blue transition-colors"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
