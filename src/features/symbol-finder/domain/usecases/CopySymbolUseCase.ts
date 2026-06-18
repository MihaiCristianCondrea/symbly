import type { ClipboardService } from '../../../../core/clipboard/ClipboardService';
import type { SymbolItem } from '../models/SymbolItem';

export class CopySymbolUseCase {
  constructor(private readonly clipboardService: ClipboardService) {}

  execute(item: SymbolItem): Promise<void> {
    return this.clipboardService.copyText(item.symbol);
  }
}
