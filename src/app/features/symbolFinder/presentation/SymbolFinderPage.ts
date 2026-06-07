import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/snackbar/snackbar.js';
import type { CopySymbolUseCase } from '../domain/CopySymbolUseCase';
import type { SearchSymbolsUseCase } from '../domain/SearchSymbolsUseCase';
import { symbolFilterCategories, type SymbolFilterCategory } from '../domain/SymbolCategory';
import type { SymbolItem } from '../domain/SymbolItem';
import type { SymbolGrid } from './SymbolGrid';
import './SymbolGrid';
import './SymbolSearchBar';

const categoryIcons: Record<SymbolFilterCategory, string> = {
  Popular: 'stars',
  Currency: 'payments',
  Arrows: 'arrow_right_alt',
  Math: 'functions',
  Punctuation: 'format_quote',
  Legal: 'gavel',
  Checkmarks: 'check_circle',
  Greek: 'language',
  Developer: 'code_blocks',
  All: 'apps',
};

export class SymbolFinderPage extends HTMLElement {
  private grid?: SymbolGrid;
  private snackbar?: HTMLElement & { labelText?: string; show?: () => void };
  private searchSymbolsUseCase?: SearchSymbolsUseCase;
  private copySymbolUseCase?: CopySymbolUseCase;
  private query = '';
  private category: SymbolFilterCategory = 'Popular';

  configure(searchSymbolsUseCase: SearchSymbolsUseCase, copySymbolUseCase: CopySymbolUseCase): void {
    this.searchSymbolsUseCase = searchSymbolsUseCase;
    this.copySymbolUseCase = copySymbolUseCase;
    if (this.isConnected) {
      void this.search();
    }
  }

  connectedCallback(): void {
    this.render();
    void this.search();
  }

  private render(): void {
    this.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-shape" aria-hidden="true">S</div>
        <div class="hero-content">
          <h1 id="hero-title">Search any symbol</h1>
          <p class="hero-copy">Find and copy symbols in seconds. From currency signs and arrows to math operators, punctuation, legal marks, and developer symbols.</p>
        </div>
      </section>
      <section class="finder-area" aria-label="Search and copy symbols">
        <symbol-search-bar></symbol-search-bar>
        <md-chip-set class="category-chips" aria-label="Filter symbol categories">
          ${symbolFilterCategories.map((category) => this.renderChip(category)).join('')}
        </md-chip-set>
        <div class="results-heading">
          <h2>${this.headingText()}</h2>
          <span class="results-count"></span>
        </div>
        <symbol-grid></symbol-grid>
      </section>
      <md-snackbar></md-snackbar>
    `;

    this.grid = this.querySelector('symbol-grid') as SymbolGrid;
    this.snackbar = this.querySelector('md-snackbar') as HTMLElement & { labelText?: string; show?: () => void };
    this.addEventListener('symbol-search', (event) => {
      this.query = (event as CustomEvent<string>).detail;
      void this.search();
    });

    this.querySelectorAll('md-filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        this.category = chip.getAttribute('data-category') as SymbolFilterCategory;
        this.updateSelectedChip();
        void this.search();
      });
    });

    this.addEventListener('copy-symbol', (event) => {
      const item = (event as CustomEvent<SymbolItem>).detail;
      void this.copy(item);
    });
  }

  private renderChip(category: SymbolFilterCategory): string {
    const selected = category === this.category ? 'selected' : '';
    return `
      <md-filter-chip label="${category}" data-category="${category}" ${selected}>
        <span class="material-symbol category-chip-icon" aria-hidden="true">${categoryIcons[category]}</span>
        <span>${category}</span>
      </md-filter-chip>
    `;
  }

  private updateSelectedChip(): void {
    this.querySelectorAll('md-filter-chip').forEach((chip) => {
      const selected = chip.getAttribute('data-category') === this.category;
      chip.toggleAttribute('selected', selected);
    });
  }

  private async search(): Promise<void> {
    if (!this.searchSymbolsUseCase || !this.grid) {
      return;
    }

    const items = await this.searchSymbolsUseCase.execute(this.query, this.category);
    this.grid.symbols = items;
    this.querySelector('.results-heading h2')!.textContent = this.headingText();
    this.querySelector('.results-count')!.textContent = `${items.length} shown`;
  }

  private headingText(): string {
    if (this.query.trim()) {
      return 'Search results';
    }

    return this.category === 'All' ? 'All symbols' : `${this.category} symbols`;
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
      this.snackbar.show();
      return;
    }

    this.dispatchEvent(new CustomEvent<string>('app-toast', { detail: message, bubbles: true }));
  }
}

customElements.define('symbol-finder-page', SymbolFinderPage);
