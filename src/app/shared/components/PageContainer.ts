export class PageContainer extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'main');
  }
}

customElements.define('page-container', PageContainer);
