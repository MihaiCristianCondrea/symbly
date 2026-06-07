import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';

export class SymbolSearchBar extends HTMLElement {
  private input!: HTMLElement & { value: string };

  connectedCallback(): void {
    this.innerHTML = `
      <div class="search-field-wrap">
        <md-outlined-text-field
          class="symbol-search-field"
          type="search"
          aria-label="Search symbols"
          placeholder="Search symbols, names, categories, or aliases..."
        >
          <span class="material-symbol" slot="leading-icon" aria-hidden="true">search</span>
          <md-icon-button class="search-clear" slot="trailing-icon" aria-label="Clear search" hidden>
            <span class="material-symbol" aria-hidden="true">close</span>
          </md-icon-button>
        </md-outlined-text-field>
      </div>
    `;

    this.input = this.querySelector('md-outlined-text-field') as HTMLElement & { value: string };
    const clearButton = this.querySelector('.search-clear') as HTMLElement;

    this.input.addEventListener('input', () => {
      clearButton.hidden = !this.input.value;
      this.dispatchEvent(new CustomEvent<string>('symbol-search', {
        detail: this.input.value,
        bubbles: true,
      }));
    });

    clearButton.addEventListener('click', () => {
      this.input.value = '';
      clearButton.hidden = true;
      this.dispatchEvent(new CustomEvent<string>('symbol-search', {
        detail: '',
        bubbles: true,
      }));
    });
  }
}

customElements.define('symbol-search-bar', SymbolSearchBar);
