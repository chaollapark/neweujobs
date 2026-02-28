'use client';

import Link from 'next/link';
import { INiche } from '@/models/Niche';

interface NicheLandingProps {
  niche: INiche;
}

export function NicheLanding({ niche }: NicheLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className={`bg-${niche.colors?.primary || 'blue'}-600 text-white py-20`}>
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
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Jobs
            </Link>
            <Link
              href="/post-job"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition border border-white/20"
            >
              Post a Job — €99
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">1,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50k+</div>
              <div className="text-gray-600">Monthly Visitors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Placeholder */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Latest {niche.name} Jobs
          </h2>
          <div className="space-y-4">
            {/* Jobs will be dynamically loaded here */}
            <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
              Loading jobs...
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hiring for {niche.name.replace(' Jobs', '')} roles?
          </h2>
          <p className="text-gray-300 mb-8">
            Reach thousands of qualified candidates for just €99.
          </p>
          <Link
            href="/post-job"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Post a Job Now
          </Link>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 bg-gray-50 text-center text-sm text-gray-500">
        <p>
          Looking for more opportunities? Check out{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            EUjobs.co
          </Link>
          {' '}— The leading EU job board.
        </p>
      </section>
    </div>
  );
}
