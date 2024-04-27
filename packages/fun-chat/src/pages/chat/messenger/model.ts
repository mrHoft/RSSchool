import { TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';

export default class MessagesModel {
  protected eventBus: EventBus;
  protected _user: TUser | null = null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
}
