import type { SymbolItem } from './SymbolItem';
import type { SymbolFilterCategory } from './SymbolCategory';
import type { SymbolRepository } from './SymbolRepository';

export class SearchSymbolsUseCase {
  constructor(private readonly repository: SymbolRepository) {}

  async execute(query: string, category: SymbolFilterCategory = 'Popular'): Promise<SymbolItem[]> {
    const symbols = await this.repository.listSymbols();
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return symbols
      .filter((item) => this.matchesCategory(item, category))
      .filter((item) => this.matchesQuery(item, normalizedQuery))
      .slice(0, normalizedQuery || category !== 'Popular' ? symbols.length : 36);
  }

  private matchesQuery(item: SymbolItem, normalizedQuery: string): boolean {
    if (!normalizedQuery) {
      return true;
    }

    const searchable = [
      item.symbol,
      item.name,
      this.displayCategory(item),
      item.category,
      ...item.aliases,
    ]
      .join(' ')
      .toLocaleLowerCase();

    return searchable.includes(normalizedQuery);
  }

  private matchesCategory(item: SymbolItem, category: SymbolFilterCategory): boolean {
    if (category === 'All') {
      return true;
    }

    if (category === 'Popular') {
      return Boolean(item.popular);
    }

    if (category === 'Developer') {
      return item.category === 'Programming';
    }

    if (category === 'Punctuation') {
      return ['Punctuation', 'Quotes', 'Bullets'].includes(item.category);
    }

    return item.category === category;
  }

  private displayCategory(item: SymbolItem): string {
    return item.category === 'Programming' ? 'Developer' : item.category;
  }
}
