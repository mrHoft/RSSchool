import { createElement } from '~/utils/dom';

import './styles.css';

class Connection {
  private $el: HTMLElement;

  constructor() {
    this.$el = createElement('div', { className: 'loader hidden' });
    const loader = createElement('div', { className: 'loader__wrapper' });
    for (let i = 0; i < 3; i += 1) {
      loader.append(createElement('span', { className: 'loader__element' }));
    }
    this.$el.append(
      createElement('div', { textContent: 'Connection lost' }),
      createElement('div', { textContent: 'waiting for connection...' }),
      loader,
    );
  }

  public get el() {
    return this.$el;
  }

  public show() {
    this.$el.classList.remove('hidden');
  }

  public hide() {
    this.$el.classList.add('hidden');
  }
}

const connection = new Connection();
export default connection;
