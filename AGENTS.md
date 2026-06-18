# Repository Instructions

## Project overview

Symbly is a lightweight static Vite app for searching, browsing, and copying common symbols. It is built with TypeScript, native Web Components, Material Web components from `@material/web`, and SCSS/CSS custom properties.

## Application source

The production application source lives in `src/`. Runtime code must be implemented from project source and npm dependencies, not copied from reference snapshots.

Current source layout:

- `src/main.ts` boots the app by importing `src/app/main.ts`.
- `src/app/App.ts` is the app shell. It renders the top-level custom elements and connects them to configured services.
- `src/app/DataServices.ts` is the composition root for app services, repositories, and use cases.
- `src/app/main.ts` locates `#app`, imports global styles, and mounts `SymblyApp`.
- `src/app/ThemeController.ts` and `src/app/ThemeMode.ts` manage persisted light/dark/system theme preferences.
- `src/app/styles/` contains global SCSS partials and the style entrypoint.
- `src/core/clipboard/` contains browser clipboard infrastructure.
- `src/core/storage/` contains browser storage infrastructure.
- `src/core/components/` contains app-wide layout and chrome components such as the header, footer, snackbar, and page container.
- `src/core/material/MaterialElements.ts` is the centralized Material Web custom-element registration boundary.
- `src/core/typings/` contains Vite/client typings.
- `src/features/app-showcase/` contains the promoted-apps feature.
- `src/features/symbol-finder/` contains the main symbol search/copy feature.

## Feature structure

Feature code follows a small clean-architecture style:

- `domain/models/` contains feature models and value types.
- `domain/repositories/` contains repository interfaces.
- `domain/usecases/` contains feature use cases.
- `data/dto/` contains API DTOs when a feature consumes remote data.
- `data/mappers/` contains DTO-to-domain mapping logic.
- `data/repositories/` contains local, browser, or API-backed repository implementations.
- `presentation/` contains custom elements and UI-specific behavior.

For the current features:

- `src/features/symbol-finder/domain/models/` owns `SymbolItem` and `SymbolCategory`.
- `src/features/symbol-finder/domain/repositories/` owns `SymbolRepository`.
- `src/features/symbol-finder/domain/usecases/` owns `SearchSymbolsUseCase` and `CopySymbolUseCase`.
- `src/features/symbol-finder/data/` owns the static symbol dataset, with repository adapters in `data/repositories/`.
- `src/features/symbol-finder/presentation/` owns the page, search bar, grid, and symbol card custom elements.
- `src/features/app-showcase/domain/models/` owns `AppItem`.
- `src/features/app-showcase/domain/repositories/` owns `AppsRepository`.
- `src/features/app-showcase/domain/usecases/` owns `GetPromotedAppsUseCase`.
- `src/features/app-showcase/data/` owns Android apps API DTOs, mappers, and repository adapters.
- `src/features/app-showcase/presentation/` owns the showcase section and app card custom elements.

When adding behavior, keep app-wide infrastructure in `src/core`, application composition in `src/app`, and feature-specific domain/data/presentation code in the matching `src/features/<feature-name>` folder.

## Material Web imports and styling

Material Web is consumed from the npm package `@material/web` and bundled by Vite. Keep Material Web custom element registration centralized in `src/core/material/MaterialElements.ts` unless there is a strong reason to add a separate import boundary. Do not import Material Web modules from runtime CDNs.

Do not register local fallback classes with official `md-*` tag names. If a Material component cannot be installed or bundled, fail the build instead of shipping a fake implementation.

Do not override Material Web component internals such as shadow DOM structure, sizing, shape, padding, borders, typography, cursor, ripple, icon placement, disabled behavior, or animation in application CSS. Prefer component attributes, slots, and supported CSS custom properties/design tokens. Keep global Material token customization in `src/app/styles/_material-web.scss` or another style partial under `src/app/styles/`.

Standalone icon buttons must have accessible labels. Use Material button `href`/`target` support for link-like buttons instead of nesting anchors and buttons.

## Reference-only Material Web source

The `references/` folder is preview/research only. It contains external open-source Material Web source code for comparison, documentation, and AI context.

Rules for `references/`:

- Do not edit files under `references/`.
- Do not import, bundle, or execute code from `references/`.
- Do not copy reference code blindly into application source.
- Use the folder only to inspect implementation patterns and component APIs.
- Consume Material Web components through npm imports from `@material/web`.

## Public assets and deployment

Static assets live in `public/`. The current app uses `public/favicon.svg`, `public/social-preview.svg`, `public/manifest.webmanifest`, and documentation for future generated icons under `public/icons/`.

Deployment is configured for GitHub Pages with Vite in `vite.config.js` and `.github/workflows/deploy.yml`. If the deployed base path changes, update Vite configuration and the public URLs/metadata in `index.html` together.

## Documentation

Documentation lives in `docs/`. Keep docs synchronized with Symbly's `src/app`, `src/core`, and `src/features` layout, Material Web usage, public assets, and GitHub Pages deployment.

## Commands

Use these project commands when validating changes:

- `npm run build` — TypeScript check plus Vite production build.
- `npm run dev` — local Vite development server.
- `npm run preview` — preview the production build locally after building.
