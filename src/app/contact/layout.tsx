import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - EU Jobs Brussels',
  description: 'Get in touch with the EU Jobs Brussels team. We are here to help with job postings, partnerships, and general inquiries.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
