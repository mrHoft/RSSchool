import router from '~/services/router';
import { createElement } from '~/utils/dom';

const srcImg = './image/people-24.svg';

export default function Page500() {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createElement('h1', { textContent: '(500) Unable to connect.' }),
    createElement<HTMLImageElement>('img', {
      className: '500__img',
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
