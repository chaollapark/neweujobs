/**
 * Retire old jobs — sets status='retired' on jobs whose expiresOn date has passed.
 * Safe to run multiple times (idempotent).
 *
 * Usage: node scripts/retire-old-jobs.js [--dry-run]
 */

const mongoose = require('mongoose');
require('dotenv/config');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'test';
const DRY_RUN = process.argv.includes('--dry-run');

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI or MONGO_URI in .env');
  process.exit(1);
}

async function retire() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== RETIRING OLD JOBS ===');
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected to database:', DB_NAME);

  const db = mongoose.connection.db;
  const col = db.collection('jobs');
  const now = new Date();

  // 1. Set all jobs without a status field to 'active' first
  const noStatus = await col.countDocuments({ status: { $exists: false } });
  if (noStatus > 0) {
    if (!DRY_RUN) {
      await col.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
      );
    }
    console.log(`Set ${noStatus} jobs without status to 'active'`);
  }

  // 2. Find jobs that should be retired:
  //    - expiresOn is a date string that has passed
  //    - OR no expiresOn but createdAt is older than 90 days
  //    - AND currently not already retired
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Jobs with expiresOn that has passed
  const allJobs = await col.find({
    status: { $ne: 'retired' },
    plan: { $nin: ['pending'] },
  }).project({ slug: 1, title: 1, expiresOn: 1, createdAt: 1, companyName: 1 }).toArray();

  const toRetire = [];
  for (const job of allJobs) {
    let shouldRetire = false;

    if (job.expiresOn) {
      const expiresDate = new Date(job.expiresOn);
      if (!isNaN(expiresDate.getTime()) && expiresDate < now) {
        shouldRetire = true;
      }
    } else if (job.createdAt) {
      const created = new Date(job.createdAt);
      if (!isNaN(created.getTime()) && created < ninetyDaysAgo) {
        shouldRetire = true;
      }
    }

    if (shouldRetire) {
      toRetire.push(job);
    }
  }

  console.log(`\nTotal non-pending jobs: ${allJobs.length}`);
  console.log(`Jobs to retire: ${toRetire.length}`);
  console.log(`Jobs staying active: ${allJobs.length - toRetire.length}`);

  if (toRetire.length > 0) {
    // Show sample
    console.log('\nSample of jobs being retired:');
    toRetire.slice(0, 10).forEach(function(job) {
      console.log('  -', job.title || 'Untitled', 'at', job.companyName || 'Unknown',
        '| expires:', job.expiresOn || 'N/A',
        '| created:', job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : 'N/A');
    });
    if (toRetire.length > 10) {
      console.log('  ... and', toRetire.length - 10, 'more');
    }

    if (!DRY_RUN) {
      const retireIds = toRetire.map(function(j) { return j._id; });
      const result = await col.updateMany(
        { _id: { $in: retireIds } },
        { $set: { status: 'retired' } }
      );
      console.log(`\nRetired ${result.modifiedCount} jobs`);
    } else {
      console.log('\n(Dry run — no changes made)');
    }
  } else {
    console.log('\nNo jobs to retire.');
  }

  // 3. Summary
  const activeCount = await col.countDocuments({ status: 'active' });
  const retiredCount = await col.countDocuments({ status: 'retired' });
  const pendingCount = await col.countDocuments({ plan: 'pending' });
  console.log(`\n=== SUMMARY ===`);
  console.log(`Active: ${activeCount}`);
  console.log(`Retired: ${retiredCount}`);
  console.log(`Pending: ${pendingCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

retire().catch(function(err) {
  console.error('Retirement script failed:', err);
  process.exit(1);
});
