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

## SEO, social metadata, and PWA files

Symbly includes production-oriented metadata in `index.html`:

- Browser title: `Symbly - Search Any Symbol`.
- Meta description and robots directives for search engines.
- Open Graph and Twitter/X card tags for social previews.
- JSON-LD structured data using the `WebApplication` schema.
- A canonical URL placeholder and social preview URL placeholder.

Before publishing, replace every `https://example.github.io/symbly/` value in `index.html` with the final deployed URL. Update the `og:image` and `twitter:image` tags in the same file if the social preview file or domain changes.

The PWA manifest lives at `public/manifest.webmanifest` and is linked from `index.html`. It uses relative icon paths so the generated `dist/` output works under the GitHub Pages `/symbly/` subpath.

### Icon requirements

Do not commit generated binary icon files unless they are final production assets. Create the following PNG files when the final icon artwork is ready:

- `/workspace/symbly/public/icons/icon-192.png` — 192×192 PNG app icon.
- `/workspace/symbly/public/icons/icon-512.png` — 512×512 PNG app icon.
- `/workspace/symbly/public/icons/maskable-icon-192.png` — 192×192 PNG maskable app icon with safe-zone padding.
- `/workspace/symbly/public/icons/maskable-icon-512.png` — 512×512 PNG maskable app icon with safe-zone padding.
- `/workspace/symbly/public/favicon.ico` — optional ICO favicon for older browsers.

The current SVG favicon is `public/favicon.svg`, and the current SVG social preview is `public/social-preview.svg`. Recommended final icon direction: a simple Material 3 rounded mark using money-themed green and gold colors, with a symbol-related glyph such as `§`, `€`, `✦`, or a stylized `S`. Verify the icon remains legible in light and dark contexts.

## Deployment notes for GitHub Pages

The Vite `base` path is configured as `/symbly/` in `vite.config.js` because GitHub Pages usually serves a repository named `symbly` at `https://<github-user>.github.io/symbly/`. For GitHub Pages:

1. Run `npm run build`.
2. Publish the generated `dist/` directory to GitHub Pages.
3. If the repository name changes, update the `base` value in `vite.config.js` to match the deployed path, including leading and trailing slashes.
4. If deploying to a custom domain at the domain root, change `base` in `vite.config.js` to `/` and update the canonical, Open Graph, Twitter/X, and JSON-LD URLs in `index.html`.
5. After deployment, confirm `manifest.webmanifest`, `favicon.svg`, `social-preview.svg`, and the future icon PNGs load at the deployed URL.

## Future ideas

- Add favorite and recently copied symbols.
- Add keyboard shortcuts for faster search and copy.
- Expand the symbol dataset with more Unicode categories.
- Add category chips and advanced filters.
- Add offline-friendly caching for the app showcase.
- Improve accessibility testing and visual regression coverage.
