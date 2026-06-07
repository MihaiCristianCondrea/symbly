class MdSnackbar extends HTMLElement {
  labelText = '';
  show() { this.setAttribute('open', ''); setTimeout(() => this.removeAttribute('open'), 2400); }
}
customElements.define('md-snackbar', MdSnackbar);
export {};
