import type { SymbolItem } from '../models/SymbolItem';

export interface SymbolRepository {
  listSymbols(): Promise<SymbolItem[]>;
}
