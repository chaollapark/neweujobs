"use client"

import Link from 'next/link'
import { Job } from '@/types'

interface JobCardProps {
  job: Job
  featured?: boolean
}

export default function JobCard({ job, featured = false }: JobCardProps) {
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

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div className={`card hover:border-eu-blue dark:hover:border-eu-yellow border-2 border-transparent cursor-pointer ${
        featured ? 'ring-2 ring-eu-yellow' : ''
      }`}>
        {featured && (
          <div className="mb-3">
            <span className="badge-yellow text-xs">Featured</span>
          </div>
        )}

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
