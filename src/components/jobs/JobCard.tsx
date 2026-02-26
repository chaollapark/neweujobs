"use client"

import Link from 'next/link'
import { Job, POLICY_TAG_LABELS, PolicyTag } from '@/types'

interface JobCardProps {
  job: Job
  featured?: boolean
  citySlug?: string
}

export default function JobCard({ job, featured = false, citySlug }: JobCardProps) {
  const formatSalary = () => {
    if (!job.salaryMin) return null
    if (job.salaryMin === job.salaryMax) {
      return `€${job.salaryMin.toLocaleString()}/month`
    }
    return `€${job.salaryMin.toLocaleString()} - €${job.salaryMax?.toLocaleString()}`
  }

  const getContractLabel = (type: string) => {
    const labels: Record<string, string> = {
      'permanent': 'Permanent',
      'fixed-term': 'Fixed Term',
      'traineeship': 'Traineeship',
      'freelance': 'Freelance',
      'temporary-agent': 'Temporary Agent',
      'contract-agent': 'Contract Agent',
    }
    return labels[type] || type
  }

  const getRemoteLabel = (type: string) => {
    const labels: Record<string, string> = {
      'onsite': 'On-site',
      'hybrid': 'Hybrid',
      'remote': 'Remote',
    }
    return labels[type] || type
  }

  const getExperienceLabel = (level: string) => {
    const labels: Record<string, string> = {
      'entry': 'Entry Level',
      'junior': 'Junior',
      'mid': 'Mid-Level',
      'senior': 'Senior',
      'executive': 'Executive',
    }
    return labels[level] || level
  }

  const daysAgo = () => {
    const diff = Date.now() - new Date(job.createdAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const getDeadlineUrgency = () => {
    if (!job.expiresAt) return null
    const now = Date.now()
    const expiresMs = new Date(job.expiresAt).getTime()
    const daysLeft = Math.floor((expiresMs - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return null
    if (daysLeft === 0) return { label: 'Expiring today', className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
    if (daysLeft === 1) return { label: '1 day left', className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
    if (daysLeft <= 3) return { label: `${daysLeft} days left`, className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' }
    if (daysLeft <= 7) return { label: `${daysLeft} days left`, className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' }
    return null
  }

  const deadline = getDeadlineUrgency()
  const jobHref = citySlug ? `/${citySlug}/jobs/${job.slug}` : `/jobs/${job.slug}`

  return (
    <Link href={jobHref}>
      <div className={`card hover:border-eu-blue dark:hover:border-eu-yellow border-2 border-transparent cursor-pointer ${
        featured ? 'ring-2 ring-eu-yellow' : ''
      }`}>
        <div className="flex items-center gap-2 mb-3">
          {featured && (
            <span className="badge-yellow text-xs">Featured</span>
          )}
          {deadline && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${deadline.className}`}>
              {deadline.label}
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-eu-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {job.company?.name?.charAt(0) || '?'}
              </span>
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-eu-blue dark:hover:text-eu-yellow truncate">
              {job.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{job.company?.name}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge-blue">
                {job.location}
              </span>
              <span className="badge-green">
                {getContractLabel(job.contractType)}
              </span>
              <span className="badge-purple">
                {getRemoteLabel(job.remoteType)}
              </span>
            </div>

            {/* Policy Tags */}
            {job.policyTags && job.policyTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.policyTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  >
                    {POLICY_TAG_LABELS[tag as PolicyTag] || tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{getExperienceLabel(job.experienceLevel)}</span>
                {formatSalary() && (
                  <span className="font-medium text-green-600 dark:text-green-400">{formatSalary()}</span>
                )}
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500">{daysAgo()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
