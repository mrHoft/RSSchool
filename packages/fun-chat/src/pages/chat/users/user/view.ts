import getAvatar from '~/utils/avatar';
import { createElement } from '~/utils/dom';
import styles from './styles.module.scss';

export default class UserView {
  protected $el: HTMLElement;
  protected $avatar: HTMLImageElement;
  protected $name: HTMLElement;
  protected $status: HTMLElement;
  protected $unreaded: HTMLElement;
  protected $lastMessage: HTMLElement;

  constructor() {
    this.$el = createElement('li', { className: styles.chat__user });
    const userWrap = createElement('div', { className: styles.chat__user_wrap });
    this.$avatar = createElement<HTMLImageElement>('img', {
      className: styles.chat__user_avatar,
      alt: '',
    });
    this.$name = createElement('div', { className: styles.chat__user_name });
    userWrap.append(this.$avatar, this.$name);
    this.$status = createElement('div', { className: styles.chat__user_status });
    this.$unreaded = createElement('div', { className: `${styles.chat__user_unreaded} hidden` });
    this.$lastMessage = createElement('div', { className: styles.chat__user_message });
    this.$el.append(userWrap, this.$status, this.$unreaded, this.$lastMessage);
  }

  protected updateUser(name: string) {
    this.$avatar.src = getAvatar(name);
    this.$name.textContent = name;
  }

  protected updateUnreaded(val: number) {
    this.$unreaded.textContent = val.toString();
    this.$unreaded.classList.toggle('hidden', val === 0);
  }

  protected updateLastMessage(text: string) {
    this.$lastMessage.textContent = text;
  }

  protected updateStatus(online: boolean) {
    if (online) {
      this.$status.setAttribute('online', 'true');
    } else {
      this.$status.removeAttribute('online');
    }
  }

  public get el() {
    return this.$el;
  }
}
