class MdMenu extends HTMLElement {
  private documentClickListening = false;

  connectedCallback(): void {
    this.setAttribute('role', this.getAttribute('role') ?? 'menu');
    this.hidden = !this.hasAttribute('open');

    if (!this.documentClickListening) {
      document.addEventListener('click', this.handleDocumentClick);
      this.documentClickListening = true;
    }

    this.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('click', this.handleItemClick);
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this.handleDocumentClick);
    this.documentClickListening = false;
    this.removeEventListener('keydown', this.handleKeydown);
    this.removeEventListener('click', this.handleItemClick);
  }

  get open(): boolean { return this.hasAttribute('open'); }
  set open(nextOpen: boolean) { this.setOpen(nextOpen); }

  show(): void { this.setOpen(true); }
  close(): void { this.setOpen(false); }

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.open) {
      return;
    }

    const anchor = this.getAnchorElement();
    const target = event.target as Node;
    if (!this.contains(target) && !anchor?.contains(target)) {
      this.close();
    }
  };

  private handleKeydown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      this.close();
      this.getAnchorElement()?.focus();
    }
  };

  private handleItemClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const item = target.closest('md-menu-item');
    if (item) {
      this.close();
    }
  };

  private setOpen(nextOpen: boolean): void {
    this.toggleAttribute('open', nextOpen);
    this.hidden = !nextOpen;

    const anchor = this.getAnchorElement();
    anchor?.setAttribute('aria-expanded', String(nextOpen));

    if (nextOpen) {
      window.requestAnimationFrame(() => this.querySelector<HTMLElement>('md-menu-item')?.focus());
    }
  }

  private getAnchorElement(): HTMLElement | null {
    const anchorId = this.getAttribute('anchor');
    return anchorId ? document.getElementById(anchorId) : null;
  }
}

customElements.define('md-menu', MdMenu);
export {};
