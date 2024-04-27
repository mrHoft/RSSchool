import socket from '~/api/ws/socket';
import { TMessage, TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import state from '~/services/state';
import { formatDate } from '~/utils/dates';
import { createElement } from '~/utils/dom';
import { debounce } from '~/utils/throttle';
import Message from './message/message';
import noMessages from './noMessages/noMessages';
import styles from './styles.module.scss';
import MessagesListView from './view';

export default class MessagesList extends MessagesListView {
  protected _scrollDebounce: (arg: unknown) => void;

  constructor(eventBus: EventBus) {
    super(eventBus);
    this._user = <TUser>state.get('user');

    // Update messages event listener
    eventBus.on('recipient', this.recipientChange);
    const updateMessages = debounce<string>(this.updateMessages, 250);
    state.on(state.EVENT_UPDATE, (arg: string) => {
      updateMessages(arg.split('.').slice(0, 2).join('.'));
    });

    // Mark messages as readed on scroll
    /* Disabled for the cross-check
    const callback = debounce<Element>((el: Element) => {
      const { data } = el as Element & { data?: TMessage };
      if (data && !data.status.isReaded && data.from !== this._user?.login) {
        socket.markMessageAsReaded(data.id);
      }
    }, 100);
    const options = { root: this.$el, rootMargin: '0px', threshold: 1.0 };
    this._observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio === 1) callback(entry.target);
      });
    }, options);
 */
    // Remove new messages separator on click or scroll messages area
    this.$el.addEventListener('click', this.resetSeparator);
    const scrollCallback = debounce(this.resetSeparator, 250);
    this._scrollDebounce = () => scrollCallback('scroll');
  }

  private resetSeparator = () => {
    if (this._unreadId && this._recipient) {
      this._unreadId = null;
      socket.markAllRead(this._recipient);
    }
  };

  private recipientChange = (recipient: TUser) => {
    this._recipient = recipient;
    this._unreadId = null;
    this.requestMessages();
  };

  private requestMessages() {
    if (this._recipient) {
      this._messagesCount = 0;
      socket.getMessages(this._recipient);
    }
  }

  public updateMessages = (field: string = 'messages') => {
    if (field === 'user') {
      const user = state.get('user');
      if (user) {
        this._user = <TUser>user;
      }
    }
    if (field.startsWith('messages')) {
      const from = field.split('.');
      if (this._recipient) {
        const { login: name } = this._recipient;
        if (from[1] && from[1] === name) {
          const messages = state.get(`messages.${name}`) as TMessage[];
          if (messages && Array.isArray(messages)) {
            this._messages = messages.filter(item => !item.status.isDeleted);
            this.showMessages();
          }
        }
      }
    }
  };

  private showMessages() {
    if (this._user) {
      const { scrollTop } = this.$el;
      let lastDate = '';
      let hr: HTMLElement | null = null;
      const len = this._messages.length;
      if (len) {
        const arr: HTMLElement[] = [];
        this._unreadId = null;
        for (let i = 0; i < len; i += 1) {
          const message = this._messages[i];
          const date = formatDate(message.datetime);
          if (date !== lastDate) {
            lastDate = date;
            arr.push(
              createElement('div', { className: styles.chat__messages_date, textContent: date }),
            );
          }
          const isNew =
            message.from !== this._user.login && !message.status.isReaded && !this._unreadId;
          if (message.id === this._unreadId || isNew) {
            if (!this.haveAnswear(i)) {
              this._unreadId = message.id;
              hr = createElement('hr', { className: styles.chat__messages_hr });
              arr.push(hr);
            }
          }
          arr.push(new Message(message, this._user!, this._observer).el);
        }
        this.$el.replaceChildren(...arr.reverse());
      } else if (this._recipient) {
        this.$el.replaceChildren(noMessages(this._recipient));
      }

      this.$el.removeEventListener('scroll', this._scrollDebounce);
      if (hr) {
        hr.scrollIntoView();
      } else if (this._messagesCount !== len) {
        this._messagesCount = len;
        this.$el.firstElementChild?.scrollIntoView();
      } else {
        this.$el.scrollTop = scrollTop;
      }
      setTimeout(() => {
        this.$el.addEventListener('scroll', this._scrollDebounce);
      }, 500);
    }
  }

  private haveAnswear(n: number) {
    const len = this._messages.length;
    for (let i = n; i < len; i += 1) {
      const message = this._messages[i];
      if (message.from === this._user?.login) return true;
    }
    return false;
  }
}
