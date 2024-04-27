import EventBus from '~/services/eventbus';
import { createElement } from '~/utils/dom';
import messageBox from '~/widgets/enter/enter';
import MessagesList from './list/list';
import MessagesModel from './model';
import Recipient from './recipient/recipient';
import styles from './styles.module.scss';

export default class MessagesView extends MessagesModel {
  protected $el: HTMLElement;
  protected _recipient: Recipient;
  protected _messages: MessagesList;

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.$el = createElement('div', { className: styles.chat__right });
    this._recipient = new Recipient(this.eventBus);
    this._messages = new MessagesList(this.eventBus);
    this.$el.append(this._recipient.el, this._messages.el, messageBox.el);
  }

  public get el() {
    return this.$el;
  }
}
