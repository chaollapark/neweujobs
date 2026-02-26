import Link from 'next/link';
import { getBibEditorialPages } from '@/lib/bibData';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ city: string }>;
}

export default async function GuidesPage({ params }: PageProps) {
  const { city } = await params;
  const items = await getBibEditorialPages();

  // Group by section
  const grouped: Record<string, any[]> = {};
  const topLevel: any[] = [];

  items.forEach((item: any) => {
    if (item.parentSlug) {
      if (!grouped[item.parentSlug]) grouped[item.parentSlug] = [];
      grouped[item.parentSlug].push(item);
    } else {
      topLevel.push(item);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Guides &amp; Best Practice</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Expert guides on EU public affairs best practice and choosing the right partner
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {topLevel.length === 0 && items.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-500 dark:text-gray-400 text-lg">No guides found.</p></div>
        ) : (
          <div className="space-y-10">
            {topLevel.map((parent: any) => (
              <div key={parent._id}>
                <Link
                  href={`/${city}/best-in-brussels/guides/${parent.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow p-6 mb-4"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{parent.title}</h2>
                  {parent.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {parent.content.substring(0, 200)}
                    </p>
                  )}
                </Link>

                {grouped[parent.slug]?.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 ml-4">
                    {grouped[parent.slug].map((child: any) => (
                      <Link
                        key={child._id}
                        href={`/${city}/best-in-brussels/guides/${child.slug}`}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow p-4"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{child.title}</h3>
                        {child.content && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {child.content.substring(0, 120)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Items without parent that aren't parents themselves */}
            {items.filter((i: any) => !i.parentSlug && !topLevel.some((t: any) => grouped[t.slug]?.includes(i))).length > 0 && topLevel.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/${city}/best-in-brussels/guides/${item.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow p-5"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
