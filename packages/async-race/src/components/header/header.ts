import router from '~/utils/Router';
import { createElement } from '~/utils/dom';
import ThemeSwitcher from '@/theme/theme';
import NavigationMenu from '@/menu/menu';
import './styles.css';

const srcLogo = './logo/race.svg';

const Header = () => {
  const header = createElement('header', { className: 'header' });

  const logo = createElement('div', { className: 'header__logo', onClick: () => router.go('') });
  logo.append(
    createElement<HTMLImageElement>('img', {
      className: 'header__logo_img',
      src: srcLogo,
      width: 100,
      height: 25,
      alt: 'logo',
    }),
    createElement('h1', { className: 'header__title', textContent: 'Async Race' }),
  );

  const settings = createElement('div', { className: 'header__menu' });
  settings.append(ThemeSwitcher());

  header.append(logo, NavigationMenu(), settings);
  return header;
};

export default Header;
