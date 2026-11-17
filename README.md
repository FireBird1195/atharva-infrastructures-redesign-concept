# Atharva Infrastructures — website redesign concept

An independent, speculative redesign of [atharvainfrastructuresnagpur.com](https://atharvainfrastructuresnagpur.com/), prepared for discussion. **Not the official website** and not affiliated with Atharva Infrastructures.

Two pages:

- `index.html` — homepage: brand, the Atharva Nagari I–VIII register, featured project, verifiable credentials, location, enquiry.
- `projects/atharva-nagari-viii/index.html` — project page: key facts with source tags, floor plans, renders with lightbox, amenities, location, MahaRERA, enquiry.

## Run locally

```bash
node scripts/fetch-assets.mjs     # downloads the company's images into assets/img/atharva/
python3 -m http.server 8080       # or: npx serve .
# open http://localhost:8080/
```

Without step 1 the site still works and shows labelled placeholders where company images belong.

## Stack

Plain HTML, CSS and a single dependency-free script. No build step, no backend, no tracking. All links are relative, so it works from a GitHub Pages sub-path (`/atharva-infrastructures-redesign-concept/`). Fonts: Newsreader and Hanken Grotesk (Google Fonts; self-host for production).

Project content lives in `data/projects.json` with a `basis` on every fact (published / verified / to_confirm), shaped for a future headless CMS.

## The enquiry form

Validates name, Indian mobile number, optional email and project; shows a confirmation. **It sends and stores nothing.** A real build would post to the client's CRM with consent capture and spam protection.

## Publishing

- Atharva Infrastructures has given written permission to republish its logo and images in this concept. Keep that permission on file.
- Download the images (`node scripts/fetch-assets.mjs`, or on Windows `powershell -ExecutionPolicy Bypass -File scripts/fetch-assets.ps1`) and commit `assets/img/atharva/`.
- Every page carries `noindex, nofollow`; `robots.txt` disallows crawling. The site stays labelled as an independent concept.
- Deploy with the manual workflow `.github/workflows/pages.yml` (Settings → Pages → Source: GitHub Actions, then Actions → Run workflow).
