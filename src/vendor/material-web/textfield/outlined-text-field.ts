class MdOutlinedTextField extends HTMLElement {
  private input?: HTMLInputElement;

  connectedCallback() { this.render(); }

  get value(): string { return this.input?.value ?? ''; }
  set value(nextValue: string) {
    if (!this.input) {
      this.render();
    }
    if (this.input) {
      this.input.value = nextValue;
    }
  }

  private render() {
    if (this.input) {
      return;
    }

    this.setAttribute('role', 'search');
    const leading = Array.from(this.querySelectorAll('[slot="leading-icon"]'));
    const trailing = Array.from(this.querySelectorAll('[slot="trailing-icon"]'));
    const input = document.createElement('input');
    input.type = this.getAttribute('type') ?? 'text';
    input.placeholder = this.getAttribute('placeholder') ?? '';
    input.autocomplete = this.getAttribute('autocomplete') ?? 'off';
    input.setAttribute('aria-label', this.getAttribute('aria-label') ?? this.getAttribute('label') ?? 'Text field');
    input.value = this.getAttribute('value') ?? '';
    this.textContent = '';
    leading.forEach((node) => this.append(node));
    this.append(input);
    trailing.forEach((node) => this.append(node));
    this.input = input;
  }
}
customElements.define('md-outlined-text-field', MdOutlinedTextField);
export {};
