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
  title: 'EU Jobs Brussels - Find Your Career in the EU Bubble',
  description: 'The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels. Find your next career opportunity in the European Union.',
  keywords: 'EU jobs, Brussels jobs, European Commission, EU careers, public affairs, lobbying, NGO jobs, think tank jobs, EU traineeship',
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
    title: 'EU Jobs Brussels - Find Your Career in the EU Bubble',
    description: 'The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels.',
    url: 'https://eujobs.brussels',
    siteName: 'EU Jobs Brussels',
    locale: 'en_EU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EU Jobs Brussels',
    description: 'Find your next career opportunity in the EU bubble',
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
