import { cleanText } from '../utils';

/**
 * Extract name from the first h2, stripping "About " prefix
 */
export function extractName($: any, slug: string): string {
  const h2Text = cleanText($('h2').first().text());
  return h2Text.replace(/^About\s+/i, '').trim() || slug;
}

/**
 * Parse all h3 sections into a map of heading -> content
 */
export function parseH3Sections($: any): Record<string, { text: string; listItems: string[]; links: Array<{ href: string; text: string }> }> {
  const sections: Record<string, { text: string; listItems: string[]; links: Array<{ href: string; text: string }> }> = {};

  $('h3').each((_: any, el: any) => {
    const heading = cleanText($(el).text()).toLowerCase();
    if (!heading) return;

    // Get text content from the section (siblings until next h3 or h2)
    const textParts: string[] = [];
    const listItems: string[] = [];
    const links: Array<{ href: string; text: string }> = [];

    // Check text directly in parent div after the h3
    const parentDiv = $(el).parent();
    const parentText = cleanText(parentDiv.clone().children('h3').remove().end().text());
    if (parentText) textParts.push(parentText);

    // Check next sibling elements
    let sibling = $(el).next();
    while (sibling.length && !sibling.is('h2, h3')) {
      if (sibling.is('ul, ol')) {
        sibling.find('li').each((_: any, li: any) => {
          const text = cleanText($(li).text());
          if (text) listItems.push(text);
          // Also get links within list items
          $(li).find('a[href]').each((_: any, a: any) => {
            links.push({ href: $(a).attr('href') || '', text: cleanText($(a).text()) });
          });
        });
      } else {
        const text = cleanText(sibling.text());
        if (text) textParts.push(text);
        sibling.find('a[href]').each((_: any, a: any) => {
          links.push({ href: $(a).attr('href') || '', text: cleanText($(a).text()) });
        });
      }
      sibling = sibling.next();
    }

    // Also check for links in the parent div
    parentDiv.find('a[href]').each((_: any, a: any) => {
      const href = $(a).attr('href') || '';
      if (href && !links.some(l => l.href === href)) {
        links.push({ href, text: cleanText($(a).text()) });
      }
    });

    sections[heading] = {
      text: textParts.join('\n').trim(),
      listItems,
      links,
    };
  });

  return sections;
}

/**
 * Find the best logo/photo image on the page
 */
export function extractImage($: any): string | undefined {
  // Look for images in the content area that are uploads
  const img = $('img').filter((_: any, el: any) => {
    const src = $(el).attr('src') || '';
    return src.includes('uploads') && !src.includes('favicon') && !src.includes('bib/img/');
  }).first();
  return img.attr('src') || undefined;
}

/**
 * Extract contact info from h3 sections
 */
export function extractContact(sections: Record<string, any>): { address?: string; phone?: string; email?: string; website?: string } | undefined {
  const contact: { address?: string; phone?: string; email?: string; website?: string } = {};

  for (const [heading, section] of Object.entries(sections)) {
    if (heading.includes('office address') || heading === 'address') {
      contact.address = section.text;
    } else if (heading.includes('email')) {
      const mailLink = section.links.find((l: any) => l.href.startsWith('mailto:'));
      contact.email = mailLink ? mailLink.href.replace('mailto:', '') : section.text;
    } else if (heading.includes('phone') || heading.includes('tel')) {
      contact.phone = section.text;
    } else if (heading.includes('website') || heading === 'web') {
      const extLink = section.links.find((l: any) => l.href.startsWith('http') && !l.href.includes('bestinbrussels'));
      contact.website = extLink ? extLink.href : section.text;
    }
  }

  return Object.values(contact).some(v => v) ? contact : undefined;
}
