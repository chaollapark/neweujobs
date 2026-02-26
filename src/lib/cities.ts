export interface CityConfig {
  slug: string
  name: string
  country: string
  countryCode: string
  description: string
  heroTitle: string
  heroSubtitle: string
  searchPlaceholder: string
  cityMatchers: string[]
  features: {
    bestInBrussels: boolean
    lobbyingEntities: boolean
    blog: boolean
    fairpay: boolean
  }
}

export const CITIES: CityConfig[] = [
  {
    slug: 'brussels',
    name: 'Brussels',
    country: 'Belgium',
    countryCode: 'BE',
    description: 'Find EU jobs in Brussels - the heart of European institutions, NGOs, think tanks, and public affairs.',
    heroTitle: 'Find Your Career in the EU Bubble',
    heroSubtitle: 'The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels.',
    searchPlaceholder: 'Brussels, Belgium',
    cityMatchers: ['Brussels', 'Bruxelles', 'Brussel'],
    features: {
      bestInBrussels: true,
      lobbyingEntities: true,
      blog: true,
      fairpay: true,
    },
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    description: 'Find EU-related jobs in Paris - OECD, UNESCO, and European affairs positions in France.',
    heroTitle: 'EU & International Jobs in Paris',
    heroSubtitle: 'Discover career opportunities at international organisations, NGOs, and public affairs firms in Paris.',
    searchPlaceholder: 'Paris, France',
    cityMatchers: ['Paris'],
    features: {
      bestInBrussels: false,
      lobbyingEntities: false,
      blog: false,
      fairpay: false,
    },
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    description: 'Find EU-related jobs in London - public affairs, policy, and international organisation roles.',
    heroTitle: 'EU & Policy Jobs in London',
    heroSubtitle: 'Find public affairs, policy, and international organisation positions in London.',
    searchPlaceholder: 'London, United Kingdom',
    cityMatchers: ['London'],
    features: {
      bestInBrussels: false,
      lobbyingEntities: false,
      blog: false,
      fairpay: false,
    },
  },
  {
    slug: 'geneva',
    name: 'Geneva',
    country: 'Switzerland',
    countryCode: 'CH',
    description: 'Find international jobs in Geneva - UN, WHO, WTO, and NGO positions in Switzerland.',
    heroTitle: 'International Jobs in Geneva',
    heroSubtitle: 'Explore career opportunities at the UN, WHO, WTO, and other international organisations in Geneva.',
    searchPlaceholder: 'Geneva, Switzerland',
    cityMatchers: ['Geneva', 'Geneve', 'Gen\u00e8ve', 'Genf'],
    features: {
      bestInBrussels: false,
      lobbyingEntities: false,
      blog: false,
      fairpay: false,
    },
  },
  {
    slug: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    description: 'Find EU-related jobs in Berlin - policy, public affairs, and international organisation roles in Germany.',
    heroTitle: 'EU & Policy Jobs in Berlin',
    heroSubtitle: 'Discover policy, public affairs, and international organisation opportunities in Berlin.',
    searchPlaceholder: 'Berlin, Germany',
    cityMatchers: ['Berlin'],
    features: {
      bestInBrussels: false,
      lobbyingEntities: false,
      blog: false,
      fairpay: false,
    },
  },
  {
    slug: 'rome',
    name: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    description: 'Find EU-related jobs in Rome - FAO, IFAD, and international organisation positions in Italy.',
    heroTitle: 'International Jobs in Rome',
    heroSubtitle: 'Find career opportunities at FAO, IFAD, and other international organisations in Rome.',
    searchPlaceholder: 'Rome, Italy',
    cityMatchers: ['Rome', 'Roma'],
    features: {
      bestInBrussels: false,
      lobbyingEntities: false,
      blog: false,
      fairpay: false,
    },
  },
]

export const VALID_CITY_SLUGS = CITIES.map(c => c.slug)

export function getCityConfig(slug: string): CityConfig | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function isValidCity(slug: string): boolean {
  return VALID_CITY_SLUGS.includes(slug)
}
