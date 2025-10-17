## AI vs Humans — Code on GitHub

A minimal static site that displays an estimate of how much code on GitHub is written by AI versus humans.

### Structure

- `index.html` — Overview page with counters and chart
- `methodology.html` — Methodology and limitations
- `assets/styles.css` — Styling
- `assets/app.js` — Fetches and renders `data/estimate.json`
- `data/estimate.json` — Current numbers (update this file)
- `CNAME` and `.nojekyll` — GitHub Pages configuration

### Local development

Serve locally with any static server, e.g.:

```
python3 -m http.server 8080
# then open http://localhost:8080
```

### Updating the data

Edit `data/estimate.json` and push. The UI will automatically render the new values.

`estimate.json` format:

```json
{
  "updated_at": "2025-10-17T00:00:00Z",
  "scope": "Public GitHub repositories (estimate)",
  "ai_lines": 6400000000,
  "human_lines": 18600000000,
  "notes": "Source or caveats here"
}
```

### GitHub Pages

Enable Pages in repo settings:
- Source: `main` branch, `/ (root)`
- Custom domain: `ai-vs-humans.ryanjarv.sh` (this repo includes `CNAME`)

### Roadmap

- Add GitHub Action to refresh `data/estimate.json` on a schedule.
- Explore better attribution signals and sampling for more robust estimates.

