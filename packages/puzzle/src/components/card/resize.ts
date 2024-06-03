import { getElement } from '~/utils/dom';

export default function resizeCard(card: HTMLElement) {
  const parent = getElement('.puzzle__body').getBoundingClientRect();
  const { width, height, top, left } = card.getBoundingClientRect();
  const before = card.firstElementChild as HTMLDivElement;
  const after = card.lastElementChild as HTMLDivElement;

  card.style.width = `${width.toFixed(2)}px`;
  card.style.height = `${height.toFixed(2)}px`;

  before.style.backgroundPosition = `-${left - parent.left}px -${top - parent.top}px`;
  after.style.backgroundPosition = `-${left - parent.left + width - 8.5}px -${top - parent.top + 16}px`;

  card.classList.remove('grow');
  card.classList.add('opaque');
}
