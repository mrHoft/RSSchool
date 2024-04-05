import { getElement, createElement } from '~/utils/dom';
import { getSettings } from '~/api/settings/settings';
import store from '~/utils/Store';
import styles from './styles.module.css';

const themeUpdate = (dark: boolean) => {
  getElement('.body__bg').classList.toggle('invert', dark);
  getElement('.header__logo_img').classList.toggle('invert', !dark);
  getElement('.footer__logo_rss').classList.toggle('invert', !dark);
  getElement('.modal__close').classList.toggle('invert', !dark);

  const img1 = document.querySelector('.home__anim_img1');
  if (img1) img1.classList.toggle('invert', !dark);
  const img2 = document.querySelector('.home__anim_img2');
  if (img2) img2.classList.toggle('invert', !dark);
};

export const themeInit = () => {
  const { dark } = getSettings();
  document.documentElement.classList.toggle('dark', dark);
  themeUpdate(dark);
};

const changeHandler = (event: Event) => {
  event.preventDefault();
  const dark = (event.currentTarget as HTMLInputElement).checked;
  document.documentElement.classList.toggle('dark', dark);
  store.set('settings.dark', dark);
  themeUpdate(dark);
};

const ThemeSwitcher = () => {
  const { dark } = getSettings();

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
