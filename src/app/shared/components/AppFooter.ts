import '@material/web/iconbutton/icon-button.js';

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

const profileLinks: SocialLink[] = [
  {
    label: 'Instagram Profile',
    href: 'https://www.instagram.com/d4rk7355608/',
    icon: 'photo_camera',
  },
  {
    label: 'YouTube Channel',
    href: 'https://www.youtube.com/@D4rK7355608',
    icon: 'smart_display',
  },
  {
    label: 'Pinterest Profile',
    href: 'https://www.pinterest.com/d4rk7355608/',
    icon: 'palette',
  },
  {
    label: 'Send Email',
    href: 'mailto:contact.mihaicristiancondrea@gmail.com',
    icon: 'mail',
  },
  {
    label: 'X Profile',
    href: 'https://x.com/MihaiCrstian',
    icon: 'close',
  },
  {
    label: 'LinkedIn Profile',
    href: 'https://www.linkedin.com/in/mihai-cristian-condrea/',
    icon: 'person',
  },
];

export class AppFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer class="app-footer">
        <div class="footer-content">
          <nav class="social-icons" aria-label="Social links">
            ${profileLinks.map((link, index) => this.renderSocialLink(link, index)).join('')}
          </nav>
        </div>
        <div class="footer-copyright">Copyright © 2025-2026, Mihai-Cristian Condrea</div>
      </footer>
    `;
  }

  private renderSocialLink(link: SocialLink, index: number): string {
    return `
      <a href="${link.href}" ${link.href.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'} aria-label="${link.label}" title="${this.linkTitle(link.label)}" style="--item-index: ${index};">
        <md-icon-button value="">
          <md-icon aria-hidden="true">
            <span class="material-symbol">${link.icon}</span>
          </md-icon>
        </md-icon-button>
      </a>
    `;
  }

  private linkTitle(label: string): string {
    return label.replace(' Profile', '').replace(' Channel', '').replace('Send ', '');
  }
}

customElements.define('app-footer', AppFooter);
