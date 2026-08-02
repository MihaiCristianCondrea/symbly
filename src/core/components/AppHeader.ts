import type { ThemeController } from '../../app/ThemeController';
import { themeModes, type ThemeMode } from '../../app/ThemeMode';

interface HeaderLink {
  label: string;
  href: string;
  icon: string;
}

interface NavigationDrawerElement extends HTMLElement {
  opened: boolean;
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
    if (event.key === 'Escape') {
      this.toggleDrawer(false);
    }
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
      <div id="drawerLayer" class="drawer-layer" aria-hidden="true">
        <md-navigation-drawer-modal
          id="appDrawer"
          class="app-drawer"
          pivot="start"
          aria-label="Application menu"
          aria-modal="true"
        >
          <div class="drawer-header">
            <h2>Symbly</h2>
            <md-icon-button id="drawerClose" type="button" aria-label="Close menu">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div class="drawer-content">
            <a class="drawer-home" href="#app">
              <md-item class="drawer-item">
                <span class="drawer-item-container" slot="container" aria-hidden="true"></span>
                <md-icon slot="start">home</md-icon>
                Home
              </md-item>
            </a>
            <p class="drawer-section-label">Theme</p>
            ${themeModes.map((themeMode) => this.renderThemeItem(themeMode, mode)).join('')}
            <div class="drawer-spacer"></div>
            <p class="drawer-section-label">About</p>
            ${policyLinks.map((link) => this.renderPolicyItem(link)).join('')}
          </div>
        </md-navigation-drawer-modal>
      </div>
      <header class="app-header">
        <div class="topbar-title">
          <md-icon-button
            id="drawerOpen"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="appDrawer"
          >
            <md-icon id="drawerOpenIcon">menu</md-icon>
          </md-icon-button>
          <a class="brand" href="#app" aria-label="Symbly home">
            <strong>Symbly</strong>
          </a>
        </div>
      </header>
    `;

    this.querySelector('#drawerOpen')?.addEventListener('click', () => this.toggleDrawer());
    this.querySelector('#drawerClose')?.addEventListener('click', () => this.toggleDrawer(false));
    this.querySelector<NavigationDrawerElement>('#appDrawer')?.addEventListener(
      'navigation-drawer-changed',
      (event) => this.syncDrawerState((event as CustomEvent<{ opened: boolean }>).detail.opened),
    );
    this.querySelector('.drawer-home')?.addEventListener('click', () => this.toggleDrawer(false));

    this.querySelectorAll<HTMLElement>('[data-theme-mode]').forEach((item) => {
      item.addEventListener('click', () => {
        const nextMode = (item.dataset.themeMode ?? 'system') as ThemeMode;
        this.themeController?.setMode(nextMode);
        this.toggleDrawer(false);
        this.render();
      });
    });

    this.querySelectorAll<HTMLElement>('[data-href]').forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.dataset.href ?? '';
        if (!href) {
          return;
        }

        this.toggleDrawer(false);
        window.open(href, '_blank', 'noopener,noreferrer');
      });
    });
  }

  private toggleDrawer(forceOpen?: boolean): void {
    const drawer = this.querySelector<NavigationDrawerElement>('#appDrawer');
    if (!drawer) {
      return;
    }

    const isOpen = forceOpen ?? !drawer.opened;
    drawer.opened = isOpen;
    this.syncDrawerState(isOpen);
  }

  private syncDrawerState(isOpen: boolean): void {
    const drawerLayer = this.querySelector<HTMLElement>('#drawerLayer');
    drawerLayer?.classList.toggle('open', isOpen);
    drawerLayer?.setAttribute('aria-hidden', String(!isOpen));

    const trigger = this.querySelector<HTMLElement>('#drawerOpen');
    trigger?.setAttribute('aria-expanded', String(isOpen));
    trigger?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    const triggerIcon = this.querySelector('#drawerOpenIcon');
    if (triggerIcon) {
      triggerIcon.textContent = isOpen ? 'menu_open' : 'menu';
    }
  }

  private renderThemeItem(themeMode: ThemeMode, selectedMode: ThemeMode): string {
    const selected = themeMode === selectedMode;
    return `
      <md-item
        class="drawer-item"
        data-theme-mode="${themeMode}"
        role="button"
        tabindex="0"
        aria-pressed="${selected}"
        ${selected ? 'data-active' : ''}
      >
        <span class="drawer-item-container" slot="container" aria-hidden="true"></span>
        <md-icon slot="start">${themeIcons[themeMode]}</md-icon>
        ${this.label(themeMode)}
        ${selected ? '<md-icon slot="end">check</md-icon>' : ''}
      </md-item>
    `;
  }

  private renderPolicyItem(link: HeaderLink): string {
    return `
      <md-item
        class="drawer-item"
        data-href="${link.href}"
        role="link"
        tabindex="0"
      >
        <span class="drawer-item-container" slot="container" aria-hidden="true"></span>
        <md-icon slot="start">${link.icon}</md-icon>
        ${link.label}
        <md-icon slot="end">open_in_new</md-icon>
      </md-item>
    `;
  }

  private label(mode: ThemeMode): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

customElements.define('app-header', AppHeader);
