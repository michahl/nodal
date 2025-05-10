import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export interface ExtractedArticle {
  title: string;
  content: string;
  source: string;
}

export async function extractArticleContent(url: string): Promise<ExtractedArticle | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html, { url });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const clean = (text?: string): string =>
      text?.replace(/[\t\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim() || '';

    if (!article || clean(article.textContent ?? '').length < 100) {
      throw new Error('Insufficient content extracted');
    }

    return {
      title: article.title ?? 'Untitled',
      content: clean(article.textContent ?? ''),
      source: url
    };
  } catch (err: any) {
    console.error(`Article extraction error: ${err.message}`);
    return null;
  }
}
