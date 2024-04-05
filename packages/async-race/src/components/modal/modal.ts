import { createElement } from '~/utils/dom';

import './styles.css';

const srcClose = './icons/close.svg';

class Modal {
  private _el: HTMLElement;

  private _inner: HTMLElement;

  constructor() {
    const { modal, inner } = this.init();
    this._el = modal;
    this._inner = inner;
  }

  public get el() {
    return this._el;
  }

  public show(fragment: DocumentFragment) {
    this._el.classList.remove('hidden');
    this._inner.innerHTML = '';
    this._inner.append(fragment);
  }

  public close = () => {
    this._el.classList.add('hidden');
  };

  private handleClick = (event: MouseEvent) => {
    const { target, currentTarget } = event;
    if (target === currentTarget) {
      event.preventDefault();
      this.close();
    }
  };

  private init = () => {
    const modal = createElement('div', {
      className: 'modal hidden',
      onClick: this.handleClick,
    });
    const outer = createElement('div', { className: 'modal__outer' });
    const close = createElement('div', { className: 'modal__close', onClick: this.close });
    const closeImg = createElement('img', { src: srcClose });
    close.append(closeImg);
    const inner = createElement('div', { className: 'modal__inner' });
    outer.append(close, inner);
    modal.append(outer);

    return { modal, inner };
  };
}

const modal = new Modal();
export default modal;
