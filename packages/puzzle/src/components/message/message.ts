import { createElement } from '~/utils/dom';

import styles from './styles.module.css';

class Message {
  private _el: HTMLElement;

  private _text: HTMLElement;

  private _timer: NodeJS.Timeout | null = null;

  constructor() {
    const { message, text } = this.init();
    this._el = message;
    this._text = text;
  }

  public get el() {
    return this._el;
  }

  public show(text: string) {
    this._el.classList.remove('hidden');
    this._text.textContent = text;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._timer = setTimeout(() => this._el.classList.add('hidden'), 3000);
  }

  private init = () => {
    const message = createElement('div', { className: `${styles.message__wrapper} hidden` });
    const icon = createElement('div', { className: styles.message__icon, textContent: '\u2714' });
    const text = createElement('div', { className: styles.message__text });
    message.append(icon, text);

    return { message, text };
  };
}

const message = new Message();
export default message;
