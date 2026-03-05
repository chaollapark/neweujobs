interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  heading?: string
}

export default function FAQSection({ items, heading = 'Frequently Asked Questions' }: FAQSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{heading}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-gray-900 dark:text-white font-medium hover:text-eu-blue dark:hover:text-blue-400 transition-colors list-none">
              <span>{item.question}</span>
              <svg
                className="w-5 h-5 shrink-0 ml-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
