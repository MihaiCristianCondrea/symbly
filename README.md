# Symbly

Symbly is a lightweight Material 3 web application for finding and copying symbols without digging through character maps or search results. It supports currency signs, arrows, checkmarks, mathematical operators, legal marks, punctuation, and other commonly used Unicode symbols.

**Live site:** [mihaicristiancondrea.github.io/symbly](https://mihaicristiancondrea.github.io/symbly/)

## Features

- Search by glyph, name, alias, or category.
- Browse commonly used symbols before searching.
- Copy a symbol from its card with immediate feedback.
- Light, dark, and system theme modes persisted locally.
- Material Web components bundled from `@material/web`.
- A promoted-apps section backed by the public Android apps API.
- Static hosting with no Symbly backend required.

## Technology

- TypeScript
- Vite
- Native Web Components
- Material Web
- SCSS and CSS custom properties
- GitHub Actions and GitHub Pages

## Project structure

```text
.
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── app-icon.svg
│   │   │   └── maskable-icon.svg
│   │   └── social/
│   │       └── social-preview.svg
│   └── manifest.webmanifest
├── scripts/
│   └── validate-project.mjs
├── src/
│   ├── app/
│   │   ├── App.ts
│   │   ├── DataServices.ts
│   │   ├── ThemeController.ts
│   │   ├── ThemeMode.ts
│   │   └── styles/
│   ├── core/
│   │   ├── clipboard/
│   │   ├── components/
│   │   ├── material/
│   │   ├── storage/
│   │   └── typings/
│   ├── features/
│   │   ├── app-showcase/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   └── symbol-finder/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   └── main.ts
├── index.html
├── package.json
└── vite.config.js
```

`src/main.ts` is the single browser entry point. It imports global styles, locates `#app`, and mounts `SymblyApp`. Application composition stays in `src/app`, shared browser infrastructure stays in `src/core`, and feature code owns its `data`, `domain`, and `presentation` layers under `src/features`.

The `references/` directory contains external Material Web source snapshots for research only. It is not imported, bundled, or edited as part of the application.

## Getting started

Vite 8 requires a recent Node.js release. Node.js 22 is the recommended development and CI runtime for this repository.

```bash
npm ci
npm run dev
```

The local Vite server will print the development URL.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run validate` | Check project structure, public assets, manifest paths, production metadata, and SVG boundaries. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run build` | Type-check and produce the production site in `dist/`. |
| `npm run check` | Run validation, TypeScript, and the production build. |
| `npm run preview` | Preview the generated `dist/` site locally. |

Use `npm run check` before opening or merging a pull request.

## Asset organization

Application-owned static artwork is served from `public/assets`:

- `public/assets/icons/app-icon.svg` is used by the browser and web manifest.
- `public/assets/icons/maskable-icon.svg` provides a safe-zone PWA icon.
- `public/assets/social/social-preview.svg` is used by Open Graph and Twitter/X metadata.
- `public/manifest.webmanifest` references only committed assets.

Documentation diagrams remain under `docs/` because they are not runtime application assets. Standalone product SVGs should not be embedded as data URIs or copied into TypeScript, HTML templates, or stylesheets. Interactive markup that genuinely depends on internal SVG nodes may remain colocated with its component.

## Architecture

### Symbol finder

```text
SymbolFinderPage
→ SearchSymbolsUseCase / CopySymbolUseCase
→ SymbolRepository / ClipboardService
→ LocalSymbolRepository / browser clipboard
```

### App showcase

```text
AppShowcaseSection
→ GetPromotedAppsUseCase
→ AppsRepository
→ RemoteAppsRepository
→ Android apps API
```

Material Web registration is centralized in `src/core/material/MaterialElements.ts`. Application code must not create fallback components using official `md-*` tag names or load Material Web definitions from runtime CDNs.

More detail is available in [docs/architecture.md](docs/architecture.md) and [docs/documentation.md](docs/documentation.md).

## CI/CD

The repository uses two GitHub Actions workflows:

- **CI** runs on pull requests and pushes to `master`. It installs dependencies with `npm ci` and runs `npm run check`.
- **Deploy site** runs on `master` and manual dispatch. It repeats the same verification gate, uploads `dist/`, and deploys it to GitHub Pages.

The Vite base path is `/symbly/`. Update `vite.config.js`, canonical metadata, social URLs, and manifest assumptions together if the repository name or deployment host changes.
