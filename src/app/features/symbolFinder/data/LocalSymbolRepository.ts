import type { SymbolItem } from '../domain/SymbolItem';
import type { SymbolRepository } from '../domain/SymbolRepository';
import { symbolsData } from './symbols.data';

export class LocalSymbolRepository implements SymbolRepository {
  async listSymbols(): Promise<SymbolItem[]> {
    return symbolsData;
  }
}
