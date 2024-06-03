import router from '~/utils/Router';
import { createElement } from '~/utils/dom';
import { FormInput, FormSubmit } from '@/ui';
import { setUser, type TUser } from '~/api/user/user';
import message from '../message/message';

import styles from './styles.module.css';

const srcChar = './assets/cute-chibi-fox-boy2.png';

const formSubmitHandler = (event: Event) => {
  const form = event.currentTarget as HTMLFormElement;
  if (form) {
    const formData = new FormData(form);
    const data: TUser = {
      name: formData.get('name')?.toString() || '',
      surname: formData.get('surname')?.toString() || '',
    };

    setUser(data);
    event.preventDefault();
    message.show('Successfully registered');
    router.go('/');
  }
};

const pattern = '^[A-Z][a-z\\-]+';
const validationDescription =
  "latin letters and the hyphen ('-') symbol. First letter must be uppercase.";

class Valid {
  private _name: string;

  private _surname: string;

  private pattern = pattern;

  private minLength = {
    name: 3,
    surname: 4,
  };

  constructor(name: string, surname: string) {
    this._name = name;
    this._surname = surname;
  }

  get name() {
    return this._name.length >= this.minLength.name && this._name.match(this.pattern) !== null;
  }

  get surname() {
    return (
      this._surname.length >= this.minLength.surname && this._surname.match(this.pattern) !== null
    );
  }

  get all() {
    return this.name && this.surname;
  }
}

const Login = () => {
  const form = createElement<HTMLFormElement>('form', { className: styles.login__form });
  const button = FormSubmit({ children: 'Login', disabled: true });

  const inputHandler = () => {
    const formData = new FormData(form);
    const data: TUser = {
      name: formData.get('name')?.toString() || '',
      surname: formData.get('surname')?.toString() || '',
    };
    const isValid = new Valid(data.name, data.surname).all;
    button.classList.toggle('disabled', !isValid);
  };

  const title = createElement('h1', {
    className: styles.login__header,
    textContent: 'Please enter your name',
  });

  form.addEventListener('submit', formSubmitHandler);
  const name = FormInput({
    name: 'name',
    placeholder: 'first name',
    minLength: '3',
    pattern,
    title: `3-16 ${validationDescription}`,
    onInput: inputHandler,
  });
  const surname = FormInput({
    name: 'surname',
    placeholder: 'surname',
    minLength: '4',
    pattern,
    title: `4-16 ${validationDescription}`,
    onInput: inputHandler,
  });
  form.append(name, surname, button);

  const section = createElement('section', { className: styles.login });
  const wrapper = createElement('div', { className: styles.login__wrapper });
  const char = createElement<HTMLImageElement>('img', {
    className: styles.login__char,
    src: srcChar,
    alt: 'login',
  });
  wrapper.append(form, char);
  section.append(title, wrapper);

  return section;
};

export default Login;
