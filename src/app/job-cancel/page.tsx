import Link from 'next/link';

export const metadata = {
  title: 'Payment Cancelled - EU Jobs Brussels',
  description: 'Your payment has been cancelled. You can try again or browse available jobs.',
};

export default function JobCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment was not completed. No charges were made. You can try posting your job again or browse available positions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/post-job"
            className="px-6 py-3 bg-eu-blue text-white rounded-lg font-medium hover:bg-eu-dark transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/jobs"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Jobs
          </Link>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Need help? <Link href="/contact" className="text-eu-blue dark:text-blue-400 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
