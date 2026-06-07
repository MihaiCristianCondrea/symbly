class MdSnackbar extends HTMLElement {
  private closeTimeout?: number;

  get labelText(): string { return this.getAttribute('label-text') ?? ''; }
  set labelText(value: string) {
    this.setAttribute('label-text', value);
    this.render();
  }

  connectedCallback() { this.render(); }

  show() {
    window.clearTimeout(this.closeTimeout);
    this.render();
    this.setAttribute('open', '');
    this.closeTimeout = window.setTimeout(() => this.close(), 5000);
  }

  close() {
    this.removeAttribute('open');
  }

  private render() {
    const message = this.labelText || this.textContent?.trim() || '';
    if (this.querySelector('.md-snackbar-label')?.textContent === message) {
      return;
    }

    this.innerHTML = `<span class="md-snackbar-label">${this.escape(message)}</span>`;
  }

  private escape(value: string): string {
    const element = document.createElement('span');
    element.textContent = value;
    return element.innerHTML;
  }
}
customElements.define('md-snackbar', MdSnackbar);
export {};
