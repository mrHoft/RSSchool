import Header from '@/header/header.ts';
import Main from '@/main/main.ts';
import Footer from '@/footer/footer.ts';
import { createElement } from './utils/dom.ts';
import App from './App.ts';
import modal from '@/modal/modal.ts';
import message from '@/message/message.ts';

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
  );
  return fragment;
};

document.body.prepend(Layout());
App();
