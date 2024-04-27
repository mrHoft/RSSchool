import type { TMessage, TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import state from '~/services/state';
import { debounce } from '~/utils/throttle';
import UserView from './view';

export default class User extends UserView {
  private eventBus: EventBus;
  private _user: TUser;

  constructor(eventBus: EventBus, user: TUser, recipient: TUser | null) {
    super();
    this.eventBus = eventBus;
    this._user = user;
    const { login: name, isLogined = false } = user;
    this.updateUser(name);
    this.updateStatus(isLogined);
    this.$el.addEventListener('click', this.clickHandler);
    if (recipient && recipient.login === this._user.login) {
      this.$el.setAttribute('selected', 'true');
    }

    const updateMessages = debounce<string>(this.updateMessages, 500);
    state.on(state.EVENT_UPDATE, (arg: string) => {
      const field = arg.split('.').slice(0, 2).join('.');
      if (field === `messages.${name}`) updateMessages(field);
    });
    eventBus.on('recipient', this.recipientChange);
  }

  private recipientChange = (recipient: TUser) => {
    if (recipient.login !== this._user.login) {
      this.$el.removeAttribute('selected');
    } else {
      this.$el.setAttribute('selected', 'true');
    }
  };

  private clickHandler = () => {
    this.eventBus.emit('recipient', this._user);
  };

  private updateMessages = () => {
    const { login: name } = this._user;
    const messages = state.get(`messages.${name}`) as TMessage[];
    if (messages && Array.isArray(messages) && messages.length) {
      const unreaded = messages.reduce((acc, message) => {
        if (message.from === name && !message.status.isReaded && !message.status.isDeleted) {
          acc += 1;
        }
        return acc;
      }, 0);
      this.updateUnreaded(unreaded);

      const last = this.getLastMessage(messages);
      if (last) {
        const from = last.from === name ? '' : 'you: ';
        this.updateLastMessage(`${from}${last.text}`);
      }
    }
  };

  private getLastMessage(messages: TMessage[]) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const message = messages[i];
      if (!message.status.isDeleted) return message;
    }
    return null;
  }
}
