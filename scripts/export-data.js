const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = "";
const DB_NAME = 'test';

async function exportData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Export Jobs
    console.log('Exporting jobs...');
    const jobs = await db.collection('jobs').find({
      plan: { $nin: ['pending'] }
    }).sort({ createdAt: -1 }).limit(100).toArray();
    
    console.log(`Found ${jobs.length} jobs`);
    
    // Transform jobs to simpler format
    const transformedJobs = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title || 'Untitled Position',
      slug: job.slug || job._id.toString(),
      description: job.description || '',
      companyName: job.companyName || 'Unknown Company',
      salary: job.salary,
      location: [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Brussels, Belgium',
      city: job.city || 'Brussels',
      country: job.country || 'Belgium',
      remoteType: job.remote || 'onsite',
      contractType: job.type || 'permanent',
      experienceLevel: job.seniority || 'mid',
      applyLink: job.applyLink || '',
      source: job.source || '',
      createdAt: job.createdAt,
      expiresOn: job.expiresOn,
    }));
    
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(dataDir, 'jobs.json'),
      JSON.stringify(transformedJobs, null, 2)
    );
    console.log(`Exported ${transformedJobs.length} jobs to src/data/jobs.json`);
    
    // Export Lobbying Entities (Companies)
    console.log('Exporting lobbying entities...');
    const entities = await db.collection('eu_interest_representatives').find({}).limit(200).toArray();
    
    console.log(`Found ${entities.length} lobbying entities`);
    
    // Transform entities to company format
    const transformedCompanies = entities.map(entity => ({
      id: entity._id.toString(),
      name: entity.name || entity.originalName || 'Unknown Organization',
      slug: entity.slug || entity._id.toString(),
      description: entity.description || entity.goals || '',
      goals: entity.goals || '',
      website: entity.website || entity.webSiteURL || '',
      interests: entity.interests || [],
      levelsOfInterest: entity.levelsOfInterest || [],
      registrationCategory: entity.registrationCategory || '',
      acronym: entity.acronym || '',
      location: entity.headOffice?.city ? `${entity.headOffice.city}, ${entity.headOffice.country || 'Belgium'}` : 'Brussels, Belgium',
      industry: entity.registrationCategory || 'EU Affairs',
      verified: true,
    }));
    
    fs.writeFileSync(
      path.join(dataDir, 'companies.json'),
      JSON.stringify(transformedCompanies, null, 2)
    );
    console.log(`Exported ${transformedCompanies.length} companies to src/data/companies.json`);
    
    console.log('\nExport complete!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

exportData();
