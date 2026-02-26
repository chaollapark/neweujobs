import Link from 'next/link';
import Image from 'next/image';

interface BibConsultantCardProps {
  slug: string;
  name: string;
  title?: string;
  organization?: string;
  photoUrl?: string;
  specialisms?: string[];
}

export default function BibConsultantCard({ slug, name, title, organization, photoUrl, specialisms }: BibConsultantCardProps) {
  return (
    <Link
      href={`/best-in-brussels/consultants/${slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        {photoUrl ? (
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            <Image
              src={photoUrl}
              alt={name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-eu-blue/10 dark:bg-eu-blue/20 flex items-center justify-center shrink-0">
            <span className="text-eu-blue dark:text-blue-300 font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1">
            {name}
          </h3>
          {title && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{title}</p>
          )}
          {organization && (
            <p className="text-xs text-eu-blue dark:text-blue-400 line-clamp-1">{organization}</p>
          )}
        </div>
      </div>

      {specialisms && specialisms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specialisms.slice(0, 3).map((s, idx) => (
            <span
              key={idx}
              className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
            >
              {s}
            </span>
          ))}
          {specialisms.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{specialisms.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
