import router from '~/utils/Router';
import { getUser } from '~/api/user/user';
import { createElement } from '~/utils/dom';
import styles from './styles.module.css';

const srcChar = './assets/cute-chibi-fox-boy1.png';

const descr = [
  'Click on words, collect phrases.',
  'Words can be drag and drop.',
  'Use menu icons to switch tooltips.',
];

const HomePage = () => {
  const user = getUser();
  const section = createElement('section', { className: styles.welcome });
  const wrapper = createElement('div', { className: styles.welcome__wrapper });
  const char = createElement<HTMLImageElement>('img', {
    className: styles.welcome__char,
    src: srcChar,
    alt: 'welcome',
  });
  const info = createElement('div', { className: styles.welcome__info });
  wrapper.append(char, info);
  section.append(
    createElement('h1', { className: styles.welcome__title, textContent: 'English puzzle game' }),
    wrapper,
  );
  if (user) {
    info.append(
      createElement('p', {
        className: styles.welcome__user,
        textContent: `Welcome ${user.name} ${user.surname}!`,
      }),
    );
  }
  const list = createElement('ul', { className: styles.welcome__descr_list });
  list.append(...descr.map(text => createElement('li', { textContent: text })));
  info.append(
    list,
    createElement('button', {
      className: 'button',
      textContent: 'Start',
      onClick: () => router.go('/game'),
    }),
  );

  return section;
};

export default HomePage;
