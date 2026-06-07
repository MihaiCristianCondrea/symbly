import type { SymbolItem } from './SymbolItem';

export interface SymbolRepository {
  listSymbols(): Promise<SymbolItem[]>;
}
