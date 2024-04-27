import socket from '~/api/ws/socket';
import type { TResponse, TUser } from '~/api/ws/types';
import router from '~/services/router';
import state from '~/services/state';
import store from '~/services/store';
import connection from './connection/connection';
import ChatView from './view';

export default class Chat extends ChatView {
  constructor() {
    super();
    state.on(state.EVENT_UPDATE, this.checkUser);
    socket.addConnectionCallback(this.connectionCallback);
    this.checkUser('user');
  }

  private connectionCallback = (readyState: number) => {
    if (readyState > 1) {
      this._disconnected = true;
      connection.show();
    }
    if (readyState === 1 && this._disconnected) {
      this._disconnected = false;
      connection.hide();
      const user = store.get('user') as TUser;
      if (user) {
        socket.requestLogin(user, (response: TResponse) => {
          const { type } = response;
          if (type !== 'ERROR') {
            this._users.updateUsersList();
          }
        });
      }
    }
  };

  private checkUser = (field: string) => {
    const user = state.get('user');
    if (field === 'user' && user === null) {
      state.off(state.EVENT_UPDATE, this.checkUser);
      if (socket.readyState === 1) {
        queueMicrotask(() => router.go('login'));
      } else {
        queueMicrotask(() => router.go('500'));
      }
    }
  };

  public get el() {
    this._users.updateUsersList();
    return this.$el;
  }
}
