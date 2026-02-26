import dbConnect from './dbConnect';
import OrgCareerGuide from '@/models/OrgCareerGuide';

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getOrgCareerGuides(page = 1, perPage = 50) {
  await dbConnect();
  const query = {};

  const [items, total] = await Promise.all([
    OrgCareerGuide.find(query)
      .sort({ organization: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select('slug title organization entitySlug wordCount generatedAt description')
      .lean(),
    OrgCareerGuide.countDocuments(query),
  ]);

  return { items: serialize(items), total, totalPages: Math.ceil(total / perPage) };
}

export async function getOrgCareerGuideBySlug(slug: string) {
  await dbConnect();
  const doc = await OrgCareerGuide.findOne({ slug }).lean();
  return doc ? serialize(doc) : null;
}

export async function getOrgCareerGuideByEntityId(entityId: string) {
  await dbConnect();
  const doc = await OrgCareerGuide.findOne({ entityId })
    .select('slug title organization entitySlug wordCount')
    .lean();
  return doc ? serialize(doc) : null;
}

export async function getOrgCareerGuideByEntitySlug(entitySlug: string) {
  await dbConnect();
  const doc = await OrgCareerGuide.findOne({ entitySlug })
    .select('slug title organization entitySlug wordCount')
    .lean();
  return doc ? serialize(doc) : null;
}

export async function getAllOrgCareerGuideSlugs() {
  await dbConnect();
  const docs = await OrgCareerGuide.find({}, { slug: 1, updatedAt: 1 }).lean();
  return docs.map((d: any) => ({ slug: d.slug as string, updatedAt: d.updatedAt }));
}

export async function getOrgCareerGuideCount() {
  await dbConnect();
  return OrgCareerGuide.countDocuments({});
}
