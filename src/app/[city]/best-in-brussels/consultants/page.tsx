import { getBibConsultants, getBibAllSpecialisms } from '@/lib/bibData';
import BibConsultantCard from '@/components/bib/BibConsultantCard';
import BibPagination from '@/components/bib/BibPagination';
import BibSpecialismChips from '@/components/bib/BibSpecialismChips';
import BibAlphabetFilter from '@/components/bib/BibAlphabetFilter';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string; specialism?: string; letter?: string }>;
}

export default async function ConsultantsPage({ params, searchParams }: PageProps) {
  const { city } = await params;
  const searchP = await searchParams;
  const currentPage = Math.max(1, parseInt(searchP.page || '1', 10));
  const specialism = searchP.specialism || '';
  const letter = searchP.letter || '';

  const [{ items, total, totalPages }, specialisms] = await Promise.all([
    getBibConsultants(currentPage, 24, specialism || undefined, letter || undefined),
    getBibAllSpecialisms(),
  ]);

  const extraParams = [
    specialism ? `specialism=${encodeURIComponent(specialism)}` : '',
    letter ? `letter=${letter}` : '',
  ].filter(Boolean).join('&');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EU Public Affairs Consultants</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {total > 0 ? `${total} consultants` : 'Consultants'} in Brussels
            {specialism && ` specialising in "${specialism}"`}
            {letter && ` starting with "${letter}"`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BibAlphabetFilter
          activeLetter={letter}
          basePath={`/${city}/best-in-brussels/consultants`}
          extraParams={specialism ? `specialism=${encodeURIComponent(specialism)}` : ''}
        />

        <BibSpecialismChips
          specialisms={specialisms}
          activeSpecialism={specialism}
          basePath={`/${city}/best-in-brussels/consultants`}
        />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No consultants found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item: any) => (
              <BibConsultantCard
                key={item._id}
                slug={item.slug}
                name={item.name}
                title={item.title}
                organization={item.organization}
                photoUrl={item.photoUrl}
                specialisms={item.specialisms}
              />
            ))}
          </div>
        )}

        <BibPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/${city}/best-in-brussels/consultants`}
          extraParams={extraParams ? `&${extraParams}` : ''}
        />
      </div>
    </div>
  );
}
