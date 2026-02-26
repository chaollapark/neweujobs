import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrgCareerGuideBySlug } from '@/lib/orgCareerGuideData'

export const revalidate = 86400;
export const dynamicParams = true;

interface Props {
  params: Promise<{ city: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params
  const guide = await getOrgCareerGuideBySlug(slug)

  if (!guide) {
    return { title: 'Career Guide Not Found' }
  }

  const description = guide.description || `Career guide for ${guide.organization}. Learn how to get hired, interview tips, salary info, and insider advice.`

  return {
    title: `${guide.title}`,
    description,
    openGraph: {
      title: guide.title,
      description,
      url: `https://eujobs.co/${city}/career-guides/${slug}`,
      siteName: 'EU Jobs',
      type: 'article',
      publishedTime: guide.generatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description,
    },
  }
}

export default async function OrgCareerGuidePage({ params }: Props) {
  const { city, slug } = await params
  const guide = await getOrgCareerGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    datePublished: guide.generatedAt,
    author: {
      '@type': 'Organization',
      name: 'EU Jobs',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EU Jobs',
      url: 'https://eujobs.co',
    },
    mainEntityOfPage: `https://eujobs.co/${city}/career-guides/${slug}`,
    ...(guide.description && { description: guide.description }),
    wordCount: guide.wordCount,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://eujobs.co/${city}` },
      { '@type': 'ListItem', position: 2, name: 'Career Guides', item: `https://eujobs.co/${city}/career-guides` },
      { '@type': 'ListItem', position: 3, name: guide.organization },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500 dark:text-gray-400">
            <Link href={`/${city}`} className="hover:text-eu-blue dark:hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${city}/career-guides`} className="hover:text-eu-blue dark:hover:text-blue-400">Career Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{guide.organization}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{guide.title}</h1>
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            <span>{guide.wordCount?.toLocaleString()} words</span>
            {guide.entitySlug && (
              <>
                <span>•</span>
                <Link
                  href={`/${city}/lobbying-entities/${guide.entitySlug}`}
                  className="hover:text-white underline transition-colors"
                >
                  View {guide.organization} entity profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-eu-blue dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 dark:prose-li:text-gray-300 dark:prose-td:text-gray-300 dark:prose-th:text-gray-200"
            dangerouslySetInnerHTML={{ __html: guide.contentHtml || '' }}
          />
        </article>

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link href={`/${city}/career-guides`} className="text-eu-blue dark:text-blue-400 font-medium hover:underline">
            &larr; Browse all career guides
          </Link>
          {guide.entitySlug && (
            <Link
              href={`/${city}/lobbying-entities/${guide.entitySlug}`}
              className="text-eu-blue dark:text-blue-400 font-medium hover:underline"
            >
              View {guide.organization} entity profile &rarr;
            </Link>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-eu-blue rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Find Your EU Career?</h3>
          <p className="text-gray-300 mb-6">Browse hundreds of opportunities in EU institutions, NGOs, and public affairs.</p>
          <Link href={`/${city}/jobs`} className="bg-eu-yellow text-eu-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}
