import { ScrapedLawFirm } from '../types';
import { extractSlugFromUrl } from '../utils';
import { extractName, parseH3Sections, extractImage, extractContact } from './helpers';

export function parseLawFirm(url: string, $: any): ScrapedLawFirm {
  const slug = extractSlugFromUrl(url);
  const name = extractName($, slug);
  const logoUrl = extractImage($);
  const sections = parseH3Sections($);
  const contact = extractContact(sections);

  let description = '';
  const specialisms: string[] = [];
  const keyPartners: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('firm description') || heading.includes('description')) {
      description = section.text;
    } else if (heading.includes('specialis') || heading.includes('key specialis')) {
      if (section.listItems.length > 0) {
        specialisms.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) specialisms.push(t);
        });
      }
    } else if (heading.includes('key partner') || heading.includes('partner')) {
      if (section.listItems.length > 0) {
        keyPartners.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) keyPartners.push(t);
        });
      }
    }
  }

  return {
    slug, name, logoUrl,
    description: description || undefined,
    specialisms: specialisms.length > 0 ? specialisms : undefined,
    contact,
    keyPartners: keyPartners.length > 0 ? keyPartners : undefined,
    sourceUrl: url,
  };
}
