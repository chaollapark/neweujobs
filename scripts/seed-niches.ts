import mongoose from 'mongoose';
import { Niche } from '../src/models/Niche';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/eujobs';

// Define niches directly - 20 niche job boards
const niches = [
  { slug: 'berlin-startup-jobs', name: 'Berlin Startup Jobs', focus: 'startup and tech jobs in Berlin', competitor: 'berlinstartupjobs.com' },
  { slug: 'climate-jobs', name: 'Climate Jobs', focus: 'climate and sustainability careers', competitor: 'climatejobs.com' },
  { slug: 'eu-policy-jobs', name: 'EU Policy Jobs', focus: 'EU policy and public affairs', competitor: 'europolitics.com' },
  { slug: 'brussels-jobs', name: 'Brussels Jobs', focus: 'jobs in the EU capital', competitor: 'brusselsjobs.com' },
  { slug: 'ngo-jobs', name: 'NGO Jobs', focus: 'nonprofit and NGO careers', competitor: 'devex.com' },
  { slug: 'think-tank-jobs', name: 'Think Tank Jobs', focus: 'research and policy analysis', competitor: 'policyjobs.net' },
  { slug: 'sustainability-jobs', name: 'Sustainability Jobs', focus: 'green and sustainable careers', competitor: 'greenjobs.com' },
  { slug: 'public-affairs-jobs', name: 'Public Affairs Jobs', focus: 'lobbying and government relations', competitor: 'publicaffairsjobs.com' },
  { slug: 'amsterdam-tech-jobs', name: 'Amsterdam Tech Jobs', focus: 'tech jobs in Amsterdam', competitor: 'amsterdamtechjobs.com' },
  { slug: 'paris-tech-jobs', name: 'Paris Tech Jobs', focus: 'tech jobs in Paris', competitor: 'paristechjobs.com' },
  { slug: 'london-fintech-jobs', name: 'London Fintech Jobs', focus: 'fintech careers in London', competitor: 'fintechjobs.co.uk' },
  { slug: 'web3-jobs', name: 'Web3 Jobs', focus: 'blockchain and crypto careers', competitor: 'web3.career' },
  { slug: 'remote-europe-jobs', name: 'Remote Europe Jobs', focus: 'remote work in Europe', competitor: 'remoteok.com' },
  { slug: 'legal-jobs-eu', name: 'Legal Jobs EU', focus: 'legal careers in Europe', competitor: 'legalweekjobs.com' },
  { slug: 'energy-jobs', name: 'Energy Jobs', focus: 'energy sector careers', competitor: 'energyjobs.com' },
  { slug: 'healthcare-jobs-eu', name: 'Healthcare Jobs EU', focus: 'healthcare careers in Europe', competitor: 'healthcarejobs.eu' },
  { slug: 'finance-jobs-eu', name: 'Finance Jobs EU', focus: 'finance careers in Europe', competitor: 'efinancialcareers.com' },
  { slug: 'digital-marketing-jobs', name: 'Digital Marketing Jobs', focus: 'marketing and digital careers', competitor: 'marketingjobs.com' },
  { slug: 'data-science-jobs', name: 'Data Science Jobs', focus: 'data and AI careers', competitor: 'datasciencejobs.com' },
  { slug: 'eu-institutions-jobs', name: 'EU Institutions Jobs', focus: 'European Commission and Parliament', competitor: 'epso.europa.eu' },
];

function getColorForNiche(slug: string): string {
  const colorMap: Record<string, string> = {
    'climate-jobs': 'green',
    'sustainability-jobs': 'green',
    'berlin-startup-jobs': 'purple',
    'web3-jobs': 'violet',
    'ngo-jobs': 'teal',
    'london-fintech-jobs': 'blue',
    'paris-tech-jobs': 'indigo',
    'data-science-jobs': 'cyan',
    'healthcare-jobs-eu': 'red',
    'energy-jobs': 'orange',
    'finance-jobs-eu': 'emerald',
    'legal-jobs-eu': 'slate',
    'eu-policy-jobs': 'blue',
    'brussels-jobs': 'blue',
    'eu-institutions-jobs': 'blue',
  };
  return colorMap[slug] || 'blue';
}

function getFiltersForNiche(slug: string): { locations?: string[]; categories?: string[]; tags?: string[] } {
  const filterMap: Record<string, { locations?: string[]; categories?: string[]; tags?: string[] }> = {
    'berlin-startup-jobs': { locations: ['Berlin', 'Germany'], tags: ['startup', 'tech'] },
    'amsterdam-tech-jobs': { locations: ['Amsterdam', 'Netherlands'], tags: ['tech'] },
    'paris-tech-jobs': { locations: ['Paris', 'France'], tags: ['tech'] },
    'london-fintech-jobs': { locations: ['London', 'UK'], tags: ['fintech', 'finance', 'banking'] },
    'climate-jobs': { tags: ['climate', 'sustainability', 'green', 'environment'] },
    'sustainability-jobs': { tags: ['sustainability', 'green', 'environment', 'ESG'] },
    'web3-jobs': { tags: ['web3', 'crypto', 'blockchain', 'defi', 'nft'] },
    'ngo-jobs': { tags: ['NGO', 'nonprofit', 'charity', 'development'] },
    'remote-europe-jobs': { tags: ['remote'] },
    'eu-policy-jobs': { locations: ['Brussels', 'Belgium'], tags: ['policy', 'EU affairs', 'public affairs'] },
    'brussels-jobs': { locations: ['Brussels', 'Belgium'] },
    'think-tank-jobs': { tags: ['research', 'policy', 'think tank', 'analysis'] },
    'public-affairs-jobs': { tags: ['public affairs', 'lobbying', 'government relations', 'advocacy'] },
    'legal-jobs-eu': { tags: ['legal', 'law', 'lawyer', 'compliance'] },
    'energy-jobs': { tags: ['energy', 'renewable', 'oil', 'gas', 'power'] },
    'healthcare-jobs-eu': { tags: ['health', 'medical', 'pharma', 'healthcare'] },
    'finance-jobs-eu': { tags: ['finance', 'banking', 'investment', 'accounting'] },
    'digital-marketing-jobs': { tags: ['marketing', 'digital', 'SEO', 'content', 'social media'] },
    'data-science-jobs': { tags: ['data', 'AI', 'machine learning', 'analytics', 'data science'] },
    'eu-institutions-jobs': { locations: ['Brussels', 'Luxembourg', 'Strasbourg'], tags: ['European Commission', 'EU Parliament', 'EU Council'] },
  };
  return filterMap[slug] || {};
}

const nicheConfigs = niches.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: `Find the best ${c.name.toLowerCase()} in Europe. Updated daily with fresh opportunities from top companies.`,
  h1: c.name,
  tagline: `Your #1 destination for ${c.focus}`,
  competitor: c.competitor,
  keywords: [c.slug.replace(/-/g, ' '), c.focus, 'jobs', 'europe', 'careers'],
  colors: {
    primary: getColorForNiche(c.slug),
    accent: 'indigo',
  },
  filters: getFiltersForNiche(c.slug),
  enabled: true,
}));

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const config of nicheConfigs) {
      await Niche.findOneAndUpdate({ slug: config.slug }, config, { upsert: true, new: true });
      console.log(`✓ Seeded: ${config.slug}`);
    }

    console.log(`\n✅ Seeded ${nicheConfigs.length} niches`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
