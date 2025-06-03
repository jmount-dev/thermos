const express = require('express');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const createDOMPurify = require('dompurify');
const cors = require('cors');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/fetch', async (req, res) => {
  let url;
  try {
    url = decodeURIComponent(req.query.url || '');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const purify = createDOMPurify(dom.window);
    let content, title;
    if (article) {
      title = article.title;
      content = purify.sanitize(article.content);
    } else {
      title = dom.window.document.title;
      content = purify.sanitize(dom.window.document.body.innerHTML);
    }
    res.json({ title, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
