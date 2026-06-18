# Architecture

Symbly is a Vite-built static web application implemented with TypeScript and native Web Components. The app follows a small clean-architecture layout so browser infrastructure, app composition, feature domain rules, data adapters, and presentation components stay separated.

## Runtime boot path

1. `src/main.ts` imports `src/app/main.ts`.
2. `src/app/main.ts` imports global styles, finds `#app`, and mounts `SymblyApp`.
3. `src/app/App.ts` imports the app-wide custom elements, imports `src/core/material/MaterialElements.ts` for bundled Material Web registrations, renders the app shell, and wires page components to services.
4. `src/app/DataServices.ts` creates shared infrastructure, repositories, and use cases.
5. Feature presentation components call use cases and render results.

## Source layers

### `src/app`

Application composition and shell code lives here:

- `App.ts` renders the header, page container, symbol finder page, app showcase section, and footer.
- `DataServices.ts` constructs clipboard/storage services, repositories, theme controller, and use cases.
- `main.ts` mounts the application.
- `ThemeController.ts` and `ThemeMode.ts` manage persisted light/dark/system theme preferences.
- `styles/` contains global SCSS partials and the style injection entrypoint.

### `src/core`

Core code provides app-wide foundations that are not specific to one feature:

- `clipboard/` contains browser clipboard infrastructure.
- `storage/` contains browser local-storage infrastructure.
- `components/` contains shared custom elements such as the header, footer, snackbar, and page container.
- `material/MaterialElements.ts` centralizes Material Web custom-element registration from `@material/web`.
- `typings/` contains project-level TypeScript declarations.

### `src/features`

Each feature owns its own domain, data, and presentation code.

#### `src/features/symbol-finder`

- `domain/models/` contains `SymbolItem` and symbol category types.
- `domain/repositories/` contains the `SymbolRepository` contract.
- `domain/usecases/` contains searching and copying use cases.
- `data/` contains the static symbol dataset and local repository adapter.
- `presentation/` contains the symbol finder page, search bar, grid, and card custom elements.

#### `src/features/app-showcase`

- `domain/models/` contains `AppItem`.
- `domain/repositories/` contains the `AppsRepository` contract.
- `domain/usecases/` contains `GetPromotedAppsUseCase`.
- `data/dto/`, `data/mappers/`, and `data/repositories/` contain Android apps API integration code.
- `presentation/` contains the app showcase section and app card custom elements.

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

## Custom-element registration rules

Custom elements are global to the page. A tag name can only be registered once, and the same constructor cannot be reused for multiple tag names. Project code must not define fake `md-*` elements as a production fallback and must not load Material Web definitions from runtime CDNs. Material registrations belong in `src/core/material/MaterialElements.ts` and should stay as bundled imports from `@material/web`.
