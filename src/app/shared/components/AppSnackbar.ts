export class AppSnackbar extends HTMLElement {
  private hideTimer?: number;
  private currentLabelText = '';

  get labelText(): string {
    return this.currentLabelText;
  }

  set labelText(value: string) {
    this.currentLabelText = value;
    this.render();
  }

  connectedCallback(): void {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    this.render();
  }

  disconnectedCallback(): void {
    this.clearHideTimer();
  }

  show(): void {
    this.render();
    this.setAttribute('open', '');
    this.clearHideTimer();
    this.hideTimer = window.setTimeout(() => this.close(), 3000);
  }

  close(): void {
    this.clearHideTimer();
    this.removeAttribute('open');
  }

  private clearHideTimer(): void {
    if (this.hideTimer === undefined) {
      return;
    }

    window.clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
  }

  private render(): void {
    this.innerHTML = `<span class="app-snackbar-label">${this.escape(this.currentLabelText)}</span>`;
  }

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }
}

customElements.define('app-snackbar', AppSnackbar);
