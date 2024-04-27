import router from '~/services/router';
import { createElement } from '~/utils/dom';

const srcImg = './image/people-24.svg';

export default function Page404() {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createElement('h1', { textContent: '(404) Page not found!' }),
    createElement<HTMLImageElement>('img', {
      className: '404__img',
      src: srcImg,
      alt: 'boy',
    }),
    createElement('button', {
      className: 'button',
      textContent: '\u2190 Home',
      onClick: () => router.go(''),
    }),
  );
  return fragment;
}
