import type { SymbolItem } from './SymbolItem';
import type { SymbolRepository } from './SymbolRepository';

export class SearchSymbolsUseCase {
  constructor(private readonly repository: SymbolRepository) {}

  async execute(query: string): Promise<SymbolItem[]> {
    const symbols = await this.repository.listSymbols();
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return symbols.filter((item) => item.popular).slice(0, 36);
    }

    return symbols.filter((item) => {
      const searchable = [
        item.symbol,
        item.name,
        item.category,
        ...item.aliases,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }
}
