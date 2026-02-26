import Link from 'next/link'
import { notFound } from 'next/navigation'
import SearchBar from '@/components/jobs/SearchBar'
import JobCard from '@/components/jobs/JobCard'
import { categories, getFeaturedJobs, getLatestJobs } from '@/lib/data'
import { getCityConfig } from '@/lib/cities'

export const revalidate = 60

interface CityHomePageProps {
  params: Promise<{ city: string }>
}

export default async function CityHomePage({ params }: CityHomePageProps) {
  const { city } = await params
  const config = getCityConfig(city)
  if (!config) notFound()

  const featuredJobs = await getFeaturedJobs(city)
  const recentJobs = await getLatestJobs(6, city)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {config.heroTitle.includes('EU Bubble') ? (
                <>Find Your Career in the<span className="text-eu-yellow"> EU Bubble</span></>
              ) : (
                <>{config.heroTitle}</>
              )}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {config.heroSubtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar large citySlug={city} />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
            <span className="text-gray-300">Popular:</span>
            <Link href={`/${city}/jobs?q=policy+officer`} className="text-eu-yellow hover:underline">Policy Officer</Link>
            <Link href={`/${city}/jobs?q=public+affairs`} className="text-eu-yellow hover:underline">Public Affairs</Link>
            <Link href={`/${city}/jobs?q=traineeship`} className="text-eu-yellow hover:underline">Traineeship</Link>
            <Link href={`/${city}/jobs?q=communications`} className="text-eu-yellow hover:underline">Communications</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-eu-blue">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">50+</div>
              <div className="text-gray-600 dark:text-gray-300">New Jobs Daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Jobs</h2>
            <Link href={`/${city}/jobs`} className="text-eu-blue font-medium hover:underline">
              View all jobs &rarr;
            </Link>
          </div>

          <div className="grid gap-4">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} featured citySlug={city} />
            ))}
            {featuredJobs.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No featured jobs at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-300">Find opportunities in your area of expertise</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/${city}/categories/${category.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:border-eu-blue border-2 border-transparent dark:border-gray-700 dark:hover:border-eu-blue transition-colors"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Jobs</h2>
            <Link href={`/${city}/jobs`} className="text-eu-blue font-medium hover:underline">
              View all jobs &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} citySlug={city} />
            ))}
            {recentJobs.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-2">No jobs found.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eu-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Hire Top EU Talent?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Post your job and reach thousands of qualified professionals in the EU bubble.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-job" className="bg-eu-yellow text-eu-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Post a Job - From &euro;99
            </Link>
            <Link href="/pricing" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-eu-blue transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get EU Jobs in Your Inbox
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our weekly newsletter and never miss a great opportunity.
          </p>
          <form
            action="/api/newsletter/signup"
            method="POST"
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="input-field flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
