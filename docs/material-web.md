# Material Web Usage

This project uses Material Web for buttons, icon buttons, icons, menus, chips, text fields, and progress indicators. Material Web is installed as an npm dependency and bundled by Vite; production code must not dynamically import Material modules from a runtime CDN.

## Import contract

`src/core/material/MaterialElements.ts` is the single import boundary for Material element definitions. Import that module from the app shell before rendering components that use `md-*` tags.

Approved imports currently registered there:

```ts
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/textfield/outlined-text-field.js';
```

Do not reintroduce component-level Material imports or `import(/* @vite-ignore */ "https://...")` for Material components. Runtime CDN imports make local builds less reproducible and can evaluate shared internals more than once.

## Components in use

- `md-filled-tonal-button`
- `md-outlined-button`
- `md-text-button`
- `md-chip-set`
- `md-filter-chip`
- `md-icon`
- `md-icon-button`
- `md-menu`
- `md-menu-item`
- `md-circular-progress`
- `md-outlined-text-field`

## Buttons and links

Material button docs expose `href` and `target` properties for link-button behavior. Use a single Material button element with `href`/`target` when an action navigates away. Do not wrap a Material button in an `<a>` tag, and do not put an anchor inside a button.

Correct pattern:

```html
<md-outlined-button href="https://example.com" target="_blank" aria-label="Open example">
  <md-icon slot="icon">open_in_new</md-icon>
  Open
</md-outlined-button>
```

Use the same pattern for `md-icon-button` links. Do not wrap an icon button in an anchor.

## Icon buttons and favorite actions

Icon buttons usually have no visible text label. Material's icon-button accessibility guidance calls for an `aria-label` when the label needs to be more descriptive. Every standalone icon button in this project must have an accessible label.

## Text fields and chips

Text fields should provide a meaningful `label`, appropriate `type`, and relevant browser hints such as `autocomplete`. Symbol category filtering uses Material filter chips inside a chip set; keep chip semantics aligned with the current selected category state.

The symbol search field is intentionally fully rounded. Preserve that shape with supported Material Web text-field tokens such as `--md-outlined-text-field-container-shape`, not by adding direct border-radius, padding, height, or internal-layout overrides to the Material element.

## Theming

The app themes Material controls with CSS custom properties in `src/app/styles/_material-web.scss`, including outlined text-field, filter-chip, icon-button, menu, and filled-tonal-button tokens. Prefer token overrides in app styles over imperative style changes in TypeScript.

## Fallback policy

Do not implement production fallbacks by registering local classes under official `md-*` tag names. The browser's custom-element registry rejects duplicate names and reused constructors, and partial local clones can drift from Material's accessibility and form behavior. If Material cannot be installed or bundled, fail the build rather than shipping a runtime fake implementation.

## References

- Material Web quick start: https://github.com/material-components/material-web/blob/main/docs/quick-start.md
- Material Web buttons: https://github.com/material-components/material-web/blob/main/docs/components/button.md
- Material Web icon buttons: https://github.com/material-components/material-web/blob/main/docs/components/icon-button.md
- Material Web text fields: https://github.com/material-components/material-web/blob/main/docs/components/text-field.md
- Local reference-source policy: ./references.md
