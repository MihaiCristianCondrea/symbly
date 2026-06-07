class MdChipSet extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', this.getAttribute('role') ?? 'listbox');
  }
}

customElements.define('md-chip-set', MdChipSet);
export {};
