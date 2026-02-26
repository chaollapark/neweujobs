'use client'

import { useState, useMemo } from 'react'
import JobCard from '@/components/jobs/JobCard'
import SearchBar from '@/components/jobs/SearchBar'
import { Job, Category, ContractType, ExperienceLevel, RemoteType, PolicyTag, POLICY_TAG_LABELS } from '@/types'

interface JobsClientFiltersProps {
  initialJobs: Job[]
  initialQuery: string
  categories: Category[]
  citySlug?: string
}

export default function JobsClientFilters({ initialJobs, initialQuery, categories, citySlug }: JobsClientFiltersProps) {
  const [filters, setFilters] = useState({
    category: '',
    contractType: '' as ContractType | '',
    experienceLevel: '' as ExperienceLevel | '',
    remoteType: '' as RemoteType | '',
    policyTag: '' as PolicyTag | '',
  })

  const filteredJobs = useMemo(() => {
    let result = [...initialJobs]

    if (filters.category) {
      result = result.filter(job => job.category.slug === filters.category)
    }

    if (filters.contractType) {
      result = result.filter(job => job.contractType === filters.contractType)
    }

    if (filters.experienceLevel) {
      result = result.filter(job => job.experienceLevel === filters.experienceLevel)
    }

    if (filters.remoteType) {
      result = result.filter(job => job.remoteType === filters.remoteType)
    }

    if (filters.policyTag) {
      result = result.filter(job => job.policyTags?.includes(filters.policyTag as PolicyTag))
    }

    return result
  }, [initialJobs, filters])

  const clearFilters = () => {
    setFilters({
      category: '',
      contractType: '',
      experienceLevel: '',
      remoteType: '',
      policyTag: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <>
      {/* Header */}
      <div className="bg-eu-blue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find EU Jobs</h1>
          <SearchBar initialQuery={initialQuery} citySlug={citySlug} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-eu-blue hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input-field py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Contract Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Type
                </label>
                <select
                  value={filters.contractType}
                  onChange={(e) => setFilters({ ...filters, contractType: e.target.value as ContractType })}
                  className="input-field py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="permanent">Permanent</option>
                  <option value="fixed-term">Fixed Term</option>
                  <option value="traineeship">Traineeship</option>
                  <option value="freelance">Freelance</option>
                  <option value="temporary-agent">Temporary Agent</option>
                  <option value="contract-agent">Contract Agent</option>
                </select>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value as ExperienceLevel })}
                  className="input-field py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Remote Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Type
                </label>
                <select
                  value={filters.remoteType}
                  onChange={(e) => setFilters({ ...filters, remoteType: e.target.value as RemoteType })}
                  className="input-field py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Policy Tag Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Policy Area
                </label>
                <select
                  value={filters.policyTag}
                  onChange={(e) => setFilters({ ...filters, policyTag: e.target.value as PolicyTag })}
                  className="input-field py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Policy Areas</option>
                  {(Object.entries(POLICY_TAG_LABELS) as [PolicyTag, string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> jobs found
                {initialQuery && <span> for &quot;{initialQuery}&quot;</span>}
              </p>
              <select className="input-field py-2 px-4 w-auto text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Most Recent</option>
                <option>Most Relevant</option>
                <option>Salary: High to Low</option>
              </select>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} featured={job.featured} citySlug={citySlug} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
