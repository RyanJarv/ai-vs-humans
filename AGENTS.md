# Repository Guidelines

## Project Structure & Module Organization
- `index.html` — main dashboard (ring chart + counters)
- `methodology.html` — methodology and caveats
- `assets/` — static assets
  - `styles.css` — global styles (CSS variables in `:root`)
  - `app.js` — data fetch + animations
  - `favicon.svg`
- `data/estimate.json` — source of truth for numbers
- `CNAME`, `.nojekyll` — GitHub Pages config (keep both)

## Build, Test, and Development Commands
- Local preview: `python3 -m http.server 8080` then open `http://localhost:8080`
- Optional: `npx serve . -p 8080`
- No build step or dependencies. Keep the site deployable as static files.

## Coding Style & Naming Conventions
- HTML/CSS/JS only; no frameworks or bundlers.
- Indentation: 2 spaces. Keep lines readable and semantic HTML (landmarks: `header`, `main`, `footer`).
- Filenames: lowercase-hyphen-case (e.g., `styles.css`, `estimate.json`).
- JS: ES modules, single quotes, semicolons. Keep functions small and focused.
- Paths: use root-absolute for assets (`/assets/...`) and pages (`/methodology.html`).

## Testing Guidelines
- Manual checks (no automated tests yet):
  - Page loads without console errors; ring animation renders.
  - `data/estimate.json` is fetched and values update; confirm fallback works by temporarily renaming the file.
  - Links: Overview ↔ Methodology, GitHub link, favicon present.
  - Responsive layout at 360px, 768px, 1024px; verify light/dark preference.

## Commit & Pull Request Guidelines
- Commits: clear, imperative mood; group related changes.
  - Examples: `feat: add legend to ring`, `fix: correct estimate timestamp label`, `docs: update README usage`.
- PRs should include:
  - Summary, before/after screenshot (if UI changes), and any linked issue.
  - Scope small; avoid drive-by reformatting. Keep CNAME and `.nojekyll` intact.

## Security & Configuration Tips
- Do not commit secrets; the site is fully static.
- Changing the domain? Update `CNAME` and verify Pages settings.
- If adding automation for `data/estimate.json`, store tokens in repo secrets and document the workflow.

## Agent-Specific Instructions
- Keep changes minimal and consistent with current style.
- Do not introduce new toolchains without discussion. If commands or structure change, update `README.md` and this file.

## Automation
- Scheduled workflow: `.github/workflows/update-estimate.yml` calls `scripts/update-estimate.js` daily.
- The script samples public code via the GitHub API looking for explicit AI markers (heuristic, low-volume) and updates `data/estimate.json`.
