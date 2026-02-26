import Link from 'next/link';

interface BibAlphabetFilterProps {
  activeLetter?: string;
  basePath: string;
  extraParams?: string;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function BibAlphabetFilter({ activeLetter, basePath, extraParams = '' }: BibAlphabetFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-1 items-center">
        <Link
          href={`${basePath}${extraParams ? `?${extraParams}` : ''}`}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
            !activeLetter
              ? 'bg-eu-blue text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </Link>
        {LETTERS.map((letter) => (
          <Link
            key={letter}
            href={`${basePath}?letter=${letter}${extraParams ? `&${extraParams}` : ''}`}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
              activeLetter === letter
                ? 'bg-eu-blue text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {letter}
          </Link>
        ))}
      </div>
    </div>
  );
}
