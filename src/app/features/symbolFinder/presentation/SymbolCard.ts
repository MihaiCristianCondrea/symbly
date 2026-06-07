import '@material/web/iconbutton/icon-button.js';
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
      <article class="symbol-card" role="button" tabindex="0" aria-label="Copy ${this.escape(this.symbolItem.name)}">
        <div class="symbol-card-top">
          <span class="symbol-glyph">${this.escape(this.symbolItem.symbol)}</span>
          <md-icon-button class="copy-button" aria-label="Copy ${this.escape(this.symbolItem.symbol)}">
            <span class="material-symbol" aria-hidden="true">content_copy</span>
          </md-icon-button>
        </div>
        <div class="symbol-meta">
          <strong>${this.escape(this.symbolItem.name)}</strong>
          <small>${this.escape(this.displayCategory(this.symbolItem))}</small>
        </div>
      </article>
    `;

    const card = this.querySelector('.symbol-card');
    card?.addEventListener('click', () => this.copy());
    card?.addEventListener('keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
        keyboardEvent.preventDefault();
        this.copy();
      }
    });
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

  private displayCategory(item: SymbolItem): string {
    return item.category === 'Programming' ? 'Developer' : item.category;
  }

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }
}

customElements.define('symbol-card', SymbolCard);
