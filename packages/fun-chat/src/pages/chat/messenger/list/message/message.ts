import contextMenu from '@/context/menu.ts';
import { TMessage, TUser } from '~/api/ws/types';
import { formatTime } from '~/utils/dates';
import { createElement } from '~/utils/dom';
import parse from '~/utils/parser';

import styles from './styles.module.scss';

const imgStatus = {
  delivered: './icons/mark_check.svg',
  readed: './icons/mark_doublecheck.svg',
};

export default class Message {
  private _user: TUser;
  private _msg: TMessage;
  private $el: HTMLElement & { data?: TMessage };

  constructor(message: TMessage, user: TUser, observer: IntersectionObserver | null) {
    this._user = user;
    this._msg = message;
    this.$el = this.createElement();
    this.$el.data = message;
    if (observer) observer.observe(this.$el);
  }

  private clickHandler = (event: MouseEvent) => {
    event.preventDefault();
    contextMenu.show(event.clientX, event.clientY, this._msg.id, this._msg.text);
  };

  private createElement() {
    const out = this._user.login === this._msg.from;
    const el = createElement('div', { className: out ? styles.message__out : styles.message__in });
    if (out) el.addEventListener('contextmenu', this.clickHandler);
    const header = createElement('div', { className: styles.message__header });
    const name = out ? 'you:' : `${this._msg.from}:`;
    const from = createElement('div', { className: styles.message__from, textContent: name });
    const time = formatTime(this._msg.datetime);
    const date = createElement('div', { className: styles.message__date, textContent: time });
    header.append(from, date);
    el.append(header, parse(this._msg.text));

    const { status } = this._msg;
    if (out && (status.isDelivered || status.isReaded)) {
      const read = createElement<HTMLImageElement>('img', {
        className: styles.message__status,
        alt: '',
        src: status.isReaded ? imgStatus.readed : imgStatus.delivered,
      });
      el.append(read);
    }
    if (status.isEdited) {
      const edit = createElement('span', {
        className: styles.message__edited,
        textContent: 'edited',
      });
      el.append(edit);
    }
    return el;
  }

  public get el() {
    return this.$el;
  }
}
