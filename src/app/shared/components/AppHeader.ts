import '@material/web/iconbutton/icon-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import type { ThemeController } from '../../theme/ThemeController';
import { themeModes, type ThemeMode } from '../../theme/ThemeMode';

interface HeaderLink {
  label: string;
  href: string;
}

const policyLinks: HeaderLink[] = [
  {
    label: 'Privacy Policy',
    href: 'https://mihaicristiancondrea.github.io/profile/#privacy-policy',
  },
  {
    label: 'Code of Conduct',
    href: 'https://mihaicristiancondrea.github.io/profile/#code-of-conduct',
  },
];

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
          <div class="theme-control" aria-label="Theme controls">
            <span class="material-symbol theme-icon" aria-hidden="true">${mode === 'dark' ? 'dark_mode' : mode === 'light' ? 'light_mode' : 'brightness_auto'}</span>
            <md-outlined-select class="theme-menu" aria-label="Choose theme mode" value="${mode}">
              ${themeModes.map((themeMode) => `
                <md-select-option value="${themeMode}" ${themeMode === mode ? 'selected' : ''}>
                  <div slot="headline">${this.label(themeMode)}</div>
                </md-select-option>
              `).join('')}
            </md-outlined-select>
          </div>
          <md-outlined-select class="policy-menu" aria-label="Open site links" placeholder="Links" value="">
            ${policyLinks.map((link) => this.renderPolicyOption(link)).join('')}
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

    const policySelect = this.querySelector('md-outlined-select.policy-menu') as HTMLElement & { value?: string };
    policySelect?.addEventListener('change', () => {
      const href = policySelect.value ?? '';
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
        policySelect.value = '';
      }
    });
  }

  private renderPolicyOption(link: HeaderLink): string {
    return `
      <md-select-option value="${link.href}">
        <div slot="headline">${link.label}</div>
      </md-select-option>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
