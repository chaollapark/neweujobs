import { notFound } from 'next/navigation'
import { getCityConfig, VALID_CITY_SLUGS } from '@/lib/cities'
import type { Metadata } from 'next'

interface CityLayoutProps {
  children: React.ReactNode
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const config = getCityConfig(city)
  if (!config) return {}

  return {
    title: {
      template: `%s - EU Jobs ${config.name}`,
      default: `EU Jobs ${config.name} - ${config.description}`,
    },
    openGraph: {
      siteName: `EU Jobs ${config.name}`,
    },
  }
}

export function generateStaticParams() {
  return VALID_CITY_SLUGS.map(city => ({ city }))
}

export default async function CityLayout({ children, params }: CityLayoutProps) {
  const { city } = await params
  if (!VALID_CITY_SLUGS.includes(city)) {
    notFound()
  }

  return <>{children}</>
}
