# Atharva Infrastructures — website redesign concept

An independent, speculative redesign of [atharvainfrastructuresnagpur.com](https://atharvainfrastructuresnagpur.com/), prepared for discussion. **Not the official website** and not affiliated with Atharva Infrastructures.

Two pages:

- `index.html` — homepage: brand, the Atharva Nagari I–VIII register, featured project, verifiable credentials, location, enquiry.
- `projects/atharva-nagari-viii/index.html` — project page: key facts with source tags, floor plans, renders with lightbox, amenities, location, MahaRERA, enquiry.

## Run locally

```bash
node scripts/fetch-assets.mjs     # downloads the company's own images into assets/img/atharva/ (git-ignored)
python3 -m http.server 8080       # or: npx serve .
# open http://localhost:8080/
```

Without step 1 the site still works and shows labelled placeholders where company images belong.

## Stack

Plain HTML, CSS and a single dependency-free script. No build step, no backend, no tracking. All links are relative, so it works from a GitHub Pages sub-path (`/atharva-infrastructures-redesign-concept/`). Fonts: Newsreader and Hanken Grotesk (Google Fonts; self-host for production).

Project content lives in `data/projects.json` with a `basis` on every fact (published / verified / to_confirm), shaped for a future headless CMS.

## The enquiry form

Validates name, Indian mobile number, optional email and project; shows a confirmation. **It sends and stores nothing.** A real build would post to the client's CRM with consent capture and spam protection.

## Publishing — read first

- Company logo and images are **excluded from git** (`.gitignore`) until Atharva Infrastructures grants permission to republish them.
- Every page carries `noindex, nofollow`; `robots.txt` disallows all crawling.
- The Pages workflow (`.github/workflows/pages.yml`) is manual-only. Do not run it with company images until permission is confirmed in writing.
