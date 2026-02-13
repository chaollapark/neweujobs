'use client'

import Link from 'next/link'
import { useState } from 'react'
import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-eu-blue rounded-lg flex items-center justify-center">
                <span className="text-eu-yellow font-bold text-xl">EU</span>
              </div>
              <span className="text-xl font-bold text-eu-blue dark:text-eu-yellow">Jobs Brussels</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Find Jobs
            </Link>
            <Link href="/companies" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Companies
            </Link>
            <Link href="/lobbying-entities" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Lobbying Entities
            </Link>
            <Link href="/fairpay" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Fair Pay
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Blog
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            <Link href="/post-job" className="btn-primary text-sm py-2">
              Post a Job
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Find Jobs
              </Link>
              <Link href="/companies" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Companies
              </Link>
              <Link href="/lobbying-entities" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Lobbying Entities
              </Link>
              <Link href="/fairpay" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Fair Pay
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Blog
              </Link>
              <hr className="border-gray-200 dark:border-gray-700" />
              <Link href="/post-job" className="btn-primary text-center text-sm py-2">
                Post a Job
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
