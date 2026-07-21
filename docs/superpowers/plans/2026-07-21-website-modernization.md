# GSDware Website Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2013-era grunt-bake site with a 7-page Eleventy site deployed to GitHub Pages, per `docs/superpowers/specs/2026-07-21-website-modernization-design.md`.

**Architecture:** Eleventy v3 (ESM, Nunjucks) builds `src/` → `_site/`. One `base.njk` layout, one hand-written `site.css` (no frameworks, no JS). GitHub Actions builds and deploys to Pages on push to `main`. Old flat `*.html` URLs get meta-refresh redirect stubs. DNS cutover to `gsdware.com` happens last, after verification on the `github.io` URL.

**Tech Stack:** Node ≥18, @11ty/eleventy ^3.0.0 (with bundled HtmlBasePlugin), Nunjucks, GitHub Actions, GitHub Pages.

## Global Constraints

- New repo remote: `git@github.com:EdHubbell/GSDwareWebsite.git` (GitHub user `EdHubbell`, repo `GSDwareWebsite`)
- No CSS frameworks, no jQuery, no Bootstrap, no client-side JS (spec: JS only if needed; nothing in this plan needs it)
- Design: "Clean Engineering" — light background `#fafaf8`, ink `#1a1a1a`, single accent `#0f62fe`, system font stack
- Voice: direct with personality; no 2013-era edgy lines
- All internal URLs written root-relative (`/about/`, `/css/site.css`); HtmlBasePlugin + `PATH_PREFIX` env var handles the `github.io` subpath during pre-cutover verification
- Contact info everywhere: `info@gsdware.com`, phone `919-656-3926`, Durham NC
- All copy in this plan is **draft for Ed's review** — factual claims about Ed/GSDware must not be extended beyond what the old site claimed (15 years at Cree across engineering and IT; GSDware shipping since ~2013; Durham, NC)
- Working directory is `C:\Development\GSDware\websitev1` (this repo becomes the new repo's history). Shell commands below are Git Bash syntax.
- End every commit message with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Push repo history to GitHub

**Files:** none created — remote configuration only.

**Interfaces:**
- Produces: `origin` = `git@github.com:EdHubbell/GSDwareWebsite.git`, branch `main` pushed and tracking. Later tasks (`8`, `11`) run `gh` commands against `EdHubbell/GSDwareWebsite`.

- [ ] **Step 1: Inspect current remotes**

Run: `git remote -v`
Expected: either no remotes, or a Bitbucket remote (likely named `origin`).

- [ ] **Step 2: Rename Bitbucket remote if present, add GitHub as origin**

If a Bitbucket `origin` exists:
```bash
git remote rename origin bitbucket
```
Then (always):
```bash
git remote add origin git@github.com:EdHubbell/GSDwareWebsite.git
```

- [ ] **Step 3: Push full history**

```bash
git push -u origin main
```
Expected: all commits pushed, `main` tracking `origin/main`. If the push rejects because the GitHub repo was initialized with a README/license, STOP and ask the user rather than force-pushing over it.

- [ ] **Step 4: Verify**

Run: `git ls-remote origin main` and `gh repo view EdHubbell/GSDwareWebsite --json defaultBranchRef -q .defaultBranchRef.name`
Expected: same commit SHA as local `git rev-parse main`; default branch `main`. (If `gh` is not authenticated, `git ls-remote` alone is sufficient.)

---

### Task 2: Eleventy scaffold + base layout

**Files:**
- Modify: `package.json` (full replacement), `.gitignore`
- Create: `eleventy.config.js`, `src/_includes/base.njk`, `src/index.njk` (placeholder, replaced in Task 4), `src/css/site.css` (empty placeholder, filled in Task 3)
- Create: `src/images/GSDware36.png`, `src/static/favicon.ico`, `src/static/favicon-32x32.png`, `src/static/apple-touch-icon.png` (copied from existing root/images assets)

**Interfaces:**
- Produces: `base.njk` layout consumed by every page via front matter `layout: base.njk`; expects front matter vars `title` (string, rendered as `{{ title }} — GSDware`) and `description` (string). Build commands `npm run build` (→ `_site/`) and `npm run serve` (→ http://localhost:8080). `PATH_PREFIX` env var controls `pathPrefix`.

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "gsdware-website",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=18" },
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

- [ ] **Step 2: Install (regenerates package-lock.json)**

```bash
rm -rf node_modules package-lock.json && npm install
```
Expected: installs cleanly; `npx @11ty/eleventy --version` prints `3.x.x`.

- [ ] **Step 3: Create eleventy.config.js**

```js
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
```

- [ ] **Step 4: Update .gitignore**

Add `_site/` (keep existing entries for now; `/*.html` is removed in Task 9):
```
node_modules/
.tmp/
/*.html
_site/
.superpowers/
```

- [ ] **Step 5: Copy brand assets**

```bash
mkdir -p src/images src/static src/css
cp images/GSDware36.png src/images/
cp favicon.ico favicon-32x32.png apple-touch-icon.png src/static/
touch src/css/site.css
```

- [ ] **Step 6: Create src/_includes/base.njk**

```njk
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }} — GSDware</title>
  <meta name="description" content="{{ description }}">
  <link rel="stylesheet" href="/css/site.css">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="logo" href="/"><img src="/images/GSDware36.png" alt="GSDware" height="28"></a>
      <nav class="site-nav">
        <a href="/services/ai-development/">AI Development</a>
        <a href="/services/manufacturing/">Manufacturing</a>
        <a href="/services/ai-consulting/">AI Consulting</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
    </div>
  </header>
  <main class="container">
    {{ content | safe }}
  </main>
  <footer class="site-footer">
    <div class="container">
      <span>© GSDware · Durham, NC</span>
      <span><a href="mailto:info@gsdware.com">info@gsdware.com</a> · <a href="tel:+19196563926">919-656-3926</a></span>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 7: Create placeholder src/index.njk**

```njk
---
layout: base.njk
title: Custom software for manufacturers
description: GSDware builds custom software for manufacturers.
---
<h1>GSDware</h1>
```

- [ ] **Step 8: Build and verify**

Run: `npm run build`
Expected: exit 0; `_site/index.html` exists and contains `<title>Custom software for manufacturers — GSDware</title>` and the nav links. Verify:
```bash
grep -c "site-nav" _site/index.html   # expected: 1
ls _site/css/site.css _site/images/GSDware36.png _site/favicon.ico
```

- [ ] **Step 9: Verify PATH_PREFIX rewriting works**

```bash
PATH_PREFIX=/GSDwareWebsite/ npm run build && grep "GSDwareWebsite/css/site.css" _site/index.html
```
Expected: match found (HtmlBasePlugin rewrote the root-relative href). Then rebuild clean: `npm run build`.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json eleventy.config.js .gitignore src/
git commit -m "Scaffold Eleventy 3 site: base layout, config, brand assets

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Design system CSS

**Files:**
- Modify: `src/css/site.css` (full content)

**Interfaces:**
- Consumes: markup classes emitted by `base.njk` (`site-header`, `container`, `logo`, `site-nav`, `site-footer`)
- Produces: page-content classes used by Tasks 4–6: `hero`, `lede`, `button`, `button secondary`, `cards`, `card`, `prose`. Later tasks must use exactly these class names.

- [ ] **Step 1: Write src/css/site.css**

```css
:root {
  --paper: #fafaf8;
  --ink: #1a1a1a;
  --muted: #55554f;
  --line: #e5e5e0;
  --accent: #0f62fe;
  --accent-ink: #ffffff;
  --max: 1080px;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
}
.container { max-width: var(--max); margin: 0 auto; padding: 0 1.25rem; }
img { max-width: 100%; height: auto; }

/* Header */
.site-header { border-bottom: 1px solid var(--line); background: #fff; }
.site-header .container {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.5rem 1rem;
  padding-top: 0.75rem; padding-bottom: 0.75rem;
}
.logo { display: flex; align-items: center; text-decoration: none; }
.logo img { height: 28px; width: auto; }
.site-nav { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
.site-nav a { text-decoration: none; color: var(--muted); font-size: 0.95rem; font-weight: 500; }
.site-nav a:hover { color: var(--accent); }

/* Hero */
.hero { padding: clamp(3rem, 8vw, 6rem) 0 clamp(2rem, 5vw, 4rem); }
.hero h1 {
  font-size: clamp(2rem, 1.4rem + 3vw, 3.25rem);
  line-height: 1.1; letter-spacing: -0.02em;
  margin: 0 0 1rem; max-width: 22ch;
}
.hero .lede {
  font-size: clamp(1.05rem, 1rem + 0.5vw, 1.3rem);
  color: var(--muted); max-width: 55ch; margin: 0 0 1.75rem;
}

/* Buttons */
.button {
  display: inline-block; background: var(--accent); color: var(--accent-ink);
  padding: 0.7rem 1.4rem; border-radius: 4px;
  text-decoration: none; font-weight: 600;
}
.button:hover { filter: brightness(1.1); }
.button.secondary { background: transparent; color: var(--accent); }

/* Sections & cards */
section { padding: 2.5rem 0; }
h2 { font-size: clamp(1.4rem, 1.2rem + 1vw, 1.9rem); letter-spacing: -0.01em; margin: 0 0 1rem; }
.cards {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem; padding: 0; margin: 1.5rem 0 0; list-style: none;
}
.card { background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 1.25rem; }
.card h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
.card p { margin: 0 0 0.75rem; color: var(--muted); font-size: 0.95rem; }
.card a { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.95rem; }

/* Prose pages */
.prose { max-width: 65ch; padding: 2.5rem 0; }
.prose h1 {
  font-size: clamp(1.8rem, 1.3rem + 2.2vw, 2.6rem);
  line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 1rem;
}
.prose h2 { margin-top: 2rem; }
.prose a { color: var(--accent); }
.prose ul { padding-left: 1.25rem; }
.prose li { margin-bottom: 0.4rem; }

/* Footer */
.site-footer { border-top: 1px solid var(--line); margin-top: 3rem; padding: 1.5rem 0 2.5rem; color: var(--muted); font-size: 0.9rem; }
.site-footer .container { display: flex; flex-wrap: wrap; gap: 0.5rem 2rem; justify-content: space-between; }
.site-footer a { color: var(--muted); }
```

- [ ] **Step 2: Build and eyeball**

Run: `npm run serve`, open http://localhost:8080.
Expected: placeholder home renders with styled header, nav, footer; nav wraps cleanly at 375px width (no hamburger by design — links wrap).

- [ ] **Step 3: Commit**

```bash
git add src/css/site.css
git commit -m "Add Clean Engineering design system CSS

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Home page

**Files:**
- Modify: `src/index.njk` (full replacement of Task 2 placeholder)

**Interfaces:**
- Consumes: `base.njk` layout; CSS classes `hero`, `lede`, `button`, `button secondary`, `cards`, `card`, `prose` from Task 3
- Produces: links to `/services/ai-development/`, `/services/manufacturing/`, `/services/ai-consulting/`, `/contact/` — Tasks 5–6 must create pages at exactly these paths.

- [ ] **Step 1: Write src/index.njk**

```njk
---
layout: base.njk
title: Custom software for manufacturers
description: GSDware builds custom software for manufacturers — AI-assisted development, manufacturing systems, and AI enablement. Durham, NC.
---
<section class="hero">
  <h1>Custom software for manufacturers. Built at AI speed.</h1>
  <p class="lede">GSDware has been shipping software for manufacturing floors since 2013. AI-assisted development means we now deliver in days what used to take months — same experience, a lot more leverage.</p>
  <a class="button" href="/contact/">Start a project</a>
  <a class="button secondary" href="/services/ai-development/">See how we work →</a>
</section>

<section>
  <h2>What we do</h2>
  <ul class="cards">
    <li class="card">
      <h3>AI-Assisted Development</h3>
      <p>Custom software shipped in days instead of quarters. Senior engineering judgment, AI-scale output.</p>
      <a href="/services/ai-development/">Read more →</a>
    </li>
    <li class="card">
      <h3>Manufacturing Software</h3>
      <p>Data visibility, tool integration, and line-of-business apps built by someone who has actually run a fab's systems.</p>
      <a href="/services/manufacturing/">Read more →</a>
    </li>
    <li class="card">
      <h3>AI Consulting &amp; Enablement</h3>
      <p>Cut through the hype. Find where AI actually helps your operation, prove it with a pilot, and train your team.</p>
      <a href="/services/ai-consulting/">Read more →</a>
    </li>
  </ul>
</section>

<section class="prose">
  <h2>Why GSDware</h2>
  <p>Fifteen years at Cree across engineering and IT, and more than a decade of GSDware projects since. We know which technologies get results on a manufacturing floor — and which ones just look good in slide decks. With AI in the toolchain, a small senior team now delivers what used to take a department.</p>
  <p>We still get stuff done. It's the name.</p>
  <a class="button" href="/contact/">Talk to us</a>
</section>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build && grep -c "Built at AI speed" _site/index.html
```
Expected: `1`. Eyeball at http://localhost:8080 — hero, three cards, why-section render per Clean Engineering direction.

- [ ] **Step 3: Commit**

```bash
git add src/index.njk
git commit -m "Home page: 2026 pitch, service cards, why-GSDware

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Service pages (3)

**Files:**
- Create: `src/services/ai-development.njk`, `src/services/manufacturing.njk`, `src/services/ai-consulting.njk`

**Interfaces:**
- Consumes: `base.njk`; CSS classes `prose`, `button`
- Produces: pages at `/services/ai-development/`, `/services/manufacturing/`, `/services/ai-consulting/` (Eleventy default permalinks from file paths — do not set `permalink` front matter). Task 7 redirect stubs point at these paths.

- [ ] **Step 1: Write src/services/ai-development.njk**

```njk
---
layout: base.njk
title: AI-Assisted Development
description: Custom software delivered in days, not quarters. Senior engineering judgment with AI-scale output, for manufacturers who need results.
---
<article class="prose">
  <h1>Your development cycle never sleeps.</h1>
  <p>Back in 2014, GSDware sold "relay development" — coders in different time zones passing the baton so your project moved around the clock. The idea was right. The mechanism has been replaced. AI-assisted development gives one senior engineer the throughput of a team, without the handoffs, the time-zone gaps, or the lost context.</p>

  <h2>What that means for you</h2>
  <ul>
    <li><strong>Days, not quarters.</strong> Working software on a timeline that used to be a kickoff meeting.</li>
    <li><strong>Same-day iteration.</strong> Describe a change in the morning, review it in the afternoon.</li>
    <li><strong>Senior judgment on every line.</strong> AI generates; an experienced engineer decides what ships.</li>
    <li><strong>Small-team economics.</strong> You're not paying for a bench, a PM layer, or an office tower.</li>
  </ul>

  <h2>Burst capacity, still</h2>
  <p>The oldest GSDware pitch still holds: when your backlog outgrows your team, plug in experienced development capacity without a six-month hiring cycle. It's just that the capacity got a lot bigger.</p>

  <h2>The accounting angle</h2>
  <p>Third-party development can also simplify how you account for software costs. The rules changed in 2022 — ask your accountant about Section 174 — and we'll structure deliverables and invoices to make their job easy.</p>

  <a class="button" href="/contact/">Start a project</a>
</article>
```

- [ ] **Step 2: Write src/services/manufacturing.njk**

```njk
---
layout: base.njk
title: Manufacturing Software
description: Data visibility, tool integration, and .NET line-of-business applications for manufacturers, from someone who has run a fab's systems.
---
<article class="prose">
  <h1>Software that knows what a fab is.</h1>
  <p>Most developers have never stood on a manufacturing floor. GSDware started there — fifteen years at Cree across engineering and IT, building the systems that ran production. That's the difference between software that demos well and software that operators actually use at 2 AM.</p>

  <h2>What we build</h2>
  <ul>
    <li><strong>Data visibility.</strong> Leaders make decisions, and decisions require data. Dashboards and reporting that put floor data in front of the people who need it.</li>
    <li><strong>Tool &amp; equipment integration.</strong> Getting your tools, sensors, and systems talking to each other — and to your database.</li>
    <li><strong>Line-of-business applications.</strong> Custom .NET applications with solid SQL Server design underneath. The unglamorous software that runs your operation.</li>
    <li><strong>Mobile on the floor.</strong> Everyone carries a computer in their pocket. Put your floor data on it.</li>
  </ul>

  <a class="button" href="/contact/">Talk about your floor</a>
</article>
```

- [ ] **Step 3: Write src/services/ai-consulting.njk**

```njk
---
layout: base.njk
title: AI Consulting & Enablement
description: Practical AI adoption for manufacturers — honest assessment, working pilots, and team training. No hype.
---
<article class="prose">
  <h1>Adopt AI without the hype.</h1>
  <p>Every vendor has an AI story right now. Most of them are selling you their story. We help manufacturers figure out what's real: where AI-assisted workflows genuinely save time and money in your operation, and where they don't.</p>

  <h2>How we help</h2>
  <ul>
    <li><strong>Assessment.</strong> A clear-eyed look at your processes and where AI tooling actually fits. If the answer is "not much yet," we'll say so.</li>
    <li><strong>Pilot projects.</strong> Prove the value on one real problem before you commit budget to a program.</li>
    <li><strong>Team enablement.</strong> Train your engineers to use AI-assisted development well — it's a skill, and we use it every day.</li>
  </ul>

  <p>We use these tools to build software for a living. That's the difference between advice from practitioners and advice from a deck.</p>

  <a class="button" href="/contact/">Get an honest assessment</a>
</article>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
grep -c "never sleeps" _site/services/ai-development/index.html   # expected: 1
grep -c "what a fab is" _site/services/manufacturing/index.html   # expected: 1
grep -c "without the hype" _site/services/ai-consulting/index.html # expected: 1
```

- [ ] **Step 5: Commit**

```bash
git add src/services/
git commit -m "Service pages: AI-assisted dev, manufacturing software, AI consulting

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: About, Contact, 404

**Files:**
- Create: `src/about.njk`, `src/contact.njk`, `src/404.njk`

**Interfaces:**
- Consumes: `base.njk`; CSS classes `prose`, `button`
- Produces: pages at `/about/`, `/contact/`, and `/404.html` (GitHub Pages serves root `404.html` automatically for missing paths).

- [ ] **Step 1: Write src/about.njk**

```njk
---
layout: base.njk
title: About
description: GSDware is Ed Hubbell — engineer, developer, and manufacturing software veteran, based in Durham, NC.
---
<article class="prose">
  <h1>GSDware is Ed Hubbell.</h1>
  <p>Ed spent fifteen years at Cree, working across both engineering and IT while the company grew explosively. That vantage point — one foot in the fab, one in the server room — taught him which technologies and techniques actually achieve rapid results, and which just generate meetings.</p>
  <p>GSDware has been his vehicle for putting that to work since 2013: custom software and engineering services for manufacturers and anyone else who needs to get stuff done.</p>
  <p>Today the operation is deliberately small and heavily leveraged. AI-assisted development means one experienced engineer ships what a team used to — with fewer handoffs and no lost context. You talk directly to the person building your software.</p>
  <p>Based in Durham, North Carolina.</p>
  <a class="button" href="/contact/">Work with Ed</a>
</article>
```

- [ ] **Step 2: Write src/contact.njk**

```njk
---
layout: base.njk
title: Contact
description: Contact GSDware — email info@gsdware.com or call 919-656-3926. Durham, NC.
---
<article class="prose">
  <h1>Let's get stuff done.</h1>
  <p>Tell us what you're trying to build, fix, or speed up. You'll get a reply from the person who would actually do the work.</p>
  <p>
    <a class="button" href="mailto:info@gsdware.com?Subject=Help%20us%20gsd">Email info@gsdware.com</a>
  </p>
  <p>Or call: <a href="tel:+19196563926">919-656-3926</a></p>
  <p>GSDware · Durham, North Carolina</p>
</article>
```

- [ ] **Step 3: Write src/404.njk**

```njk
---
layout: base.njk
title: Page not found
description: Page not found.
permalink: /404.html
---
<article class="prose">
  <h1>404 — that page is gone.</h1>
  <p>It probably got stuff done and moved on. <a href="/">Head back to the home page.</a></p>
</article>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
grep -c "Ed Hubbell" _site/about/index.html      # expected: >= 1
grep -c "info@gsdware.com" _site/contact/index.html  # expected: >= 1
ls _site/404.html                                 # expected: exists
```

- [ ] **Step 5: Commit**

```bash
git add src/about.njk src/contact.njk src/404.njk
git commit -m "About, contact, and 404 pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Redirect stubs for old URLs

**Files:**
- Create: `src/_data/redirects.json`, `src/redirects.njk`

**Interfaces:**
- Consumes: successor page paths from Tasks 4–6 (`/`, `/services/*`, `/about/`, `/contact/`)
- Produces: an HTML stub at every old flat `*.html` path, each meta-refreshing to its successor. Uses HtmlBasePlugin's `htmlBaseUrl` filter so redirect targets work under `PATH_PREFIX` too.

- [ ] **Step 1: Write src/_data/redirects.json**

```json
[
  { "from": "burst.html", "to": "/services/ai-development/" },
  { "from": "relay.html", "to": "/services/ai-development/" },
  { "from": "capitalize.html", "to": "/services/ai-development/" },
  { "from": "contractDevelopment.html", "to": "/services/ai-development/" },
  { "from": "dataVisibility.html", "to": "/services/manufacturing/" },
  { "from": "windowsApps.html", "to": "/services/manufacturing/" },
  { "from": "mobileDevices.html", "to": "/services/manufacturing/" },
  { "from": "iotTracking.html", "to": "/services/manufacturing/" },
  { "from": "technology.html", "to": "/" },
  { "from": "cloud.html", "to": "/" },
  { "from": "productDevelopment.html", "to": "/" },
  { "from": "projectManagement.html", "to": "/" },
  { "from": "siteInfo.html", "to": "/" },
  { "from": "byoDirectory.html", "to": "/" },
  { "from": "about.html", "to": "/about/" },
  { "from": "team.html", "to": "/about/" },
  { "from": "faq.html", "to": "/contact/" },
  { "from": "contact.html", "to": "/contact/" }
]
```
(`index.html` needs no stub — Eleventy emits the real home page there.)

- [ ] **Step 2: Write src/redirects.njk**

```njk
---
pagination:
  data: redirects
  size: 1
  alias: redirect
permalink: "/{{ redirect.from }}"
eleventyExcludeFromCollections: true
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url={{ redirect.to | htmlBaseUrl }}">
  <link rel="canonical" href="{{ redirect.to | htmlBaseUrl }}">
  <title>Redirecting…</title>
</head>
<body>
  <p>This page has moved. <a href="{{ redirect.to | htmlBaseUrl }}">Continue →</a></p>
</body>
</html>
```
Note: no `layout` key — this template is a complete standalone document.

- [ ] **Step 3: Build and verify**

```bash
npm run build
ls _site/burst.html _site/relay.html _site/team.html _site/faq.html   # expected: all exist
grep 'url=/services/ai-development/' _site/burst.html                  # expected: match
grep 'url=/about/' _site/team.html                                     # expected: match
```

- [ ] **Step 4: Commit**

```bash
git add src/_data/redirects.json src/redirects.njk
git commit -m "Meta-refresh redirect stubs for legacy flat URLs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: GitHub Actions deploy + Pages enablement

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` from Task 2; repo `EdHubbell/GSDwareWebsite` from Task 1
- Produces: live site at `https://edhubbell.github.io/GSDwareWebsite/` on every push to `main`. Repo variable `PATH_PREFIX` (initially `/GSDwareWebsite/`) — Task 11 changes it to `/` at cutover.

- [ ] **Step 1: Write .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          PATH_PREFIX: ${{ vars.PATH_PREFIX || '/' }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Enable Pages (Actions source) and set PATH_PREFIX**

```bash
gh api -X POST repos/EdHubbell/GSDwareWebsite/pages -f build_type=workflow
gh variable set PATH_PREFIX --repo EdHubbell/GSDwareWebsite --body "/GSDwareWebsite/"
```
If `gh api` returns 409 (already enabled), that's fine. If `gh` is unavailable, the user enables it at github.com → repo Settings → Pages → Source: "GitHub Actions", and adds repo variable `PATH_PREFIX` = `/GSDwareWebsite/` under Settings → Secrets and variables → Actions → Variables.

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "GitHub Actions: build Eleventy and deploy to Pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 4: Verify deploy**

Run: `gh run watch --repo EdHubbell/GSDwareWebsite` (or check the Actions tab).
Expected: workflow green. Then open `https://edhubbell.github.io/GSDwareWebsite/` — home page renders **with CSS applied** (proves PATH_PREFIX rewriting), nav links work, `https://edhubbell.github.io/GSDwareWebsite/burst.html` redirects to the AI development page.

---

### Task 9: Delete old implementation, rewrite README and CLAUDE.md

**Files:**
- Delete (tracked): `bake_html/`, `Gruntfile.js`, `bower.json`, `bower_components/`, `css/`, `js/`, `app/`, `fonts/`, `images/`, `server/`, `web.config`, `browserconfig.xml`, all root icon/favicon PNGs + `favicon.ico` (now living in `src/`), `readme.md`
- Delete (untracked, disk only): root `*.html` build outputs, `GSDwareHTTPSCertScreenshot.png`
- Create: `README.md`
- Modify: `.gitignore` (drop `/*.html` and `.tmp/`), `CLAUDE.md` (full rewrite)

**Interfaces:**
- Consumes: everything the new site needs already lives under `src/` (verified by Task 8's green deploy)
- Produces: a repo containing only the Eleventy site. Old code recoverable via git history.

- [ ] **Step 1: Delete old tracked files**

```bash
git rm -r bake_html bower.json bower_components css js app fonts images server \
  Gruntfile.js web.config browserconfig.xml readme.md \
  favicon.ico favicon-16x16.png favicon-32x32.png favicon-96x96.png favicon-160x160.png favicon-192x192.png \
  apple-touch-icon.png apple-touch-icon-precomposed.png \
  apple-touch-icon-57x57.png apple-touch-icon-60x60.png apple-touch-icon-72x72.png apple-touch-icon-76x76.png \
  apple-touch-icon-114x114.png apple-touch-icon-120x120.png apple-touch-icon-144x144.png apple-touch-icon-152x152.png apple-touch-icon-180x180.png \
  mstile-70x70.png mstile-144x144.png mstile-150x150.png mstile-310x150.png mstile-310x310.png
rm -f *.html GSDwareHTTPSCertScreenshot.png
```
(Root `*.html` files are gitignored build outputs — plain `rm`, not `git rm`.)

- [ ] **Step 2: Update .gitignore**

```
node_modules/
_site/
.superpowers/
```

- [ ] **Step 3: Write README.md**

```markdown
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
```

- [ ] **Step 4: Rewrite CLAUDE.md**

```markdown
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
```

- [ ] **Step 5: Build still passes**

```bash
npm run build
```
Expected: exit 0, `_site/index.html` present. Old-source deletion must not affect the build.

- [ ] **Step 6: Commit and push**

```bash
git add -A
git commit -m "Remove grunt-bake/Bootstrap-era implementation; new README and CLAUDE.md

Old site recoverable from history before the Eleventy scaffold commit.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 7: Verify deploy still green**

Run: `gh run watch --repo EdHubbell/GSDwareWebsite`
Expected: workflow green; `https://edhubbell.github.io/GSDwareWebsite/` unchanged.

---

### Task 10: Verification pass (links, responsive, Lighthouse)

**Files:** none — verification only.

**Interfaces:**
- Consumes: full built site from Tasks 4–9

- [ ] **Step 1: Link check**

```bash
npm run build
npx linkinator _site --recurse
```
Expected: all internal links return 200; zero broken links. (`mailto:`/`tel:` are skipped automatically.) Fix any breakage before proceeding.

- [ ] **Step 2: Responsive eyeball**

Run `npm run serve`; check every page (`/`, three `/services/*`, `/about/`, `/contact/`, `/404.html`) at 375px and 1280px widths in browser devtools.
Expected: no horizontal scroll, nav wraps cleanly, cards stack on mobile.

- [ ] **Step 3: Lighthouse**

```bash
npx lighthouse http://localhost:8080 --view
```
Expected: ≥95 on Performance, Accessibility, Best Practices, SEO. Investigate anything lower — with no JS and one stylesheet there is no excuse.

- [ ] **Step 4: Report results to user**

Present link-check output and Lighthouse scores. **This is the pre-cutover gate: get the user's explicit OK on the deployed `github.io` site before Task 11 touches DNS.**

---

### Task 11: Custom domain cutover (user-gated — DNS is manual)

**Files:**
- Create: `src/static/CNAME`

**Interfaces:**
- Consumes: verified live site from Task 10; Pages config from Task 8
- Produces: site served at `https://www.gsdware.com` and `https://gsdware.com`; droplet no longer serving the site.

- [ ] **Step 1: Add CNAME file**

Create `src/static/CNAME` containing exactly:
```
www.gsdware.com
```

- [ ] **Step 2: Set custom domain and clear PATH_PREFIX**

```bash
gh api -X PUT repos/EdHubbell/GSDwareWebsite/pages -f cname=www.gsdware.com
gh variable set PATH_PREFIX --repo EdHubbell/GSDwareWebsite --body "/"
```

- [ ] **Step 3: Commit and push**

```bash
git add src/static/CNAME
git commit -m "Add CNAME for www.gsdware.com cutover

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 4: User updates DNS (manual — provide these instructions)**

At the DNS host for `gsdware.com`:
- `www` → CNAME → `edhubbell.github.io`
- apex `gsdware.com` → A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- apex AAAA (optional) → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- Remove the old A record pointing at the DigitalOcean droplet
- **Leave `blog.gsdware.com` records untouched** (Ghost blog still on the droplet)

- [ ] **Step 5: Verify cutover**

After DNS propagates (minutes to hours):
```bash
curl -sI https://www.gsdware.com | head -5
curl -sI https://gsdware.com | head -5
```
Expected: 200 (or 301 apex→www) served by GitHub (`server: GitHub.com` header). In repo Settings → Pages, enable **Enforce HTTPS** once the certificate is issued. Spot-check `https://www.gsdware.com/burst.html` redirects correctly.

- [ ] **Step 6: Done — note droplet**

Site fully off the droplet. Droplet decommission is out of scope (Ghost blogs may still live there); remind the user it's now only serving the blogs.
