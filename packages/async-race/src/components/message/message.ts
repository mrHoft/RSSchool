import { createElement } from '~/utils/dom';

import styles from './styles.module.css';

class Message {
  private $el: HTMLElement;
  private $text: HTMLElement;
  private $icon: HTMLElement;
  private _timer: NodeJS.Timeout | null = null;

  constructor() {
    const { message, text, icon } = this.init();
    this.$el = message;
    this.$text = text;
    this.$icon = icon;
  }

  public get el() {
    return this.$el;
  }

  public show(text: string, mode: 'regular' | 'error' = 'regular') {
    this.$el.classList.remove('hidden');
    this.$text.textContent = text;
    if (mode === 'error') {
      this.$icon.textContent = '\u274C';
      this.$icon.style.backgroundColor = 'gray';
    } else {
      this.$icon.textContent = '\u2714';
      this.$icon.removeAttribute('style');
    }
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._timer = setTimeout(() => this.$el.classList.add('hidden'), 3000);
  }

  private init = () => {
    const message = createElement('div', { className: `${styles.message__wrapper} hidden` });
    const icon = createElement('div', { className: styles.message__icon, textContent: '\u2714' });
    const text = createElement('div', { className: styles.message__text });
    message.append(icon, text);

    return { message, text, icon };
  };
}

const message = new Message();
export default message;
