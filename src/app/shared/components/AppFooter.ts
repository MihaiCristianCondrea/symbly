interface FooterLink {
  label: string;
  href: string;
  icon: string;
}

const policyLinks: FooterLink[] = [
  {
    label: 'Privacy Policy',
    href: 'https://mihaicristiancondrea.github.io/profile/#privacy-policy',
    icon: 'policy',
  },
  {
    label: 'Code of Conduct',
    href: 'https://mihaicristiancondrea.github.io/profile/#code-of-conduct',
    icon: 'verified_user',
  },
];

const profileLinks: FooterLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/MihaiCristianCondrea',
    icon: 'code',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/d4rk7355608/',
    icon: 'photo_camera',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@D4rK7355608',
    icon: 'smart_display',
  },
  {
    label: 'Pinterest',
    href: 'https://ro.pinterest.com/mihaicristiancondrea/',
    icon: 'palette',
  },
  {
    label: 'Email',
    href: 'mailto:contact.mihaicristiancondrea@gmail.com',
    icon: 'mail',
  },
  {
    label: 'X',
    href: 'https://x.com/MihaiCristianC',
    icon: 'close',
  },
  {
    label: 'Profile',
    href: 'https://mihaicristiancondrea.github.io/profile/',
    icon: 'person',
  },
];

export class AppFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer class="app-footer">
        <div class="footer-content">
          <nav class="footer-social-links" aria-label="Profile links">
            ${profileLinks.map((link) => this.renderLink(link, 'footer-social-link')).join('')}
          </nav>
          <nav class="footer-policy-links" aria-label="Policies">
            ${policyLinks.map((link) => this.renderTextLink(link)).join('')}
          </nav>
        </div>
        <div class="footer-copyright">Copyright © 2025-2026, Mihai-Cristian Condrea</div>
      </footer>
    `;
  }

  private renderLink(link: FooterLink, className: string): string {
    return `
      <a class="${className}" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
        <span class="material-symbol" aria-hidden="true">${link.icon}</span>
      </a>
    `;
  }

  private renderTextLink(link: FooterLink): string {
    return `
      <a href="${link.href}" target="_blank" rel="noopener noreferrer">
        ${link.label}
      </a>
    `;
  }
}

customElements.define('app-footer', AppFooter);
