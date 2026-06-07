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
              aria-label="Choose theme mode: ${this.label(mode)}"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span class="material-symbol" aria-hidden="true">${themeIcons[mode]}</span>
            </md-icon-button>
            <md-menu
              anchor="themeMenuButton"
              class="theme-menu"
              aria-label="Theme menu"
              positioning="popover"
              y-offset="8"
              anchor-corner="end-start"
              menu-corner="start-end"
            >
              ${themeModes.map((themeMode) => this.renderThemeItem(themeMode, mode)).join('')}
            </md-menu>
          </div>
          <div class="menu-control policy-control">
            <md-icon-button
              id="policyMenuButton"
              aria-label="Open Privacy Policy and Code of Conduct menu"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span class="material-symbol" aria-hidden="true">more_vert</span>
            </md-icon-button>
            <md-menu
              anchor="policyMenuButton"
              class="policy-menu"
              aria-label="Privacy Policy and Code of Conduct menu"
              positioning="popover"
              y-offset="8"
              anchor-corner="end-start"
              menu-corner="start-end"
            >
              ${policyLinks.map((link) => this.renderPolicyItem(link)).join('')}
            </md-menu>
          </div>
        </div>
      </header>
    `;

    const themeButton = this.querySelector('#themeMenuButton') as HTMLElement;
    const policyButton = this.querySelector('#policyMenuButton') as HTMLElement;
    const themeMenu = this.querySelector('md-menu.theme-menu') as HeaderMenuElement;
    const policyMenu = this.querySelector('md-menu.policy-menu') as HeaderMenuElement;

    this.setupMenuControl(themeButton, themeMenu, policyMenu);
    this.setupMenuControl(policyButton, policyMenu, themeMenu);

    this.querySelectorAll<HTMLElement>('md-menu-item[data-theme-mode]').forEach((item) => {
      item.addEventListener('click', () => {
        const nextMode = (item.dataset.themeMode ?? 'system') as ThemeMode;
        this.themeController?.setMode(nextMode);
        this.render();
      });
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

  private setupMenuControl(
    button: HTMLElement | null,
    menu: HeaderMenuElement | null,
    siblingMenu: HeaderMenuElement | null,
  ): void {
    if (!button || !menu) {
      return;
    }

    const syncButtonState = () => {
      const isOpen = Boolean(menu.open);
      button.setAttribute('aria-expanded', String(isOpen));
      button.toggleAttribute('data-menu-open', isOpen);
    };

    menu.addEventListener('opened', syncButtonState);
    menu.addEventListener('closed', syncButtonState);
    syncButtonState();

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setMenuOpen(menu, !menu.open);
      this.setMenuOpen(siblingMenu, false);
    });

    button.addEventListener('keydown', (event) => {
      const opensMenu = ['ArrowDown', 'Enter', ' '].includes(event.key);
      if (!opensMenu) {
        return;
      }

      event.preventDefault();
      this.setMenuOpen(menu, true);
      this.setMenuOpen(siblingMenu, false);
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
      <md-menu-item type="menuitemradio" data-theme-mode="${themeMode}" aria-checked="${selected}" ${selected ? 'selected' : ''}>
        <span slot="start" class="material-symbol" aria-hidden="true">${themeIcons[themeMode]}</span>
        <div slot="headline">${this.label(themeMode)}</div>
        ${selected ? '<span slot="end" class="material-symbol" aria-hidden="true">check</span>' : ''}
      </md-menu-item>
    `;
  }

  private renderPolicyItem(link: HeaderLink): string {
    return `
      <md-menu-item href="${link.href}" target="_blank">
        <span slot="start" class="material-symbol" aria-hidden="true">${link.icon}</span>
        <div slot="headline">${link.label}</div>
      </md-menu-item>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
