import mongoose, { Document, Schema } from 'mongoose';

export interface INiche extends Document {
  slug: string;
  name: string;
  description: string;
  h1: string;
  tagline: string;
  competitor: string;
  keywords: string[];
  colors: {
    primary: string;
    accent: string;
  };
  filters: {
    locations?: string[];
    categories?: string[];
    tags?: string[];
  };
  enabled: boolean;
  createdAt: Date;
}

const NicheSchema = new Schema<INiche>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  h1: { type: String, required: true },
  tagline: { type: String, required: true },
  competitor: { type: String },
  keywords: [{ type: String }],
  colors: {
    primary: { type: String, default: 'blue' },
    accent: { type: String, default: 'indigo' }
  },
  filters: {
    locations: [{ type: String }],
    categories: [{ type: String }],
    tags: [{ type: String }]
  },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Niche = mongoose.models.Niche || mongoose.model<INiche>('Niche', NicheSchema);

// Helper type for serialized niche (without Document methods)
export type NicheType = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  h1: string;
  tagline: string;
  competitor: string;
  keywords: string[];
  colors: {
    primary: string;
    accent: string;
  };
  filters: {
    locations?: string[];
    categories?: string[];
    tags?: string[];
  };
  enabled: boolean;
  createdAt: Date;
};

export async function findNicheBySlug(slug: string): Promise<NicheType | null> {
  const niche = await Niche.findOne({ slug, enabled: true });
  return niche ? JSON.parse(JSON.stringify(niche)) : null;
}

export async function getAllNiches(): Promise<NicheType[]> {
  const niches = await Niche.find({ enabled: true }).sort({ name: 1 });
  return JSON.parse(JSON.stringify(niches));
}

export async function getAllNicheSlugs(): Promise<string[]> {
  const niches = await Niche.find({ enabled: true }, { slug: 1 });
  return niches.map((n) => n.slug);
}

export async function createOrUpdateNiche(
  slug: string,
  data: Partial<NicheType>
): Promise<NicheType> {
  const niche = await Niche.findOneAndUpdate(
    { slug },
    { ...data, slug },
    { upsert: true, new: true, runValidators: true }
  );
  return JSON.parse(JSON.stringify(niche));
}
