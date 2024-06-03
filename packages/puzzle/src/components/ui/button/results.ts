import { createElement } from '~/utils/dom';

import './styles.css';

type TElementState = 'hidden' | 'ready';

class Results {
  private _el: HTMLDivElement;

  private _state: TElementState = 'hidden';

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
    if (state === 'ready') {
      this._el.classList.remove('hidden');
      this._el.classList.add('results');
    }
  }

  private init() {
    return createElement<HTMLDivElement>('div', {
      className: 'puzzle__source_btn hidden',
      textContent: 'Results',
    });
  }
}

const resultsButton = new Results();
export default resultsButton;
