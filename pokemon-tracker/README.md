# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment

This project is a static site built with Vite. Two convenient GitHub Pages deployment options are provided below: a quick `gh-pages` branch deploy, or an automated GitHub Actions workflow.

### Option A — Quick deploy with `gh-pages`

1. Install dependencies locally (if you haven't already):

```bash
npm install
```

2. Install `gh-pages` (if not already installed):

```bash
npm install --save-dev gh-pages
```

3. Build and publish (this will push the `dist` folder to the `gh-pages` branch):

```bash
npm run deploy
```

Notes:
- `vite.config.js` is configured with `base: './'` so assets are served relative to the site root.
- If you prefer the repo subpath URL (https://<user>.github.io/<repo>/), you can set `base: '/REPO_NAME/'` in `vite.config.js`.

### Option B — GitHub Actions (recommended for automated deploys)

A workflow file is included at `.github/workflows/gh-pages.yml`. When you push to the `main` branch the workflow will:

- install dependencies,
- run `npm run build`,
- add `dist/.nojekyll`, and
- publish the `dist` folder to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

To use Actions, simply push your changes to `main` and watch the workflow run in the repository's Actions tab. After the workflow completes, your site will be available under GitHub Pages (it can take a few minutes to appear).

### Important security note

GitHub Pages sites are publicly accessible. Remove any sensitive files or credentials from the repository before publishing.

---

If you'd like, I can run the quick `npm run deploy` for you now (this will push the `gh-pages` branch), or I can leave deployment to the GitHub Actions workflow — tell me which you prefer.
