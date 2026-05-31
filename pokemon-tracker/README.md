# Pokemon Tracker

React + Vite app for tracking Pokemon trades.

## Development

Run these commands from the `pokemon-tracker` folder:

```bash
npm install
npm run dev
```

## Deployment

This project is a static site built with Vite. The app lives in the `pokemon-tracker` folder, so the GitHub Pages workflow lives at the repository root in `.github/workflows/deploy.yml` and builds from this subfolder.

### GitHub Actions

Push to the `main` branch. The root workflow will:

- install dependencies from `pokemon-tracker/package-lock.json`,
- run `npm run build` inside `pokemon-tracker`,
- add `dist/.nojekyll`,
- upload `pokemon-tracker/dist` as a Pages artifact, and
- deploy that artifact with GitHub Pages.

In the repository's GitHub Pages settings, set the build and deployment source to `GitHub Actions`. After the workflow completes, the site can take a few minutes to appear.

### Local Build Check

Run these commands from the `pokemon-tracker` folder if you want to test the production build locally:

```bash
npm install
npm run build
```

## Security Note

GitHub Pages sites are publicly accessible. Remove any sensitive files or credentials from the repository before publishing.
