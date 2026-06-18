import type { SymbolItem } from '../../domain/models/SymbolItem';
import type { SymbolRepository } from '../../domain/repositories/SymbolRepository';
import { symbolsData } from '../symbols.data';

export class LocalSymbolRepository implements SymbolRepository {
  async listSymbols(): Promise<SymbolItem[]> {
    return symbolsData;
  }
}
