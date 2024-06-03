import { createElement } from '~/utils/dom';

import './styles.css';

type TElementState = 'hidden' | 'check' | 'ready' | 'fail';

class Continue {
  private _el: HTMLDivElement;

  private _state: TElementState = 'check';

  constructor() {
    this._el = this.init();
  }

  get el() {
    return this._el;
  }

  get state() {
    return this._state;
  }

  set state(state: TElementState) {
    if (state === 'hidden') {
      this._el.classList.add('hidden');
    }
    if (state === 'check') {
      this._el.textContent = 'Check';
      this._el.classList.remove('hidden', 'ready', 'fail');
    }
    if (state === 'ready') {
      this._el.textContent = 'Continue';
      this._el.classList.remove('hidden', 'fail');
      this._el.classList.add('ready');
    }
    if (state === 'fail') {
      this._el.classList.remove('hidden', 'ready');
      this._el.classList.add('fail');
    }
  }

  private init() {
    return createElement<HTMLDivElement>('div', {
      className: 'puzzle__source_btn hidden',
      textContent: 'Check',
    });
  }
}

const continueButton = new Continue();
export default continueButton;
