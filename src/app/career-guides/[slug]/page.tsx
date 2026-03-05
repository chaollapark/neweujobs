import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrgCareerGuideBySlug } from '@/lib/orgCareerGuideData'
import FAQSection from '@/components/seo/FAQSection'
import FAQPageJsonLd from '@/components/seo/FAQPageJsonLd'
import { RelatedContent, getRelatedLinks } from '@/components/RelatedContent'

export const revalidate = 86400;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>
}

function extractFirstSentence(html: string | undefined, maxLen: number): string {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const match = text.match(/^(.+?[.!?])\s/)
  const sentence = match ? match[1] : text
  if (sentence.length <= maxLen) return sentence
  const truncated = sentence.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + '...'
}

function extractFAQsFromHTML(html: string | undefined): { question: string; answer: string }[] {
  if (!html) return []
  const faqs: { question: string; answer: string }[] = []

  // Match H2/H3 headings that look like questions, paired with next paragraph
  const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = match[1].replace(/<[^>]*>/g, '').trim()
    // Check if it looks like a question
    if (/\?$|^(what|how|why|when|where|who|is |are |can |do |does |will |should )/i.test(heading)) {
      // Get the text after this heading until the next heading
      const afterHeading = html.slice(match.index + match[0].length)
      const nextHeadingMatch = afterHeading.match(/<h[23][^>]*>/)
      const section = nextHeadingMatch
        ? afterHeading.slice(0, nextHeadingMatch.index)
        : afterHeading.slice(0, 1000)
      // Extract first paragraph
      const paraMatch = section.match(/<p[^>]*>(.*?)<\/p>/is)
      if (paraMatch) {
        const answer = paraMatch[1].replace(/<[^>]*>/g, '').trim()
        if (answer.length > 20) {
          faqs.push({ question: heading, answer })
        }
      }
    }
    if (faqs.length >= 5) break
  }
  return faqs
}

function getTemplateFAQs(orgName: string): { question: string; answer: string }[] {
  return [
    { question: `What is ${orgName}?`, answer: `${orgName} is an organisation active in the EU affairs ecosystem. Visit their entity profile on EUJobs.co for detailed information about their activities, interests, and registration in the EU Transparency Register.` },
    { question: `How do I apply for jobs at ${orgName}?`, answer: `Check EUJobs.co regularly for the latest vacancies at ${orgName}. You can also visit their official website for direct applications. Setting up job alerts on EUJobs.co ensures you never miss a new opening.` },
    { question: `What career opportunities does ${orgName} offer?`, answer: `${orgName} offers various career opportunities depending on their focus area. Roles may include policy positions, research, communications, administrative support, and management roles. Check our career guide for detailed information.` },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = await getOrgCareerGuideBySlug(slug)

  if (!guide) {
    return { title: 'Career Guide Not Found - EU Jobs Brussels' }
  }

  const description = guide.description
    || extractFirstSentence(guide.contentHtml, 155)
    || `Career guide for ${guide.organization}. Learn how to get hired, interview tips, salary info, and insider advice.`

  return {
    title: `${guide.title} - EU Jobs Brussels`,
    description,
    openGraph: {
      title: guide.title,
      description,
      url: `https://eujobs.co/career-guides/${slug}`,
      siteName: 'EU Jobs Brussels',
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
  const { slug } = await params
  const guide = await getOrgCareerGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  // Extract FAQs from content or use template
  const extractedFAQs = extractFAQsFromHTML(guide.contentHtml)
  const faqs = extractedFAQs.length >= 2
    ? extractedFAQs
    : getTemplateFAQs(guide.organization)

  const relatedLinks = await getRelatedLinks({ companyName: guide.organization })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    datePublished: guide.generatedAt,
    author: {
      '@type': 'Organization',
      name: 'EU Jobs Brussels',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EU Jobs Brussels',
      url: 'https://eujobs.co',
    },
    mainEntityOfPage: `https://eujobs.co/career-guides/${slug}`,
    ...(guide.description && { description: guide.description }),
    wordCount: guide.wordCount,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eujobs.co' },
      { '@type': 'ListItem', position: 2, name: 'Career Guides', item: 'https://eujobs.co/career-guides' },
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
      <FAQPageJsonLd items={faqs} />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="breadcrumb" className="flex text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-eu-blue dark:hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/career-guides" className="hover:text-eu-blue dark:hover:text-blue-400">Career Guides</Link>
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
                  href={`/lobbying-entities/${guide.entitySlug}`}
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

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <FAQSection items={faqs} heading={`${guide.organization} - Frequently Asked Questions`} />
        )}

        {/* Related Content (Internal Links) */}
        <RelatedContent items={relatedLinks} heading="Explore More" />

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/career-guides" className="text-eu-blue dark:text-blue-400 font-medium hover:underline">
            &larr; Browse all career guides
          </Link>
          {guide.entitySlug && (
            <Link
              href={`/lobbying-entities/${guide.entitySlug}`}
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
          <Link href="/jobs" className="bg-eu-yellow text-eu-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}
