import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '99.99',
      period: 'per job',
      description: 'Perfect for occasional hiring',
      features: [
        '30-day job listing',
        'Standard listing placement',
        'Email support',
        'Company logo display',
        'Social sharing',
      ],
      cta: 'Post a Job',
      href: '/post-job?plan=basic',
      popular: false,
    },
    {
      name: 'Pro',
      price: '299.99',
      period: 'per job',
      description: 'Best for competitive positions',
      features: [
        '60-day job listing',
        'Featured placement',
        'Priority support',
        'Newsletter inclusion',
        'Social media promotion',
        'Highlighted in search',
        'Advanced analytics',
      ],
      cta: 'Post Featured Job',
      href: '/post-job?plan=pro',
      popular: true,
    },
    {
      name: 'Recruiter',
      price: '500',
      period: 'per job',
      description: 'For agencies and high-volume recruiters',
      features: [
        '90-day job listing',
        'All Pro features',
        'Dedicated support',
        'Top placement in results',
        'Custom branding',
        'ATS integration',
        'Bulk posting tools',
        'Priority placement',
      ],
      cta: 'Post Premium Job',
      href: '/post-job?plan=recruiter',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-eu-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Reach thousands of qualified EU professionals. No hidden fees.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-eu-blue' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-eu-blue text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">&euro;{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-eu-blue text-white hover:bg-eu-dark'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Frequently Asked Questions</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How long do job postings stay active?</h3>
              <p className="text-gray-600 dark:text-gray-300">Basic listings are active for 30 days, Pro for 60 days, and Recruiter for 90 days.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I edit my job posting after publishing?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, you can edit your job posting at any time from your employer dashboard.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">We accept all major credit cards via Stripe. Secure payment processing is included.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-300">We offer a full refund within 7 days if your job posting hasn&apos;t received any applications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-eu-blue py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-300 mb-8">Contact our sales team for volume discounts and custom packages.</p>
          <Link href="/contact" className="bg-white text-eu-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  )
}
