/**
 * MongoDB index creation script for eujobs.
 *
 * Run inside the mongo container:
 *   docker exec eujobs-mongo mongosh < scripts/add-indexes.js
 *
 * Or from the host:
 *   mongosh mongodb://localhost:27017/test < scripts/add-indexes.js
 */

db = db.getSiblingDB('test');

// --- jobs collection (78K+ docs) ---

// Most queries filter on status + plan and sort by createdAt
db.jobs.createIndex(
  { status: 1, plan: 1, createdAt: -1 },
  { name: 'status_plan_createdAt', background: true }
);

// Company lookups filter by companyName + status + plan
db.jobs.createIndex(
  { companyName: 1, status: 1, plan: 1 },
  { name: 'companyName_status_plan', background: true }
);

// Text search on title, companyName, description
db.jobs.createIndex(
  { title: 'text', companyName: 'text', description: 'text' },
  { name: 'text_search', background: true }
);

// Seniority-based queries
db.jobs.createIndex(
  { seniority: 1, status: 1, plan: 1, createdAt: -1 },
  { name: 'seniority_status_plan_createdAt', background: true }
);

// --- eu_interest_representatives (12K+ docs) ---
db.eu_interest_representatives.createIndex(
  { slug: 1 },
  { name: 'slug_1', unique: true, background: true }
);

print('All indexes created successfully.');
print('Current jobs indexes:');
printjson(db.jobs.getIndexes());
