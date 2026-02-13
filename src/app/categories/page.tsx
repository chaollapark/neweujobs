import Link from 'next/link'
import { categories } from '@/lib/categories'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Categories</h1>
          <p className="text-gray-300">Browse jobs by sector in the EU bubble</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="card hover:border-eu-blue dark:hover:border-eu-yellow border-2 border-transparent group"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-eu-blue dark:group-hover:text-eu-yellow mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-eu-blue dark:text-eu-yellow font-semibold">
                  View jobs
                </span>
                <span className="text-gray-400 group-hover:text-eu-blue dark:group-hover:text-eu-yellow transition-colors">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
