## 📖 Docs

### How to: Create Components

*tldr: Create a native custom element class, register it once, and import it from the app or feature shell that renders it.*

1. Create a TypeScript file in the relevant `presentation/` folder for feature UI, or in `src/core/components/` for app-wide UI.
2. Extend `HTMLElement` and implement rendering/event wiring in the element class.
3. Register the element with `customElements.define('your-tag-name', YourElement)` after checking that the tag is not already registered when needed.
4. Import the component from the parent component or app shell before rendering its tag.

Examples:

- `src/features/symbol-finder/presentation/SymbolFinderPage.ts`
- `src/features/app-showcase/presentation/AppShowcaseSection.ts`
- `src/core/components/AppHeader.ts`

### How to: Add Feature Logic

*tldr: Put domain rules in `domain/`, data adapters in `data/`, and UI in `presentation/`.*

Feature folders live under `src/features/<feature-name>/` and use this structure:

- `domain/models/` for feature types.
- `domain/repositories/` for repository contracts.
- `domain/usecases/` for application actions.
- `data/dto/` for remote DTOs, when needed.
- `data/mappers/` for mapping remote DTOs to domain models, when needed.
- `data/repositories/` for repository implementations.
- `presentation/` for custom elements.

### How to: Wire Dependencies

*tldr: Add composition wiring to `src/app/DataServices.ts`, then pass dependencies from `src/app/App.ts` into custom elements.*

1. Define domain contracts and use cases in the feature folder.
2. Implement local or remote adapters in `data/`.
3. Instantiate shared services, repositories, and use cases in `DataServices`.
4. Configure the relevant presentation component from `SymblyApp` after the component is rendered.

### How to: Use Material Web

*tldr: Register Material elements in `src/core/material/MaterialElements.ts` and use supported attributes, slots, and design tokens.*

- Add new `@material/web` element imports to `src/core/material/MaterialElements.ts`.
- Import `src/core/material/MaterialElements.ts` from the app shell, not from each component.
- Do not import Material Web from a runtime CDN.
- Do not register fake fallback elements under `md-*` tag names.
- Prefer CSS custom properties in `src/app/styles/_material-web.scss` for theming.

### How to: Manage Theme State

Theme state is handled by `src/app/ThemeController.ts` and persisted through `src/core/storage/LocalStorageService.ts`. UI controls should call `ThemeController.setMode(...)` rather than writing directly to storage or the document root.

### How to: Copy Symbols

Copy behavior flows through `CopySymbolUseCase`, which depends on `ClipboardService`. UI components should call the use case and display success/failure state rather than using `navigator.clipboard` directly.
