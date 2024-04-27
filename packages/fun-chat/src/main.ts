import contextMenu from '@/context/menu.ts';
import Footer from '@/footer/footer.ts';
import Header from '@/header/header.ts';
import Main from '@/main/main.ts';
import message from '@/message/message.ts';
import modal from '@/modal/modal.ts';
import App from './App.ts';
import { createElement } from './utils/dom.ts';

import './styles.css';

const Layout = () => {
  const fragment = document.createDocumentFragment();
  fragment.append(
    Header(),
    Main(),
    Footer(),
    createElement('div', { className: 'body__bg' }),
    modal.el,
    message.el,
    contextMenu.el,
  );
  return fragment;
};

document.body.append(Layout());
App();
