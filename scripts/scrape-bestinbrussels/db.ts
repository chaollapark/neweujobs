import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Import models - use require for CommonJS compatibility
const modelPath = (name: string) => path.join(__dirname, '..', '..', 'src', 'models', name);

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'test';

  if (!uri) throw new Error('MONGODB_URI not set');

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri, { dbName });
  console.log(`Connected to MongoDB (${dbName})`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

async function getModel(modelFile: string) {
  // Dynamic import for CommonJS
  const mod = require(modelPath(modelFile));
  return mod.default || mod;
}

export async function upsertConsultancy(data: any) {
  const Model = await getModel('BibConsultancy');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertConsultant(data: any) {
  const Model = await getModel('BibConsultant');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertLawFirm(data: any) {
  const Model = await getModel('BibLawFirm');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertIntelligenceSystem(data: any) {
  const Model = await getModel('BibIntelligenceSystem');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertDigitalTool(data: any) {
  const Model = await getModel('BibDigitalTool');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertTrainer(data: any) {
  const Model = await getModel('BibTrainer');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertSpecialistCategory(data: any) {
  const Model = await getModel('BibSpecialistCategory');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertArticle(data: any) {
  const Model = await getModel('BibArticle');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function upsertEditorialPage(data: any) {
  const Model = await getModel('BibEditorialPage');
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $set: data },
    { upsert: true, new: true }
  );
}
