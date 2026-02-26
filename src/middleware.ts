import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VALID_CITY_SLUGS, getCityConfig } from '@/lib/cities'

// Paths that remain at root (no city prefix)
const GLOBAL_PATHS = [
  '/_next',
  '/api',
  '/about',
  '/contact',
  '/pricing',
  '/post-job',
  '/privacy',
  '/terms',
  '/alerts',
  '/auth',
  '/employer-dashboard',
  '/job-success',
  '/job-cancel',
  '/actions',
  '/providers',
  '/favicon',
  '/sitemap.xml',
  '/robots.txt',
]

// Brussels-only features
const BRUSSELS_ONLY_PATHS = [
  '/best-in-brussels',
  '/lobbying-entities',
  '/blog',
  '/fairpay',
]

// Legacy paths that should redirect to /brussels/...
const LEGACY_CITY_PATHS = [
  '/jobs',
  '/companies',
  '/categories',
  '/career-guides',
  ...BRUSSELS_ONLY_PATHS,
]

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Old domain redirect: eujobs.brussels/* -> eujobs.co/brussels/*
  if (host.includes('eujobs.brussels')) {
    const newUrl = new URL(request.url)
    newUrl.host = 'eujobs.co'
    newUrl.port = ''
    // If path is root, redirect to /brussels
    if (pathname === '/') {
      newUrl.pathname = '/brussels'
    } else {
      // Check if path already has a city prefix
      const firstSegment = pathname.split('/')[1]
      if (!VALID_CITY_SLUGS.includes(firstSegment)) {
        newUrl.pathname = `/brussels${pathname}`
      }
    }
    return NextResponse.redirect(newUrl, 301)
  }

  // Skip global paths and static assets
  if (GLOBAL_PATHS.some(p => pathname.startsWith(p)) || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Root path — let it through to the landing page
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check if path starts with a valid city slug
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  if (VALID_CITY_SLUGS.includes(firstSegment)) {
    // Brussels-only feature guard for non-Brussels cities
    const cityConfig = getCityConfig(firstSegment)
    if (cityConfig && firstSegment !== 'brussels') {
      const subPath = '/' + segments.slice(2).join('/')
      for (const brusselsPath of BRUSSELS_ONLY_PATHS) {
        if (subPath.startsWith(brusselsPath)) {
          return NextResponse.rewrite(new URL('/not-found', request.url))
        }
      }
    }
    return NextResponse.next()
  }

  // Legacy path redirect: /jobs -> /brussels/jobs, /companies -> /brussels/companies, etc.
  if (LEGACY_CITY_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    const newUrl = new URL(request.url)
    newUrl.pathname = `/brussels${pathname}`
    return NextResponse.redirect(newUrl, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon).*)',
  ],
}
