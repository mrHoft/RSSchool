import router from '~/utils/Router';
import { createElement, getElement } from '~/utils/dom';
import { themeInit } from '@/theme/theme';
import NotFoundPage from '@/404/404';
import modal from '@/modal/modal.ts';
import { home, garage, winners } from './pages';

const setMain = (el: HTMLElement | DocumentFragment) => {
  const main = getElement('main');
  main.innerHTML = '';
  main.append(el);
};

const routes = {
  home: () => {
    setMain(home());
  },
  404: () => {
    setMain(NotFoundPage());
  },
  garage: async () => {
    setMain(garage.el);
  },
  winners: () => {
    setMain(winners.el);
  },
  test: () => {
    modal.show(
      (() => {
        const fragment = document.createDocumentFragment();
        for (let i = 1; i < 10; i += 1) {
          fragment.append(createElement('p', { textContent: `Sample paragraph ${i}` }));
        }
        return fragment;
      })(),
    );
  },
};

export default function App() {
  themeInit();

  router
    .use('', routes.home)
    .use('garage', routes.garage)
    .use('winners', routes.winners)
    .use('404', routes['404'])
    .use('test', routes.test)
    .start();
}
