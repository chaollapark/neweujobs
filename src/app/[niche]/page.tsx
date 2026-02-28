import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Niche } from '@/models/Niche';
import { NicheLanding } from '@/components/NicheLanding';

interface PageProps {
  params: { niche: string };
}

async function getNiche(slug: string) {
  await connectDB();
  const niche = await Niche.findOne({ slug, enabled: true }).lean();
  return niche;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const niche = await getNiche(params.niche);
  
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
  const niche = await getNiche(params.niche);

  if (!niche) {
    notFound();
  }

  return <NicheLanding niche={niche} />;
}

// Generate static paths for enabled niches
export async function generateStaticParams() {
  await connectDB();
  const niches = await Niche.find({ enabled: true }).select('slug').lean();
  return niches.map((n) => ({ niche: n.slug }));
}
