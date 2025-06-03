const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const createDOMPurify = require('dompurify');

async function main() {
  const url = process.argv[2];
  if (!url || !/^https?:\/\//i.test(url)) {
    console.error('Usage: node cli.js <url>');
    process.exit(1);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('fetch failed');
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const purify = createDOMPurify(dom.window);
    const reader = new Readability(dom.window.document);

    let article;
    let content = '';
    let title = dom.window.document.title;

    try {
      article = reader.parse();
    } catch (e) {}

    if (article && article.content) {
      content = purify.sanitize(article.content);
      title = article.title || title;
    } else {
      const fallback = purify.sanitize(dom.window.document.body.innerHTML);
      content = fallback || '<p>No readable content.</p>';
    }

    const output = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${content}</body></html>`;
    console.log(output);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
