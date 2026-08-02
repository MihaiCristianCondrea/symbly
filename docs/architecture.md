# Architecture

Symbly is a Vite-built static web application implemented with TypeScript and native Web Components. It uses a compact clean-architecture layout so browser infrastructure, application composition, feature domain rules, data adapters, and presentation components remain separate.

## Runtime boot path

1. `index.html` loads `src/main.ts` through Vite.
2. `src/main.ts` imports global styles, locates `#app`, and mounts `SymblyApp`.
3. `src/app/App.ts` imports app-wide custom elements and the centralized Material Web registration boundary, renders the shell, and connects page components to services.
4. `src/app/DataServices.ts` constructs shared infrastructure, repositories, theme state, and use cases.
5. Feature presentation components invoke use cases and render their results.

There is intentionally no second `main.ts` under `src/app`. Browser startup belongs at the source root, while `src/app` owns composition.

## Source layers

### `src/app`

Application composition and shell code lives here:

- `App.ts` renders the header, page container, symbol finder, app showcase, snackbar, and footer.
- `DataServices.ts` constructs clipboard and storage services, repositories, the theme controller, and use cases.
- `ThemeController.ts` and `ThemeMode.ts` manage persisted light, dark, and system theme preferences.
- `styles/` contains global SCSS partials and the style entrypoint.

### `src/core`

Core code provides foundations that are shared across features:

- `clipboard/` contains browser clipboard infrastructure.
- `storage/` contains browser local-storage infrastructure.
- `components/` contains app-wide custom elements such as the header, footer, snackbar, and page container.
- `material/MaterialElements.ts` centralizes Material Web custom-element registration from `@material/web`.
- `typings/` contains project-level TypeScript declarations.

### `src/features`

Each feature owns its domain, data, and presentation code.

#### `src/features/symbol-finder`

- `domain/models/` contains `SymbolItem` and symbol category types.
- `domain/repositories/` contains the `SymbolRepository` contract.
- `domain/usecases/` contains symbol searching and copying actions.
- `data/` contains the static symbol dataset and local repository adapter.
- `presentation/` contains the page, search bar, grid, and symbol card custom elements.

#### `src/features/app-showcase`

- `domain/models/` contains `AppItem`.
- `domain/repositories/` contains the `AppsRepository` contract.
- `domain/usecases/` contains `GetPromotedAppsUseCase`.
- `data/dto/`, `data/mappers/`, and `data/repositories/` contain Android apps API integration code.
- `presentation/` contains the showcase section and app card custom elements.

## Product flows

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

## Static asset boundary

Application-owned static assets are copied from `public/` into the production build:

```text
public/
├── assets/
│   ├── icons/
│   │   ├── app-icon.svg
│   │   └── maskable-icon.svg
│   └── social/
│       └── social-preview.svg
└── manifest.webmanifest
```

The web manifest and `index.html` reference these committed files. Documentation diagrams remain under `docs/` because they are not runtime application assets.

Standalone product SVGs should be files rather than TypeScript constants, data URIs, or template blobs. Inline SVG is reserved for structural cases where a component needs access to internal SVG nodes for styling, state, or animation.

## Custom-element registration rules

Custom elements are global to the page. A tag name can only be registered once, and the same constructor cannot be reused for multiple tag names. Project code must not define fake `md-*` elements as production fallbacks or load Material Web definitions from runtime CDNs. Material registrations belong in `src/core/material/MaterialElements.ts` and remain bundled imports from `@material/web`.

## Verification and delivery

`scripts/validate-project.mjs` checks entry-point ownership, required and obsolete files, production metadata, manifest asset resolution, and SVG boundaries. `npm run check` combines that validation with TypeScript and the Vite production build.

Pull requests and pushes to `master` run `.github/workflows/ci.yml`. The Pages workflow repeats the same gate before uploading and deploying `dist/`, ensuring review and production use the same build path.
