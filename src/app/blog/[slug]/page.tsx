import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostData, getAllPostSlugs } from '@/lib/blogUtils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug: encodeURIComponent(slug) }))
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-eu-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-eu-blue">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <span>{new Date(post.date).toLocaleDateString('en-EU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-eu-blue prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </article>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-eu-blue font-medium hover:underline">
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
