'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import DarkModeToggle from './DarkModeToggle'
import { VALID_CITY_SLUGS, getCityConfig } from '@/lib/cities'

function deriveCityFromPath(pathname: string): string | null {
  const segments = pathname.split('/')
  const first = segments[1]
  if (first && VALID_CITY_SLUGS.includes(first)) return first
  return null
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bibOpen, setBibOpen] = useState(false)
  const pathname = usePathname()

  const city = deriveCityFromPath(pathname)
  const config = city ? getCityConfig(city) : null
  const prefix = city ? `/${city}` : '/brussels'
  const isBrussels = city === 'brussels' || !city
  const brandName = config ? `Jobs ${config.name}` : 'EU Jobs'

  const bibLinks = [
    { href: `${prefix}/best-in-brussels`, label: 'Overview' },
    { href: `${prefix}/best-in-brussels/consultancies`, label: 'Consultancies' },
    { href: `${prefix}/best-in-brussels/consultants`, label: 'Consultants' },
    { href: `${prefix}/best-in-brussels/law-firms`, label: 'Law Firms' },
    { href: `${prefix}/best-in-brussels/intelligence-systems`, label: 'Intelligence Systems' },
    { href: `${prefix}/best-in-brussels/digital-tools`, label: 'Digital Tools' },
    { href: `${prefix}/best-in-brussels/trainers`, label: 'Trainers' },
    { href: `${prefix}/best-in-brussels/specialists`, label: 'Specialist Areas' },
    { href: `${prefix}/best-in-brussels/articles`, label: 'Articles' },
    { href: `${prefix}/best-in-brussels/guides`, label: 'Guides' },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={city ? `/${city}` : '/'} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-eu-blue rounded-lg flex items-center justify-center">
                <span className="text-eu-yellow font-bold text-xl">EU</span>
              </div>
              <span className="text-xl font-bold text-eu-blue dark:text-eu-yellow">{brandName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href={`${prefix}/jobs`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Find Jobs
            </Link>
            <Link href={`${prefix}/companies`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
              Companies
            </Link>

            {isBrussels && (
              <>
                <Link href={`${prefix}/lobbying-entities`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                  Lobbying Entities
                </Link>

                {/* Best in Brussels Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setBibOpen(true)}
                  onMouseLeave={() => setBibOpen(false)}
                >
                  <Link
                    href={`${prefix}/best-in-brussels`}
                    className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium inline-flex items-center gap-1"
                  >
                    Best in Brussels
                    <svg className={`w-4 h-4 transition-transform ${bibOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {bibOpen && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-600 py-2 z-50">
                      {bibLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-eu-blue dark:hover:text-eu-yellow"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href={`${prefix}/fairpay`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                  Fair Pay
                </Link>
                <Link href={`${prefix}/blog`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                  Blog
                </Link>
              </>
            )}
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
              <Link href={`${prefix}/jobs`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Find Jobs
              </Link>
              <Link href={`${prefix}/companies`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                Companies
              </Link>

              {isBrussels && (
                <>
                  <Link href={`${prefix}/lobbying-entities`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                    Lobbying Entities
                  </Link>

                  {/* Best in Brussels Accordion */}
                  <div>
                    <button
                      onClick={() => setBibOpen(!bibOpen)}
                      className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium"
                    >
                      Best in Brussels
                      <svg className={`w-4 h-4 transition-transform ${bibOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {bibOpen && (
                      <div className="mt-2 ml-4 space-y-2">
                        {bibLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-eu-blue dark:hover:text-eu-yellow"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link href={`${prefix}/fairpay`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                    Fair Pay
                  </Link>
                  <Link href={`${prefix}/blog`} className="text-gray-700 dark:text-gray-300 hover:text-eu-blue dark:hover:text-eu-yellow font-medium">
                    Blog
                  </Link>
                </>
              )}

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
