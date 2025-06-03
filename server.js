const express = require('express');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const createDOMPurify = require('dompurify');
const cors = require('cors');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const content = article ? article.content : dom.window.document.body.innerHTML;
    const purify = createDOMPurify(dom.window);
    const safe = purify.sanitize(content);
    res.json({ title: article ? article.title : dom.window.document.title, content: safe });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
