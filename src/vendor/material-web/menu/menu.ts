const menuSurfaceGap = 8;
const viewportPadding = 8;

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
    window.addEventListener('resize', this.reposition);
    window.addEventListener('scroll', this.reposition, { capture: true });

    if (this.open) {
      window.requestAnimationFrame(this.reposition);
    }
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this.handleDocumentClick);
    this.documentClickListening = false;
    this.removeEventListener('keydown', this.handleKeydown);
    this.removeEventListener('click', this.handleItemClick);
    window.removeEventListener('resize', this.reposition);
    window.removeEventListener('scroll', this.reposition, { capture: true });
  }

  get open(): boolean { return this.hasAttribute('open'); }
  set open(nextOpen: boolean) { this.setOpen(nextOpen); }

  show(): void { this.setOpen(true); }
  close(): void { this.setOpen(false); }

  reposition = (): void => {
    if (!this.open || this.hidden) {
      return;
    }

    const anchor = this.getAnchorElement();
    if (!anchor) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = this.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;
    const availableBelow = window.innerHeight - anchorRect.bottom - menuSurfaceGap - viewportPadding;
    const availableAbove = anchorRect.top - menuSurfaceGap - viewportPadding;
    const placeAbove = menuHeight > availableBelow && availableAbove > availableBelow;

    const minLeft = viewportPadding;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding);
    const desiredLeft = anchorRect.right - menuWidth;
    const left = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

    const desiredTop = placeAbove
      ? anchorRect.top - menuHeight - menuSurfaceGap
      : anchorRect.bottom + menuSurfaceGap;
    const minTop = viewportPadding;
    const maxTop = Math.max(viewportPadding, window.innerHeight - menuHeight - viewportPadding);
    const top = Math.min(Math.max(desiredTop, minTop), maxTop);

    this.style.position = 'fixed';
    this.style.left = `${Math.round(left)}px`;
    this.style.top = `${Math.round(top)}px`;
  };

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.open) {
      return;
    }

    const anchor = this.getAnchorElement();
    const path = event.composedPath();
    if (!path.includes(this) && (!anchor || !path.includes(anchor))) {
      this.close();
    }
  };

  private handleKeydown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      this.close();
      this.getAnchorElement()?.focus();
      return;
    }

    if (keyboardEvent.key === 'ArrowDown' || keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      const direction = keyboardEvent.key === 'ArrowDown' ? 1 : -1;
      this.focusAdjacentItem(direction);
    }
  };

  private handleItemClick = (event: Event): void => {
    const item = this.getMenuItemFromEvent(event);
    if (item && !item.hasAttribute('disabled')) {
      this.close();
    }
  };

  private setOpen(nextOpen: boolean): void {
    this.toggleAttribute('open', nextOpen);
    this.hidden = !nextOpen;

    const anchor = this.getAnchorElement();
    anchor?.setAttribute('aria-expanded', String(nextOpen));

    if (nextOpen) {
      this.style.visibility = 'hidden';
      window.requestAnimationFrame(() => {
        this.reposition();
        this.style.visibility = '';
        this.getMenuItems()[0]?.focus();
      });
    } else {
      this.style.left = '';
      this.style.top = '';
      this.style.position = '';
      this.style.visibility = '';
    }
  }

  private focusAdjacentItem(direction: 1 | -1): void {
    const items = this.getMenuItems();
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length;

    items[nextIndex]?.focus();
  }

  private getMenuItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('md-menu-item:not([disabled])'));
  }

  private getMenuItemFromEvent(event: Event): HTMLElement | null {
    return event.composedPath().find((target): target is HTMLElement => (
      target instanceof HTMLElement && target.matches('md-menu-item')
    )) ?? null;
  }

  private getAnchorElement(): HTMLElement | null {
    const anchorId = this.getAttribute('anchor');
    return anchorId ? document.getElementById(anchorId) : null;
  }
}

customElements.define('md-menu', MdMenu);
export {};
