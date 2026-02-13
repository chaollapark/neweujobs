import Link from 'next/link';
import { getAllInterests } from '@/lib/interestAggregation';

export const revalidate = 3600;

export default async function InterestsPage() {
  const interests = await getAllInterests();

  const maxCount = interests.length > 0 ? interests[0].count : 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/lobbying-entities"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            &larr; Back to entities
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All Lobbying Interests
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse all {interests.length.toLocaleString()} areas of interest represented in the EU Transparency Register.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {interests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No interests found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {interests.map((item) => {
              const intensity = Math.max(0.15, item.count / maxCount);
              return (
                <Link
                  key={item.interest}
                  href={`/lobbying-entities?interest=${encodeURIComponent(item.interest)}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-eu-blue dark:hover:border-eu-blue transition-all p-5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                    {item.interest}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-eu-blue rounded-full transition-all"
                        style={{ width: `${intensity * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {item.count.toLocaleString()} {item.count === 1 ? 'entity' : 'entities'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
