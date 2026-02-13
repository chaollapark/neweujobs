import Link from 'next/link'
import { getSortedPostsData } from '@/lib/blogUtils'

export default function BlogPage() {
  const posts = getSortedPostsData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Career Advice & EU Insights</h1>
          <p className="text-gray-300 mt-2">Expert tips for landing your dream job in the EU bubble</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="card hover:shadow-lg transition-shadow group"
            >
              <div className="h-40 bg-gradient-to-br from-eu-blue to-eu-dark rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{new Date(post.date).toLocaleDateString('en-EU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-eu-blue transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 text-eu-blue font-medium text-sm">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for career advice and EU insights!</p>
          </div>
        )}
      </div>
    </div>
  )
}
