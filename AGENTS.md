# Repository Instructions

## Project overview

Symbly is a static Vite application for searching, browsing, and copying common symbols. It is built with TypeScript, native Web Components, Material Web from `@material/web`, and SCSS/CSS custom properties.

## Application source

Production application code lives in `src/`.

- `src/main.ts` is the only browser entry point. It imports global styles, locates `#app`, and mounts `SymblyApp`.
- `src/app/App.ts` renders the application shell and connects presentation components to configured services.
- `src/app/DataServices.ts` is the composition root for shared services, repositories, and use cases.
- `src/app/ThemeController.ts` and `src/app/ThemeMode.ts` manage persisted light, dark, and system theme preferences.
- `src/app/styles/` contains global SCSS partials and the style entrypoint.
- `src/core/` contains app-wide browser infrastructure, shared components, Material registration, storage, and project typings.
- `src/features/` contains feature-specific `data`, `domain`, and `presentation` layers.

Do not add another entry point under `src/app`. Application composition belongs there, but browser startup remains in `src/main.ts`.

## Feature structure

Feature code follows a small clean-architecture layout:

- `domain/models/` contains feature models and value types.
- `domain/repositories/` contains repository interfaces.
- `domain/usecases/` contains application actions and domain-facing orchestration.
- `data/dto/` contains remote DTOs when needed.
- `data/mappers/` maps transport data into domain models.
- `data/repositories/` contains local, browser, or API-backed repository implementations.
- `presentation/` contains custom elements and UI-specific behavior.

Keep app-wide infrastructure in `src/core`, application composition in `src/app`, and feature-specific behavior in the matching `src/features/<feature-name>` directory.

## Material Web imports and styling

Material Web is consumed from `@material/web` and bundled by Vite. Keep custom-element registration centralized in `src/core/material/MaterialElements.ts` unless a deliberate second registration boundary is required. Do not load Material Web definitions from runtime CDNs.

Do not register local fallback classes with official `md-*` tag names. If a Material component cannot be installed or bundled, fail validation rather than shipping an imitation.

Do not override unsupported Material Web internals such as shadow DOM structure, component geometry, ripple behavior, or animation. Prefer documented attributes, slots, and CSS custom properties. Keep global Material token customization under `src/app/styles/`.

Standalone icon buttons require accessible labels. Use Material button link support for link-like controls instead of nesting anchors and buttons.

## Static assets

Runtime assets live under `public/` and are copied to `dist/` by Vite.

- Product icons belong in `public/assets/icons/`.
- Social and sharing artwork belongs in `public/assets/social/`.
- The web manifest lives at `public/manifest.webmanifest` and must reference committed files.
- Documentation diagrams remain under `docs/`; they are not runtime branding assets.

Standalone product SVGs must be committed as files. Do not embed SVG data URIs or standalone `<svg>` blobs in application TypeScript, HTML templates, SCSS, or CSS. Structural SVG markup may remain beside a component only when its internal nodes are required for component behavior or animation.

When asset paths change, update `index.html`, `public/manifest.webmanifest`, documentation, and `scripts/validate-project.mjs` together.

## Reference-only Material Web source

The `references/` directory contains external Material Web source snapshots for research and API inspection only.

- Do not edit files under `references/`.
- Do not import, bundle, or execute code from `references/`.
- Do not copy reference code blindly into production source.
- Consume Material Web through npm imports from `@material/web`.

## CI/CD and deployment

- `.github/workflows/ci.yml` validates pull requests and pushes to `master`.
- `.github/workflows/deploy.yml` verifies and deploys `dist/` to GitHub Pages.
- Both workflows use Node.js 22, `npm ci`, and `npm run check`.
- `vite.config.js` owns the `/symbly/` Pages base path.

If the deployment host or base path changes, update Vite configuration, canonical and social metadata, manifest assumptions, and README deployment notes in the same change.

## Documentation

Documentation lives in `docs/`. Keep it synchronized with the `src/app`, `src/core`, and `src/features` boundaries, public asset layout, validation rules, and deployment workflow.

## Commands

- `npm run dev` starts the Vite development server.
- `npm run validate` checks structure, public assets, metadata, manifest paths, and SVG boundaries.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` type-checks and creates `dist/`.
- `npm run check` runs the complete validation and production-build gate.
- `npm run preview` previews the generated site.

Run `npm run check` before opening or merging a pull request.
