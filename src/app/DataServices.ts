import { ClipboardService } from '../core/clipboard/ClipboardService';
import { LocalStorageService } from '../core/storage/LocalStorageService';
import { RemoteAppsRepository } from '../features/app-showcase/data/repositories/RemoteAppsRepository';
import { GetPromotedAppsUseCase } from '../features/app-showcase/domain/usecases/GetPromotedAppsUseCase';
import { LocalSymbolRepository } from '../features/symbol-finder/data/repositories/LocalSymbolRepository';
import { CopySymbolUseCase } from '../features/symbol-finder/domain/usecases/CopySymbolUseCase';
import { SearchSymbolsUseCase } from '../features/symbol-finder/domain/usecases/SearchSymbolsUseCase';
import { ThemeController } from './ThemeController';

export class DataServices {
  readonly storage = new LocalStorageService();
  readonly themeController = new ThemeController(this.storage);
  readonly symbolRepository = new LocalSymbolRepository();
  readonly clipboardService = new ClipboardService();
  readonly searchSymbolsUseCase = new SearchSymbolsUseCase(this.symbolRepository);
  readonly copySymbolUseCase = new CopySymbolUseCase(this.clipboardService);
  readonly getPromotedAppsUseCase = new GetPromotedAppsUseCase(new RemoteAppsRepository());
}
