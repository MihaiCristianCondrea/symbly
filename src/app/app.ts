import { ClipboardService } from './core/clipboard/ClipboardService';
import { LocalStorageService } from './core/storage/LocalStorageService';
import { GetPromotedAppsUseCase } from './features/appShowcase/domain/GetPromotedAppsUseCase';
import { RemoteAppsRepository } from './features/appShowcase/data/RemoteAppsRepository';
import type { AppShowcaseSection } from './features/appShowcase/presentation/AppShowcaseSection';
import './features/appShowcase/presentation/AppShowcaseSection';
import { LocalSymbolRepository } from './features/symbolFinder/data/LocalSymbolRepository';
import { CopySymbolUseCase } from './features/symbolFinder/domain/CopySymbolUseCase';
import { SearchSymbolsUseCase } from './features/symbolFinder/domain/SearchSymbolsUseCase';
import type { SymbolFinderPage } from './features/symbolFinder/presentation/SymbolFinderPage';
import './features/symbolFinder/presentation/SymbolFinderPage';
import './shared/components/AppFooter';
import type { AppHeader } from './shared/components/AppHeader';
import './shared/components/AppHeader';
import './shared/components/PageContainer';
import { ThemeController } from './theme/ThemeController';

export class SymblyApp {
  private readonly storage = new LocalStorageService();
  private readonly themeController = new ThemeController(this.storage);
  private readonly symbolRepository = new LocalSymbolRepository();
  private readonly clipboardService = new ClipboardService();
  private readonly searchSymbolsUseCase = new SearchSymbolsUseCase(this.symbolRepository);
  private readonly copySymbolUseCase = new CopySymbolUseCase(this.clipboardService);
  private readonly getPromotedAppsUseCase = new GetPromotedAppsUseCase(new RemoteAppsRepository());

  mount(root: HTMLElement): void {
    root.innerHTML = `
      <app-header></app-header>
      <page-container>
        <symbol-finder-page></symbol-finder-page>
        <app-showcase-section></app-showcase-section>
      </page-container>
      <app-footer></app-footer>
    `;

    (root.querySelector('app-header') as AppHeader).configure(this.themeController);
    (root.querySelector('symbol-finder-page') as SymbolFinderPage).configure(this.searchSymbolsUseCase, this.copySymbolUseCase);
    (root.querySelector('app-showcase-section') as AppShowcaseSection).configure(this.getPromotedAppsUseCase);
  }
}
