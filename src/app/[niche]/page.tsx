import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Niche } from '@/models/Niche';
import { JobModel } from '@/models/Job';
import { NicheLanding } from '@/components/NicheLanding';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { niche: string };
}

async function getNicheWithJobs(slug: string) {
  await dbConnect();
  const niche = await Niche.findOne({ slug, enabled: true }).lean();
  if (!niche) return null;

  // Build query from niche filters
  const query: Record<string, unknown> = { status: 'active' };
  if (niche.filters?.locations?.length) {
    query.location = { $in: niche.filters.locations };
  }
  if (niche.filters?.categories?.length) {
    query.category = { $in: niche.filters.categories };
  }
  if (niche.filters?.tags?.length) {
    query.tags = { $in: niche.filters.tags };
  }
  if (niche.filters?.country) {
    query.country = niche.filters.country;
  }

  const jobs = await JobModel.find(query)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return { niche, jobs: JSON.parse(JSON.stringify(jobs)) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await dbConnect();
  const niche = await Niche.findOne({ slug: params.niche, enabled: true }).lean();
  
  if (!niche) {
    return { title: 'Not Found' };
  }

  return {
    title: `${niche.name} | EUjobs.co`,
    description: niche.description,
    keywords: niche.keywords?.join(', '),
    openGraph: {
      title: niche.name,
      description: niche.description,
      type: 'website',
    },
  };
}

export default async function NichePage({ params }: PageProps) {
  const result = await getNicheWithJobs(params.niche);

  if (!result) {
    notFound();
  }

  return <NicheLanding niche={result.niche} jobs={result.jobs} />;
}

// Generate static paths for enabled niches
export async function generateStaticParams() {
  await dbConnect();
  const niches = await Niche.find({ enabled: true }).select('slug').lean();
  return niches.map((n) => ({ niche: n.slug }));
}
