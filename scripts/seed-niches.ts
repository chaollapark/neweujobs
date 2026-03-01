import mongoose from 'mongoose';
import { Niche } from '../src/models/Niche';
import competitors from '../../competitors.json';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eujobs';

const nicheConfigs = [
  ...competitors.niches.map((c: any) => ({
    slug: c.slug,
    name: c.name,
    description: `Find the best ${c.name.toLowerCase()} in Europe. Updated daily with fresh opportunities from top companies.`,
    h1: c.name,
    tagline: `Your #1 destination for ${c.focus}`,
    competitor: c.competitor,
    keywords: [c.slug.replace(/-/g, ' '), c.focus, 'jobs', 'europe', 'careers'],
    colors: {
      primary: getColorForNiche(c.slug),
      accent: 'indigo'
    },
    filters: getFiltersForNiche(c.slug),
    enabled: true
  })),
  {
    slug: 'germany',
    name: 'Germany Jobs',
    description: 'Find the best germany jobs in Europe. Updated daily with fresh opportunities from top companies.',
    h1: 'Jobs in Germany',
    tagline: 'Your #1 destination for jobs in Germany',
    keywords: ['germany', 'jobs', 'europe', 'careers'],
    colors: {
      primary: 'blue',
      accent: 'indigo'
    },
    filters: { country: 'Germany' },
    enabled: true
  }
];

function getColorForNiche(slug: string): string {
  const colorMap: Record<string, string> = {
    'climate-jobs': 'green',
    'sustainability-jobs': 'green',
    'berlin-startup-jobs': 'purple',
    'web3-jobs': 'violet',
    'ngo-jobs': 'teal',
    'london-fintech': 'blue',
    'paris-tech': 'indigo',
    'data-science': 'cyan',
    'healthcare-jobs': 'red',
    'design-jobs': 'pink'
  };
  return colorMap[slug] || 'blue';
}

function getFiltersForNiche(slug: string): { locations?: string[], categories?: string[], tags?: string[] } {
  const filterMap: Record<string, any> = {
    'berlin-startup-jobs': { locations: ['Berlin', 'Germany'] },
    'amsterdam-tech': { locations: ['Amsterdam', 'Netherlands'] },
    'paris-tech': { locations: ['Paris', 'France'] },
    'london-fintech': { locations: ['London', 'UK'], categories: ['Finance', 'Fintech'] },
    'climate-jobs': { tags: ['climate', 'sustainability', 'green'] },
    'web3-jobs': { tags: ['web3', 'crypto', 'blockchain', 'defi'] },
    'ngo-jobs': { categories: ['NGO', 'Nonprofit', 'Charity'] },
    'remote-europe': { tags: ['remote'] },
    'eu-policy': { locations: ['Brussels', 'Belgium'], categories: ['Policy', 'EU Affairs'] }
  };
  return filterMap[slug] || {};
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const config of nicheConfigs) {
      await Niche.findOneAndUpdate(
        { slug: config.slug },
        config,
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded: ${config.slug}`);
    }

    console.log(`\n✅ Seeded ${nicheConfigs.length} niches`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
