import { createElement } from '~/utils/dom';
import connection from './connection/connection';
import Messages from './messenger/messenger';
import ChatModel from './model';
import styles from './styles.module.scss';
import Users from './users/users';

export default class ChatView extends ChatModel {
  protected $el: HTMLElement;
  protected _users: Users;
  protected _messages: Messages;

  constructor() {
    super();
    this.$el = createElement('section', { className: styles.chat });
    this._users = new Users(this.eventBus);
    this._messages = new Messages(this.eventBus);
    this.$el.append(this._users.el, this._messages.el, connection.el);
  }
}
