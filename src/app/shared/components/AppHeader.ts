import '@material/web/iconbutton/icon-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import type { ThemeController } from '../../theme/ThemeController';
import { themeModes, type ThemeMode } from '../../theme/ThemeMode';

interface HeaderLink {
  label: string;
  href: string;
  icon: string;
}

const policyLinks: HeaderLink[] = [
  {
    label: 'Privacy Policy',
    href: 'https://mihaicristiancondrea.github.io/profile/#privacy-policy',
    icon: 'policy',
  },
  {
    label: 'Code of Conduct',
    href: 'https://mihaicristiancondrea.github.io/profile/#code-of-conduct',
    icon: 'verified_user',
  },
];

export class AppHeader extends HTMLElement {
  private themeController?: ThemeController;
  private outsideClickController?: AbortController;

  configure(themeController: ThemeController): void {
    this.themeController = themeController;
    if (this.isConnected) {
      this.render();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.outsideClickController?.abort();
  }

  private render(): void {
    this.outsideClickController?.abort();
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
          <div class="policy-menu-wrap">
            <md-icon-button class="policy-menu-button" aria-label="Open site links" aria-haspopup="menu" aria-expanded="false">
              <span class="material-symbol" aria-hidden="true">more_vert</span>
            </md-icon-button>
            <nav class="policy-menu" aria-label="Site links" role="menu" hidden>
              ${policyLinks.map((link) => this.renderPolicyLink(link)).join('')}
            </nav>
          </div>
        </div>
      </header>
    `;

    const select = this.querySelector('md-outlined-select') as HTMLElement & { value?: ThemeMode };
    select?.addEventListener('change', () => {
      const nextMode = (select.value ?? select.getAttribute('value') ?? 'system') as ThemeMode;
      this.themeController?.setMode(nextMode);
      this.render();
    });

    const menuButton = this.querySelector('.policy-menu-button') as HTMLElement | null;
    const menu = this.querySelector('.policy-menu') as HTMLElement | null;
    menuButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menu?.hasAttribute('hidden') ?? true;
      this.setPolicyMenuOpen(open);
    });

    menu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.setPolicyMenuOpen(false));
    });

    this.outsideClickController = new AbortController();
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target as Node)) {
        this.setPolicyMenuOpen(false);
      }
    }, { signal: this.outsideClickController.signal });
  }

  private renderPolicyLink(link: HeaderLink): string {
    return `
      <a href="${link.href}" target="_blank" rel="noopener noreferrer" role="menuitem">
        <span class="material-symbol" aria-hidden="true">${link.icon}</span>
        <span>${link.label}</span>
      </a>
    `;
  }

  private setPolicyMenuOpen(open: boolean): void {
    const menuButton = this.querySelector('.policy-menu-button') as HTMLElement | null;
    const menu = this.querySelector('.policy-menu') as HTMLElement | null;
    menu?.toggleAttribute('hidden', !open);
    menuButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
