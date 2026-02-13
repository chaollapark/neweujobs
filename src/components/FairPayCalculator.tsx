'use client';

import { useState, useMemo } from 'react';

type Category = 'consultancy' | 'trade_association' | 'in_house' | 'ngo';
type Seniority = 'junior' | 'mid' | 'senior';

interface SalaryRange {
  min: number;
  max: number;
}

const SALARY_RANGES: Record<Category, Record<Seniority, SalaryRange>> = {
  consultancy: {
    junior: { min: 2500, max: 3500 },
    mid: { min: 3500, max: 5500 },
    senior: { min: 6000, max: 10000 },
  },
  trade_association: {
    junior: { min: 2000, max: 3000 },
    mid: { min: 3000, max: 4500 },
    senior: { min: 4500, max: 6000 },
  },
  in_house: {
    junior: { min: 2800, max: 4500 },
    mid: { min: 4500, max: 7500 },
    senior: { min: 7500, max: 12000 },
  },
  ngo: {
    junior: { min: 2000, max: 3000 },
    mid: { min: 3000, max: 4500 },
    senior: { min: 4500, max: 6000 },
  },
};

const CATEGORY_LABELS: Record<Category, string> = {
  consultancy: 'Consultancy',
  trade_association: 'Trade Association',
  in_house: 'In-House (Corporate)',
  ngo: 'NGO / Non-Profit',
};

const SENIORITY_LABELS: Record<Seniority, string> = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
};

const CATEGORIES: Category[] = ['consultancy', 'trade_association', 'in_house', 'ngo'];
const SENIORITIES: Seniority[] = ['junior', 'mid', 'senior'];

const ABSOLUTE_MAX = 12000;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FairPayCalculator() {
  const [category, setCategory] = useState<Category>('consultancy');
  const [seniority, setSeniority] = useState<Seniority>('mid');

  const range = useMemo(() => SALARY_RANGES[category][seniority], [category, seniority]);

  const barLeftPercent = (range.min / ABSOLUTE_MAX) * 100;
  const barWidthPercent = ((range.max - range.min) / ABSOLUTE_MAX) * 100;
  const midpoint = (range.min + range.max) / 2;

  const linkedInText = encodeURIComponent(
    `As a ${SENIORITY_LABELS[seniority]} professional in ${CATEGORY_LABELS[category]} in Brussels, the fair monthly salary range is ${formatCurrency(range.min)} - ${formatCurrency(range.max)}. Check yours at eujobs.brussels/fairpay`
  );

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://eujobs.brussels/fairpay')}&summary=${linkedInText}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Calculate Your Fair Pay
      </h2>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sector / Organization Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                category === cat
                  ? 'bg-eu-blue text-white border-eu-blue shadow-md'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-eu-blue dark:hover:border-eu-blue hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Seniority Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Seniority Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {SENIORITIES.map((sen) => (
            <button
              key={sen}
              onClick={() => setSeniority(sen)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                seniority === sen
                  ? 'bg-eu-blue text-white border-eu-blue shadow-md'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-eu-blue dark:hover:border-eu-blue hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {SENIORITY_LABELS[sen]}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-600 my-6" />

      {/* Results */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Fair Monthly Salary Range
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {SENIORITY_LABELS[seniority]} in {CATEGORY_LABELS[category]} (Brussels, gross monthly)
        </p>

        {/* Salary Display */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Minimum</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(range.min)}
            </p>
          </div>
          <div className="text-gray-300 dark:text-gray-600 text-3xl font-light">&mdash;</div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Maximum</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(range.max)}
            </p>
          </div>
        </div>

        {/* Midpoint */}
        <div className="text-center mb-6">
          <span className="inline-block bg-eu-blue/10 dark:bg-eu-blue/20 text-eu-blue dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            Midpoint: {formatCurrency(midpoint)}
          </span>
        </div>

        {/* Visual Bar */}
        <div className="relative">
          {/* Scale labels */}
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2 px-1">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(3000)}</span>
            <span>{formatCurrency(6000)}</span>
            <span>{formatCurrency(9000)}</span>
            <span>{formatCurrency(ABSOLUTE_MAX)}</span>
          </div>

          {/* Bar background */}
          <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Range bar */}
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-eu-blue to-eu-dark rounded-full transition-all duration-500 ease-out"
              style={{
                left: `${barLeftPercent}%`,
                width: `${barWidthPercent}%`,
              }}
            />
          </div>

          {/* Min/Max markers below bar */}
          <div className="relative h-6 mt-1">
            <span
              className="absolute text-xs font-medium text-gray-600 dark:text-gray-300 -translate-x-1/2"
              style={{ left: `${barLeftPercent}%` }}
            >
              {formatCurrency(range.min)}
            </span>
            <span
              className="absolute text-xs font-medium text-gray-600 dark:text-gray-300 -translate-x-1/2"
              style={{ left: `${barLeftPercent + barWidthPercent}%` }}
            >
              {formatCurrency(range.max)}
            </span>
          </div>
        </div>
      </div>

      {/* Annual Equivalent */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Annual Equivalent (12 months)
        </h4>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(range.min * 12)} &ndash; {formatCurrency(range.max * 12)}
        </p>
      </div>

      {/* Share on LinkedIn */}
      <div className="text-center">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
        These salary ranges are estimates based on market data for the Brussels EU affairs sector.
        Actual compensation may vary based on experience, language skills, and specific responsibilities.
      </p>
    </div>
  );
}
