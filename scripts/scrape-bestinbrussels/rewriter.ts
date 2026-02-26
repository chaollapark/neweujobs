import { retry, sleep } from './utils';
import { ContentType } from './types';

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT!;
const API_KEY = process.env.AZURE_OPENAI_API_KEY!;
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5.2-chat-3';
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';

const systemPrompts: Record<ContentType, string> = {
  consultancy: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a consultancy in a clear, professional, and engaging tone. Preserve all factual information including names, dates, and specific details. Output valid JSON with the same field names.',
  consultant: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a consultant/professional in a clear, professional biographical tone. Preserve all factual information. Output valid JSON with the same field names.',
  lawFirm: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a law firm in a clear, authoritative, and professional tone. Preserve all factual information. Output valid JSON with the same field names.',
  intelligenceSystem: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a political intelligence/monitoring system in a clear, informative tone. Preserve all factual information. Output valid JSON with the same field names.',
  digitalTool: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a digital tool or agency in a clear, modern, and professional tone. Preserve all factual information. Output valid JSON with the same field names.',
  trainer: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a training provider in a clear, professional, and engaging tone. Preserve all factual information. Output valid JSON with the same field names.',
  specialist: 'You are a professional copywriter for an EU public affairs directory. Rewrite the provided text about a specialist category/area of expertise in a clear, informative tone. Preserve all factual information. Output valid JSON with the same field names.',
  article: 'You are a professional copywriter for an EU public affairs publication. Rewrite the provided article text in a clear, engaging, journalistic tone. Preserve all factual information, quotes, and attributions. Output valid JSON with the same field names.',
  editorial: 'You are a professional copywriter for an EU public affairs publication. Rewrite the provided editorial/guide content in a clear, helpful, authoritative tone. Preserve all factual information and advice. Output valid JSON with the same field names.',
};

let requestCount = 0;
let windowStart = Date.now();

async function rateLimitWait() {
  requestCount++;
  const elapsed = Date.now() - windowStart;

  // ~60 RPM limit
  if (requestCount >= 55 && elapsed < 60000) {
    const waitTime = 60000 - elapsed + 1000;
    console.log(`  Rate limit: waiting ${Math.round(waitTime / 1000)}s...`);
    await sleep(waitTime);
    requestCount = 0;
    windowStart = Date.now();
  } else if (elapsed >= 60000) {
    requestCount = 1;
    windowStart = Date.now();
  }

  // Minimum spacing between requests
  await sleep(1000);
}

export async function rewriteFields(
  fields: Record<string, string>,
  contentType: ContentType
): Promise<Record<string, string>> {
  // Skip if no fields to rewrite
  const nonEmptyFields = Object.entries(fields).filter(([_, v]) => v && v.length > 10);
  if (nonEmptyFields.length === 0) return fields;

  await rateLimitWait();

  const inputJson = JSON.stringify(Object.fromEntries(nonEmptyFields));
  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const result = await retry(async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompts[contentType] },
          { role: 'user', content: `Rewrite the following text fields. Return ONLY valid JSON with the same keys:\n\n${inputJson}` },
        ],
        max_completion_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '30');
      console.log(`  429 Too Many Requests, waiting ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      throw new Error('Rate limited');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Azure OpenAI error ${response.status}: ${text}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Azure OpenAI');

    return JSON.parse(content);
  }, 3, 5000);

  // Merge rewritten fields back, keeping originals for fields not returned
  const merged = { ...fields };
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && value.length > 0) {
      merged[key] = value;
    }
  }

  return merged;
}
