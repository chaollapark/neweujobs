import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCareerGuideBySlug, getRelatedEntitiesForGuide, getAllCareerGuideSlugs } from '@/lib/careerGuideData'
import FAQSection from '@/components/seo/FAQSection'
import FAQPageJsonLd from '@/components/seo/FAQPageJsonLd'
import { RelatedContent, getRelatedLinks } from '@/components/RelatedContent'

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>
}

function sanitizeDescription(raw: string | undefined, contentHtml: string | undefined): string {
  if (raw) {
    // Strip "Date: ... Author: ..." prefixes
    let cleaned = raw.replace(/^Date:\s*[\d\-\/]+\s*(Author:\s*[^\n.]+)?[\s.]*/i, '').trim()
    if (cleaned.length > 10) {
      return truncateAtWord(cleaned, 155)
    }
  }
  if (contentHtml) {
    const text = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const firstSentence = text.match(/^(.+?[.!?])\s/)
    if (firstSentence && firstSentence[1].length >= 40) {
      return truncateAtWord(firstSentence[1], 155)
    }
    return truncateAtWord(text, 155)
  }
  return ''
}

function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const truncated = text.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + '...'
}

function extractFAQsFromContent(
  title: string,
  contentHtml: string | undefined
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  // If the post title is a question, use it as FAQ #1
  if (title && /\?$/.test(title.trim()) && contentHtml) {
    const text = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const firstParaMatch = text.match(/^(.+?[.!?])\s/)
    if (firstParaMatch) {
      faqs.push({ question: title.trim(), answer: firstParaMatch[1] })
    }
  }

  if (!contentHtml) return faqs

  // Extract H2/H3 question headings
  const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const heading = match[1].replace(/<[^>]*>/g, '').trim()
    if (/\?$|^(what|how|why|when|where|who|is |are |can |do |does |will |should )/i.test(heading)) {
      const afterHeading = contentHtml.slice(match.index + match[0].length)
      const nextHeadingMatch = afterHeading.match(/<h[23][^>]*>/)
      const section = nextHeadingMatch
        ? afterHeading.slice(0, nextHeadingMatch.index)
        : afterHeading.slice(0, 1000)
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

export async function generateStaticParams() {
  try {
    const slugs = await getAllCareerGuideSlugs()
    return slugs.map((slug) => ({ slug: encodeURIComponent(slug) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getCareerGuideBySlug(decodeURIComponent(slug))

  if (!post) {
    return { title: 'Article Not Found - EU Jobs Brussels' }
  }

  const description = sanitizeDescription(post.description, post.contentHtml)
    || `${post.title} - Career advice and insights for working in EU institutions and Brussels.`

  return {
    title: `${post.title} - EU Jobs Brussels Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://eujobs.co/blog/${slug}`,
      siteName: 'EU Jobs Brussels',
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author || 'EU Jobs Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getCareerGuideBySlug(decodeURIComponent(slug))

  if (!post) {
    notFound()
  }

  const [relatedEntities, relatedLinks] = await Promise.all([
    getRelatedEntitiesForGuide(post.relatedInterests || [], 6),
    getRelatedLinks({ interests: post.relatedInterests }),
  ])
  const blogFAQs = extractFAQsFromContent(post.title, post.contentHtml)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedDate,
    author: {
      '@type': 'Organization',
      name: post.author || 'EU Jobs Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EU Jobs Brussels',
      url: 'https://eujobs.co',
    },
    mainEntityOfPage: `https://eujobs.co/blog/${slug}`,
    ...(post.description && { description: post.description }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eujobs.co' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://eujobs.co/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
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
      {blogFAQs.length > 0 && <FAQPageJsonLd items={blogFAQs} />}

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="breadcrumb" className="flex text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-eu-blue dark:hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-eu-blue dark:hover:text-blue-400">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <span>{new Date(post.publishedDate).toLocaleDateString('en-EU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
          {post.relatedInterests && post.relatedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.relatedInterests.map((interest: string) => (
                <span
                  key={interest}
                  className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-eu-blue dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 dark:prose-li:text-gray-300 dark:prose-td:text-gray-300 dark:prose-th:text-gray-200"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </article>

        {/* FAQ Section */}
        {blogFAQs.length > 0 && (
          <FAQSection items={blogFAQs} />
        )}

        {/* Related EU Organizations */}
        {relatedEntities.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related EU Organizations</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedEntities.map((entity: any) => (
                <Link
                  key={entity._id}
                  href={`/lobbying-entities/${entity.slug}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-eu-blue dark:hover:border-eu-blue transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {entity.name}
                    {entity.acronym && <span className="text-gray-500 dark:text-gray-400 font-normal"> ({entity.acronym})</span>}
                  </h3>
                  {entity.registrationCategory && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{entity.registrationCategory}</p>
                  )}
                  {entity.interests && entity.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entity.interests.slice(0, 3).map((interest: string) => (
                        <span
                          key={interest}
                          className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Content (Internal Links) */}
        <RelatedContent items={relatedLinks} heading="Explore More" />

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-eu-blue dark:text-blue-400 font-medium hover:underline">
            ← Back to all articles
          </Link>
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
