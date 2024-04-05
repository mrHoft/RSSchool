import { createElement } from '~/utils/dom';
import router from '~/utils/Router';

import './styles.css';

const pages = [
  {
    name: 'Garage',
    handler: () => router.go('garage'),
  },
  {
    name: 'Winners',
    handler: () => router.go('winners'),
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
