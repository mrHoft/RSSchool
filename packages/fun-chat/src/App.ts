import Page404 from '@/404/404';
import { themeInit } from '@/theme/theme';
import router from '~/services/router';
import { getElement } from '~/utils/dom';
import { Chat, about, login } from './pages';
import Page500 from './ui/500/500';

const setMain = (el: HTMLElement | DocumentFragment) => {
  const main = getElement('main');
  main.replaceChildren(el);
};

const routes = {
  chat: () => {
    setMain(new Chat().el);
  },
  login: () => {
    setMain(login());
  },
  404: () => {
    setMain(Page404());
  },
  500: () => {
    setMain(Page500());
  },
  about: () => {
    setMain(about());
  },
};

export default function App() {
  themeInit();
  console.log('(.)(.)');

  router
    .use('', routes.about)
    .use('login', routes.login)
    .use('chat', routes.chat)
    .use('404', routes['404'])
    .use('500', routes['500'])
    .use('about', routes.about)
    .start();
}
