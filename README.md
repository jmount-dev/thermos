# Thermos

A minimal reader-mode web app that fetches pages server-side and displays a clean reading view.

## Development

```
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and enter a URL to view.

## Security

All remote pages are fetched and sanitized server-side using DOMPurify.

## Standalone CLI

You can also fetch and render an article directly from the command line without
running the server:

```bash
npm run cli -- <url>
```

The command prints sanitized HTML to stdout. Redirect it to a file to view in a
browser:

```bash
npm run cli -- https://example.com > article.html
```
