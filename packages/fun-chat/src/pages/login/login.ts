import socket from '~/api/ws/socket';
import { TUser } from '~/api/ws/types';
import router from '~/services/router';
import state from '~/services/state';
import { createElement } from '~/utils/dom';
import LoginForm from '~/widgets/login/login';

import styles from './styles.module.css';

const srcChar = './image/people-02.svg';

const login = () => {
  const checkUser = (field: string) => {
    if (field === 'user') {
      const user = state.get('user') as TUser;
      if (user && user.isLogined && socket.readyState === 1) {
        queueMicrotask(() => router.go('chat'));
      }
    }
  };
  state.on(state.EVENT_UPDATE, checkUser);

  const title = createElement('h1', {
    className: styles.login__header,
    textContent: 'Login',
  });
  const wrapper = createElement('div', { className: styles.login__wrapper });
  const char = createElement<HTMLImageElement>('img', {
    className: styles.login__char,
    src: srcChar,
    alt: 'login',
  });
  wrapper.append(new LoginForm().el, char);

  const el = createElement('section', { className: styles.login });
  el.append(title, wrapper);

  return el;
};

export default login;
