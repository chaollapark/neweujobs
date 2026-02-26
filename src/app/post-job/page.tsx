'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { saveJobAction } from '@/app/actions/jobActions'
import { POLICY_TAG_LABELS, PolicyTag } from '@/types'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99.99,
    description: '30 days, standard listing, email support',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299.99,
    description: '60 days, featured, priority support, newsletter inclusion',
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    price: 500,
    description: '90 days, all Pro features, dedicated support, top placement',
  },
]

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <PostJobForm />
    </Suspense>
  )
}

function PostJobForm() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan') || 'basic'

  const [selectedPlan, setSelectedPlan] = useState(planParam)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    seniority: 'mid-level',
    description: '',
    salary: '',
    city: '',
    country: '',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    applyLink: '',
    expiresOn: '',
    blockAIApplications: false,
    policyTags: [] as string[],
  })

  useEffect(() => {
    if (planParam && plans.some(p => p.id === planParam)) {
      setSelectedPlan(planParam)
    }
  }, [planParam])

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Build FormData for server action
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('companyName', formData.companyName)
      fd.append('seniority', formData.seniority)
      fd.append('description', formData.description)
      if (formData.salary) fd.append('salary', formData.salary)
      fd.append('city', formData.city)
      fd.append('country', formData.country)
      fd.append('contactEmail', formData.contactEmail)
      if (formData.contactName) fd.append('contactName', formData.contactName)
      if (formData.contactPhone) fd.append('contactPhone', formData.contactPhone)
      if (formData.applyLink) fd.append('applyLink', formData.applyLink)
      if (formData.expiresOn) fd.append('expiresOn', formData.expiresOn)
      fd.append('blockAIApplications', String(formData.blockAIApplications))
      if (formData.policyTags.length > 0) {
        fd.append('policyTags', JSON.stringify(formData.policyTags))
      }
      fd.append('plan', 'pending')

      // Save job as pending
      const result = await saveJobAction(fd)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      const jobId = result.jobId

      // Redirect to Stripe checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          plan: selectedPlan,
          price: currentPlan.price,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to create checkout session')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post a Job</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Reach thousands of qualified EU professionals
          </p>
        </div>

        {/* Plan Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Select Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedPlan === plan.id
                    ? 'border-eu-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">{plan.name}</div>
                <div className="text-2xl font-bold text-eu-blue mt-1">&euro;{plan.price}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Details</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Senior Policy Officer"
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your company name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Seniority *
                  </label>
                  <select
                    id="seniority"
                    required
                    value={formData.seniority}
                    onChange={(e) => updateField('seniority', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="intern">Intern</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-Level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salary (EUR/month) - Optional
                  </label>
                  <input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => updateField('salary', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 4500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Brussels"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country *
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Belgium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Description</h2>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={10}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              />
            </div>
          </div>

          {/* Policy Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Policy Areas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select up to 4 policy areas relevant to this role (optional)</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(POLICY_TAG_LABELS) as [PolicyTag, string][]).map(([value, label]) => {
                const isSelected = formData.policyTags.includes(value)
                const isDisabled = !isSelected && formData.policyTags.length >= 4
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        policyTags: isSelected
                          ? prev.policyTags.filter(t => t !== value)
                          : [...prev.policyTags, value],
                      }))
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      isSelected
                        ? 'border-eu-blue bg-blue-50 dark:bg-blue-900/20 text-eu-blue dark:text-blue-300'
                        : isDisabled
                          ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Contact & Application */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact &amp; Application</h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="careers@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="HR Contact Name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+32 2 xxx xxxx"
                  />
                </div>

                <div>
                  <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Application URL
                  </label>
                  <input
                    id="applyLink"
                    type="url"
                    value={formData.applyLink}
                    onChange={(e) => updateField('applyLink', e.target.value)}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://your-company.com/careers/apply"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expiresOn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Listing Expiry Date
                </label>
                <input
                  id="expiresOn"
                  type="date"
                  value={formData.expiresOn}
                  onChange={(e) => updateField('expiresOn', e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="blockAIApplications"
                  type="checkbox"
                  checked={formData.blockAIApplications}
                  onChange={(e) => updateField('blockAIApplications', e.target.checked)}
                  className="h-4 w-4 text-eu-blue border-gray-300 dark:border-gray-600 rounded focus:ring-eu-blue"
                />
                <label htmlFor="blockAIApplications" className="text-sm text-gray-700 dark:text-gray-300">
                  Block AI-generated applications (discourage automated submissions)
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By posting, you agree to our{' '}
              <Link href="/terms" className="text-eu-blue hover:underline">Terms of Service</Link>
            </p>
            <div className="flex gap-4">
              <Link href="/" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Post Job - \u20AC${currentPlan.price}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
