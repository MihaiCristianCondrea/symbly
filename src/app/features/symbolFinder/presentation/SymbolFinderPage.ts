import '@material/web/snackbar/snackbar.js';
import type { CopySymbolUseCase } from '../domain/CopySymbolUseCase';
import type { SearchSymbolsUseCase } from '../domain/SearchSymbolsUseCase';
import type { SymbolItem } from '../domain/SymbolItem';
import type { SymbolGrid } from './SymbolGrid';
import './SymbolGrid';
import './SymbolSearchBar';

export class SymbolFinderPage extends HTMLElement {
  private grid?: SymbolGrid;
  private snackbar?: HTMLElement & { labelText?: string; show?: () => void };
  private searchSymbolsUseCase?: SearchSymbolsUseCase;
  private copySymbolUseCase?: CopySymbolUseCase;

  configure(searchSymbolsUseCase: SearchSymbolsUseCase, copySymbolUseCase: CopySymbolUseCase): void {
    this.searchSymbolsUseCase = searchSymbolsUseCase;
    this.copySymbolUseCase = copySymbolUseCase;
    if (this.isConnected) {
      void this.search('');
    }
  }

  connectedCallback(): void {
    this.render();
    void this.search('');
  }

  private render(): void {
    this.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">Symbol finder</p>
        <h1 id="hero-title">Symbly</h1>
        <p class="tagline">Search any symbol</p>
        <p class="hero-copy">Find and copy symbols in seconds, from currency signs and arrows to math operators, punctuation, legal marks, Greek letters, and developer symbols.</p>
      </section>
      <section class="seo-summary" aria-labelledby="seo-summary-title">
        <h2 id="seo-summary-title">Quick access to common symbols</h2>
        <p>Use Symbly to search for the euro symbol, dollar symbol, pound symbol, yen symbol, copyright symbol, trademark symbol, checkmark symbol, arrow symbols, math symbols, and other copy symbols without digging through character maps.</p>
      </section>
      <section class="finder-card" aria-label="Search and copy symbols">
        <symbol-search-bar></symbol-search-bar>
        <div class="results-heading">
          <h2>Popular symbols</h2>
          <span class="results-count"></span>
        </div>
        <symbol-grid></symbol-grid>
      </section>
      <md-snackbar></md-snackbar>
    `;

    this.grid = this.querySelector('symbol-grid') as SymbolGrid;
    this.snackbar = this.querySelector('md-snackbar') as HTMLElement & { labelText?: string; show?: () => void };
    this.addEventListener('symbol-search', (event) => {
      const value = (event as CustomEvent<string>).detail;
      void this.search(value);
    });
    this.addEventListener('copy-symbol', (event) => {
      const item = (event as CustomEvent<SymbolItem>).detail;
      void this.copy(item);
    });
  }

  private async search(query: string): Promise<void> {
    if (!this.searchSymbolsUseCase || !this.grid) {
      return;
    }

    const items = await this.searchSymbolsUseCase.execute(query);
    this.grid.symbols = items;
    this.querySelector('.results-heading h2')!.textContent = query.trim() ? 'Search results' : 'Popular symbols';
    this.querySelector('.results-count')!.textContent = `${items.length} shown`;
  }

  private async copy(item: SymbolItem): Promise<void> {
    if (!this.copySymbolUseCase) {
      return;
    }

    await this.copySymbolUseCase.execute(item);
    this.showToast(`Copied ${item.symbol} ${item.name}`);
  }

  private showToast(message: string): void {
    if (this.snackbar?.show) {
      this.snackbar.labelText = message;
      this.snackbar.textContent = message;
      this.snackbar.show();
      return;
    }

    this.dispatchEvent(new CustomEvent<string>('app-toast', { detail: message, bubbles: true }));
  }
}

customElements.define('symbol-finder-page', SymbolFinderPage);
