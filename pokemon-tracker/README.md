# Pokemon Tracker

React + Vite app for tracking Pokemon trades.

## Development

Run these commands from the `pokemon-tracker` folder:

```bash
npm install
npm run dev
```

## Deployment

This project is a static site built with Vite. The app lives in the `pokemon-tracker` folder, so the GitHub Pages workflow lives at the repository root in `.github/workflows/gh-pages.yml` and builds from this subfolder.

### Option A - Quick Deploy With `gh-pages`

Run these commands from the `pokemon-tracker` folder:

```bash
npm install
npm run deploy
```

This builds the app and pushes the `dist` folder to the `gh-pages` branch.

### Option B - GitHub Actions

Push to the `main` branch. The root workflow will:

- install dependencies from `pokemon-tracker/package-lock.json`,
- run `npm run build` inside `pokemon-tracker`,
- add `dist/.nojekyll`, and
- publish `pokemon-tracker/dist` to the `gh-pages` branch.

In the repository's GitHub Pages settings, set the source to deploy from the `gh-pages` branch and the `/ (root)` folder. After the workflow completes, the site can take a few minutes to appear.

## Security Note

GitHub Pages sites are publicly accessible. Remove any sensitive files or credentials from the repository before publishing.    