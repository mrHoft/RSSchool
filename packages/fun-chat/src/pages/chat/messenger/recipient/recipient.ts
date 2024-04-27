import { TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import getAvatar from '~/utils/avatar';
import RecipientView from './view';

export default class Recipient extends RecipientView {
  private eventBus: EventBus;
  private _recipient: TUser | null = null;

  constructor(eventBus: EventBus) {
    super();
    this.eventBus = eventBus;
    this.eventBus.on('recipient', this.recipientChange);
    this.eventBus.on('recipientUpdate', this.recipientChange);
  }

  private recipientChange = (recipient: TUser) => {
    this._recipient = recipient;
    this.$avatar.classList.remove('invert');
    this.$avatar.src = getAvatar(this._recipient.login);
    this.$name.innerText = this._recipient.login;
    this.$name.dataset.online = ` (${this._recipient.isLogined ? 'online' : 'offline'})`;
  };
}
