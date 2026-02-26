import { ScrapedDigitalTool } from '../types';
import { extractSlugFromUrl } from '../utils';
import { extractName, parseH3Sections, extractImage, extractContact } from './helpers';

export function parseDigitalTool(url: string, $: any): ScrapedDigitalTool {
  const slug = extractSlugFromUrl(url);
  const name = extractName($, slug);
  const logoUrl = extractImage($);
  const sections = parseH3Sections($);
  const contact = extractContact(sections);

  let description = '';
  const services: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('description')) {
      description = section.text;
    } else if (heading.includes('service') || heading.includes('offer') || heading.includes('capabilit') || heading.includes('solution')) {
      if (section.listItems.length > 0) {
        services.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) services.push(t);
        });
      }
    }
  }

  return {
    slug, name, logoUrl,
    description: description || undefined,
    services: services.length > 0 ? services : undefined,
    contact,
    sourceUrl: url,
  };
}
