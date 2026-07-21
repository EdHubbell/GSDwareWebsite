# GSDware Website

Static site for [gsdware.com](https://www.gsdware.com), built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Develop

    npm install
    npm run serve      # http://localhost:8080, rebuilds on save

## Deploy

Push to `main`. GitHub Actions builds and publishes to Pages automatically.

## Layout

- `src/` — pages (Nunjucks), `_includes/base.njk` layout, `css/site.css`, images
- `src/_data/redirects.json` — legacy flat-URL → new-URL redirect stubs
- `_site/` — build output (gitignored)

History note: the pre-2026 grunt-bake/Bootstrap site lives in git history before the "Scaffold Eleventy 3 site" commit.
