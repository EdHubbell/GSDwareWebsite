# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for GSDware (gsdware.com), built with Eleventy v3 and deployed to GitHub Pages via GitHub Actions on push to `main`.

## Build & run

- `npm run serve` — dev server at http://localhost:8080 with rebuild-on-save
- `npm run build` — build `src/` → `_site/` (gitignored)

## Structure

- `src/_includes/base.njk` — the single layout (head, header/nav, footer). Every page sets `layout: base.njk` plus `title` and `description` front matter.
- Pages are Nunjucks files; permalinks come from file paths (`src/services/manufacturing.njk` → `/services/manufacturing/`). Only `404.njk` sets an explicit permalink.
- `src/css/site.css` — the entire stylesheet, hand-written. No CSS frameworks, no client-side JS. Keep it that way absent a strong reason.
- `src/_data/redirects.json` + `src/redirects.njk` — meta-refresh stubs mapping the old flat `*.html` URLs to current pages. Add an entry when a page moves.
- `src/static/` — files copied to the site root (favicons, CNAME).

## URLs & deployment

Write internal URLs root-relative (`/about/`, `/css/site.css`). The HtmlBasePlugin rewrites them using the `PATH_PREFIX` env var (repo Actions variable) so the site works both at `edhubbell.github.io/GSDwareWebsite/` and at the custom domain.

Voice for copy: direct with personality — plainspoken "get stuff done" tone, professional but not corporate.

History: the pre-2026 grunt-bake/Bootstrap/AngularJS site is in git history before the "Scaffold Eleventy 3 site" commit.
