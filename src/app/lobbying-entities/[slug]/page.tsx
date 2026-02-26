import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';
import { fetchJobsForEntity } from '@/models/Job';
import { getCareerGuidesForEntity } from '@/lib/careerGuideData';
import { getOrgCareerGuideByEntitySlug } from '@/lib/orgCareerGuideData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEntity(slug: string) {
  await dbConnect();
  const entity = await LobbyingEntityModel.findOne({ slug }).lean();
  if (!entity) return null;
  return JSON.parse(JSON.stringify(entity));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getEntity(slug);

  if (!entity) {
    return { title: 'Entity Not Found - EU Jobs Brussels' };
  }

  const description = entity.description
    ? entity.description.substring(0, 160)
    : `Learn about ${entity.name}, a lobbying entity registered in the EU Transparency Register.`;

  return {
    title: `${entity.name}${entity.acronym ? ` (${entity.acronym})` : ''} - EU Lobbying Entity`,
    description,
    openGraph: {
      title: `${entity.name} - EU Lobbying Entity`,
      description,
      url: `https://eujobs.brussels/lobbying-entities/${slug}`,
      siteName: 'EU Jobs Brussels',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: entity.name,
      description,
    },
  };
}

export default async function LobbyingEntityPage({ params }: PageProps) {
  const { slug } = await params;
  const entity = await getEntity(slug);

  if (!entity) {
    notFound();
  }

  const [relatedJobs, relatedGuides, orgCareerGuide] = await Promise.all([
    fetchJobsForEntity(entity.website || entity.webSiteURL, entity.name, 3),
    getCareerGuidesForEntity(entity.interests || []),
    getOrgCareerGuideByEntitySlug(slug),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: entity.name,
    ...(entity.acronym && { alternateName: entity.acronym }),
    ...(entity.description && { description: entity.description }),
    ...((entity.website || entity.webSiteURL) && { url: entity.website || entity.webSiteURL }),
    ...(entity.registrationDate && { foundingDate: entity.registrationDate }),
  };

  function formatDate(dateStr: string | undefined | null): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/lobbying-entities"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            &larr; Back to all entities
          </Link>
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {entity.name}
              </h1>
              {entity.acronym && (
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {entity.acronym}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {entity.description && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  About
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {entity.description}
                </p>
              </section>
            )}

            {/* Organization Career Guide */}
            {orgCareerGuide && (
              <Link
                href={`/career-guides/${orgCareerGuide.slug}`}
                className="block bg-gradient-to-r from-eu-blue to-eu-dark rounded-lg shadow-md p-6 group hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                      Career Guide for {entity.name}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      How to get hired, interview tips, salary info &amp; insider advice
                      {orgCareerGuide.wordCount && ` · ${orgCareerGuide.wordCount.toLocaleString()} words`}
                    </p>
                  </div>
                  <span className="text-white text-2xl group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            )}

            {/* Goals */}
            {entity.goals && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Goals &amp; Objectives
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {entity.goals}
                </p>
              </section>
            )}

            {/* Interests */}
            {entity.interests && entity.interests.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Areas of Interest
                </h2>
                <div className="flex flex-wrap gap-2">
                  {entity.interests.map((interest: string, idx: number) => (
                    <Link
                      key={idx}
                      href={`/lobbying-entities?interest=${encodeURIComponent(interest)}`}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-eu-blue/10 dark:hover:bg-eu-blue/20 hover:text-eu-blue dark:hover:text-blue-300 transition-colors"
                    >
                      {interest}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Related Jobs
                </h2>
                <div className="space-y-4">
                  {relatedJobs.map((job: any) => (
                    <Link
                      key={job._id}
                      href={`/jobs/${job.slug}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-eu-blue dark:hover:border-eu-blue transition-colors bg-gray-50 dark:bg-gray-900"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {job.companyName && <span>{job.companyName}</span>}
                        {job.city && <span>{job.city}</span>}
                        {job.type && <span>{job.type}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Career Guides */}
            {relatedGuides.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Career Guides
                </h2>
                <div className="space-y-4">
                  {relatedGuides.map((guide: any) => (
                    <Link
                      key={guide._id}
                      href={`/blog/${encodeURIComponent(guide.slug)}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-eu-blue dark:hover:border-eu-blue transition-colors bg-gray-50 dark:bg-gray-900"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {guide.title}
                      </h3>
                      {guide.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {guide.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Details
              </h2>
              <dl className="space-y-4">
                {entity.registrationCategory && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Registration Category
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {entity.registrationCategory}
                    </dd>
                  </div>
                )}

                {entity.registrationDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Registration Date
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(entity.registrationDate)}
                    </dd>
                  </div>
                )}

                {entity.identificationCode && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Identification Code
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono text-xs">
                      {entity.identificationCode}
                    </dd>
                  </div>
                )}

                {entity.lastUpdateDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(entity.lastUpdateDate)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Website Link */}
            {(entity.website || entity.webSiteURL) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Website
                </h2>
                <a
                  href={entity.website || entity.webSiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-eu-blue dark:text-blue-400 hover:underline break-all text-sm"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {entity.website || entity.webSiteURL}
                </a>
              </div>
            )}

            {/* Interest Represented */}
            {entity.interestRepresented && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Interest Represented
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {entity.interestRepresented}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
