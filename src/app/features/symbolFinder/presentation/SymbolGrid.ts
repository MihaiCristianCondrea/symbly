import type { SymbolItem } from '../domain/SymbolItem';
import type { SymbolCard } from './SymbolCard';
import './SymbolCard';

export class SymbolGrid extends HTMLElement {
  private items: SymbolItem[] = [];

  set symbols(value: SymbolItem[]) {
    this.items = value;
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    if (this.items.length === 0) {
      this.innerHTML = `
        <div class="empty-state">
          <strong>No symbols found</strong>
          <span>Try a symbol, category, or alias like “money”, “arrow”, or “check”.</span>
        </div>
      `;
      return;
    }

    this.innerHTML = '<div class="symbol-grid"></div>';
    const grid = this.querySelector('.symbol-grid')!;
    this.items.forEach((item) => {
      const card = document.createElement('symbol-card') as SymbolCard;
      card.item = item;
      grid.append(card);
    });
  }
}

customElements.define('symbol-grid', SymbolGrid);
