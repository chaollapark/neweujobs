import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env first
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import { discoverAllUrls, fetchPage } from './scraper';
import { parseConsultancy } from './parsers/consultancy';
import { parseConsultant } from './parsers/consultant';
import { parseLawFirm } from './parsers/lawFirm';
import { parseIntelligenceSystem } from './parsers/intelligenceSystem';
import { parseDigitalTool } from './parsers/digitalTool';
import { parseTrainer } from './parsers/trainer';
import { parseSpecialist } from './parsers/specialist';
import { parseArticle } from './parsers/article';
import { parseEditorial } from './parsers/editorial';
import { rewriteFields } from './rewriter';
import { downloadImage } from './imageDownloader';
import {
  connectDB, disconnectDB,
  upsertConsultancy, upsertConsultant, upsertLawFirm,
  upsertIntelligenceSystem, upsertDigitalTool, upsertTrainer,
  upsertSpecialistCategory, upsertArticle, upsertEditorialPage,
} from './db';
import {
  loadProgress, markScraped, markRewritten, markSaved, logError,
} from './progress';
import { ContentType } from './types';

// Parse CLI flags
const args = process.argv.slice(2);
const RESUME = args.includes('--resume');
const SCRAPE_ONLY = args.includes('--scrape-only');
const REWRITE_ONLY = args.includes('--rewrite-only');
const RETRY_ERRORS = args.includes('--retry-errors');

interface ScrapeTask {
  urls: string[];
  type: ContentType;
  parser: (url: string, $: any) => any;
  upsert: (data: any) => Promise<any>;
  imageType: string;
  textFields: string[];
}

async function main() {
  console.log('=== Best in Brussels Scraper ===');
  console.log(`Flags: resume=${RESUME}, scrapeOnly=${SCRAPE_ONLY}, rewriteOnly=${REWRITE_ONLY}, retryErrors=${RETRY_ERRORS}`);

  const progress = loadProgress();

  if (RESUME) {
    console.log(`Resuming from previous run: ${progress.scraped.length} scraped, ${progress.rewritten.length} rewritten, ${progress.saved.length} saved, ${progress.errors.length} errors`);
  }

  await connectDB();

  // Discover all URLs
  const urls = await discoverAllUrls();

  const tasks: ScrapeTask[] = [
    {
      urls: urls.trainers,
      type: 'trainer',
      parser: parseTrainer,
      upsert: upsertTrainer,
      imageType: 'trainers',
      textFields: ['description'],
    },
    {
      urls: urls.digitalTools,
      type: 'digitalTool',
      parser: parseDigitalTool,
      upsert: upsertDigitalTool,
      imageType: 'digital-tools',
      textFields: ['description'],
    },
    {
      urls: urls.lawFirms,
      type: 'lawFirm',
      parser: parseLawFirm,
      upsert: upsertLawFirm,
      imageType: 'law-firms',
      textFields: ['description'],
    },
    {
      urls: urls.intelligenceSystems,
      type: 'intelligenceSystem',
      parser: parseIntelligenceSystem,
      upsert: upsertIntelligenceSystem,
      imageType: 'intelligence-systems',
      textFields: ['description'],
    },
    {
      urls: urls.specialists,
      type: 'specialist',
      parser: parseSpecialist,
      upsert: upsertSpecialistCategory,
      imageType: 'specialists',
      textFields: ['description'],
    },
    {
      urls: urls.consultancies,
      type: 'consultancy',
      parser: parseConsultancy,
      upsert: upsertConsultancy,
      imageType: 'consultancies',
      textFields: ['description'],
    },
    {
      urls: urls.consultants,
      type: 'consultant',
      parser: parseConsultant,
      upsert: upsertConsultant,
      imageType: 'consultants',
      textFields: ['myJob', 'achievements', 'interests'],
    },
    {
      urls: urls.articles,
      type: 'article',
      parser: parseArticle,
      upsert: upsertArticle,
      imageType: 'articles',
      textFields: ['content'],
    },
    {
      urls: urls.editorials,
      type: 'editorial',
      parser: parseEditorial,
      upsert: upsertEditorialPage,
      imageType: 'editorials',
      textFields: ['content'],
    },
  ];

  for (const task of tasks) {
    console.log(`\n--- Processing ${task.type} (${task.urls.length} URLs) ---`);
    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const url of task.urls) {
      try {
        // Phase 1: Scrape
        if (!REWRITE_ONLY) {
          if (RESUME && progress.scraped.includes(url)) {
            skipped++;
            continue;
          }

          process.stdout.write(`  [${processed + skipped + 1}/${task.urls.length}] Scraping ${url}...`);
          const $ = await fetchPage(url);
          const data = task.parser(url, $);

          // Download image
          const imageField = task.type === 'consultant' ? 'photoUrl' : 'logoUrl';
          const localImage = await downloadImage(data[imageField], task.imageType, data.slug);
          if (localImage) data[imageField] = localImage;

          // Store original text fields before rewriting
          for (const field of task.textFields) {
            if (data[field]) {
              const originalField = field === 'description' ? 'originalDescription' :
                field === 'content' ? 'originalContent' :
                  field === 'myJob' ? 'originalMyJob' :
                    field === 'achievements' ? 'originalAchievements' :
                      field === 'interests' ? 'originalInterests' :
                        `original${field.charAt(0).toUpperCase()}${field.slice(1)}`;
              data[originalField] = data[field];
            }
          }

          // Phase 2: Rewrite
          if (!SCRAPE_ONLY) {
            const fieldsToRewrite: Record<string, string> = {};
            for (const field of task.textFields) {
              if (data[field]) fieldsToRewrite[field] = data[field];
            }

            if (Object.keys(fieldsToRewrite).length > 0) {
              try {
                const rewritten = await rewriteFields(fieldsToRewrite, task.type);
                for (const [key, value] of Object.entries(rewritten)) {
                  data[key] = value;
                }
                markRewritten(progress, url);
              } catch (rewriteErr) {
                console.warn(` (rewrite failed: ${(rewriteErr as Error).message})`);
                logError(progress, url, (rewriteErr as Error).message, 'rewrite');
              }
            }
          }

          // Phase 3: Save to DB
          await task.upsert(data);
          markScraped(progress, url);
          markSaved(progress, url);
          processed++;
          console.log(' OK');
        }
      } catch (err) {
        errors++;
        console.log(` ERROR: ${(err as Error).message}`);
        logError(progress, url, (err as Error).message, 'scrape');
      }
    }

    console.log(`  Done: ${processed} processed, ${skipped} skipped, ${errors} errors`);
  }

  await disconnectDB();

  console.log('\n=== Summary ===');
  console.log(`Scraped: ${progress.scraped.length}`);
  console.log(`Rewritten: ${progress.rewritten.length}`);
  console.log(`Saved: ${progress.saved.length}`);
  console.log(`Errors: ${progress.errors.length}`);

  if (progress.errors.length > 0) {
    console.log('\nRecent errors:');
    progress.errors.slice(-10).forEach(e => {
      console.log(`  ${e.phase}: ${e.url} - ${e.error}`);
    });
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
