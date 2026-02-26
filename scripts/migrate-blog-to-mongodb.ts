import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'test';

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI or MONGO_URI in .env');
  process.exit(1);
}

// Interest mapping per blog post slug
const interestMapping: Record<string, string[]> = {
  'best-university-for-eujobs': ['Education and training', 'Research and innovation', 'Institutional affairs'],
  'can-i-work-in-brussels-with-english': ['Employment and social affairs', 'Institutional affairs', 'Communication'],
  'Competency-Based-CVs-&-Cover-Letters-for-EU-Jobs:-A-Practical-Guide': ['Employment and social affairs', 'Communication', 'Institutional affairs'],
  'coolest-european-union-jobs': ['Institutional affairs', 'Single market', 'Public health'],
  'eu-policy-legislation-careers-guide': ['Institutional affairs', 'Single market', 'Competition', 'Communication'],
  'eurobrussels-how-brussels-became-eu-capital': ['Institutional affairs', 'Regional policy', 'Budget'],
  'eurobubble-eu-jobs-brussels-local-divide': ['Institutional affairs', 'Employment and social affairs'],
  'how-easy-is-it-to-get-a-job-in-brussels': ['Employment and social affairs', 'Single market', 'Communication', 'Business and industry'],
  'How-to-Win-the-2025-European-Job-Market': ['Employment and social affairs', 'Digital economy and society', 'Business and industry'],
  'lesser-known-eu-job-opportunities': ['Institutional affairs', 'Public health', 'Food safety', 'Environment'],
  'minimum-salary-in-brussels': ['Employment and social affairs', 'Economy finance and the euro'],
  'types-of-eu-job-vacancies': ['Institutional affairs', 'Employment and social affairs', 'Competition'],
  'un-jobs-in-brussels-niche-opportunities': ['International co-operation and development', 'Foreign affairs and security policy', 'Humanitarian aid and civil protection'],
  'what-is-a-good-salary-in-brussels': ['Employment and social affairs', 'Economy finance and the euro', 'Business and industry'],
  'your-first-internship-in-eu-institutions': ['Institutional affairs', 'Education and training', 'Youth'],
};

const CareerGuideSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  content: { type: String },
  contentHtml: { type: String },
  description: { type: String },
  excerpt: { type: String },
  author: { type: String, default: 'EU Jobs Team' },
  publishedDate: { type: Date },
  relatedInterests: [{ type: String }],
  tags: [{ type: String }],
  featuredImage: { type: String },
}, {
  timestamps: true,
  collection: 'career_guides',
  strict: false,
});

const CareerGuide = mongoose.model('CareerGuide', CareerGuideSchema);

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!, { dbName: DB_NAME });
  console.log(`Connected to database: ${DB_NAME}`);

  const postsDir = path.join(process.cwd(), 'src/blog');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} markdown files`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    if (fileContents.trim().length === 0) {
      console.log(`  SKIP (empty): ${slug}`);
      skipped++;
      continue;
    }

    const matterResult = matter(fileContents);
    const content = matterResult.content;

    // Render markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    // Extract first paragraph as excerpt
    const firstParagraph = content
      .split('\n\n')
      .find(p => p.trim() && !p.startsWith('#') && !p.startsWith('---'));
    const excerpt = firstParagraph
      ? firstParagraph.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').substring(0, 200)
      : '';

    // Build description from title
    const title = matterResult.data.title || slug.replace(/-/g, ' ');
    const description = excerpt
      ? excerpt.substring(0, 160)
      : `${title} - Career advice and insights for working in EU institutions and Brussels.`;

    const relatedInterests = interestMapping[slug] || [];
    const tags = relatedInterests.length > 0 ? relatedInterests : [];

    const doc = {
      slug,
      title,
      content,
      contentHtml,
      description,
      excerpt,
      author: matterResult.data.author || 'EU Jobs Team',
      publishedDate: matterResult.data.date ? new Date(matterResult.data.date) : new Date('2025-01-01'),
      relatedInterests,
      tags,
    };

    await CareerGuide.updateOne(
      { slug },
      { $set: doc },
      { upsert: true }
    );

    console.log(`  OK: ${slug} (${relatedInterests.length} interests)`);
    migrated++;
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
