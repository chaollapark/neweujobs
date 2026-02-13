'use client'

import { useState } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/categories'

export default function AlertsPage() {
  const [formData, setFormData] = useState({
    email: '',
    keywords: '',
    category: '',
    contractType: '',
    frequency: 'daily',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🔔</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Alert Created!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You'll receive job alerts at {formData.email} based on your preferences.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/jobs" className="btn-primary">Browse Jobs</Link>
            <button onClick={() => setSubmitted(false)} className="btn-secondary">Create Another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Job Alerts</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Never miss a great opportunity. Get notified when new jobs match your criteria.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a Job Alert</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="input-field"
                placeholder="e.g., policy officer, communications, EU affairs"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Separate multiple keywords with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contract Type</label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="permanent">Permanent</option>
                <option value="fixed-term">Fixed Term</option>
                <option value="traineeship">Traineeship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Alert Frequency</label>
              <div className="flex gap-4">
                {['instant', 'daily', 'weekly'].map((freq) => (
                  <label key={freq} className="flex items-center text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={formData.frequency === freq}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="mr-2"
                    />
                    <span className="capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Alert...' : 'Create Job Alert'}
            </button>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Instant Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified as soon as matching jobs are posted</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Matches</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Only receive jobs that match your criteria</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔕</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Easy to Manage</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribe anytime with one click</p>
          </div>
        </div>
      </div>
    </div>
  )
}
