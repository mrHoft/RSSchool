import { createElement } from '~/utils/dom';
import styles from './styles.module.scss';

const urlSend = './icons/send.svg';

export default class MessageBoxView {
  protected $el: HTMLElement;
  protected $box: HTMLDivElement;
  protected $btnSend: HTMLButtonElement;

  constructor() {
    this.$el = createElement('div', { className: styles.chat__enter });
    this.$box = createElement<HTMLDivElement>('div', {
      className: `${styles.chat__enter_box} scrolled`,
    });
    this.$box.classList.add('disabled');
    this.$box.setAttribute('data-placeholder', 'Message text');
    this.$btnSend = createElement<HTMLButtonElement>('button', {
      className: styles.chat__enter_btn,
    });
    this.$btnSend.disabled = true;
    const imgSend = createElement<HTMLImageElement>('img', {
      className: styles.chat__enter_img,
      src: urlSend,
      alt: 'send',
    });
    this.$btnSend.append(imgSend);
    this.$el.append(this.$box, this.$btnSend);
  }

  public get el() {
    return this.$el;
  }
}
