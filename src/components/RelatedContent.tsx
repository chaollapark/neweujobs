import Link from 'next/link'
import dbConnect from '@/lib/dbConnect'

interface RelatedItem {
  title: string
  href: string
  type: 'guide' | 'blog' | 'niche' | 'category'
}

interface RelatedContentProps {
  items: RelatedItem[]
  heading?: string
}

export function RelatedContent({ items, heading = 'Related Content' }: RelatedContentProps) {
  if (!items || items.length === 0) return null

  const typeLabels: Record<string, string> = {
    guide: 'Career Guide',
    blog: 'Article',
    niche: 'Browse Jobs',
    category: 'Category',
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{heading}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-eu-blue dark:hover:border-eu-blue transition-colors"
          >
            <span className="text-xs font-medium text-eu-blue dark:text-blue-400 uppercase tracking-wider">
              {typeLabels[item.type] || item.type}
            </span>
            <h3 className="font-medium text-gray-900 dark:text-white mt-1 line-clamp-2 text-sm">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Server-side helper to fetch related content for a given context
export async function getRelatedLinks(context: {
  companyName?: string
  interests?: string[]
  categorySlug?: string
}): Promise<RelatedItem[]> {
  const items: RelatedItem[] = []

  try {
    await dbConnect()

    // Related career guides based on interests
    if (context.interests?.length) {
      const CareerGuideModel = (await import('@/models/CareerGuide')).default
      const guides = await CareerGuideModel.find({
        relatedInterests: { $in: context.interests.slice(0, 3) }
      }).select('title slug').limit(2).lean()

      for (const g of guides as any[]) {
        items.push({ title: g.title, href: `/blog/${encodeURIComponent(g.slug)}`, type: 'blog' })
      }
    }

    // Related org career guide for company
    if (context.companyName) {
      const OrgCareerGuideModel = (await import('@/models/OrgCareerGuide')).default
      const guide = await OrgCareerGuideModel.findOne({
        organization: { $regex: context.companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
      }).select('title slug').lean()

      if (guide) {
        items.push({ title: (guide as any).title, href: `/career-guides/${(guide as any).slug}`, type: 'guide' })
      }
    }

    // Add relevant niche page links
    const { Niche } = await import('@/models/Niche')
    const niches = await Niche.find({ enabled: true }).select('name slug').limit(3).lean()
    for (const n of niches as any[]) {
      if (items.length >= 6) break
      items.push({ title: n.name, href: `/${n.slug}`, type: 'niche' })
    }
  } catch {
    // Graceful fallback if DB is unavailable
  }

  return items.slice(0, 6)
}
