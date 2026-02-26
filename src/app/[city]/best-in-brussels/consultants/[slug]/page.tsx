import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBibConsultantBySlug } from '@/lib/bibData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const item = await getBibConsultantBySlug(slug);
  if (!item) return { title: 'Consultant Not Found' };

  const description = item.myJob?.substring(0, 160) || `Profile of ${item.name}, EU public affairs consultant in Brussels.`;
  return {
    title: `${item.name} - EU Public Affairs Consultant`,
    description,
    openGraph: { title: item.name, description, url: `https://eujobs.co/${city}/best-in-brussels/consultants/${slug}` },
  };
}

export default async function ConsultantDetailPage({ params }: PageProps) {
  const { city, slug } = await params;
  const item = await getBibConsultantBySlug(slug);
  if (!item) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: item.name,
    ...(item.title && { jobTitle: item.title }),
    ...(item.organization && { worksFor: { '@type': 'Organization', name: item.organization } }),
    ...(item.myJob && { description: item.myJob }),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/${city}/best-in-brussels/consultants`} className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
            &larr; Back to consultants
          </Link>
          <div className="flex items-center gap-4">
            {item.photoUrl ? (
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 shrink-0">
                <Image src={item.photoUrl} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold">{item.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
              {item.title && <p className="text-lg text-gray-300 mt-1">{item.title}</p>}
              {item.organization && (
                <p className="text-eu-yellow mt-1">
                  {item.organizationSlug ? (
                    <Link href={`/${city}/best-in-brussels/consultancies/${item.organizationSlug}`} className="hover:underline">{item.organization}</Link>
                  ) : item.organization}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {item.myJob && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.myJob}</p>
              </section>
            )}

            {item.experience?.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Experience</h2>
                <ul className="space-y-2">
                  {item.experience.map((exp: string, i: number) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-eu-blue mt-1 shrink-0">&#8226;</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {item.achievements && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Achievements</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.achievements}</p>
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
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
              <dl className="space-y-4">
                {item.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd className="mt-1 text-sm"><a href={`mailto:${item.email}`} className="text-eu-blue dark:text-blue-400 hover:underline">{item.email}</a></dd>
                  </div>
                )}
                {item.education?.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Education</dt>
                    <dd className="mt-1 space-y-1">
                      {item.education.map((e: string, i: number) => (
                        <p key={i} className="text-sm text-gray-900 dark:text-white">{e}</p>
                      ))}
                    </dd>
                  </div>
                )}
                {item.languages?.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Languages</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.languages.join(', ')}</dd>
                  </div>
                )}
                {item.interests && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.interests}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
