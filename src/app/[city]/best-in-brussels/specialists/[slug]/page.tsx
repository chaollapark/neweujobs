import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBibSpecialistCategoryBySlug } from '@/lib/bibData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps { params: Promise<{ city: string; slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const item = await getBibSpecialistCategoryBySlug(slug);
  if (!item) return { title: 'Specialist Area Not Found' };
  return { title: `${item.name} - EU Public Affairs Specialism`, description: item.description?.substring(0, 160) };
}

export default async function SpecialistDetailPage({ params }: PageProps) {
  const { city, slug } = await params;
  const item = await getBibSpecialistCategoryBySlug(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/${city}/best-in-brussels/specialists`} className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">&larr; Back to specialist areas</Link>
          <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
          {item.type && (
            <span className="inline-block mt-2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">{item.type}</span>
          )}
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {item.description && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.description}</p>
            </section>
          )}

          {item.consultancies?.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Consultancies</h2>
              <div className="flex flex-wrap gap-2">
                {item.consultancies.map((slug: string) => (
                  <Link key={slug} href={`/${city}/best-in-brussels/consultancies/${slug}`}
                    className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-eu-blue/10 transition-colors">
                    {slug.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {item.lawFirms?.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Law Firms</h2>
              <div className="flex flex-wrap gap-2">
                {item.lawFirms.map((slug: string) => (
                  <Link key={slug} href={`/${city}/best-in-brussels/law-firms/${slug}`}
                    className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-eu-blue/10 transition-colors">
                    {slug.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
