/**
 * Import organization career guides from JSON files into MongoDB.
 * Reads 12,035 JSON files from career-guides/ and bulk upserts into org_career_guides collection.
 *
 * Usage: node scripts/import-org-career-guides.js [--dry-run]
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'test';
const DRY_RUN = process.argv.includes('--dry-run');
const BATCH_SIZE = 500;
const GUIDES_DIR = path.join(__dirname, '..', 'career-guides');

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI or MONGO_URI in .env');
  process.exit(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractBodyHtml(fullHtml) {
  // Extract content between <body> and </body>
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return fullHtml;

  let body = bodyMatch[1];
  // Remove <style> blocks
  body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  return body.trim();
}

function generateDescription(html) {
  // Strip HTML tags and get first 160 chars
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.substring(0, 160).trim();
}

async function importGuides() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== IMPORTING ORG CAREER GUIDES ===');
  const startTime = Date.now();

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected to database:', DB_NAME);

  const db = mongoose.connection.db;
  const guidesCol = db.collection('org_career_guides');
  const entitiesCol = db.collection('eu_interest_representatives');

  // Read all JSON files
  const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} JSON files in ${GUIDES_DIR}`);

  // Build entityId -> entitySlug lookup
  console.log('Building entity slug lookup...');
  const entities = await entitiesCol.find({}, { projection: { _id: 1, slug: 1 } }).toArray();
  const entitySlugMap = new Map();
  for (const e of entities) {
    entitySlugMap.set(e._id.toString(), e.slug);
  }
  console.log(`Loaded ${entitySlugMap.size} entity slugs`);

  // Track slugs to handle duplicates
  const slugCounts = new Map();
  let imported = 0;
  let errors = 0;
  let batch = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8');
      const data = JSON.parse(raw);

      if (!data.success) {
        errors++;
        continue;
      }

      // Generate slug from organization name
      let baseSlug = slugify(data.organization) + '-career-guide';
      const count = slugCounts.get(baseSlug) || 0;
      slugCounts.set(baseSlug, count + 1);
      const slug = count > 0 ? `${baseSlug}-${count}` : baseSlug;

      // Extract body HTML
      const contentHtml = extractBodyHtml(data.content);
      const description = generateDescription(contentHtml);

      // Look up entity slug
      const entitySlug = entitySlugMap.get(data.entityId) || null;

      const doc = {
        slug,
        title: data.title,
        contentHtml,
        organization: data.organization,
        entityId: new mongoose.Types.ObjectId(data.entityId),
        entitySlug,
        wordCount: data.wordCount,
        generatedAt: new Date(data.generatedAt),
        description,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      batch.push({
        updateOne: {
          filter: { entityId: doc.entityId },
          update: { $set: doc },
          upsert: true,
        },
      });

      if (batch.length >= BATCH_SIZE) {
        if (!DRY_RUN) {
          await guidesCol.bulkWrite(batch, { ordered: false });
        }
        imported += batch.length;
        console.log(`Processed ${imported}/${files.length} guides...`);
        batch = [];
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
      errors++;
    }
  }

  // Flush remaining batch
  if (batch.length > 0) {
    if (!DRY_RUN) {
      await guidesCol.bulkWrite(batch, { ordered: false });
    }
    imported += batch.length;
  }

  // Create indexes
  if (!DRY_RUN) {
    console.log('Creating indexes...');
    await guidesCol.createIndex({ slug: 1 }, { unique: true });
    await guidesCol.createIndex({ entityId: 1 });
    await guidesCol.createIndex({ entitySlug: 1 });
    await guidesCol.createIndex({ organization: 1 });
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n=== SUMMARY ===');
  console.log(`Total files: ${files.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Errors: ${errors}`);
  console.log(`Time: ${elapsed}s`);
  if (DRY_RUN) console.log('(DRY RUN — no data written)');

  await mongoose.disconnect();
  console.log('Done.');
}

importGuides().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
