import { createElement } from '~/utils/dom';
import styles from './styles.module.scss';

const srcDefaultAvater = './icons/user.svg';

export default class RecipientView {
  protected $el: HTMLElement;
  protected $avatar: HTMLImageElement;
  protected $name: HTMLElement;

  constructor() {
    this.$el = createElement('div', { className: styles.chat__recipient });
    const avatar = createElement('div', { className: styles.chat__recipient_avatar });
    this.$avatar = createElement<HTMLImageElement>('img', {
      className: styles['chat__recipient_avatar-img'],
      src: srcDefaultAvater,
      alt: '',
    });
    avatar.append(this.$avatar);
    this.$name = createElement('div', {
      className: styles.chat__recipient_name,
      textContent: 'Select user to start chatting',
    });
    this.$el.append(avatar, this.$name);
  }

  public get el() {
    return this.$el;
  }
}
