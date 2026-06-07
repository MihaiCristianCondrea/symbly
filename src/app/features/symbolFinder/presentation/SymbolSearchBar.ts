import '@material/web/textfield/outlined-text-field.js';

export class SymbolSearchBar extends HTMLElement {
  private input!: HTMLInputElement;

  connectedCallback(): void {
    this.innerHTML = `
      <label class="search-shell" aria-label="Search symbols">
        <span class="search-icon">⌕</span>
        <input type="search" placeholder="Search symbols, names, categories, or aliases" autocomplete="off" />
      </label>
    `;

    this.input = this.querySelector('input')!;
    this.input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent<string>('symbol-search', {
        detail: this.input.value,
        bubbles: true,
      }));
    });
  }
}

customElements.define('symbol-search-bar', SymbolSearchBar);
