import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getJobsByCategory, categories } from '@/lib/data'
import JobCard from '@/components/jobs/JobCard'

export const revalidate = 60

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const categoryJobs = await getJobsByCategory(slug)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-300 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{category.name}</h1>
              <p className="text-gray-300 mt-2">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">{categoryJobs.length}</span> jobs in {category.name}
          </p>
          <select className="input-field py-2 px-4 w-auto text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>Most Recent</option>
            <option>Most Relevant</option>
            <option>Salary: High to Low</option>
          </select>
        </div>

        {categoryJobs.length > 0 ? (
          <div className="space-y-4">
            {categoryJobs.map(job => (
              <JobCard key={job.id} job={job} featured={job.featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs in this category yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Be the first to post a job in {category.name}!
            </p>
            <Link href="/post-job" className="btn-primary">
              Post a Job
            </Link>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories
              .filter(c => c.slug !== category.slug)
              .slice(0, 5)
              .map(cat => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center hover:border-eu-blue border-2 border-transparent dark:border-gray-700 dark:hover:border-eu-blue transition-colors"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
