'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PostHogProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      capture_pageview: false,
      capture_pageleave: true,
    })
  }, [])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    if (!pathname) return

    let url = window.origin + pathname
    if (searchParams?.toString()) {
      url = url + '?' + searchParams.toString()
    }

    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}
