'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items, maxWidth = 'max-w-7xl' }: { items: BreadcrumbItem[]; maxWidth?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `https://eujobs.co${item.href}` }),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <nav aria-label="breadcrumb" className="flex text-sm text-gray-500 dark:text-gray-400">
            {items.map((item, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="mx-2">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-eu-blue dark:hover:text-blue-400">{item.label}</Link>
                ) : (
                  <span className="text-gray-900 dark:text-white truncate max-w-xs">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
