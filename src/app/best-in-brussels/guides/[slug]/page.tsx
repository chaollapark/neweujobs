import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBibEditorialPageBySlug, getBibEditorialPages } from '@/lib/bibData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBibEditorialPageBySlug(slug);
  if (!item) return { title: 'Guide Not Found' };
  return { title: item.title, description: item.content?.substring(0, 160) };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getBibEditorialPageBySlug(slug);
  if (!item) notFound();

  // Get child pages if this is a parent
  const allPages = await getBibEditorialPages();
  const childPages = allPages.filter((p: any) => p.parentSlug === slug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/best-in-brussels/guides" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">&larr; Back to guides</Link>
          <h1 className="text-3xl md:text-4xl font-bold">{item.title}</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {item.content && (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6 md:p-8 mb-8">
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {item.content}
            </div>
          </article>
        )}

        {childPages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">In this section</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {childPages.map((child: any) => (
                <Link
                  key={child._id}
                  href={`/best-in-brussels/guides/${child.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow p-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{child.title}</h3>
                  {child.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{child.content.substring(0, 120)}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Parent link */}
        {item.parentSlug && (
          <div className="mt-8">
            <Link
              href={`/best-in-brussels/guides/${item.parentSlug}`}
              className="text-eu-blue dark:text-blue-400 hover:underline text-sm"
            >
              &larr; Back to parent section
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
