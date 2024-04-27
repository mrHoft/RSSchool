import socket from '~/api/ws/socket';
import { TResponse, TUser } from '~/api/ws/types';
import connect from '~/services/connect';
import Construct from '~/services/construct';
import router from '~/services/router';
import state from '~/services/state';
import store from '~/services/store';
import { eventBusTheme } from '~/ui/theme/theme';
import getAvatar from '~/utils/avatar';
import { createElement } from '~/utils/dom';
import styles from './styles.module.css';

const urlUser = './icons/user.svg';
const urlLogout = './icons/logout.svg';

export default class User {
  private $component: Construct;
  private $avatar: HTMLImageElement;
  private $name: HTMLElement;
  private $btnImg: HTMLImageElement;
  private _user: TUser | null = null;

  constructor() {
    const { component, avatar, name, btnImg } = this.createElement();
    this.$component = component;
    this.$avatar = avatar;
    this.$name = name;
    this.$btnImg = btnImg;
    eventBusTheme.on('theme', this.themeUpdate);
    this.performLogin();
  }

  private themeUpdate = (dark: boolean) => {
    this.$btnImg.classList.toggle('invert', !dark);
  };

  private performLogin() {
    const data = (store.get('user') as TUser) ?? null;

    if (data && data.isLogined) {
      const callback = (response: TResponse) => {
        const { type, payload } = response;
        if (type === 'ERROR_500') {
          router.go('500');
        }
        if (type === 'USER_LOGIN') {
          state.set('user', {
            id: response.id,
            login: payload.user?.login,
            isLogined: true,
            password: data.password,
          });
        } else {
          state.set('user', null);
        }
      };
      socket.requestLogin(data, callback);
    } else {
      state.set('user', null);
    }
  }

  private performLogout() {
    if (this._user) {
      const callback = (response: TResponse) => {
        const { type } = response;
        if (type === 'USER_LOGOUT') {
          state.set('user', null);
          store.set('user.isLogined', false);
        }
      };
      socket.requestLogout(callback);
    }
  }

  private mapUserToProp = (obj: Indexed) => obj.user as Indexed;

  private clickHandler = () => {
    if (this._user) this.performLogout();
    router.go('login');
  };

  private updateCallback = (data?: Indexed) => {
    if (data) {
      this._user = data as TUser;
      this.$avatar.src = getAvatar(this._user.login);
      this.$avatar.classList.remove('hidden');
      this.$btnImg.src = urlLogout;
      this.$name.textContent = this._user.login.slice(0, 10);
    } else {
      this._user = null;
      this.$avatar.classList.add('hidden');
      this.$btnImg.src = urlUser;
      this.$name.textContent = '';
    }
  };

  private createElement() {
    const avatar = createElement<HTMLImageElement>('img', {
      className: styles.user__avatar,
      src: this._user ? getAvatar(this._user.login) : '',
      alt: '',
    });
    if (!this._user) avatar.classList.add('hidden');
    const name = createElement('div', {
      className: styles.user__name,
      textContent: this._user ? this._user.login : '',
    });
    const button = createElement('div', { className: styles.user__btn });
    const btnImg = createElement<HTMLImageElement>('img', {
      className: styles.user__btn_img,
      src: this._user ? urlLogout : urlUser,
      alt: '',
    });
    button.append(btnImg);
    button.addEventListener('click', this.clickHandler);

    const Component = connect(Construct, this.mapUserToProp);
    const component = new Component('div', {
      className: styles.user,
      child: [avatar, name, button],
      name: 'User',
      update: this.updateCallback,
    });

    return { component, avatar, name, btnImg };
  }

  public get el() {
    return this.$component.el;
  }
}
