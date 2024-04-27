import { TMessage, TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';

export default class MessagesListModel {
  protected eventBus: EventBus;
  protected _messagesCount = 0;
  protected _unreadId: string | null = null;
  protected _messages: TMessage[] = [];
  protected _user: TUser | null = null;
  protected _recipient: TUser | null = null;
  protected _observer: IntersectionObserver | null = null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
}
