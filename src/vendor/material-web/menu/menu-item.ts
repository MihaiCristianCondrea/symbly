class MdMenuItem extends HTMLElement {
  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menuitem');
    }

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }
  }
}

customElements.define('md-menu-item', MdMenuItem);
export {};
