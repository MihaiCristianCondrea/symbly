import type { SymbolCategory } from './SymbolCategory';

export interface SymbolItem {
  symbol: string;
  name: string;
  category: SymbolCategory;
  aliases: string[];
  popular?: boolean;
}
