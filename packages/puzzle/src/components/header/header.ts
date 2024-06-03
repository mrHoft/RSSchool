import router from '~/utils/Router';
import { createElement } from '~/utils/dom';
import UserMenu from '@/user/menu';
import settingsMenu from '@/settings/settings';
import styles from './styles.module.css';

const srcLogo = './assets/favicon.png';

const Header = () => {
  const header = createElement('header', { className: 'header' });
  const menu = createElement('div', { className: styles.header__menu });
  menu.append(settingsMenu.el, UserMenu());

  const logo = createElement('div', {
    className: styles.header__logo,
    src: srcLogo,
    onClick: () => router.go('/'),
  });
  logo.append(
    createElement<HTMLImageElement>('img', {
      className: styles.header__logo_img,
      src: srcLogo,
      alt: 'logo',
    }),
    createElement('h1', { className: styles.header__title, textContent: 'Puzzle' }),
  );

  header.append(logo, menu);
  return header;
};

export default Header;
