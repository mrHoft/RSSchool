import message from '@/message/message';
import servers from '~/api/ws/servers';
import socket from '~/api/ws/socket';
import type { TResponse, TUser } from '~/api/ws/types';
import router from '~/services/router';
import state from '~/services/state';
import store from '~/services/store';
import FormSelect from '~/ui/select/select';
import { createElement } from '~/utils/dom';
import FormInput from '../../ui/input/input';
import FormSubmit from '../../ui/submit/submit';

import styles from './styles.module.css';

const validation = {
  login: {
    pattern: '^[A-Z][0-9a-z\\-_]+\\s*[0-9a-z\\-_]+$',
    description:
      "3-16 latin letters, numbers, space and '-_' symbols. First letter must be uppercase.",
    minLength: 3,
  },
  password: {
    pattern: '^[0-9A-Za-z\\-_]+$',
    description: "3-16 latin letters, numbers and '-_' symbols.",
    minLength: 3,
  },
};

export default class LoginForm {
  private $form: HTMLFormElement;
  private $desc: HTMLElement;
  private $button: FormSubmit;
  private $login: HTMLInputElement;
  private $password: HTMLInputElement;
  private $server: HTMLSelectElement;

  constructor() {
    const { form, login, password, server, desc, button } = this.createForm();
    this.$form = form;
    this.$desc = desc;
    this.$button = button;
    this.$login = login;
    this.$password = password;
    this.$server = server;
    this.recoverSavedData();
    this.$form.addEventListener('submit', this.formSubmitHandler);
  }

  private recoverSavedData() {
    const data = (store.get('user') as TUser) ?? null;
    if (data) {
      this.$login.value = data.login;
      this.$password.value = data.password;
      if (data.server) {
        const val = servers.indexOf(data.server) ?? 0;
        this.$server.value = val.toString();
      }
      this.$button.toggle(!this.isValid(this.formData));
    }
  }

  private formSubmitHandler = (event: Event) => {
    event.preventDefault();
    this.$button.loading(true);
    const data = this.formData;

    const callback = (response: TResponse) => {
      this.$button.loading(false);
      const { type, payload } = response;
      if (type === 'ERROR_500') {
        router.go('500');
      } else if (type === 'ERROR') {
        if (payload.error) this.$desc.textContent = payload.error;
      } else {
        state.set('user', { login: payload.user?.login, password: data.password, isLogined: true });
        store.set('user', {
          login: payload.user?.login,
          password: data.password,
          server: data.server,
          isLogined: true,
        });
        message.show('Successfully logged in');
        router.go('chat');
      }
    };

    socket.requestLogin(data, callback);
  };

  private get formData(): TUser {
    const formData = new FormData(this.$form);
    const select = Number(formData.get('server'));
    return {
      login: formData.get('login')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      server: servers[select ?? 0],
    };
  }

  private isValid(user: TUser) {
    const login =
      user.login.length >= validation.login.minLength &&
      user.login.match(validation.login.pattern) !== null;
    const password =
      user.password.length >= validation.password.minLength &&
      user.password.match(validation.password.pattern) !== null;
    return login && password;
  }

  private createForm() {
    const form = createElement<HTMLFormElement>('form', { className: styles.login__form });
    const button = new FormSubmit({ children: 'Login', disabled: true });

    const inputHandler = () => {
      button.toggle(!this.isValid(this.formData));
    };

    const login = new FormInput({
      name: 'login',
      placeholder: 'Name',
      minLength: validation.login.minLength.toString(),
      pattern: validation.login.pattern,
      title: validation.login.description,
      onInput: inputHandler,
    });
    const password = new FormInput({
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      minLength: validation.password.minLength.toString(),
      pattern: validation.password.pattern,
      title: validation.password.description,
      onInput: inputHandler,
    });
    const server = new FormSelect({
      name: 'server',
      options: servers,
      placeholder: 'Select server',
    });

    const desc = createElement('p', { className: styles.login__message, textContent: '' });
    form.append(login.el, password.el, server.el, desc, button.el);

    return {
      form,
      login: login.input,
      password: password.input,
      server: server.select,
      desc,
      button,
    };
  }

  public get el() {
    return this.$form;
  }
}
