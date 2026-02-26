import { ScrapedEditorialPage } from '../types';
import { extractSlugFromUrl, cleanText } from '../utils';

export function parseEditorial(url: string, $: any): ScrapedEditorialPage {
  const slug = extractSlugFromUrl(url);
  const title = cleanText($('h1').first().text()) || slug;

  // Determine section and parent from URL structure
  const urlPath = new URL(url).pathname;
  const pathParts = urlPath.split('/').filter(Boolean);
  let section: string | undefined;
  let parentSlug: string | undefined;

  if (pathParts.length >= 2) {
    section = pathParts[0];
    parentSlug = pathParts[0];
  } else if (pathParts.length === 1) {
    section = pathParts[0];
  }

  // Content - full page body from entry-content area
  const contentParts: string[] = [];
  $('.entry-content p, .entry-content h2, .entry-content h3, .entry-content ul, .entry-content ol, .page-content p, .page-content h2, .page-content h3').each((_: any, el: any) => {
    const tag = $(el).prop('tagName')?.toLowerCase();
    const text = cleanText($(el).text());
    if (!text) return;

    if (tag === 'h2' || tag === 'h3') {
      contentParts.push(`\n## ${text}\n`);
    } else if (tag === 'ul' || tag === 'ol') {
      $(el).find('li').each((_: any, li: any) => {
        contentParts.push(`- ${cleanText($(li).text())}`);
      });
    } else {
      contentParts.push(text);
    }
  });
  const content = contentParts.join('\n\n') || undefined;

  // Sort order based on position in editorial hierarchy
  const sortOrderMap: Record<string, number> = {
    'best-practice-in-public-affairs': 0,
    'association-management': 1,
    'conference-and-event-management': 2,
    'digital-public-affairs': 3,
    'grassroots': 4,
    'monitoring': 5,
    'political-intelligence': 6,
    'public-affairs-training': 7,
    'stakeholder-engagement': 8,
    'strategic-communications': 9,
    'choosing-a-partner': 10,
    'choosing-a-consultant': 11,
    'choosing-a-consultancy': 12,
    'choosing-a-digital-agency': 13,
    'choosing-a-law-firm': 14,
    'choosing-a-political-intelligence-system': 15,
    'choosing-a-trainer': 16,
    'about-us': 17,
    'awards': 18,
    'nominate': 19,
  };
  const sortOrder = sortOrderMap[slug] ?? 99;

  return {
    slug,
    title,
    section,
    content,
    parentSlug: parentSlug !== slug ? parentSlug : undefined,
    sortOrder,
    sourceUrl: url,
  };
}
