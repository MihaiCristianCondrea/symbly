const defaultMenuItemType = 'menuitem';

class MdMenuItem extends HTMLElement {
  static get observedAttributes(): string[] { return ['type']; }

  connectedCallback(): void {
    this.syncRole();

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.syncRole();
    }
  }

  private syncRole(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.getAttribute('type') ?? defaultMenuItemType);
    }
  }
}

customElements.define('md-menu-item', MdMenuItem);
export {};
