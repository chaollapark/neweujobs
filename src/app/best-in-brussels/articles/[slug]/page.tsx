export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBibArticleBySlug } from '@/lib/bibData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBibArticleBySlug(slug);
  if (!item) return { title: 'Article Not Found' };
  return {
    title: item.title,
    description: item.excerpt || item.content?.substring(0, 160),
    openGraph: {
      title: item.title,
      type: 'article',
      ...(item.featuredImage && { images: [item.featuredImage] }),
      ...(item.publishedDate && { publishedTime: item.publishedDate }),
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getBibArticleBySlug(slug);
  if (!item) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    ...(item.author && { author: { '@type': 'Person', name: item.author } }),
    ...(item.publishedDate && { datePublished: item.publishedDate }),
    ...(item.excerpt && { description: item.excerpt }),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/best-in-brussels/articles" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">&larr; Back to articles</Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{item.title}</h1>
          <div className="flex gap-4 text-sm text-gray-300">
            {item.author && <span>By {item.author}</span>}
            {item.publishedDate && <span>{new Date(item.publishedDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {item.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image src={item.featuredImage} alt={item.title} width={800} height={400} className="w-full h-auto object-cover" />
          </div>
        )}

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6 md:p-8">
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {item.content}
          </div>
        </article>
      </div>
    </div>
  );
}
