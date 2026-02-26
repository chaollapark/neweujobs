import Link from 'next/link';
import Image from 'next/image';

interface BibCardProps {
  href: string;
  name: string;
  description?: string;
  logoUrl?: string;
  tags?: string[];
  subtitle?: string;
}

export default function BibCard({ href, name, description, logoUrl, tags, subtitle }: BibCardProps) {
  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        {logoUrl && (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            <Image
              src={logoUrl}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
            {name}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {description.length > 150 ? description.substring(0, 150).trimEnd() + '...' : description}
        </p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-block text-xs text-gray-500 dark:text-gray-400 px-1 py-0.5">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
