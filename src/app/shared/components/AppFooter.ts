export class AppFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer class="app-footer">
        <p>Built with TypeScript, Vite, and Material 3 components.</p>
        <p>© ${new Date().getFullYear()} Symbly</p>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
