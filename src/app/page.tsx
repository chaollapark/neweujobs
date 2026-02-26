import Link from 'next/link'
import { CITIES } from '@/lib/cities'
import { getFeaturedJobs } from '@/lib/data'
import JobCard from '@/components/jobs/JobCard'

export const revalidate = 60

export default async function PlatformLandingPage() {
  const featuredJobs = await getFeaturedJobs()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            EU Jobs Across
            <span className="text-eu-yellow"> Europe</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            The leading job board for EU institutions, international organisations, NGOs, think tanks, and public affairs positions across Europe.
          </p>
          <Link
            href="/brussels"
            className="bg-eu-yellow text-eu-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block text-lg"
          >
            Browse Brussels Jobs
          </Link>
        </div>
      </section>

      {/* City Cards Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your City</h2>
            <p className="text-gray-600 dark:text-gray-300">Find EU and international affairs jobs in major European hubs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center hover:border-eu-blue border-2 border-gray-200 dark:border-gray-700 dark:hover:border-eu-blue transition-all hover:shadow-lg group"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-eu-blue dark:group-hover:text-eu-yellow mb-2">
                  {city.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{city.country}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">{city.description.split(' - ')[1] || city.description}</p>
                <span className="inline-block mt-4 text-eu-blue dark:text-eu-yellow font-semibold text-sm">
                  View jobs &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Jobs</h2>
              <Link href="/brussels/jobs" className="text-eu-blue font-medium hover:underline">
                View all jobs &rarr;
              </Link>
            </div>

            <div className="grid gap-4">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} featured citySlug="brussels" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-12 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-eu-blue">6</div>
              <div className="text-gray-600 dark:text-gray-300">European Cities</div>
            </div>
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
            Post your job and reach thousands of qualified professionals across Europe.
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
    </div>
  )
}
