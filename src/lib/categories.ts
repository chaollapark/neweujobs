import { Category } from '@/types'

// Categories for job classification (static data - safe for client components)
export const categories: Category[] = [
  { id: '1', name: 'EU Institutions', slug: 'eu-institutions', description: 'European Commission, Parliament, Council, and more', icon: '🏛️' },
  { id: '2', name: 'EU Agencies', slug: 'eu-agencies', description: 'EFSA, EMA, Frontex, and other EU agencies', icon: '🏢' },
  { id: '3', name: 'Trade Associations', slug: 'trade-associations', description: 'BusinessEurope, ETUC, and industry groups', icon: '🤝' },
  { id: '4', name: 'NGOs & Civil Society', slug: 'ngos', description: 'WWF, Greenpeace, Amnesty, and more', icon: '🌍' },
  { id: '5', name: 'Think Tanks', slug: 'think-tanks', description: 'Bruegel, CEPS, EPC, and policy institutes', icon: '💡' },
  { id: '6', name: 'Public Affairs & Lobbying', slug: 'public-affairs', description: 'Consultancies and in-house PA roles', icon: '📢' },
  { id: '7', name: 'Law Firms', slug: 'law-firms', description: 'EU law specialists and legal practices', icon: '⚖️' },
  { id: '8', name: 'Media & Communications', slug: 'media', description: 'Politico, Euractiv, and EU media', icon: '📰' },
  { id: '9', name: 'International Organizations', slug: 'international-orgs', description: 'NATO, UN agencies, and more', icon: '🌐' },
  { id: '10', name: 'Traineeships', slug: 'traineeships', description: 'Blue Book, Schuman, and internships', icon: '🎓' },
]
