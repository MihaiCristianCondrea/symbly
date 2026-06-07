class MdFilterChip extends HTMLElement {
  static get observedAttributes() { return ['label']; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    const label = this.getAttribute('label') ?? this.textContent ?? '';
    this.setAttribute('role', 'option');
    this.setAttribute('aria-selected', this.hasAttribute('selected') ? 'true' : 'false');
    if (!this.textContent?.trim()) {
      this.textContent = label;
    }
  }
}
customElements.define('md-filter-chip', MdFilterChip);
export {};
