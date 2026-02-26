import * as cheerio from 'cheerio';
import { sleep, retry } from './utils';

const RATE_LIMIT_MS = 1500;
let lastRequestTime = 0;

export async function fetchPage(url: string): Promise<any> {
  // Rate limiting
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await sleep(RATE_LIMIT_MS - elapsed);
  }
  lastRequestTime = Date.now();

  const html = await retry(async () => {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EUJobsBrussels/1.0; +https://eujobs.brussels)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.text();
  });

  return cheerio.load(html);
}

export async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const $ = await fetchPage(sitemapUrl);
    const urls: string[] = [];
    $('url loc').each((_, el) => {
      const loc = $(el).text().trim();
      if (loc) urls.push(loc);
    });
    return urls;
  } catch (err) {
    console.error(`Failed to fetch sitemap: ${sitemapUrl}`, err);
    return [];
  }
}

export async function discoverAllUrls(): Promise<{
  consultancies: string[];
  consultants: string[];
  lawFirms: string[];
  intelligenceSystems: string[];
  digitalTools: string[];
  trainers: string[];
  specialists: string[];
  articles: string[];
  editorials: string[];
}> {
  const baseUrl = 'https://bestinbrussels.eu';

  console.log('Discovering URLs from sitemaps...');

  // Fetch sitemaps in sequence to respect rate limiting
  const consultancies = await fetchSitemapUrls(`${baseUrl}/best_consultancies-sitemap.xml`);
  const consultants = await fetchSitemapUrls(`${baseUrl}/best_consultants-sitemap.xml`);
  const lawFirms = await fetchSitemapUrls(`${baseUrl}/best_law_firms-sitemap.xml`);
  const intelligenceSystems = await fetchSitemapUrls(`${baseUrl}/intelligence_systems-sitemap.xml`);
  const digitalTools = await fetchSitemapUrls(`${baseUrl}/best_digital_tools-sitemap.xml`);
  const trainers = await fetchSitemapUrls(`${baseUrl}/best_trainers-sitemap.xml`);
  const specialists = await fetchSitemapUrls(`${baseUrl}/specialists-sitemap.xml`);
  const articles = await fetchSitemapUrls(`${baseUrl}/post-sitemap.xml`);

  // Hardcoded editorial pages
  const editorials = [
    `${baseUrl}/best-practice-in-public-affairs/`,
    `${baseUrl}/best-practice-in-public-affairs/association-management/`,
    `${baseUrl}/best-practice-in-public-affairs/conference-and-event-management/`,
    `${baseUrl}/best-practice-in-public-affairs/digital-public-affairs/`,
    `${baseUrl}/best-practice-in-public-affairs/grassroots/`,
    `${baseUrl}/best-practice-in-public-affairs/monitoring/`,
    `${baseUrl}/best-practice-in-public-affairs/political-intelligence/`,
    `${baseUrl}/best-practice-in-public-affairs/public-affairs-training/`,
    `${baseUrl}/best-practice-in-public-affairs/stakeholder-engagement/`,
    `${baseUrl}/best-practice-in-public-affairs/strategic-communications/`,
    `${baseUrl}/choosing-a-partner/`,
    `${baseUrl}/choosing-a-partner/choosing-a-consultant/`,
    `${baseUrl}/choosing-a-partner/choosing-a-consultancy/`,
    `${baseUrl}/choosing-a-partner/choosing-a-digital-agency/`,
    `${baseUrl}/choosing-a-partner/choosing-a-law-firm/`,
    `${baseUrl}/choosing-a-partner/choosing-a-political-intelligence-system/`,
    `${baseUrl}/choosing-a-partner/choosing-a-trainer/`,
    `${baseUrl}/about-us/`,
    `${baseUrl}/awards/`,
    `${baseUrl}/awards/nominate/`,
  ];

  console.log(`Discovered: ${consultancies.length} consultancies, ${consultants.length} consultants, ${lawFirms.length} law firms, ${intelligenceSystems.length} intelligence systems, ${digitalTools.length} digital tools, ${trainers.length} trainers, ${specialists.length} specialists, ${articles.length} articles, ${editorials.length} editorials`);

  return {
    consultancies,
    consultants,
    lawFirms,
    intelligenceSystems,
    digitalTools,
    trainers,
    specialists,
    articles,
    editorials,
  };
}
