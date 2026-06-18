import '../core/material/MaterialElements';
import type { AppHeader } from '../core/components/AppHeader';
import '../core/components/AppFooter';
import '../core/components/AppHeader';
import '../core/components/PageContainer';
import type { AppShowcaseSection } from '../features/app-showcase/presentation/AppShowcaseSection';
import '../features/app-showcase/presentation/AppShowcaseSection';
import type { SymbolFinderPage } from '../features/symbol-finder/presentation/SymbolFinderPage';
import '../features/symbol-finder/presentation/SymbolFinderPage';
import { DataServices } from './DataServices';

export class SymblyApp {
  private readonly services: DataServices;

  constructor(services = new DataServices()) {
    this.services = services;
  }

  mount(root: HTMLElement): void {
    root.innerHTML = `
      <app-header></app-header>
      <page-container>
        <symbol-finder-page></symbol-finder-page>
        <app-showcase-section></app-showcase-section>
      </page-container>
      <app-footer></app-footer>
    `;

    (root.querySelector('app-header') as AppHeader).configure(this.services.themeController);
    (root.querySelector('symbol-finder-page') as SymbolFinderPage).configure(
      this.services.searchSymbolsUseCase,
      this.services.copySymbolUseCase,
    );
    (root.querySelector('app-showcase-section') as AppShowcaseSection).configure(this.services.getPromotedAppsUseCase);
  }
}
