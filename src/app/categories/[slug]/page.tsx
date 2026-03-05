import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getJobsByCategory, categories } from '@/lib/data'
import JobCard from '@/components/jobs/JobCard'
import Breadcrumb from '@/components/Breadcrumb'
import FAQSection from '@/components/seo/FAQSection'
import FAQPageJsonLd from '@/components/seo/FAQPageJsonLd'

export const revalidate = 60

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Category Not Found - EUJobs.co' }
  }

  const description = `Browse ${category.name} jobs in the EU. ${category.description || ''} Find your next career opportunity at EUJobs.co.`

  return {
    title: `${category.name} Jobs in the EU | EUJobs.co`,
    description,
    openGraph: {
      title: `${category.name} Jobs in the EU`,
      description,
      url: `https://eujobs.co/categories/${slug}`,
      siteName: 'EU Jobs Brussels',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.name} Jobs in the EU`,
      description,
    },
  }
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
      {category.faqs && <FAQPageJsonLd items={category.faqs} />}
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/categories' }, { label: category.name }]} />
      {/* Category Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        {/* Editorial Content */}
        {category.longDescription && (
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About {category.name} Jobs</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {category.longDescription.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Salary & Typical Roles */}
            {(category.salaryRange || category.typicalRoles) && (
              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {category.salaryRange && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Salary Range</h3>
                    <p className="text-eu-blue dark:text-blue-400 font-medium">&euro;{category.salaryRange}</p>
                  </div>
                )}
                {category.typicalRoles && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Typical Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.typicalRoles.map((role) => (
                        <span key={role} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

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

        {/* FAQ Section */}
        {category.faqs && category.faqs.length > 0 && (
          <FAQSection items={category.faqs} heading={`${category.name} - Frequently Asked Questions`} />
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
