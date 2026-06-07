import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/snackbar/snackbar.js';
import '@material/web/textfield/outlined-text-field.js';
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

interface MenuElement extends HTMLElement {
  open: boolean;
}

interface TextFieldElement extends HTMLElement {
  value: string;
}

export class SymbolFinderPage extends HTMLElement {
  private grid?: SymbolGrid;
  private snackbar?: HTMLElement & { labelText?: string; show?: () => void };
  private searchSymbolsUseCase?: SearchSymbolsUseCase;
  private copySymbolUseCase?: CopySymbolUseCase;
  private query = '';
  private category: SymbolFilterCategory = 'Popular';

  private readonly handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') {
      return;
    }

    this.closeCategoryMenu();
  };

  configure(searchSymbolsUseCase: SearchSymbolsUseCase, copySymbolUseCase: CopySymbolUseCase): void {
    this.searchSymbolsUseCase = searchSymbolsUseCase;
    this.copySymbolUseCase = copySymbolUseCase;
    if (this.isConnected) {
      void this.search();
    }
  }

  connectedCallback(): void {
    document.addEventListener('keydown', this.handleDocumentKeydown);
    this.render();
    void this.search();
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleDocumentKeydown);
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
        <div class="finder-controls">
          <symbol-search-bar></symbol-search-bar>
          <div class="text-field-anchor category-menu-anchor">
            <md-outlined-text-field
              id="categoryMenuButton"
              class="category-menu-field"
              label="Choose category"
              readonly
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-controls="categoryMenu"
              value="${this.escapeAttribute(this.category)}"
            >
              <md-icon slot="leading-icon">filter_list</md-icon>
              <md-icon slot="trailing-icon">expand_more</md-icon>
            </md-outlined-text-field>
            <md-menu id="categoryMenu" anchor="categoryMenuButton" role="listbox" class="category-menu">
              ${symbolFilterCategories.map((category) => this.renderCategoryItem(category)).join('')}
            </md-menu>
          </div>
        </div>
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

    this.setupCategoryMenu();

    this.addEventListener('copy-symbol', (event) => {
      const item = (event as CustomEvent<SymbolItem>).detail;
      void this.copy(item);
    });
  }

  private renderCategoryItem(category: SymbolFilterCategory): string {
    const selected = category === this.category;
    return `
      <md-menu-item
        type="option"
        data-category="${this.escapeAttribute(category)}"
        aria-selected="${selected}"
        ${selected ? 'selected' : ''}
      >
        <md-icon slot="start">${categoryIcons[category]}</md-icon>
        <div slot="headline">${this.escape(category)}</div>
        ${selected ? '<md-icon slot="end">check</md-icon>' : ''}
      </md-menu-item>
    `;
  }

  private setupCategoryMenu(): void {
    const trigger = this.querySelector('#categoryMenuButton') as TextFieldElement | null;
    const menu = this.querySelector('#categoryMenu') as MenuElement | null;

    if (!trigger || !menu) {
      return;
    }

    const setMenuOpen = (open: boolean) => {
      menu.open = open;
      trigger.setAttribute('aria-expanded', String(open));
    };

    const toggleMenu = () => setMenuOpen(!menu.open);

    trigger.addEventListener('click', toggleMenu);
    trigger.addEventListener('keydown', (event) => {
      const opensMenu = event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown';
      if (!opensMenu) {
        return;
      }

      event.preventDefault();
      setMenuOpen(true);
    });

    menu.addEventListener('closed', () => {
      trigger.setAttribute('aria-expanded', 'false');
    });

    this.querySelectorAll<HTMLElement>('md-menu-item[data-category]').forEach((item) => {
      item.addEventListener('click', () => {
        this.category = item.dataset.category as SymbolFilterCategory;
        trigger.value = this.category;
        setMenuOpen(false);
        this.updateSelectedCategoryItems();
        void this.search();
      });
    });
  }

  private closeCategoryMenu(): void {
    const menu = this.querySelector('#categoryMenu') as MenuElement | null;
    const trigger = this.querySelector('#categoryMenuButton') as HTMLElement | null;
    if (!menu) {
      return;
    }

    menu.open = false;
    trigger?.setAttribute('aria-expanded', 'false');
  }

  private updateSelectedCategoryItems(): void {
    this.querySelectorAll<HTMLElement>('md-menu-item[data-category]').forEach((item) => {
      const selected = item.dataset.category === this.category;
      item.toggleAttribute('selected', selected);
      item.setAttribute('aria-selected', String(selected));
      const endIcon = item.querySelector('[slot="end"]');
      if (selected && !endIcon) {
        item.insertAdjacentHTML('beforeend', '<md-icon slot="end">check</md-icon>');
      } else if (!selected) {
        endIcon?.remove();
      }
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

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }

  private escapeAttribute(value: string): string {
    return this.escape(value).replace(/"/g, '&quot;');
  }
}

customElements.define('symbol-finder-page', SymbolFinderPage);
