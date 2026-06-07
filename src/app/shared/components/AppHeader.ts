import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import type { ThemeController } from '../../theme/ThemeController';
import { themeModes, type ThemeMode } from '../../theme/ThemeMode';

export class AppHeader extends HTMLElement {
  private themeController?: ThemeController;

  configure(themeController: ThemeController): void {
    this.themeController = themeController;
    if (this.isConnected) {
      this.render();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    const mode = this.themeController?.getMode() ?? 'system';
    this.innerHTML = `
      <header class="app-header">
        <a class="brand" href="#app" aria-label="Symbly home">
          <span class="brand-mark">S</span>
          <span class="brand-copy">
            <strong>Symbly</strong>
          </span>
        </a>
        <div class="header-actions">
          <span class="material-symbol theme-icon" aria-hidden="true">${mode === 'dark' ? 'dark_mode' : mode === 'light' ? 'light_mode' : 'brightness_auto'}</span>
          <md-outlined-select class="theme-menu" aria-label="Choose theme mode" value="${mode}">
            ${themeModes.map((themeMode) => `
              <md-select-option value="${themeMode}" ${themeMode === mode ? 'selected' : ''}>
                <div slot="headline">${this.label(themeMode)}</div>
              </md-select-option>
            `).join('')}
          </md-outlined-select>
        </div>
      </header>
    `;

    const select = this.querySelector('md-outlined-select') as HTMLElement & { value?: ThemeMode };
    select?.addEventListener('change', () => {
      const nextMode = (select.value ?? select.getAttribute('value') ?? 'system') as ThemeMode;
      this.themeController?.setMode(nextMode);
      this.render();
    });
    this.querySelectorAll('md-select-option').forEach((option) => {
      option.addEventListener('click', () => {
        const nextMode = option.getAttribute('value') as ThemeMode;
        this.themeController?.setMode(nextMode);
        this.render();
      });
    });
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
