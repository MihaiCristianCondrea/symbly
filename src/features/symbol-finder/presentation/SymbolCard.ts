import type { SymbolItem } from '../domain/models/SymbolItem';

export class SymbolCard extends HTMLElement {
  private symbolItem?: SymbolItem;
  private copied = false;
  private resetCopiedTimeout?: number;
  private swapAnimationTimeout?: number;

  set item(value: SymbolItem) {
    this.symbolItem = value;
    this.copied = false;
    window.clearTimeout(this.resetCopiedTimeout);
    window.clearTimeout(this.swapAnimationTimeout);
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.resetCopiedTimeout);
    window.clearTimeout(this.swapAnimationTimeout);
  }

  private render(): void {
    if (!this.symbolItem) {
      return;
    }

    this.innerHTML = `
      <article class="symbol-card" role="button" tabindex="0" aria-label="Copy ${this.escape(this.symbolItem.name)}">
        <div class="symbol-card-top">
          <span class="symbol-glyph">${this.escape(this.symbolItem.symbol)}</span>
          <md-icon-button class="copy-button ${this.copied ? 'is-copied' : ''}" aria-label="${this.copied ? 'Copied' : `Copy ${this.escape(this.symbolItem.symbol)}`}">
            <md-icon class="copy-icon" aria-hidden="true">${this.copied ? 'check' : 'content_copy'}</md-icon>
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

    this.showCopiedState();
    this.dispatchEvent(new CustomEvent<SymbolItem>('copy-symbol', {
      detail: this.symbolItem,
      bubbles: true,
      composed: true,
    }));
  }

  private showCopiedState(): void {
    this.setCopiedVisual(true);
    window.clearTimeout(this.resetCopiedTimeout);
    this.resetCopiedTimeout = window.setTimeout(() => {
      this.setCopiedVisual(false);
    }, 5000);
  }

  private setCopiedVisual(copied: boolean): void {
    if (this.copied === copied) {
      return;
    }

    const button = this.querySelector('.copy-button') as HTMLElement | null;
    const icon = this.querySelector('.copy-icon') as HTMLElement | null;
    if (!button || !icon || !this.symbolItem) {
      this.copied = copied;
      this.render();
      return;
    }

    window.clearTimeout(this.swapAnimationTimeout);
    button.classList.add('is-swapping');

    this.swapAnimationTimeout = window.setTimeout(() => {
      this.copied = copied;
      button.classList.toggle('is-copied', copied);
      button.setAttribute('aria-label', copied ? 'Copied' : `Copy ${this.symbolItem?.symbol ?? ''}`);
      icon.textContent = copied ? 'check' : 'content_copy';

      this.swapAnimationTimeout = window.setTimeout(() => {
        button.classList.remove('is-swapping');
      }, 180);
    }, 140);
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
