class MdOutlinedSelect extends HTMLElement {
  private select?: HTMLSelectElement;

  connectedCallback() { this.render(); }

  get value(): string { return this.select?.value ?? this.getAttribute('value') ?? ''; }
  set value(nextValue: string) {
    this.setAttribute('value', nextValue);
    if (this.select) {
      this.select.value = nextValue;
    }
  }

  private render() {
    if (this.select) {
      return;
    }

    const currentValue = this.getAttribute('value') ?? '';
    const options = Array.from(this.querySelectorAll('md-select-option'));
    const select = document.createElement('select');
    select.setAttribute('aria-label', this.getAttribute('aria-label') ?? 'Select');
    options.forEach((optionElement) => {
      const option = document.createElement('option');
      option.value = optionElement.getAttribute('value') ?? '';
      option.textContent = optionElement.textContent?.trim() ?? option.value;
      option.selected = option.value === currentValue || optionElement.hasAttribute('selected');
      select.append(option);
    });
    select.addEventListener('change', () => {
      this.setAttribute('value', select.value);
      this.dispatchEvent(new Event('change', { bubbles: true }));
    });
    this.textContent = '';
    this.append(select);
    this.select = select;
  }
}
customElements.define('md-outlined-select', MdOutlinedSelect);
export {};
