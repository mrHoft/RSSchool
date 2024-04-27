import state from '~/services/state';
import uuid from '~/utils/uuid';
import chatBot from './bot';
import type {
  TEditRequest,
  TMessage,
  TRequest,
  TResponse,
  TResponseMessage,
  TResponseMessages,
  TResponseType,
  TResponseUsers,
  TSendRequest,
  TUser,
} from './types';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'ws://localhost:4000';

type TCallbacks = {
  login: ((data: TResponse) => void) | null;
  logout: ((data: TResponse) => void) | null;
  users: ((data: TUser[]) => void) | null;
  messages: ((data: TMessage[]) => void) | null;
  connection: ((readyState: number) => void) | null;
};

class Socket {
  private socket: WebSocket | null = null;
  private action: TResponseType = 'ERROR';
  private server = API_URL;
  private _user: TUser | undefined = undefined;
  private _timer = 0;
  private _callbacks: TCallbacks = {
    login: null,
    logout: null,
    users: null,
    messages: null,
    connection: null,
  };
  private getUsersHandler = this.collectUsers();

  public get readyState() {
    return this.socket?.readyState;
  }

  private connect(url?: string, openCallback?: () => void) {
    if (this.socket) this.socket.close();
    if (url) this.server = url;
    this.socket = new WebSocket(this.server);
    this.socket.addEventListener('error', () => {
      if (this._callbacks.login) {
        this._callbacks.login({ type: 'ERROR', payload: { error: 'Unable to connect' } });
        this._callbacks.login = null;
      }
    });
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('open', () => {
      clearInterval(this._timer);
      if (openCallback) openCallback();
      if (this._callbacks.connection) this._callbacks.connection(1);
      chatBot.connect(this.server);
    });
    this.socket.addEventListener('close', () => {
      if (this._callbacks.connection) {
        this._callbacks.connection(3);
        clearInterval(this._timer);
        this._timer = window.setInterval(() => {
          if (this.socket?.readyState !== 0) this.connect();
        }, 1000);
      }
    });
  }

  public addConnectionCallback(callback: (readyState: number) => void) {
    this._callbacks.connection = callback;
  }

  private send<T = TRequest>(requestData: T) {
    if (this.socket?.readyState !== 1) {
      state.set('user', null);
      return;
    }
    this.socket.send(JSON.stringify(requestData));
  }

  private loginHandler(response: TResponse) {
    if (this._callbacks.login) {
      this._callbacks.login(response);
      this._callbacks.login = null;
    }
  }

  private logoutHandler(response: TResponse) {
    if (this._callbacks.logout) {
      this._callbacks.logout(response);
      this._callbacks.logout = null;
    }
  }

  private externalHandler(response: TResponse) {
    if (response.type === 'USER_EXTERNAL_LOGIN' || response.type === 'USER_EXTERNAL_LOGOUT') {
      const users = (state.get('users') ?? []) as TUser[];
      const len = users.length;
      for (let i = 0; i < len; i += 1) {
        if (users[i].login === response.payload.user?.login) {
          users[i].isLogined = response.type === 'USER_EXTERNAL_LOGIN';
          state.set('users', users);
          return;
        }
      }
      users.push(response.payload.user!);
      state.set('users', users);
    }
  }

  private collectUsers() {
    let users: TUser[] = [];
    let counter = 0;
    return (response: TResponseUsers) => {
      users.push(...response.payload.users);
      counter += 1;
      if (counter >= 2) {
        counter = 0;
        if (this._callbacks.users) {
          this._callbacks.users(users);
          this._callbacks.users = null;
        }
        users.forEach(user => {
          if (user.login !== this._user?.login) this.getMessages(user);
        });
        users = [];
      }
    };
  }

  private getMessagesHandler(response: TResponseMessages) {
    const {
      id,
      payload: { messages },
    } = response;
    const from = id.substring(9);
    if (this._callbacks.messages) {
      this._callbacks.messages(messages ?? []);
      this._callbacks.messages = null;
    }
    if (messages && Array.isArray(messages)) {
      state.set(`messages.${from}`, messages);
    }
  }

  private getMessageHandler(response: TResponseMessage) {
    const {
      payload: { message },
    } = response;
    if (message) {
      const user = this._user?.login === message.from ? message.to : message.from;
      state.add(`messages.${user}`, message);
    }
  }

  private messageStateHandler({ payload }: TResponseMessage) {
    const { message } = payload;
    if (message && message.from !== this._user?.login) {
      const result = this.findMessage(message.id);
      if (result) {
        const { user, index } = result;
        state.set(`messages.${user}.${index}.status.isReaded`, true);
      }
    }
  }

  private messageDeleteHandler({ payload }: TResponseMessage) {
    const { message } = payload;
    if (message && message.status.isDeleted) {
      const result = this.findMessage(message.id);
      if (result) {
        const { user, index } = result;
        state.set(`messages.${user}.${index}.status.isDeleted`, true);
      }
    }
  }

