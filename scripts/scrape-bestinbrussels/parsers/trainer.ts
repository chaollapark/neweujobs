import { ScrapedTrainer } from '../types';
import { extractSlugFromUrl } from '../utils';
import { extractName, parseH3Sections, extractImage, extractContact } from './helpers';

export function parseTrainer(url: string, $: any): ScrapedTrainer {
  const slug = extractSlugFromUrl(url);
  const name = extractName($, slug);
  const logoUrl = extractImage($);
  const sections = parseH3Sections($);
  const contact = extractContact(sections);

  let description = '';
  const programs: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('description')) {
      description = section.text;
    } else if (heading.includes('program') || heading.includes('course') || heading.includes('training') || heading.includes('offering')) {
      if (section.listItems.length > 0) {
        programs.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) programs.push(t);
        });
      }
    }
  }

  return {
    slug, name, logoUrl,
    description: description || undefined,
    programs: programs.length > 0 ? programs : undefined,
    contact,
    sourceUrl: url,
  };
}
