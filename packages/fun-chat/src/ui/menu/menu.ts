import router from '~/services/router';
import { createElement } from '~/utils/dom';

import './styles.css';

const pages = [
  {
    name: 'Chat',
    handler: () => router.go('chat'),
  },
  {
    name: 'About',
    handler: () => router.go('about'),
  },
];

const NavigationMenu = () => {
  const menu = createElement('nav', { className: 'menu__nav' });
  const list = createElement('ul', { className: 'menu__list' });
  pages.forEach(el => {
    list.append(
      createElement('li', {
        className: 'menu__item',
        textContent: el.name,
        onClick: el.handler,
      }),
    );
  });
  menu.append(list);

  return menu;
};

export default NavigationMenu;
