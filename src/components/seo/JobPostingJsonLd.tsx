import { Job } from '@/types'

interface JobPostingJsonLdProps {
  job: Job
}

export default function JobPostingJsonLd({ job }: JobPostingJsonLdProps) {
  function estimateSalary(seniority?: string) {
    const ranges: Record<string, { min: number; max: number }> = {
      'entry': { min: 25000, max: 35000 },
      'junior': { min: 30000, max: 45000 },
      'mid': { min: 45000, max: 65000 },
      'senior': { min: 65000, max: 100000 },
      'executive': { min: 90000, max: 150000 },
    }
    return ranges[seniority || 'mid'] || ranges['mid']
  }

  function getExperienceRequirements(level?: string) {
    const map: Record<string, string> = {
      'entry': '0-1 years',
      'junior': '1-3 years',
      'mid': '3-5 years',
      'senior': '5-10 years',
      'executive': '10+ years',
    }
    return map[level || 'mid'] || '3-5 years'
  }

  const salaryRange = job.salaryMin
    ? { min: job.salaryMin, max: job.salaryMax || job.salaryMin }
    : estimateSalary(job.experienceLevel)

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description?.replace(/<[^>]*>/g, '').substring(0, 500),
    datePosted: new Date(job.createdAt).toISOString(),
    validThrough: new Date(job.expiresAt).toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.name || job.companyName || 'Unknown',
      sameAs: job.company?.website || '',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Brussels',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryRange.min,
        maxValue: salaryRange.max,
        unitText: 'YEAR',
      },
    },
    experienceRequirements: getExperienceRequirements(job.experienceLevel),
    employmentType: job.contractType === 'permanent' ? 'FULL_TIME' :
      job.contractType === 'traineeship' ? 'INTERN' :
      job.contractType === 'freelance' ? 'CONTRACTOR' : 'FULL_TIME',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
