import NavigationMenu from '@/menu/menu';
import ThemeSwitcher from '@/theme/theme';
import router from '~/services/router';
import { createElement } from '~/utils/dom';
import User from '~/widgets/user/user';
import styles from './styles.module.css';

const srcLogo = './logo/chat.svg';

const Header = () => {
  const header = createElement('header', { className: 'header' });

  const logo = createElement('div', {
    className: styles.header__logo,
    onClick: () => router.go(''),
  });
  logo.append(
    createElement<HTMLImageElement>('img', {
      className: styles.header__logo_img,
      src: srcLogo,
      width: 30,
      height: 30,
      alt: 'logo',
    }),
    createElement('h2', { className: styles.header__title, textContent: 'Fun Chat' }),
  );

  const settings = createElement('div', { className: styles.header__menu });
  settings.append(new User().el, ThemeSwitcher());

  header.append(logo, NavigationMenu(), settings);
  return header;
};

export default Header;
