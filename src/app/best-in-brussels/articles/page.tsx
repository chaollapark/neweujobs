export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getBibArticles } from '@/lib/bibData';
import BibPagination from '@/components/bib/BibPagination';

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const { items, total, totalPages } = await getBibArticles(currentPage, 10);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Articles &amp; Insights</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {total > 0 ? `${total} articles` : 'Articles'} on EU public affairs in Brussels
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-500 dark:text-gray-400 text-lg">No articles found.</p></div>
        ) : (
          <div className="space-y-6">
            {items.map((item: any) => (
              <Link
                key={item._id}
                href={`/best-in-brussels/articles/${item.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {item.featuredImage && (
                    <div className="sm:w-48 h-32 sm:h-auto shrink-0 bg-gray-100 dark:bg-gray-700">
                      <Image src={item.featuredImage} alt={item.title} width={192} height={128} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{item.title}</h2>
                    {item.excerpt && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{item.excerpt}</p>}
                    <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {item.author && <span>{item.author}</span>}
                      {item.publishedDate && <span>{new Date(item.publishedDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <BibPagination currentPage={currentPage} totalPages={totalPages} basePath="/best-in-brussels/articles" />
      </div>
    </div>
  );
}
