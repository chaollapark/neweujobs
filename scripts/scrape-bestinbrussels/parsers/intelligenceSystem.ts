import { ScrapedIntelligenceSystem } from '../types';
import { extractSlugFromUrl } from '../utils';
import { extractName, parseH3Sections, extractImage, extractContact } from './helpers';

export function parseIntelligenceSystem(url: string, $: any): ScrapedIntelligenceSystem {
  const slug = extractSlugFromUrl(url);
  const name = extractName($, slug);
  const logoUrl = extractImage($);
  const sections = parseH3Sections($);
  const contact = extractContact(sections);

  let description = '';
  const features: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('description')) {
      description = section.text;
    } else if (heading.includes('feature') || heading.includes('capabilit') || heading.includes('service') || heading.includes('offer')) {
      if (section.listItems.length > 0) {
        features.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) features.push(t);
        });
      }
    }
  }

  return {
    slug, name, logoUrl,
    description: description || undefined,
    features: features.length > 0 ? features : undefined,
    contact,
    sourceUrl: url,
  };
}
