import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostHogProvider from '@/app/providers/PostHogProvider'
import NewsletterSignup from '@/components/NewsletterSignup'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EU Jobs - Find Your Career in Europe',
  description: 'The leading job board for EU institutions, NGOs, think tanks, and public affairs positions across Europe. Find your next career opportunity in Brussels, Paris, London, Geneva, Berlin, and Rome.',
  keywords: 'EU jobs, European jobs, Brussels jobs, EU careers, public affairs, lobbying, NGO jobs, think tank jobs, EU traineeship, Paris jobs, London jobs',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/favicon/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: 'EU Jobs - Find Your Career in Europe',
    description: 'The leading job board for EU institutions, NGOs, think tanks, and public affairs positions across Europe.',
    url: 'https://eujobs.co',
    siteName: 'EU Jobs',
    locale: 'en_EU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EU Jobs',
    description: 'Find your next career opportunity in EU affairs across Europe',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('darkMode') === 'true' ||
                    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-white`}>
        <Suspense fallback={null}>
          <PostHogProvider />
        </Suspense>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <NewsletterSignup />
      </body>
    </html>
  )
}
