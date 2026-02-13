import { Suspense } from 'react'
import { getLatestJobs, searchJobs, categories } from '@/lib/data'
import JobsClientFilters from './JobsClientFilters'

export const revalidate = 60

interface JobsPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams
  const query = params.q || ''

  const jobs = query
    ? await searchJobs(query)
    : await getLatestJobs(100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<JobsLoading />}>
        <JobsClientFilters
          initialJobs={JSON.parse(JSON.stringify(jobs))}
          initialQuery={query}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}

function JobsLoading() {
  return (
    <>
      <div className="bg-eu-blue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find EU Jobs</h1>
          <div className="bg-white/20 h-14 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-96 animate-pulse"></div>
          </aside>
          <main className="flex-1">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-32 animate-pulse"></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
