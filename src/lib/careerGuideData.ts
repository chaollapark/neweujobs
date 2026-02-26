import dbConnect from './dbConnect';
import CareerGuide from '@/models/CareerGuide';
import LobbyingEntityModel from '@/models/LobbyingEntity';

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getCareerGuides(page = 1, perPage = 20) {
  await dbConnect();
  const query = {};

  const [items, total] = await Promise.all([
    CareerGuide.find(query)
      .sort({ publishedDate: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    CareerGuide.countDocuments(query),
  ]);

  return { items: serialize(items), total, totalPages: Math.ceil(total / perPage) };
}

export async function getCareerGuideBySlug(slug: string) {
  await dbConnect();
  const doc = await CareerGuide.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

export async function getCareerGuidesForEntity(entityInterests: string[], limit = 4) {
  if (!entityInterests || entityInterests.length === 0) return [];
  await dbConnect();
  const docs = await CareerGuide.find({
    relatedInterests: { $in: entityInterests },
  })
    .sort({ publishedDate: -1 })
    .limit(limit)
    .select('slug title excerpt relatedInterests publishedDate')
    .lean();
  return serialize(docs);
}

export async function getRelatedEntitiesForGuide(guideInterests: string[], limit = 6) {
  if (!guideInterests || guideInterests.length === 0) return [];
  await dbConnect();
  const docs = await LobbyingEntityModel.find({
    interests: { $in: guideInterests },
  })
    .sort({ name: 1 })
    .limit(limit)
    .select('slug name acronym interests registrationCategory')
    .lean();
  return serialize(docs);
}

export async function getAllCareerGuideSlugs() {
  await dbConnect();
  const docs = await CareerGuide.find({}, { slug: 1 }).lean();
  return docs.map((d: any) => d.slug as string);
}
