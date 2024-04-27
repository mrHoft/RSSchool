import { type TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';

export default class UsersModel {
  protected eventBus: EventBus;
  protected _user: TUser | null = null;
  protected _recipient: TUser | null = null;
  protected _users: TUser[] = [];
  protected _regExp = /(?:)/;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
}
