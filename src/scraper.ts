// Web scraping tool with markdown transformation optimized for LLMs
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export class ScraperService {
  public async scrapeCleanPage(url: string): Promise<string> {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Aetheris-MCP-Agentic-Scraper/1.0.0 (Bot; +http://modelcontextprotocol.io)'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to download page. Status code: ${res.status}`);
      }

      const rawHtml = await res.text();
      const dom = new JSDOM(rawHtml);
      const doc = dom.window.document;

      // Sanitize DOM: Strip headers, footers, script, styles, and ads
      const elementsToDrop = doc.querySelectorAll('script, style, iframe, nav, footer, header, noscript, .ads, #ads');
      elementsToDrop.forEach(el => el.remove());

      const bodyText = doc.body ? doc.body.textContent : '';
      if (!bodyText) return 'No content parsed.';

      // Clean duplicate spacing and returns for dense LLM ingestion
      const cleanMarkdown = bodyText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      return cleanMarkdown.substring(0, 10000); // Truncate to secure context limits
    } catch (err: any) {
      throw new Error(`Scraper failed to process resource: ${err.message}`);
    }
  }
}
