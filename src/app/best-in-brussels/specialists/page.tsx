export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getBibSpecialistCategories } from '@/lib/bibData';

export const revalidate = 3600;

export default async function SpecialistsPage() {
  const items = await getBibSpecialistCategories();

  const sectors = items.filter((i: any) => i.type === 'sector');
  const services = items.filter((i: any) => i.type === 'service');
  const other = items.filter((i: any) => !i.type || (i.type !== 'sector' && i.type !== 'service'));

  function renderGroup(title: string, groupItems: any[]) {
    if (groupItems.length === 0) return null;
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupItems.map((item: any) => (
            <Link
              key={item._id}
              href={`/best-in-brussels/specialists/${item.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {item.description.substring(0, 120)}
                </p>
              )}
              <div className="mt-2 flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                {item.consultancies?.length > 0 && <span>{item.consultancies.length} consultancies</span>}
                {item.lawFirms?.length > 0 && <span>{item.lawFirms.length} law firms</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Specialist Areas</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {items.length} specialist categories grouped by sector and service
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderGroup('By Sector', sectors)}
        {renderGroup('By Service', services)}
        {renderGroup('Other Specialisms', other)}
        {items.length === 0 && (
          <div className="text-center py-16"><p className="text-gray-500 dark:text-gray-400 text-lg">No specialist categories found.</p></div>
        )}
      </div>
    </div>
  );
}
