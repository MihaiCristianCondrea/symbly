import '@material/web/iconbutton/icon-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import type { ThemeController } from '../../theme/ThemeController';
import { themeModes, type ThemeMode } from '../../theme/ThemeMode';

export class AppHeader extends HTMLElement {
  private themeController?: ThemeController;

  configure(themeController: ThemeController): void {
    this.themeController = themeController;
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    const mode = this.themeController?.getMode() ?? 'system';
    this.innerHTML = `
      <header class="app-header">
        <a class="brand" href="#app" aria-label="Symbly home">
          <span class="brand-mark">$</span>
          <span>
            <strong>Symbly</strong>
            <small>Search any symbol</small>
          </span>
        </a>
        <label class="theme-select">
          <span>Theme</span>
          <select aria-label="Choose theme mode">
            ${themeModes.map((themeMode) => `<option value="${themeMode}" ${themeMode === mode ? 'selected' : ''}>${this.label(themeMode)}</option>`).join('')}
          </select>
        </label>
      </header>
    `;

    this.querySelector('select')?.addEventListener('change', (event) => {
      const nextMode = (event.target as HTMLSelectElement).value as ThemeMode;
      this.themeController?.setMode(nextMode);
    });
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
