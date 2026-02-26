import { ScrapedConsultancy } from '../types';
import { extractSlugFromUrl } from '../utils';
import { extractName, parseH3Sections, extractImage, extractContact } from './helpers';

export function parseConsultancy(url: string, $: any): ScrapedConsultancy {
  const slug = extractSlugFromUrl(url);
  const name = extractName($, slug);
  const logoUrl = extractImage($);
  const sections = parseH3Sections($);
  const contact = extractContact(sections);

  let description = '';
  let ownership = '';
  let brusselsOfficeSince = '';
  let staffCount = '';
  const specialisms: string[] = [];
  const linkedConsultants: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('firm description') || heading.includes('description')) {
      description = section.text;
    } else if (heading.includes('ownership') || heading.includes('owner structure')) {
      ownership = section.text;
    } else if (heading.includes('brussels office since')) {
      brusselsOfficeSince = section.text;
    } else if (heading.includes('number of')) {
      staffCount = section.text;
    } else if (heading.includes('specialis') || heading.includes('key specialis')) {
      if (section.listItems.length > 0) {
        specialisms.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) specialisms.push(t);
        });
      }
    } else if (heading.includes('best consultant')) {
      section.links.forEach((l: any) => {
        if (l.href.includes('/best_consultants/')) {
          linkedConsultants.push(extractSlugFromUrl(l.href));
        }
      });
    }
  }

  return {
    slug, name, logoUrl,
    description: description || undefined,
    ownership: ownership || undefined,
    brusselsOfficeSince: brusselsOfficeSince || undefined,
    staffCount: staffCount || undefined,
    contact,
    specialisms: specialisms.length > 0 ? specialisms : undefined,
    linkedConsultants: linkedConsultants.length > 0 ? linkedConsultants : undefined,
    sourceUrl: url,
  };
}
