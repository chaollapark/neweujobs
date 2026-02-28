export const dynamic = 'force-dynamic';

import { getBibConsultancies, getBibAllSpecialisms } from '@/lib/bibData';
import BibCard from '@/components/bib/BibCard';
import BibPagination from '@/components/bib/BibPagination';
import BibSpecialismChips from '@/components/bib/BibSpecialismChips';

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string; specialism?: string }>;
}

export default async function ConsultanciesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const specialism = params.specialism || '';

  const [{ items, total, totalPages }, specialisms] = await Promise.all([
    getBibConsultancies(currentPage, 12, specialism || undefined),
    getBibAllSpecialisms(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EU Public Affairs Consultancies</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {total > 0 ? `${total} consultancies` : 'Consultancies'} operating in Brussels
            {specialism && ` specialising in "${specialism}"`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BibSpecialismChips
          specialisms={specialisms}
          activeSpecialism={specialism}
          basePath="/best-in-brussels/consultancies"
        />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No consultancies found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <BibCard
                key={item._id}
                href={`/best-in-brussels/consultancies/${item.slug}`}
                name={item.name}
                description={item.description}
                logoUrl={item.logoUrl}
                tags={item.specialisms}
              />
            ))}
          </div>
        )}

        <BibPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/best-in-brussels/consultancies"
          extraParams={specialism ? `&specialism=${encodeURIComponent(specialism)}` : ''}
        />
      </div>
    </div>
  );
}
