'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-8">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <div className="space-y-4">
            <Link href="/auth/login" className="btn-primary block">
              Back to Login
            </Link>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-eu-blue hover:underline text-sm"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mt-6">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">No worries, we&apos;ll send you reset instructions.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-eu-blue font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