  private messageEditHandler({ payload }: TResponseMessage) {
    const { message } = payload;
    if (message && message.status.isEdited) {
      const result = this.findMessage(message.id);
      if (result) {
        const { user, index, data } = result;
        state.set(`messages.${user}.${index}`, {
          ...data,
          text: message.text,
          status: { ...data.status, isEdited: true },
        });
      }
    }
  }

  private findMessage(id: string): { user: string; index: number; data: TMessage } | null {
    const all = state.get('messages') as Record<string, TMessage[]>;
    if (all) {
      const users = Object.keys(all);
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        const messages = all[user];
        for (let index = 0; index < messages.length; index += 1) {
          if (messages[index].id === id) {
            return { user, index, data: messages[index] };
          }
        }
      }
    }
    return null;
  }

  private onMessage = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as TResponse;
    let { type } = data;
    if (type === 'ERROR') {
      type = this.action;
    }
    if (type === 'USER_LOGIN') {
      this.loginHandler(<TResponse>data);
      return;
    }
    if (type === 'USER_LOGOUT') {
      this.logoutHandler(<TResponse>data);
      return;
    }
    if (type === 'USER_EXTERNAL_LOGIN' || data.type === 'USER_EXTERNAL_LOGOUT') {
      this.externalHandler(<TResponse>data);
      return;
    }
    if (type === 'USER_ACTIVE' || data.type === 'USER_INACTIVE') {
      this.getUsersHandler(<TResponseUsers>data);
      return;
    }
    if (type === 'MSG_FROM_USER') {
      this.getMessagesHandler(<TResponseMessages>data);
      return;
    }
    if (type === 'MSG_SEND') {
      this.getMessageHandler(<TResponseMessage>data);
      return;
    }
    if (type === 'MSG_READ') {
      this.messageStateHandler(<TResponseMessage>data);
      return;
    }
    if (type === 'MSG_DELETE') {
      this.messageDeleteHandler(<TResponseMessage>data);
      return;
    }
    if (type === 'MSG_EDIT') {
      this.messageEditHandler(<TResponseMessage>data);
    }
  };

  public requestLogin(user: TUser, callback: (data: TResponse) => void) {
    this._callbacks.login = callback;
    this._user = user;
    const requestData: TRequest = {
      id: uuid(),
      type: 'USER_LOGIN',
      payload: { user },
    };
    this.action = requestData.type;
    if (!this.socket || this.socket?.readyState === 3 || this.server !== user.server) {
      this.connect(user.server ?? API_URL, () => this.send(requestData));
    } else {
      this.send(requestData);
    }
  }

  public requestLogout(callback: (data: TResponse) => void) {
    this._callbacks.logout = callback;
    if (this._user) {
      const requestData: TRequest = {
        id: this._user.id ?? 'unknown',
        type: 'USER_LOGOUT',
        payload: {
          user: {
            login: this._user.login,
            password: this._user.password,
          },
        },
      };
      this.send(requestData);
    } else throw new Error('not looged in');
  }

  public requestGetUsers(callback: (data: TUser[]) => void) {
    this._callbacks.users = callback;
    const requestData: TRequest = {
      id: uuid(),
      type: 'USER_ACTIVE',
      payload: null,
    };
    this.send(requestData);
    this.send({ ...requestData, type: 'USER_INACTIVE' });
  }

  public getMessages(user: TUser) {
    if (this._user) {
      const requestData: TRequest = {
        id: `MSG_FROM_${user.login}`,
        type: 'MSG_FROM_USER',
        payload: { user },
      };
      this.send(requestData);
    }
  }

  public sendMessage(to: string, text: string) {
    const requestData: TSendRequest = {
      id: uuid(),
      type: 'MSG_SEND',
      payload: { message: { to, text } },
    };
    this.send<TSendRequest>(requestData);
  }

  public markMessageAsReaded(id: string) {
    const requestData: TEditRequest = {
      id: uuid(),
      type: 'MSG_READ',
      payload: { message: { id } },
    };
    this.send<TEditRequest>(requestData);
  }

  public markAllRead = (recipient: TUser) => {
    const messages = state.get(`messages.${recipient.login}`) as TMessage[];
    const unreaded = messages.filter(
      item => item.from !== this._user?.login && !item.status.isReaded,
    );
    unreaded.forEach(item => this.markMessageAsReaded(item.id));
  };

  public deleteMessage(id: string) {
    const requestData: TEditRequest = {
      id: uuid(),
      type: 'MSG_DELETE',
      payload: { message: { id } },
    };
    this.send<TEditRequest>(requestData);
  }

  public editMessage(id: string, text: string) {
    const requestData: TEditRequest = {
      id: uuid(),
      type: 'MSG_EDIT',
      payload: { message: { id, text } },
    };
    this.send<TEditRequest>(requestData);
  }
}

const socket = new Socket();
export default socket;
