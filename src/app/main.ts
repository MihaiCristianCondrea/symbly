import { SymblyApp } from './app';
import './styles';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Symbly root element was not found.');
}

new SymblyApp().mount(root);
