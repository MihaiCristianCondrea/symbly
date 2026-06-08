import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';

export class SymbolSearchBar extends HTMLElement {
  private input!: HTMLElement & { value: string; focus: () => void };

  connectedCallback(): void {
    this.innerHTML = `
      <div class="search-field-wrap">
        <md-outlined-text-field
          id="symbolSearchBar"
          class="symbol-search-field search-bar"
          type="search"
          label="Search symbols"
          aria-label="Search symbols"
        >
          <md-icon slot="leading-icon">search</md-icon>
          <md-icon-button class="search-clear" slot="trailing-icon" aria-label="Clear search" hidden>
            <md-icon>close</md-icon>
          </md-icon-button>
        </md-outlined-text-field>
      </div>
    `;

    this.input = this.querySelector('md-outlined-text-field') as HTMLElement & { value: string; focus: () => void };
    const clearButton = this.querySelector('.search-clear') as HTMLElement;

    this.input.addEventListener('input', () => {
      clearButton.hidden = !this.input.value;
      this.dispatchSearch(this.input.value);
    });

    clearButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.input.value = '';
      clearButton.hidden = true;
      this.input.focus();
      this.dispatchSearch('');
    });
  }

  private dispatchSearch(value: string): void {
    this.dispatchEvent(new CustomEvent<string>('symbol-search', {
      detail: value,
      bubbles: true,
    }));
  }
}

customElements.define('symbol-search-bar', SymbolSearchBar);
