const defaultMenuItemType = 'menuitem';

class MdMenuItem extends HTMLElement {
  static get observedAttributes(): string[] { return ['disabled', 'type']; }

  connectedCallback(): void {
    this.syncRole();
    this.syncDisabled();

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }

    this.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleKeydown);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.syncRole();
      this.syncDisabled();
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.hasAttribute('disabled')) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  private syncRole(): void {
    this.setAttribute('role', this.getAttribute('type') ?? defaultMenuItemType);
  }

  private syncDisabled(): void {
    this.setAttribute('aria-disabled', String(this.hasAttribute('disabled')));
  }
}

customElements.define('md-menu-item', MdMenuItem);
export {};
