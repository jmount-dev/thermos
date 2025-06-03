# Thermos Project – Setup Instructions

**Purpose**
Build a proof‑of‑concept (POC) "reader‑mode" web app called **Thermos** that fetches any public web page, extracts its primary content, and re‑renders it in a clean, Notion‑style block layout with optional dark mode.  The app must *not* embed Chromium or any other browser engine; instead, it will fetch and transform HTML on the server.

---

## Prerequisites

1. **Node.js ≥ 20** (includes npm)
2. Git & GitHub Desktop (for version control)
3. (Recommended) **VS Code** or other editor with Codex/Copilot

---

## Quick Start (15‑minute run‑through)

1. Clone or create the `thermos` repo via GitHub Desktop.
2. Open the repo in VS Code.
3. Run `npm init -y` to generate `package.json`.
4. Install dependencies:

```bash
npm install express node-fetch jsdom @mozilla/readability dompurify cors nodemon
```

5. Create `server.js` (backend) and `public/index.html` (frontend).  Details below.
6. Add a *start* script to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

7. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
8. Enter a test URL (e.g., [https://espn.com](https://espn.com)) and verify the reader view renders.

---

## Project Structure

```
thermos
├── package.json
├── server.js            # Express server & proxy logic
├── /public              # Static frontend
│   ├── index.html       # UI shell & JS
│   ├── main.js          # Fetch + toggle logic
│   └── styles.css       # Light & dark theme
└── README.md
```

---

## Backend (Express + Node)

*Purpose:* Fetch external pages server‑side, sanitize, extract main content, and return safe HTML.

### Key Steps

1. **Set up Express server** listening on *PORT 3000*.
2. **Enable CORS** (`cors` middleware) for local dev.
3. **Route `/fetch`**  (`GET`) with query param `url=`

   * Validate URL (require http/https).
   * Use **node‑fetch** to retrieve raw HTML.
4. **Parse HTML** with **JSDOM**:

   ```js
   const { JSDOM } = require('jsdom');
   const dom = new JSDOM(html, { url });
   ```
5. **Extract main content** using **Readability**:

   ```js
   const { Readability } = require('@mozilla/readability');
   const reader = new Readability(dom.window.document);
   const article = reader.parse();
   ```

   *If `article` is null, fall back to `dom.window.document.body.innerHTML`.*
6. **Sanitize** output with **DOMPurify** (server build):

   ```js
   const createDOMPurify = require('dompurify');
   const purify = createDOMPurify(dom.window);
   const safe = purify.sanitize(article.content);
   ```
7. **Return JSON** `{ title, content: safe }`.

---

## Frontend (Static Files)

*Purpose:* Provide a minimal UI to enter URLs, render reader mode, toggle original view, and switch dark mode.

### index.html

* Input field + "Load" button
* Toggle switches: *Reader | Original* and *Light | Dark*
* `#content` container to inject sanitized HTML

### main.js

1. Listen for *Load* button → call `/fetch?url=...`.
2. Insert returned `html` into `#content` (`innerHTML = ...`).
3. Original view toggle → attempt to embed `<iframe src="url">`; if blocked, open in new tab.
4. Dark mode toggle → add/remove `dark` class on `<body>`.

### styles.css

1. Global reset & typography (Notion‑like).
2. `.dark` theme overrides background & text colors.
3. Block element spacing (`p, h1‑h6, ul, ol { margin: 1.0rem 0; }`).

---

## Local Testing Checklist

* [ ] `npm run dev` starts server without errors.
* [ ] Loading *espn.com* returns readable article body.
* [ ] Loading *dallaslibrary2.org* returns readable content.
* [ ] Dark mode toggle flips colors instantly.
* [ ] Original view opens (iframe or new tab) and handles sites that deny framing.

---

## Security Notes

* **No client‑side fetches** to third‑party sites → all traffic goes through server.
* Strict DOMPurify config: drop scripts, iframes, `javascript:` URLs.
* Sanitize again client‑side if you inject any unsanitized HTML.

---

## Future Phases (Reference Only)

1. **Native Page Creation**: Add Notion‑like block editor, minimal email & calendar clients.
2. **Integrations & AI Search**: Provide plugin API and optional semantic search.
3. **Cross‑Platform Apps**: Wrap in Tauri, React Native, Electron, etc.

---

## AI‑Assisted Workflow Tips

* Prompt Codex for boilerplate (Express route stubs, CSS blocks).
* Comment intentions before invoking AI for clearer output.
* Use small, focused prompts ( "fetch HTML and sanitize" ) instead of whole‑app requests.
* Commit after each verified feature (GitHub Desktop makes rollbacks easy).
