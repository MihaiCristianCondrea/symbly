import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
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
  open: boolean;
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

  private readonly handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') {
      return;
    }

    this.closeMenus();
  };

  configure(themeController: ThemeController): void {
    this.themeController = themeController;
    if (this.isConnected) {
      this.render();
    }
  }

  connectedCallback(): void {
    document.addEventListener('keydown', this.handleDocumentKeydown);
    this.render();
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleDocumentKeydown);
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
            <md-filled-tonal-button
              id="themeMenuButton"
              class="theme-menu-button"
              trailing-icon
              aria-label="Choose theme mode: ${this.label(mode)}"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls="themeMenu"
            >
              ${this.label(mode)}
              <md-icon slot="icon">expand_more</md-icon>
            </md-filled-tonal-button>
            <md-menu
              id="themeMenu"
              anchor="themeMenuButton"
              class="theme-menu"
              aria-label="Theme menu"
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
              aria-controls="policyMenu"
            >
              <md-icon>more_vert</md-icon>
            </md-icon-button>
            <md-menu
              id="policyMenu"
              anchor="policyMenuButton"
              class="policy-menu"
              aria-label="Privacy Policy and Code of Conduct menu"
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
        this.closeMenus();
        this.themeController?.setMode(nextMode);
        this.render();
      });
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[href]').forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.getAttribute('href') ?? '';
        if (href) {
          this.closeMenus();
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

    const setButtonState = (isOpen: boolean) => {
      button.setAttribute('aria-expanded', String(isOpen));
      button.toggleAttribute('data-menu-open', isOpen);
    };

    menu.addEventListener('closed', () => setButtonState(false));
    setButtonState(menu.open);

    button.addEventListener('click', () => {
      const shouldOpen = !menu.open;

      this.setMenuOpen(siblingMenu, false);
      this.setMenuOpen(menu, shouldOpen);
      setButtonState(shouldOpen);
    });

    button.addEventListener('keydown', (event) => {
      const opensMenu = ['Enter', ' ', 'ArrowDown'].includes(event.key);
      if (!opensMenu) {
        return;
      }

      event.preventDefault();

      this.setMenuOpen(siblingMenu, false);
      this.setMenuOpen(menu, true);
      setButtonState(true);
    });
  }

  private setMenuOpen(menu: HeaderMenuElement | null, nextOpen: boolean): void {
    if (!menu) {
      return;
    }

    menu.open = nextOpen;

    const trigger = this.querySelector<HTMLElement>(`#${menu.getAttribute('anchor') ?? ''}`);
    trigger?.setAttribute('aria-expanded', String(nextOpen));
    trigger?.toggleAttribute('data-menu-open', nextOpen);
  }

  private closeMenus(): void {
    this.querySelectorAll<HeaderMenuElement>('md-menu').forEach((menu) => {
      this.setMenuOpen(menu, false);
    });
  }

  private renderThemeItem(themeMode: ThemeMode, selectedMode: ThemeMode): string {
    const selected = themeMode === selectedMode;
    return `
      <md-menu-item type="menuitemradio" data-theme-mode="${themeMode}" aria-checked="${selected}" ${selected ? 'selected' : ''}>
        <md-icon slot="start">${themeIcons[themeMode]}</md-icon>
        <div slot="headline">${this.label(themeMode)}</div>
        ${selected ? '<md-icon slot="end">check</md-icon>' : ''}
      </md-menu-item>
    `;
  }

  private renderPolicyItem(link: HeaderLink): string {
    return `
      <md-menu-item href="${link.href}" target="_blank">
        <md-icon slot="start">${link.icon}</md-icon>
        <div slot="headline">${link.label}</div>
      </md-menu-item>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
