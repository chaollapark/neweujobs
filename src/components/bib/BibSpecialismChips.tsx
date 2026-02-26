import Link from 'next/link';

interface BibSpecialismChipsProps {
  specialisms: Array<{ specialism: string; count: number }>;
  activeSpecialism?: string;
  basePath: string;
  paramName?: string;
}

export default function BibSpecialismChips({ specialisms, activeSpecialism, basePath, paramName = 'specialism' }: BibSpecialismChipsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Filter by Specialism
      </h2>
      <div className="flex flex-wrap gap-2 items-center">
        {activeSpecialism && (
          <Link
            href={basePath}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Clear filter &times;
          </Link>
        )}
        {specialisms.slice(0, 15).map((item) => (
          <Link
            key={item.specialism}
            href={`${basePath}?${paramName}=${encodeURIComponent(item.specialism)}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeSpecialism === item.specialism
                ? 'bg-eu-blue text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {item.specialism}
            <span className="ml-1.5 text-xs opacity-70">({item.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
