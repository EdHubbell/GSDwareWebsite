# GSDware Website

Static site for [gsdware.com](https://www.gsdware.com), built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Editing page text

Each page is one file under `src/`. The text is plain HTML below the `---` front matter block — edit it directly:

| Page | File |
|---|---|
| Home | `src/index.njk` |
| AI-Assisted Development | `src/services/ai-development.njk` |
| Manufacturing Software | `src/services/manufacturing.njk` |
| AI Consulting & Enablement | `src/services/ai-consulting.njk` |
| About | `src/about.njk` |
| Contact | `src/contact.njk` |
| 404 | `src/404.njk` |

Notes:

- The `title:` and `description:` lines in the front matter are the browser-tab title (rendered as "Title — GSDware") and the search-result snippet — keep both current when you change a page's content.
- Header nav and footer (shared by every page) live in `src/_includes/base.njk`.
- Styles are all in `src/css/site.css`. Body text sits in a centered 80-character column (`.prose`, `.hero`).
- Write internal links root-relative (`/about/`, `/contact/`) — the build rewrites them for the deploy environment automatically.
- The home hero headline in `src/index.njk` contains a manual `<br>` that forces its two-line break — keep (or move) it if you reword the headline.

## Preview locally

    npm install        # first time only
    npm run serve      # http://localhost:8080

Leave it running: it rebuilds on save, then refresh the browser to see your edit. (`npm run build` does a one-off build into `_site/` if you just want to check it compiles.)

## Publish

    git add -A
    git commit -m "describe your change"
    git push

GitHub Actions builds and publishes to Pages automatically — live a minute or two after the push. Watch progress under the repo's Actions tab if you're curious.

## Layout

- `src/` — pages (Nunjucks), `_includes/base.njk` layout, `css/site.css`, images
- `src/_data/redirects.json` — legacy flat-URL → new-URL redirect stubs (add an entry if a page URL ever changes)
- `_site/` — build output (gitignored, never edit)

History note: the pre-2026 grunt-bake/Bootstrap site lives in git history before the "Scaffold Eleventy 3 site" commit.
