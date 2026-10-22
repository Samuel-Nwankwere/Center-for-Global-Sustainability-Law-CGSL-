# CGSL website (React)

A coded rebuild of [cgsul.org](https://cgsul.org), the website of the Center for Global Sustainability Law, to replace the WordPress/Elementor site.

All the existing content is carried over: 15 publications, 33 sustainability domains, 4 programs and 20 team profiles.

## Design: Ecofine (Home 1), coded in React

The layout and components reproduce the **Ecofine – Ecology & Environment** ThemeForest theme (ThemePul), Home 1 variant, using the theme's own template library data and stylesheets as the reference. CGSL's colours replace Ecofine's: green `#006303`, greys and white.

| Ecofine element | Where it lives here |
|---|---|
| Header 1 (dark top bar, white menu, sticky on scroll) | `components/layout/SiteHeader.tsx` |
| Hero slider with vertical dots and square arrows | `pages/HomePage.tsx` → `HeroSlider` |
| About image + about block | `HomePage` → `About` |
| "Service three" cards (spinning icon, photo, hover button) | `components/content/Cards.tsx` → `ServiceCard` |
| Counter band | `HomePage` → `Counters` |
| 4-step process (icon box two) | `HomePage` → `Process` |
| FAQ accordion | `components/ui/Accordion.tsx` |
| Donation-two cards (used for featured domains) | `HomePage` → `DomainsCarousel` |
| Testimonial v2 (used for vision/mission statements) | `HomePage` → `Commitment` |
| Team two, Blog v2 | `PersonCard`, `ArticleCard` |
| Breadcrumb banner, sidebar widgets, service/team/blog detail pages | `PageHero`, `Widget`, `TopicDetail`, `PersonPage`, `ArticlePage` |
| Footer 1 | `components/layout/SiteFooter.tsx` |
| Theme button (double-chevron, colour sweep on hover) | `components/ui/primitives.tsx` → `buttonClass` |

Ecofine tokens and their CGSL equivalents are documented at the top of `src/styles/index.css`. The font is Manrope, as in Ecofine. No Ecofine demo photos are used; all images are CGSL's own.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run build:demo   # static build for any URL or sub-path (hash routing) → dist-demo/
npm run lint && npm run typecheck && npm test
```

## Stack

| Concern | Choice | Why |
|---|---|---|
| UI | React 18 + TypeScript | Industry standard; type-safe content and props |
| Build | Vite 5 | Fast dev server; optimised, code-split production builds |
| Routing | React Router 6 | Each page is its own lazy-loaded chunk |
| Styling | Tailwind CSS 3 + CSS-variable design tokens | One place to change brand colours (`src/styles/index.css`) |
| Icons | lucide-react | Consistent, tree-shaken SVG icons |
| Fonts | Manrope, self-hosted via @fontsource | Ecofine's typeface; no third-party font requests |
| Quality | ESLint, `tsc --strict`, Vitest | Tests cover content integrity (no broken internal links, unique slugs, no lorem ipsum) and search |

## Project structure

```
src/
  content/
    generated/        ← JSON imported from WordPress (articles, domains, programs, people, images)
    pages.ts          ← editorial copy for hand-designed pages (About, History, Advisory…)
    site.ts           ← organisation details, navigation, footer links, social links
    types.ts          ← content model (Article, Domain, Program, Person, Block)
  lib/
    content.ts        ← the ONLY place pages read content from (swap for a CMS here)
    search.ts         ← client-side site search (Ctrl/⌘ K)
    forms.ts          ← form submission (endpoint or email fallback)
  components/
    layout/           ← header (dropdown + mobile menu), footer, search dialog
    ui/               ← buttons, page hero, form fields, icons
    content/          ← cards, rich-text renderer, topic detail layout
    sections/         ← reusable page sections (feature grid, CTA band, enquiry form)
  pages/              ← one file per route
scripts/import-wordpress.py   ← re-runnable importer from the WordPress REST API
public/media/                 ← optimised WebP images (77 files, ~4.5 MB vs. multi-MB originals)
```

## Common editing tasks

- **Add a publication**: add an entry to `src/content/generated/articles.json` (or hook up a CMS; see below). It then appears automatically in listings, search, author pages and related-topic links.
- **Add a team member**: add to `people.json`. A profile page at `/people/<slug>` is generated automatically.
- **Change navigation**: edit `mainNav` in `src/content/site.ts`.
- **Re-theme**: edit the `--brand-*` and `--ink-*` variables in `src/styles/index.css`.

## Forms

Contact, Volunteer, Partner, Newsletter and Donation-pledge forms all validate on the client side. Submission goes through `src/lib/forms.ts`:

- If `VITE_FORM_ENDPOINT` is set (Formspree, a serverless function, or a CRM webhook), submissions are POSTed there as JSON.
- Otherwise the visitor's email app opens with a pre-filled message to `info@cgsul.org`. The forms therefore work on static hosting with no backend.

Online card payments are not built in, because the current site also lists them as "coming soon". Stripe Checkout or Donorbox can be added in `DonatePage.tsx`.

## Deployment

`npm run build` outputs static files. They can be hosted on Netlify, Vercel, Cloudflare Pages, S3/CloudFront or any web server. Configure an SPA fallback (all routes → `index.html`). Hosting costs are typically $0 at this traffic level, with nothing to patch and no PHP/plugin attack surface.

Recommended redirects from the old WordPress URLs:

| Old | New |
|---|---|
| `/overview/` | `/about` |
| `/our-history/` | `/about/history` |
| `/sustainability-domains/` | `/domains` |
| `/climate-change-law/`, `/energy-law/`, … | `/domains/<slug>` (see `legacyUrl` in `domains.json`) |
| `/programs-initiative/` | `/programs` |
| `/legsus-digest/`, `/legus-digest/` | `/publications/digest` |
| `/legsus-trove/` | `/publications/trove` |
| `/global-executive-team/` | `/people` |
| `/contact-2/` | `/contact` |

Every generated item stores its `legacyUrl`, so a full redirect map can be generated from the JSON.

## Next steps for production

1. **Headless CMS** (Sanity, Strapi, Contentful or WordPress-as-API) so non-developers can publish. Only `src/lib/content.ts` needs to change.
2. **Pre-rendering/SSR** (e.g. move to Next.js or add `vite-plugin-ssr`) for best SEO on publications.
3. Analytics, cookie consent, `sitemap.xml`/`robots.txt` and Open Graph images.
4. Connect `VITE_FORM_ENDPOINT` and a newsletter provider (Mailchimp, Buttondown).

## Content issues found on the current WordPress site

These were fixed or worked around in the rebuild, and should also be checked on the live site:

1. **Duplicate article**: the Trove item "Climate Finance – Glasgow Opens Climate Investment to Public" (`/climate-finance/`) shows the Venezuela article's text. It was left out until the real text is supplied.
2. **Sustainability Domains page**:
   - The "Supply Chain" card links to Water and Effluent Law.
   - Water and Effluent Law appears 3 times and Sustainable Aviation twice.
   - Five cards reuse the International Environmental Law description.
   - "RED MORE" and "Marinetime" are typos.
3. **Leftover "Lorem ipsum" text** at the top of the Climate-Induced Migration article.
4. **Theme demo content is still published and indexed**: "Hello world!", "Demo Post #1/#2", "Demo Header/Footer", placeholder lorem posts, and 56 Elementor templates in `wp-sitemap.xml`.
5. **Old footer links**: the footer on Case Studies, White Papers, Proposals, Annual Reports and Financials links "About Us" to `wpmet.com/plugin/elementskit/islamic/` (a theme demo URL). Its other links are `#`.
6. **Social icons without links**: the X, Facebook and Instagram icons have no URL. Only LinkedIn is used in the rebuild.
7. **Typos in team details**: "Cheif Operating Officer" was fixed. Shaune Hickson's email is listed as `shisckson@cgsul.org`; please verify it.
8. **Shared hero images**: several domain pages share the same image (e.g. circular-economy.jpg).
9. **Inconsistent organisation name**: it appears as "Center for Global Sustainability Law", "Center/Centre for Global Sustainability and Law" and, in the `<title>`, "Center for Global Sustainability (CGSL)".
10. **Old spam URL still in Google**: the spam URL from the injection (`/sustainabilityatcgsl.html`) now returns 404, but Google still lists it. Request removal in Search Console.

## New copy that needs review

Added for the Ecofine layout:

- Home FAQ questions and answers (`homeFaqs` in `src/content/pages.ts`). The answers are drawn from existing site text.
- About block checklist ("Independent, non-profit and apolitical", …).
- Hero slide 3 and the "Year founded 2025" badge.

From the first version:

Short pieces of supporting copy were written for the new layout. They are not on the current site:

- Home section headings: "Where the law meets the planet's hardest problems" and "Research that informs law and policy".
- The four-step engagement model on the Advisory page (Discover → Diagnose → Design → Deliver).
- Volunteer "areas of interest" options and contact form topics.
- Newsletter band text and the donation pledge notes.
- Domain **themes** (Climate & Energy, Governance & Rights, …), which are used for filtering. They are assigned in `scripts/import-wordpress.py`.
# Center-for-Global-Sustainability-Law-CGSL-
