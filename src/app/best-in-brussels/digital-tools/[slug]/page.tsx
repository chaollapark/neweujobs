export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBibDigitalToolBySlug } from '@/lib/bibData';

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBibDigitalToolBySlug(slug);
  if (!item) return { title: 'Digital Tool Not Found' };
  return { title: `${item.name} - Digital Public Affairs Tool`, description: item.description?.substring(0, 160) };
}

export default async function DigitalToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getBibDigitalToolBySlug(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-eu-blue to-eu-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/best-in-brussels/digital-tools" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">&larr; Back to digital tools</Link>
          <div className="flex items-center gap-4">
            {item.logoUrl && (<div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0"><Image src={item.logoUrl} alt={item.name} width={64} height={64} className="w-full h-full object-contain" /></div>)}
            <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {item.description && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{item.description}</p>
              </section>
            )}
            {item.services?.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Services</h2>
                <ul className="space-y-2">
                  {item.services.map((s: string, i: number) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start gap-2"><span className="text-eu-blue mt-1">&#8226;</span><span>{s}</span></li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {item.contact && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
                <dl className="space-y-3">
                  {item.contact.address && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.contact.address}</dd></div>)}
                  {item.contact.phone && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white">{item.contact.phone}</dd></div>)}
                  {item.contact.email && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt><dd className="mt-1 text-sm"><a href={`mailto:${item.contact.email}`} className="text-eu-blue dark:text-blue-400 hover:underline">{item.contact.email}</a></dd></div>)}
                  {item.contact.website && (<div><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt><dd className="mt-1 text-sm"><a href={item.contact.website} target="_blank" rel="noopener noreferrer" className="text-eu-blue dark:text-blue-400 hover:underline break-all">{item.contact.website}</a></dd></div>)}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
