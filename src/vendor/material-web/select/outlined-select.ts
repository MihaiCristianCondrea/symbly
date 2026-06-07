interface SelectOptionData {
  value: string;
  label: string;
  selected: boolean;
}

class MdOutlinedSelect extends HTMLElement {
  private field?: HTMLButtonElement;
  private valueLabel?: HTMLSpanElement;
  private listbox?: HTMLUListElement;
  private documentClickListening = false;
  private options: SelectOptionData[] = [];

  connectedCallback() {
    this.render();
    if (!this.documentClickListening) {
      document.addEventListener('click', this.handleDocumentClick);
      this.documentClickListening = true;
    }
  }

  disconnectedCallback() {
    this.close();
    document.removeEventListener('click', this.handleDocumentClick);
    this.documentClickListening = false;
  }

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(nextValue: string) {
    this.setAttribute('value', nextValue);
    this.syncSelection();
  }

  private render() {
    if (this.field) {
      return;
    }

    this.options = Array.from(this.querySelectorAll('md-select-option')).map((optionElement) => ({
      value: optionElement.getAttribute('value') ?? '',
      label: optionElement.textContent?.trim() ?? optionElement.getAttribute('value') ?? '',
      selected: optionElement.hasAttribute('selected'),
    }));

    const selectedOption = this.options.find((option) => option.value === this.value) ?? this.options.find((option) => option.selected);
    if (selectedOption && !this.hasAttribute('value')) {
      this.setAttribute('value', selectedOption.value);
    }

    this.textContent = '';
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-expanded', 'false');

    this.field = document.createElement('button');
    this.field.type = 'button';
    this.field.className = 'md-select-field';
    this.field.setAttribute('aria-haspopup', 'listbox');
    this.field.setAttribute('aria-label', this.getAttribute('aria-label') ?? 'Select');

    this.valueLabel = document.createElement('span');
    this.valueLabel.className = 'md-select-value';

    const icon = document.createElement('span');
    icon.className = 'material-symbol md-select-caret';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'expand_more';

    this.field.append(this.valueLabel, icon);

    this.listbox = document.createElement('ul');
    this.listbox.className = 'md-select-listbox';
    this.listbox.setAttribute('role', 'listbox');
    this.listbox.hidden = true;

    this.options.forEach((option) => {
      const item = document.createElement('li');
      item.className = 'md-select-option';
      item.setAttribute('role', 'option');
      item.dataset.value = option.value;
      item.tabIndex = -1;
      item.textContent = option.label;
      item.addEventListener('click', () => this.choose(option.value));
      this.listbox?.append(item);
    });

    this.field.addEventListener('click', (event) => {
      event.stopPropagation();
      this.toggle();
    });

    this.addEventListener('keydown', (event) => this.handleKeydown(event as KeyboardEvent));
    this.append(this.field, this.listbox);
    this.syncSelection();
  }

  private handleDocumentClick = (event: MouseEvent) => {
    if (!this.contains(event.target as Node)) {
      this.close();
    }
  };

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
      this.field?.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.classList.contains('md-select-option')) {
        event.preventDefault();
        this.choose(target.dataset.value ?? '');
        return;
      }
    }
  }

  private toggle(): void {
    const open = this.getAttribute('aria-expanded') !== 'true';
    this.setOpen(open);
  }

  private close(): void { this.setOpen(false); }

  private setOpen(open: boolean): void {
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (this.listbox) {
      this.listbox.hidden = !open;
    }
  }

  private choose(nextValue: string): void {
    if (this.value !== nextValue) {
      this.value = nextValue;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
    this.close();
    this.field?.focus();
  }

  private syncSelection(): void {
    const selected = this.options.find((option) => option.value === this.value);
    const label = selected?.label ?? this.getAttribute('placeholder') ?? '';
    if (this.valueLabel) {
      this.valueLabel.textContent = label;
    }

    this.listbox?.querySelectorAll<HTMLElement>('.md-select-option').forEach((optionElement) => {
      const selectedOption = optionElement.dataset.value === this.value;
      optionElement.setAttribute('aria-selected', selectedOption ? 'true' : 'false');
    });
  }
}
customElements.define('md-outlined-select', MdOutlinedSelect);
export {};
