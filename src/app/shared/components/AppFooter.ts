export class AppFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer class="app-footer">
        <p>© 2026 Symbly</p>
        <nav aria-label="Footer">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
