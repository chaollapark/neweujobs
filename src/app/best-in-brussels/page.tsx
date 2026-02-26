import Link from 'next/link';
import { getBibStats } from '@/lib/bibData';

export const revalidate = 3600;

const categories = [
  { name: 'Consultancies', href: '/best-in-brussels/consultancies', icon: '🏢', key: 'consultancies' as const, description: 'Public affairs and government relations consultancies operating in Brussels.' },
  { name: 'Consultants', href: '/best-in-brussels/consultants', icon: '👤', key: 'consultants' as const, description: 'Individual public affairs professionals and consultants.' },
  { name: 'Law Firms', href: '/best-in-brussels/law-firms', icon: '⚖️', key: 'lawFirms' as const, description: 'Law firms specialising in EU regulatory and public affairs law.' },
  { name: 'Intelligence Systems', href: '/best-in-brussels/intelligence-systems', icon: '📡', key: 'intelligenceSystems' as const, description: 'Political monitoring and intelligence platforms.' },
  { name: 'Digital Tools', href: '/best-in-brussels/digital-tools', icon: '💻', key: 'digitalTools' as const, description: 'Digital agencies and tools for public affairs.' },
  { name: 'Trainers', href: '/best-in-brussels/trainers', icon: '🎓', key: 'trainers' as const, description: 'Training providers for EU public affairs professionals.' },
  { name: 'Specialist Areas', href: '/best-in-brussels/specialists', icon: '🔍', key: 'specialists' as const, description: 'Browse by sector or service specialism.' },
  { name: 'Articles', href: '/best-in-brussels/articles', icon: '📰', key: 'articles' as const, description: 'Insights and analysis on the Brussels public affairs scene.' },
];

export default async function BestInBrusselsPage() {
  const stats = await getBibStats();

  const totalEntries = stats.consultancies + stats.consultants + stats.lawFirms +
    stats.intelligenceSystems + stats.digitalTools + stats.trainers;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Best in Brussels
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            The comprehensive directory of EU public affairs professionals, consultancies, law firms, and services in Brussels.
          </p>
          {totalEntries > 0 && (
            <p className="text-lg text-eu-yellow font-semibold">
              {totalEntries.toLocaleString()} listings across {categories.length} categories
            </p>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const count = stats[cat.key] || 0;
            return (
              <Link
                key={cat.key}
                href={cat.href}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow p-6"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {cat.name}
                </h2>
                {count > 0 && (
                  <span className="inline-block text-xs font-medium bg-eu-blue/10 dark:bg-eu-blue/20 text-eu-blue dark:text-blue-300 px-2 py-0.5 rounded mb-2">
                    {count} {count === 1 ? 'listing' : 'listings'}
                  </span>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Guides Link */}
        <div className="mt-12 text-center">
          <Link
            href="/best-in-brussels/guides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-eu-blue text-white hover:bg-eu-blue/90 transition-colors font-medium"
          >
            Browse Guides &amp; Best Practice
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
