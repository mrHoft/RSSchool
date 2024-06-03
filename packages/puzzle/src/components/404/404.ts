import { createElement } from '~/utils/dom';
import router from '~/utils/Router';

export default function NotFoundPage() {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createElement('h1', { textContent: '(404) Page not found!' }),
    createElement('button', {
      className: 'button',
      textContent: '\u2190 Home',
      onClick: () => router.go('/'),
    }),
  );
  return fragment;
}
