import { getSettings } from '~/api/settings/settings';
import EventBus from '~/services/eventbus';
import store from '~/services/store';
import { createElement, getElement } from '~/utils/dom';
import styles from './styles.module.css';

export const eventBusTheme = new EventBus();

const themeUpdate = (dark: boolean) => {
  getElement('.footer__logo_rss').classList.toggle('invert', !dark);
  getElement('.modal__close').classList.toggle('invert', !dark);
};

export const themeInit = () => {
  const { dark } = getSettings();
  document.documentElement.classList.toggle('dark', dark);
  document.addEventListener('readystatechange', () => {
    eventBusTheme.emit('theme', dark);
  });
};

const changeHandler = (event: Event) => {
  event.preventDefault();
  const dark = (event.currentTarget as HTMLInputElement).checked;
  document.documentElement.classList.toggle('dark', dark);
  store.set('settings.dark', dark);
  eventBusTheme.emit('theme', dark);
};

const ThemeSwitcher = () => {
  const { dark } = getSettings();
  eventBusTheme.on('theme', themeUpdate);

  const theme = createElement('div', { className: styles.theme });
  const switcher = createElement<HTMLInputElement>('input', {
    className: styles.theme__switcher,
    type: 'checkbox',
    checked: dark,
  });
  switcher.addEventListener('change', changeHandler);
  theme.append(switcher);

  return theme;
};

export default ThemeSwitcher;
