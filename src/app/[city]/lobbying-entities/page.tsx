import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';
import { getTopInterests } from '@/lib/interestAggregation';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string; interest?: string }>;
}

export default async function LobbyingEntitiesPage({ params, searchParams }: PageProps) {
  const { city } = await params;
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10));
  const interestFilter = sp.interest || '';
  const perPage = 20;

  await dbConnect();

  const query: Record<string, any> = {};
  if (interestFilter) {
    query.interests = interestFilter;
  }

  const [entities, totalCount, interestData] = await Promise.all([
    LobbyingEntityModel.find(query)
      .sort({ name: 1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean(),
    LobbyingEntityModel.countDocuments(query),
    getTopInterests(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);
  const serializedEntities = JSON.parse(JSON.stringify(entities));

  function truncate(text: string | undefined | null, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '...';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EU Lobbying Entities
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore organizations registered in the EU Transparency Register.
            {totalCount > 0 && (
              <span className="block mt-2 text-lg">
                {totalCount.toLocaleString()} {interestFilter ? `entities interested in "${interestFilter}"` : 'entities'} found
              </span>
            )}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Interest Filter Chips */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Filter by Interest
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {interestFilter && (
              <Link
                href={`/${city}/lobbying-entities`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Clear filter &times;
              </Link>
            )}
            {interestData.topInterests.map((item) => (
              <Link
                key={item.interest}
                href={`/${city}/lobbying-entities?interest=${encodeURIComponent(item.interest)}`}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  interestFilter === item.interest
                    ? 'bg-eu-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {item.interest}
                <span className="ml-1.5 text-xs opacity-70">({item.count})</span>
              </Link>
            ))}
            <Link
              href={`/${city}/lobbying-entities/interests`}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-eu-blue/10 dark:bg-eu-blue/20 text-eu-blue dark:text-blue-300 hover:bg-eu-blue/20 dark:hover:bg-eu-blue/30 transition-colors"
            >
              View All Interests &rarr;
            </Link>
          </div>
        </div>

        {/* Entities Grid */}
        {serializedEntities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No entities found matching your criteria.</p>
            <Link href={`/${city}/lobbying-entities`} className="text-eu-blue hover:underline mt-4 inline-block">
              View all entities
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serializedEntities.map((entity: any) => (
              <Link
                key={entity._id}
                href={`/${city}/lobbying-entities/${entity.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                    {entity.name}
                  </h3>
                  {entity.acronym && (
                    <span className="ml-2 shrink-0 text-xs font-medium bg-eu-blue/10 dark:bg-eu-blue/20 text-eu-blue dark:text-blue-300 px-2 py-0.5 rounded">
                      {entity.acronym}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                  {truncate(entity.description, 150)}
                </p>

                {entity.interests && entity.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entity.interests.slice(0, 3).map((interest: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                    {entity.interests.length > 3 && (
                      <span className="inline-block text-xs text-gray-500 dark:text-gray-400 px-1 py-0.5">
                        +{entity.interests.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {(entity.website || entity.webSiteURL) && (
                  <p className="text-xs text-eu-blue dark:text-blue-400 truncate">
                    {entity.website || entity.webSiteURL}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/${city}/lobbying-entities?page=${currentPage - 1}${interestFilter ? `&interest=${encodeURIComponent(interestFilter)}` : ''}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                &larr; Previous
              </Link>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={`/${city}/lobbying-entities?page=${pageNum}${interestFilter ? `&interest=${encodeURIComponent(interestFilter)}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-eu-blue text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/${city}/lobbying-entities?page=${currentPage + 1}${interestFilter ? `&interest=${encodeURIComponent(interestFilter)}` : ''}`}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                Next &rarr;
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
