import Link from 'next/link';
import { NicheType } from '@/models/Niche';
import { Job } from '@/types';
import JobCard from '@/components/jobs/JobCard';

interface NicheLandingProps {
  niche: NicheType;
  jobs: Job[];
}

export function NicheLanding({ niche, jobs }: NicheLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {niche.h1}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {niche.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-white text-eu-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Jobs
            </Link>
            <Link
              href="/post-job"
              className="bg-eu-yellow text-eu-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              Post a Job - &euro;99
            </Link>
          </div>
          {niche.keywords && niche.keywords.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
              <span className="text-gray-300">Popular:</span>
              {niche.keywords.slice(0, 4).map((keyword) => (
                <Link
                  key={keyword}
                  href={`/jobs?q=${encodeURIComponent(keyword)}`}
                  className="text-eu-yellow hover:underline"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-eu-blue">{jobs.length}+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">Daily</div>
              <div className="text-gray-600 dark:text-gray-300">Updates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-eu-blue">Free</div>
              <div className="text-gray-600 dark:text-gray-300">For Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest {niche.name}
            </h2>
            <Link href="/jobs" className="text-eu-blue font-medium hover:underline">
              View all jobs &rarr;
            </Link>
          </div>
          <div className="grid gap-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} featured={job.featured} />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No jobs found in this niche yet.
                </p>
                <Link
                  href="/jobs"
                  className="text-eu-blue hover:underline font-medium"
                >
                  Browse all available jobs &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eu-blue">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hiring for {niche.name.replace(' Jobs', '')} roles?
          </h2>
          <p className="text-gray-300 mb-8">
            Post your job and reach thousands of qualified candidates for just &euro;99.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-job"
              className="bg-eu-yellow text-eu-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Post a Job Now
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-eu-blue transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get {niche.name} in Your Inbox
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter and never miss a great opportunity.
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
            <input type="hidden" name="niche" value={niche.slug} />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Looking for more opportunities? Check out{' '}
          <Link href="/" className="text-eu-blue hover:underline">
            EU Jobs Brussels
          </Link>
          {' '}- The leading EU job board.
        </p>
      </section>
    </div>
  );
}
