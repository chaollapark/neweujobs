import { Metadata } from 'next'
import Link from 'next/link'
import { getOrgCareerGuides, getOrgCareerGuideCount } from '@/lib/orgCareerGuideData'

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Organization Career Guides - EU Jobs Brussels',
  description: 'Browse career guides for over 12,000 EU lobbying organizations. Learn how to get hired, interview tips, salary info, and insider advice.',
  openGraph: {
    title: 'Organization Career Guides - EU Jobs Brussels',
    description: 'Browse career guides for over 12,000 EU lobbying organizations.',
    url: 'https://eujobs.brussels/career-guides',
    siteName: 'EU Jobs Brussels',
    type: 'website',
  },
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function CareerGuidesListingPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const perPage = 50;

  const [{ items: guides, total, totalPages }, totalCount] = await Promise.all([
    getOrgCareerGuides(page, perPage),
    getOrgCareerGuideCount(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Organization Career Guides</h1>
          <p className="text-gray-300 mt-2">
            Comprehensive career guides for {totalCount.toLocaleString()} EU lobbying organizations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Guide grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide: any) => (
            <Link
              key={guide.slug}
              href={`/career-guides/${guide.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-eu-blue dark:hover:border-eu-blue transition-all p-6 group"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-eu-blue dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                {guide.organization}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {guide.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>{guide.wordCount?.toLocaleString()} words</span>
                {guide.entitySlug && (
                  <span className="text-eu-blue dark:text-blue-400">View entity &rarr;</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {guides.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No guides found</h3>
            <p className="text-gray-600 dark:text-gray-300">Check back soon for organization career guides!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/career-guides?page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-eu-blue transition-colors"
              >
                &larr; Previous
              </Link>
            )}

            <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages} ({total.toLocaleString()} guides)
            </span>

            {page < totalPages && (
              <Link
                href={`/career-guides?page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-eu-blue transition-colors"
              >
                Next &rarr;
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
