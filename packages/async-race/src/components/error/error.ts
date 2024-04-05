import { createElement } from '~/utils/dom';

export default function NoServerError(text: string) {
  const fragment = document.createDocumentFragment();
  const message = createElement('p', {});
  message.append(
    'Consider to start ',
    createElement('code', { textContent: 'async-race' }),
    ' server first.',
  );
  fragment.append(
    createElement('h1', { textContent: 'Error' }),
    createElement('p', { textContent: text }),
    message,
  );
  return fragment;
}
