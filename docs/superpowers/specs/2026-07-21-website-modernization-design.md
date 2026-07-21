# GSDware Website Modernization — Design Spec

**Date:** 2026-07-21
**Status:** Approved direction, pre-implementation
**New repo:** `git@github.com:EdHubbell/GSDwareWebsite.git`

## Goal

Replace the ~2013 GSDware marketing site with a modern static site that actively generates leads for the 2026 offering, hosted on GitHub Pages instead of the DigitalOcean droplet.

The site's job is **active lead generation**: pitch a current offering and convert visitors, not just look alive.

## Positioning & Voice

**Pitch:** Custom software for manufacturers, built at AI speed. Ed Hubbell's 15 years at Cree (engineering + IT) plus 12+ years running GSDware means someone who understands manufacturing floors *and* ships code — now AI-leveraged.

**Voice:** Direct with personality. Keep the plainspoken "get stuff done" attitude; drop the 2013-era edgy lines ("punch that kid in the face", etc.). Confident, no-BS, occasionally funny. The clean visual design carries the professionalism; the copy carries the personality.

## Sitemap (6 pages + 404)

| Page | Path | Content | Replaces |
|---|---|---|---|
| Home | `/` | Hero pitch, three service cards, "why GSDware" (experience + AI leverage), contact CTA | index.html |
| AI-Assisted Development | `/services/ai-development/` | Successor to burst/relay pitches: same-day iteration, small-team economics, "your dev cycle never sleeps" now means AI, not time zones. Fold in the capitalize-expenses angle if it survives a Section 174 accuracy check. | burst, relay, capitalize |
| Manufacturing Software | `/services/manufacturing/` | Data visibility, tool integration, .NET/SQL Server line-of-business apps, mobile on the floor | dataVisibility, windowsApps, mobileDevices |
| AI Consulting & Enablement | `/services/ai-consulting/` | New page: helping manufacturers adopt AI tooling — assessment, pilots, training | (new) |
| About | `/about/` | Just Ed, updated bio: Cree engineering + IT → GSDware since ~2013 → AI-augmented now. No "Coder in Asia/Europe" placeholder team members. | about, team |
| Contact | `/contact/` | `mailto:info@gsdware.com` + phone 919-656-3926. No form, no server-side anything. | contact, faq |
| 404 | `/404.html` | Simple, on-brand | 404 |

**Cut entirely** (content recoverable from git history): technology, cloud, iotTracking, productDevelopment, projectManagement, contractDevelopment, siteInfo, byoDirectory, and the IoT/hardware offering generally.

## Visual Design

Direction chosen: **Clean Engineering** (option A of three mockups, selected in visual companion session).

- Light background, near-black text, single blue accent color, generous whitespace
- Modern system-font stack; fluid type scale
- CSS grid/flexbox layout; one hand-written `site.css`; **no CSS framework, no jQuery, no Bootstrap**
- JS only where needed (likely just a mobile nav toggle)
- Images in WebP with fallbacks; proper `srcset` (retina.js retired)
- Keep the GSDware name/logo mark; refresh the PNG during implementation if it looks dated
- Target: ~100 Lighthouse scores (performance, accessibility, best practices, SEO)

## Architecture

- **Eleventy v3** with Nunjucks templates
  - `src/_includes/base.njk` — single layout: head, header/nav, footer
  - One content file per page under `src/`
  - `src/css/site.css`, `src/images/`
  - Builds to `_site/`
- **Deploy:** GitHub Actions — on push to `main`, build Eleventy and publish to GitHub Pages
- **Repo migration:** push full git history from this repo (currently Bitbucket-hosted) to `git@github.com:EdHubbell/GSDwareWebsite.git`. Bitbucket becomes a read-only archive.
- Old implementation (bake_html/, Gruntfile.js, bower_components/, theme css/js, generated root HTML) is deleted in the new repo once the new site replaces it — recoverable from history.

## Domain & Cutover

- Point `gsdware.com` and `www.gsdware.com` at GitHub Pages (A/AAAA records + CNAME at the DNS host). GitHub Pages provides automatic HTTPS — droplet nginx, certbot renewals, and FTP deploys are all retired.
- **Old URL handling:** the site was served as flat `*.html` files. Add meta-refresh redirect stubs at the old indexed paths (`burst.html`, `relay.html`, `dataVisibility.html`, `windowsApps.html`, `mobileDevices.html`, `about.html`, `contact.html`, `team.html`, `technology.html`, etc.) pointing at their successor pages, so inbound links and search results don't dead-end.
- **Cutover order:** build → verify on the `*.github.io` URL → then move DNS. No DNS change until the Pages site is verified.
- Decommissioning the DigitalOcean droplet is **out of scope** (Ghost blogs may still run there — owner's call, later).

## Verification

- CI build must pass on every push
- Internal link check (11ty plugin or simple crawl) — no broken internal links
- Manual eyeball at mobile and desktop widths for every page
- Lighthouse spot-check before DNS cutover

## Out of Scope

- Contact form backend (site stays mailto-only)
- Blog
- Droplet decommission
- IoT/hardware service pages
