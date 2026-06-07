import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
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
    icon: 'privacy_tip',
  },
  {
    label: 'Code of Conduct',
    href: 'https://mihaicristiancondrea.github.io/profile/#code-of-conduct',
    icon: 'verified_user',
  },
];

const themeIcons: Record<ThemeMode, string> = {
  system: 'brightness_auto',
  light: 'light_mode',
  dark: 'dark_mode',
};

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
          <div class="menu-control theme-control">
            <md-icon-button
              id="themeMenuButton"
              class="header-menu-button"
              aria-label="Choose theme mode: ${this.label(mode)}"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span class="material-symbol" aria-hidden="true">${themeIcons[mode]}</span>
            </md-icon-button>
            <md-menu anchor="themeMenuButton" class="header-menu theme-menu" aria-label="Theme menu">
              ${themeModes.map((themeMode) => this.renderThemeItem(themeMode, mode)).join('')}
            </md-menu>
          </div>
          <div class="menu-control policy-control">
            <md-icon-button
              id="policyMenuButton"
              class="header-menu-button"
              aria-label="Open Privacy Policy and Code of Conduct menu"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span class="material-symbol" aria-hidden="true">more_vert</span>
            </md-icon-button>
            <md-menu anchor="policyMenuButton" class="header-menu policy-menu" aria-label="Privacy Policy and Code of Conduct menu">
              ${policyLinks.map((link) => this.renderPolicyItem(link)).join('')}
            </md-menu>
          </div>
        </div>
      </header>
    `;

    const themeButton = this.querySelector('#themeMenuButton') as HTMLElement;
    const themeMenu = this.querySelector('md-menu.theme-menu') as HTMLElement & { open?: boolean };
    themeButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      themeMenu.open = !themeMenu.open;
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[data-theme-mode]').forEach((item) => {
      item.addEventListener('click', () => {
        const nextMode = (item.dataset.themeMode ?? 'system') as ThemeMode;
        this.themeController?.setMode(nextMode);
        this.render();
      });
    });

    const policyButton = this.querySelector('#policyMenuButton') as HTMLElement;
    const policyMenu = this.querySelector('md-menu.policy-menu') as HTMLElement & { open?: boolean };
    policyButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      policyMenu.open = !policyMenu.open;
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[data-href]').forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.dataset.href ?? '';
        if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  private renderThemeItem(themeMode: ThemeMode, selectedMode: ThemeMode): string {
    const selected = themeMode === selectedMode;
    return `
      <md-menu-item data-theme-mode="${themeMode}" aria-checked="${selected}">
        <span class="material-symbol menu-item-icon" aria-hidden="true">${themeIcons[themeMode]}</span>
        <span>${this.label(themeMode)}</span>
        ${selected ? '<span class="material-symbol menu-item-check" aria-hidden="true">check</span>' : ''}
      </md-menu-item>
    `;
  }

  private renderPolicyItem(link: HeaderLink): string {
    return `
      <md-menu-item data-href="${link.href}">
        <span class="material-symbol menu-item-icon" aria-hidden="true">${link.icon}</span>
        <span>${link.label}</span>
      </md-menu-item>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
