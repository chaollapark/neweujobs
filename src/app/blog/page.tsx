export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { getCareerGuides } from '@/lib/careerGuideData'

export const revalidate = 3600;

export default async function BlogPage() {
  const { items: posts } = await getCareerGuides(1, 50)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Career Advice & EU Insights</h1>
          <p className="text-gray-300 mt-2">Expert tips for landing your dream job in the EU bubble</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link
              key={post.slug}
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-eu-blue to-eu-dark rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{new Date(post.publishedDate).toLocaleDateString('en-EU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-eu-blue dark:group-hover:text-blue-400 transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                {post.relatedInterests && post.relatedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.relatedInterests.slice(0, 3).map((interest: string) => (
                      <span
                        key={interest}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-eu-blue dark:text-blue-400 font-medium text-sm">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles yet</h3>
            <p className="text-gray-600 dark:text-gray-300">Check back soon for career advice and EU insights!</p>
          </div>
        )}
      </div>
    </div>
  )
}
