import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Alerts - EU Jobs Brussels',
  description: 'Set up job alerts and get notified when new EU positions matching your criteria are posted.',
}

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children
}
