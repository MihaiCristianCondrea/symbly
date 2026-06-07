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

interface HeaderMenuElement extends HTMLElement {
  open?: boolean;
  show?: () => void;
  close?: () => void;
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
            <md-menu
              anchor="themeMenuButton"
              class="header-menu theme-menu"
              aria-label="Theme menu"
            >
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
            <md-menu
              anchor="policyMenuButton"
              class="header-menu policy-menu"
              aria-label="Privacy Policy and Code of Conduct menu"
            >
              ${policyLinks.map((link) => this.renderPolicyItem(link)).join('')}
            </md-menu>
          </div>
        </div>
      </header>
    `;

    const themeButton = this.querySelector('#themeMenuButton') as HTMLElement;
    const themeMenu = this.querySelector('md-menu.theme-menu') as HeaderMenuElement;
    const policyMenu = this.querySelector('md-menu.policy-menu') as HeaderMenuElement;
    themeButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setMenuOpen(themeMenu, !themeMenu.open);
      this.setMenuOpen(policyMenu, false);
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[data-theme-mode]').forEach((item) => {
      item.addEventListener('click', () => {
        const nextMode = (item.dataset.themeMode ?? 'system') as ThemeMode;
        this.themeController?.setMode(nextMode);
        this.render();
      });
    });

    const policyButton = this.querySelector('#policyMenuButton') as HTMLElement;
    policyButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setMenuOpen(policyMenu, !policyMenu.open);
      this.setMenuOpen(themeMenu, false);
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[href]').forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.getAttribute('href') ?? '';
        if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  private setMenuOpen(menu: HeaderMenuElement | null, nextOpen: boolean): void {
    if (!menu) {
      return;
    }

    if (nextOpen) {
      menu.show?.();
    } else {
      menu.close?.();
    }

    if (!menu.show || !menu.close) {
      menu.open = nextOpen;
    }
  }

  private renderThemeItem(themeMode: ThemeMode, selectedMode: ThemeMode): string {
    const selected = themeMode === selectedMode;
    return `
      <md-menu-item type="menuitemradio" data-theme-mode="${themeMode}" aria-checked="${selected}">
        <span slot="start" class="material-symbol menu-item-icon" aria-hidden="true">${themeIcons[themeMode]}</span>
        <div slot="headline">${this.label(themeMode)}</div>
        ${selected ? '<span slot="end" class="material-symbol menu-item-check" aria-hidden="true">check</span>' : ''}
      </md-menu-item>
    `;
  }

  private renderPolicyItem(link: HeaderLink): string {
    return `
      <md-menu-item href="${link.href}" target="_blank">
        <span slot="start" class="material-symbol menu-item-icon" aria-hidden="true">${link.icon}</span>
        <div slot="headline">${link.label}</div>
      </md-menu-item>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
