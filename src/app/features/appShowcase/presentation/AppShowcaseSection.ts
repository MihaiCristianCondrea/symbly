import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import '@material/web/progress/circular-progress.js';
import type { GetPromotedAppsUseCase } from '../domain/GetPromotedAppsUseCase';
import type { AppItem } from '../domain/AppItem';
import type { AppCard } from './AppCard';
import './AppCard';

export class AppShowcaseSection extends HTMLElement {
  private getPromotedAppsUseCase?: GetPromotedAppsUseCase;

  configure(getPromotedAppsUseCase: GetPromotedAppsUseCase): void {
    this.getPromotedAppsUseCase = getPromotedAppsUseCase;
    if (this.isConnected) {
      this.renderLoading();
      void this.loadApps();
    }
  }

  connectedCallback(): void {
    this.renderLoading();
    void this.loadApps();
  }

  private async loadApps(): Promise<void> {
    if (!this.getPromotedAppsUseCase) {
      return;
    }

    try {
      const apps = await this.getPromotedAppsUseCase.execute();
      this.renderApps(apps);
    } catch (error) {
      console.error(error);
      this.renderError();
    }
  }

  private renderLoading(): void {
    this.innerHTML = `
      <section class="showcase-section" aria-labelledby="showcase-title">
        ${this.renderHeader()}
        <div class="showcase-loading"><md-circular-progress indeterminate></md-circular-progress><span>Loading apps…</span></div>
      </section>
    `;
  }

  private renderApps(apps: AppItem[]): void {
    if (apps.length === 0) {
      this.renderError('No apps are available right now.');
      return;
    }

    this.innerHTML = `
      <section class="showcase-section" aria-labelledby="showcase-title">
        ${this.renderHeader()}
        <div class="apps-grid"></div>
      </section>
    `;

    const grid = this.querySelector('.apps-grid')!;
    apps.slice(0, 4).forEach((app) => {
      const card = document.createElement('app-card') as AppCard;
      card.app = app;
      grid.append(card);
    });
  }

  private renderHeader(): string {
    return `
      <div class="section-heading">
        <h2 id="showcase-title">More apps from Mihai-Cristian</h2>
        <a class="view-all-link" href="https://play.google.com/store/apps/dev?id=5390214922640123642" target="_blank" rel="noopener noreferrer">
          <md-text-button>View all apps<md-icon slot="icon">open_in_new</md-icon></md-text-button>
        </a>
      </div>
    `;
  }

  private renderError(message = 'Could not load app recommendations. Please try again later.'): void {
    this.innerHTML = `
      <section class="showcase-section" aria-labelledby="showcase-title">
        ${this.renderHeader()}
        <div class="showcase-error">${message}</div>
      </section>
    `;
  }
}

customElements.define('app-showcase-section', AppShowcaseSection);
