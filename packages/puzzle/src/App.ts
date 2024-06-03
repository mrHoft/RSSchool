import router from '~/utils/Router';
import puzzle from './game/controller/Puzzle';
import { createElement, getElement } from '~/utils/dom';
import { getUser } from './api/user/user';
import Login from '@/login/login';
import UserMenu from '@/user/menu';
import HomePage from '@/welcome/home';
import NotFoundPage from '@/404/404';
import { getSettings } from './api/settings/settings';
import settingsMenu from '@/settings/settings';
import modal from '@/modal/modal.ts';

const setMain = (el: HTMLElement | DocumentFragment) => {
  const main = getElement('main');
  main.innerHTML = '';
  main.append(el);
};

const routes = {
  404: () => {
    setMain(NotFoundPage());
  },
  login: () => {
    setMain(Login());
  },
  home: () => {
    const user = getUser();
    const settings = getElement('.settings');
    if (!user) {
      settings.classList.add('hidden');
      router.go('/login');
      return;
    }
    settingsMenu.refresh();
    setMain(HomePage());
    UserMenu();
  },
  game: () => {
    setMain(puzzle.init());
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
  const { dark } = getSettings();
  document.documentElement.classList.toggle('dark', dark);
  router
    .use('/', routes.home)
    .use('/login', routes.login)
    .use('/game', routes.game)
    .use('/404', routes['404'])
    .use('/test', routes.test)
    .start();
}
