# Symbly

Symbly is a lightweight Material 3 web app for searching, finding, and copying common symbols. It focuses on fast access to symbols such as €, $, £, ¥, ©, ™, ✓, →, mathematical operators, punctuation, arrows, currency symbols, and Unicode-style marks.

**Tagline:** Search any symbol

## Features

- Search symbols by the glyph itself, name, aliases, or category.
- Browse popular symbols before entering a search query.
- Copy a symbol by clicking its card or the copy button.
- Material 3-inspired interface with money-themed greens, golds, and warm neutrals.
- Light, dark, and system theme modes.
- Theme preference persisted in `localStorage`.
- “More apps from Mihai-Cristian” showcase that loads app data from the public Android apps API.
- Graceful loading and error states for remote recommendations.
- Static, no-backend architecture.

## Tech stack

- TypeScript
- Vite
- Material Web Components from `@material/web`
- Web Components
- CSS custom properties for Material-style theme tokens

## Architecture overview

The app uses a practical clean architecture layout for a small static web app:

```text
src/
  app/
    main.ts
    app.ts
    theme/
      ThemeController.ts
      ThemeMode.ts
    core/
      clipboard/
        ClipboardService.ts
      storage/
        LocalStorageService.ts
    features/
      symbolFinder/
        domain/
        data/
        presentation/
      appShowcase/
        domain/
        data/
        presentation/
    shared/
      components/
```

### Symbol finder flow

```text
SymbolFinderPage
→ SearchSymbolsUseCase / CopySymbolUseCase
→ SymbolRepository / ClipboardService
→ LocalSymbolRepository / browser clipboard
```

### App showcase flow

```text
AppShowcaseSection
→ GetPromotedAppsUseCase
→ AppsRepository
→ RemoteAppsRepository
→ Android apps API
```

## Development commands

Install dependencies:

```bash
npm install
```

Start the local Vite dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment notes for GitHub Pages

The Vite `base` path is configured as `/symbly/` in `vite.config.js`. For GitHub Pages:

1. Run `npm run build`.
2. Publish the generated `dist/` directory to GitHub Pages.
3. If the repository name changes, update the `base` value in `vite.config.js` to match the deployed path.

## Future ideas

- Add favorite and recently copied symbols.
- Add keyboard shortcuts for faster search and copy.
- Expand the symbol dataset with more Unicode categories.
- Add category chips and advanced filters.
- Add offline-friendly caching for the app showcase.
- Improve accessibility testing and visual regression coverage.
