import { TUser } from '~/api/ws/types';
import { createElement } from '~/utils/dom';

import styles from './styles.module.scss';

const text = (name: string) => [
  `There is no messages with ${name}.`,
  'Post a first message to start chatting.',
];

export default function noMessages(recipient: TUser) {
  const el = createElement('div', { className: styles.chat__messages_blank });
  text(recipient.login).forEach(str => {
    el.append(createElement('p', { textContent: str }));
  });
  return el;
}
