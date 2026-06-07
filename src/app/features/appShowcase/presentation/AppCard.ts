import '@material/web/button/outlined-button.js';
import type { AppItem } from '../domain/AppItem';

export class AppCard extends HTMLElement {
  set app(value: AppItem) {
    this.render(value);
  }

  private render(app: AppItem): void {
    const icon = app.iconUrl
      ? `<img src="${this.escapeAttribute(app.iconUrl)}" alt="" loading="lazy" />`
      : '<span class="app-icon-placeholder">apps</span>';

    this.innerHTML = `
      <article class="app-card">
        <div class="app-icon">${icon}</div>
        <div class="app-content">
          <h3>${this.escape(app.name)}</h3>
          <p class="app-category">${this.escape(app.category)}</p>
          <p>${this.escape(app.description)}</p>
        </div>
        <a class="play-link" href="${this.escapeAttribute(app.storeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${this.escapeAttribute(app.name)} on Google Play">
          <md-outlined-button>
            <span class="play-triangle" aria-hidden="true"></span>
            Google Play
          </md-outlined-button>
        </a>
      </article>
    `;
  }

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }

  private escapeAttribute(value: string): string {
    return this.escape(value).replace(/"/g, '&quot;');
  }
}

customElements.define('app-card', AppCard);
