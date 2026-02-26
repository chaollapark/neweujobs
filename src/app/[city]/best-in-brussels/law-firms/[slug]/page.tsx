import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBibLawFirmBySlug } from '@/lib/bibData';
import { fetchJobsForEntity } from '@/models/Job';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const item = await getBibLawFirmBySlug(slug);
  if (!item) return { title: 'Law Firm Not Found' };
  const description = item.description?.substring(0, 160) || `Learn about ${item.name}, an EU law firm in Brussels.`;
  return { title: `${item.name} - EU Law Firm`, description };
}

export default async function LawFirmDetailPage({ params }: PageProps) {
  const { city, slug } = await params;
  const item = await getBibLawFirmBySlug(slug);
  if (!item) notFound();

  const relatedJobs = await fetchJobsForEntity(item.contact?.website, item.name, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/${city}/best-in-brussels/law-firms`} className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">&larr; Back to law firms</Link>
          <div className="flex items-center gap-4">
            {item.logoUrl && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                <Image src={item.logoUrl} alt={item.name} width={64} height={64} className="w-full h-full object-contain" />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {item.description && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.description}</p>
              </section>
            )}
            {item.specialisms?.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Specialisms</h2>
                <div className="flex flex-wrap gap-2">
                  {item.specialisms.map((s: string, i: number) => (
                    <span key={i} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </section>
            )}
            {item.keyPartners?.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Partners</h2>
                <ul className="space-y-2">
                  {item.keyPartners.map((p: string, i: number) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-eu-blue mt-1">&#8226;</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {relatedJobs.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Related Jobs</h2>
                <div className="space-y-4">
                  {relatedJobs.map((job: any) => (
                    <Link key={job._id} href={`/${city}/jobs/${job.slug}`} className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-eu-blue transition-colors bg-gray-50 dark:bg-gray-900">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {job.companyName && <span>{job.companyName}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {item.contact && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
                <dl className="space-y-3">
                  {item.contact.address && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.contact.address}</dd></div>)}
                  {item.contact.phone && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.contact.phone}</dd></div>)}
                  {item.contact.email && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt><dd className="mt-1 text-sm"><a href={`mailto:${item.contact.email}`} className="text-eu-blue dark:text-blue-400 hover:underline">{item.contact.email}</a></dd></div>)}
                  {item.contact.website && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt><dd className="mt-1 text-sm"><a href={item.contact.website} target="_blank" rel="noopener noreferrer" className="text-eu-blue dark:text-blue-400 hover:underline break-all">{item.contact.website}</a></dd></div>)}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
