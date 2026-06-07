const defaultMenuItemType = 'menuitem';

class MdMenuItem extends HTMLElement {
  static get observedAttributes(): string[] { return ['aria-checked', 'disabled', 'type']; }

  private readonly shadow = this.attachShadow({ mode: 'open' });

  constructor() {
    super();
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          color: var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        :host([hidden]) {
          display: none;
        }

        :host([disabled]) {
          color: var(--md-menu-item-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));
          cursor: default;
          opacity: 0.38;
          pointer-events: none;
        }

        .row {
          box-sizing: border-box;
          min-height: 48px;
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr) 24px;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          margin: 0 8px;
          border-radius: 4px;
          font-family: var(--md-sys-typescale-label-large-font, Roboto, system-ui, sans-serif);
          font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
          font-weight: var(--md-sys-typescale-label-large-weight, 500);
          line-height: var(--md-sys-typescale-label-large-line-height, 1.25rem);
          letter-spacing: var(--md-sys-typescale-label-large-tracking, 0.00625rem);
        }

        :host(:hover) .row,
        :host(:focus-visible) .row,
        :host([aria-checked='true']) .row {
          color: var(--md-sys-color-on-secondary-container, #1d192b);
          background: var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));
        }

        .start,
        .end {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
        }

        .headline {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      </style>
      <div class="row" part="row">
        <span class="start" part="start"><slot name="start"></slot></span>
        <span class="headline" part="headline"><slot name="headline"></slot></span>
        <span class="end" part="end"><slot name="end"></slot></span>
      </div>
    `;
  }

  connectedCallback(): void {
    this.syncRole();
    this.syncDisabled();

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }

    this.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleKeydown);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.syncRole();
      this.syncDisabled();
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.hasAttribute('disabled')) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  private syncRole(): void {
    this.setAttribute('role', this.getAttribute('type') ?? defaultMenuItemType);
  }

  private syncDisabled(): void {
    this.setAttribute('aria-disabled', String(this.hasAttribute('disabled')));
  }
}

customElements.define('md-menu-item', MdMenuItem);
export {};
