import socket from '~/api/ws/socket';
import { TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import state from '~/services/state';
import User from './user/user';
import UsersView from './view';

export default class Users extends UsersView {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.eventBus.on('search', this.filter);
    state.on(state.EVENT_UPDATE, this.updateUsersList);
    this.eventBus.on('recipient', this.recipientChange);
  }

  private recipientChange = (recipient: TUser) => {
    this._recipient = recipient;
  };

  private filter = (regExp: RegExp) => {
    this._regExp = regExp;
    this.updateUsersList();
  };

  private sortOrder(a: TUser, b: TUser) {
    const am = (state.get(`messages.${a.login}`) as { datetime: number }[]) ?? [];
    const bm = (state.get(`messages.${b.login}`) as { datetime: number }[]) ?? [];
    const at = am.length ? am[am.length - 1].datetime : 0;
    const bt = bm.length ? bm[bm.length - 1].datetime : 0;
    if (at < bt || (!a.isLogined && b.isLogined) || a.login > b.login) return 1;
    if (at > bt || (a.isLogined && !b.isLogined) || a.login < b.login) return -1;
    return 0;
  }

  public updateUsersList = (field: string = 'user') => {
    if (field === 'user') {
      const user = state.get('user');
      if (user) {
        this._user = <TUser>user;
        this.getUsers();
        return;
      }
    }
    if (field === 'users') {
      const users = state.get('users') as TUser[];
      if (users && Array.isArray(users)) {
        if (this._user) {
          this._users = users.filter(user => {
            if (this._recipient?.login === user.login) {
              this._recipient = user;
              this.eventBus.emit('recipientUpdate', user);
            }
            return user.login !== this._user?.login;
          });
        }
        this.$users.replaceChildren(
          ...this._users
            .filter(user => user.login.match(this._regExp))
            .sort(this.sortOrder)
            .map(user => new User(this.eventBus, user, this._recipient).el),
        );
      }
    }
  };

  private getUsers() {
    const callback = (users: TUser[]) => {
      state.set('users', users);
    };
    socket.requestGetUsers(callback);
  }
}
