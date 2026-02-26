import { ScrapedConsultant } from '../types';
import { extractSlugFromUrl, cleanText } from '../utils';
import { parseH3Sections, extractImage } from './helpers';

export function parseConsultant(url: string, $: any): ScrapedConsultant {
  const slug = extractSlugFromUrl(url);

  // Consultant name is in first h2 (e.g. "Natacha Clarac, General Director")
  const h2Text = cleanText($('h2').first().text());
  const nameParts = h2Text.split(',');
  const name = nameParts[0].trim() || slug;
  const title = nameParts.length > 1 ? nameParts.slice(1).join(',').trim() : undefined;

  // Second h2 might be the organization (class="nobold")
  const orgH2 = $('h2.nobold').first();
  let organization = cleanText(orgH2.text()) || undefined;
  let organizationSlug: string | undefined;

  const orgLink = orgH2.find('a[href*="/best_consultancies/"]');
  if (orgLink.length) {
    organization = cleanText(orgLink.text()) || organization;
    organizationSlug = extractSlugFromUrl(orgLink.attr('href') || '');
  }

  const photoUrl = extractImage($);
  const sections = parseH3Sections($);

  let email: string | undefined;
  $('h3 a[href^="mailto:"]').each((_: any, a: any) => {
    if (!email) email = $(a).attr('href')?.replace('mailto:', '');
  });

  let myJob = '';
  let achievements = '';
  let interests = '';
  const experience: string[] = [];
  const specialisms: string[] = [];
  const education: string[] = [];
  const languages: string[] = [];

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('my job') || heading.includes('about me')) {
      myJob = section.text;
    } else if (heading.includes('experience') || heading.includes('my experience')) {
      if (section.text) experience.push(section.text);
    } else if (heading.includes('specialis') || heading.includes('my specialis')) {
      if (section.listItems.length > 0) {
        specialisms.push(...section.listItems);
      } else if (section.text) {
        section.text.split(/[,\n]/).forEach((s: string) => {
          const t = s.trim();
          if (t) specialisms.push(t);
        });
      }
    } else if (heading.includes('achievement') || heading.includes('proudest')) {
      achievements = section.text;
    } else if (heading.includes('education') || heading.includes('my education')) {
      if (section.text) education.push(section.text);
    } else if (heading.includes('language') || heading.includes('my language')) {
      if (section.text) {
        section.text.split(/[,&\n]/).forEach((l: string) => {
          const t = l.trim();
          if (t) languages.push(t);
        });
      }
    } else if (heading.includes('interest') || heading.includes('outside work')) {
      interests = section.text;
    }
  }

  return {
    slug, name, title, organization, organizationSlug, email, photoUrl,
    myJob: myJob || undefined,
    experience: experience.length > 0 ? experience : undefined,
    specialisms: specialisms.length > 0 ? specialisms : undefined,
    achievements: achievements || undefined,
    education: education.length > 0 ? education : undefined,
    languages: languages.length > 0 ? languages : undefined,
    interests: interests || undefined,
    sourceUrl: url,
  };
}
