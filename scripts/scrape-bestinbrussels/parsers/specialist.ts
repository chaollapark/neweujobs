import { ScrapedSpecialistCategory } from '../types';
import { extractSlugFromUrl, cleanText } from '../utils';
import { parseH3Sections } from './helpers';

export function parseSpecialist(url: string, $: any): ScrapedSpecialistCategory {
  const slug = extractSlugFromUrl(url);
  const name = cleanText($('h2').first().text()) || slug;

  const sections = parseH3Sections($);

  // Build description from section text that isn't a list of firms/consultancies
  let description = '';
  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('description') || heading.includes('overview')) {
      description = section.text;
    }
  }

  // Determine type based on URL or content
  const urlLower = url.toLowerCase();
  const nameLower = name.toLowerCase();
  let type: 'sector' | 'service' | undefined;
  const sectorKeywords = ['energy', 'health', 'digital', 'trade', 'agriculture', 'transport', 'financial', 'defence', 'environment', 'food'];
  const serviceKeywords = ['monitor', 'communication', 'advocacy', 'lobby', 'stakeholder', 'training', 'research', 'strategy', 'campaign'];

  if (sectorKeywords.some(k => nameLower.includes(k) || urlLower.includes(k))) {
    type = 'sector';
  } else if (serviceKeywords.some(k => nameLower.includes(k) || urlLower.includes(k))) {
    type = 'service';
  }

  // Extract linked consultancies and law firms from h3 sections
  const consultancies: string[] = [];
  const lawFirms: string[] = [];

  for (const [, section] of Object.entries(sections)) {
    for (const link of section.links) {
      if (link.href.includes('/best_consultancies/')) {
        const consultancySlug = extractSlugFromUrl(link.href);
        if (consultancySlug && !consultancies.includes(consultancySlug)) {
          consultancies.push(consultancySlug);
        }
      } else if (link.href.includes('/best_law_firms/')) {
        const firmSlug = extractSlugFromUrl(link.href);
        if (firmSlug && !lawFirms.includes(firmSlug)) {
          lawFirms.push(firmSlug);
        }
      }
    }
  }

  return {
    slug,
    name,
    type,
    description: description || undefined,
    consultancies: consultancies.length > 0 ? consultancies : undefined,
    lawFirms: lawFirms.length > 0 ? lawFirms : undefined,
    sourceUrl: url,
  };
}
