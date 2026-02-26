import dbConnect from './dbConnect';
import BibConsultancy from '@/models/BibConsultancy';
import BibConsultant from '@/models/BibConsultant';
import BibLawFirm from '@/models/BibLawFirm';
import BibIntelligenceSystem from '@/models/BibIntelligenceSystem';
import BibDigitalTool from '@/models/BibDigitalTool';
import BibTrainer from '@/models/BibTrainer';
import BibSpecialistCategory from '@/models/BibSpecialistCategory';
import BibArticle from '@/models/BibArticle';
import BibEditorialPage from '@/models/BibEditorialPage';

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

// ── Consultancies ──

export async function getBibConsultancies(page = 1, perPage = 12, specialism?: string) {
  await dbConnect();
  const query: Record<string, any> = {};
  if (specialism) query.specialisms = specialism;

  const [items, total] = await Promise.all([
    BibConsultancy.find(query).sort({ name: 1 }).skip((page - 1) * perPage).limit(perPage).lean(),
    BibConsultancy.countDocuments(query),
  ]);
  return { items: serialize(items), total, totalPages: Math.ceil(total / perPage) };
}

export async function getBibConsultancyBySlug(slug: string) {
  await dbConnect();
  const doc = await BibConsultancy.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

export async function getBibAllSpecialisms() {
  await dbConnect();
  const result = await BibConsultancy.aggregate([
    { $unwind: '$specialisms' },
    { $group: { _id: '$specialisms', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return result.map((r: any) => ({ specialism: r._id, count: r.count }));
}

// ── Consultants ──

export async function getBibConsultants(page = 1, perPage = 24, specialism?: string, letter?: string) {
  await dbConnect();
  const query: Record<string, any> = {};
  if (specialism) query.specialisms = specialism;
  if (letter) query.name = { $regex: `^${letter}`, $options: 'i' };

  const [items, total] = await Promise.all([
    BibConsultant.find(query).sort({ name: 1 }).skip((page - 1) * perPage).limit(perPage).lean(),
    BibConsultant.countDocuments(query),
  ]);
  return { items: serialize(items), total, totalPages: Math.ceil(total / perPage) };
}

export async function getBibConsultantBySlug(slug: string) {
  await dbConnect();
  const doc = await BibConsultant.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Law Firms ──

export async function getBibLawFirms() {
  await dbConnect();
  const items = await BibLawFirm.find().sort({ name: 1 }).lean();
  return serialize(items);
}

export async function getBibLawFirmBySlug(slug: string) {
  await dbConnect();
  const doc = await BibLawFirm.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Intelligence Systems ──

export async function getBibIntelligenceSystems() {
  await dbConnect();
  const items = await BibIntelligenceSystem.find().sort({ name: 1 }).lean();
  return serialize(items);
}

export async function getBibIntelligenceSystemBySlug(slug: string) {
  await dbConnect();
  const doc = await BibIntelligenceSystem.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Digital Tools ──

export async function getBibDigitalTools() {
  await dbConnect();
  const items = await BibDigitalTool.find().sort({ name: 1 }).lean();
  return serialize(items);
}

export async function getBibDigitalToolBySlug(slug: string) {
  await dbConnect();
  const doc = await BibDigitalTool.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Trainers ──

export async function getBibTrainers() {
  await dbConnect();
  const items = await BibTrainer.find().sort({ name: 1 }).lean();
  return serialize(items);
}

export async function getBibTrainerBySlug(slug: string) {
  await dbConnect();
  const doc = await BibTrainer.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Specialist Categories ──

export async function getBibSpecialistCategories(type?: 'sector' | 'service') {
  await dbConnect();
  const query: Record<string, any> = {};
  if (type) query.type = type;
  const items = await BibSpecialistCategory.find(query).sort({ type: 1, name: 1 }).lean();
  return serialize(items);
}

export async function getBibSpecialistCategoryBySlug(slug: string) {
  await dbConnect();
  const doc = await BibSpecialistCategory.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Articles ──

export async function getBibArticles(page = 1, perPage = 10) {
  await dbConnect();
  const [items, total] = await Promise.all([
    BibArticle.find().sort({ publishedDate: -1, createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean(),
    BibArticle.countDocuments(),
  ]);
  return { items: serialize(items), total, totalPages: Math.ceil(total / perPage) };
}

export async function getBibArticleBySlug(slug: string) {
  await dbConnect();
  const doc = await BibArticle.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Editorial Pages ──

export async function getBibEditorialPages(section?: string) {
  await dbConnect();
  const query: Record<string, any> = {};
  if (section) query.section = section;
  const items = await BibEditorialPage.find(query).sort({ sortOrder: 1 }).lean();
  return serialize(items);
}

export async function getBibEditorialPageBySlug(slug: string) {
  await dbConnect();
  const doc = await BibEditorialPage.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

// ── Stats ──

export async function getBibStats() {
  await dbConnect();
  const [consultancies, consultants, lawFirms, intelligenceSystems, digitalTools, trainers, specialists, articles] = await Promise.all([
    BibConsultancy.countDocuments(),
    BibConsultant.countDocuments(),
    BibLawFirm.countDocuments(),
    BibIntelligenceSystem.countDocuments(),
    BibDigitalTool.countDocuments(),
    BibTrainer.countDocuments(),
    BibSpecialistCategory.countDocuments(),
    BibArticle.countDocuments(),
  ]);
  return { consultancies, consultants, lawFirms, intelligenceSystems, digitalTools, trainers, specialists, articles };
}
