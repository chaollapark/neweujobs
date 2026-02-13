'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'jobseeker',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setIsLoading(true)
    // TODO: Implement actual registration
    setTimeout(() => {
      setIsLoading(false)
      alert('Registration functionality coming soon!')
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-eu-blue rounded-lg flex items-center justify-center">
              <span className="text-eu-yellow font-bold text-2xl">EU</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">Create an account</h1>
          <p className="text-gray-600 mt-2">Start your EU career journey today</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Account Type Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => updateField('accountType', 'jobseeker')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.accountType === 'jobseeker'
                  ? 'bg-white text-eu-blue shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => updateField('accountType', 'employer')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.accountType === 'employer'
                  ? 'bg-white text-eu-blue shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="input-field"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-eu-blue focus:ring-eu-blue"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-eu-blue hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-eu-blue hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-eu-blue font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
