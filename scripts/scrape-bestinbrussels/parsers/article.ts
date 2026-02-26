import { ScrapedArticle } from '../types';
import { extractSlugFromUrl, cleanText } from '../utils';
import { extractImage } from './helpers';

export function parseArticle(url: string, $: any): ScrapedArticle {
  const slug = extractSlugFromUrl(url);
  const title = cleanText($('h1').first().text()) || slug;

  // Content - full article body from entry-content area
  const contentParts: string[] = [];
  $('.entry-content p, .entry-content h2, .entry-content h3, .entry-content ul, .entry-content ol').each((_: any, el: any) => {
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

  // Excerpt
  const excerpt = content ? content.substring(0, 200).trimEnd() + '...' : undefined;

  // Author
  const author = cleanText($('.author, .byline, [rel="author"]').first().text()) || undefined;

  // Published date
  const dateEl = $('time[datetime], .date, .published').first();
  const publishedDate = dateEl.attr('datetime') || cleanText(dateEl.text()) || undefined;

  // Featured image
  const featuredImage = extractImage($);

  return {
    slug,
    title,
    content,
    excerpt,
    author,
    publishedDate,
    featuredImage,
    sourceUrl: url,
  };
}
