import { getBibIntelligenceSystems } from '@/lib/bibData';
import BibCard from '@/components/bib/BibCard';

export const revalidate = 3600;

export default async function IntelligenceSystemsPage() {
  const items = await getBibIntelligenceSystems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Political Intelligence Systems</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {items.length} monitoring and intelligence platforms for EU public affairs
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-500 dark:text-gray-400 text-lg">No intelligence systems found.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <BibCard key={item._id} href={`/best-in-brussels/intelligence-systems/${item.slug}`} name={item.name} description={item.description} logoUrl={item.logoUrl} tags={item.features} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
