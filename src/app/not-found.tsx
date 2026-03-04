import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found - EU Jobs Brussels',
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-eu-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="btn-primary px-6 py-3 text-center"
          >
            Browse Jobs
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-eu-blue text-eu-blue rounded-lg font-semibold hover:bg-eu-blue hover:text-white transition-colors text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
