import '@material/web/button/filled-button.js';
import type { SymbolItem } from '../domain/SymbolItem';

export class SymbolCard extends HTMLElement {
  private symbolItem?: SymbolItem;

  set item(value: SymbolItem) {
    this.symbolItem = value;
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    if (!this.symbolItem) {
      return;
    }

    this.innerHTML = `
      <button class="symbol-card" type="button" aria-label="Copy ${this.escape(this.symbolItem.name)}">
        <span class="symbol-glyph">${this.escape(this.symbolItem.symbol)}</span>
        <span class="symbol-meta">
          <strong>${this.escape(this.symbolItem.name)}</strong>
          <small>${this.escape(this.symbolItem.category)}</small>
        </span>
        <md-filled-button class="copy-button" aria-label="Copy ${this.escape(this.symbolItem.symbol)}">Copy</md-filled-button>
      </button>
    `;

    this.querySelector('.symbol-card')?.addEventListener('click', () => this.copy());
    this.querySelector('.copy-button')?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.copy();
    });
  }

  private copy(): void {
    if (!this.symbolItem) {
      return;
    }

    this.dispatchEvent(new CustomEvent<SymbolItem>('copy-symbol', {
      detail: this.symbolItem,
      bubbles: true,
      composed: true,
    }));
  }

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }
}

customElements.define('symbol-card', SymbolCard);
