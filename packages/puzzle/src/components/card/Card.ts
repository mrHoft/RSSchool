import { createElement } from '~/utils/dom';
import resizeCard from './resize';

import './styles.css';

export default class Card {
  private textContent: string;

  private _el: HTMLDivElement;

  constructor(textContent: string) {
    this.textContent = textContent;
    this._el = this.create();
  }

  get el() {
    return this._el;
  }

  private create() {
    const card = createElement<HTMLDivElement>('div', {
      className: 'puzzle__item grow',
      draggable: true,
    });
    const before = createElement('div', {});
    const after = createElement('div', {});
    card.append(before, this.textContent, after);
    const observer = new MutationObserver(() => {
      if (document.contains(card)) {
        resizeCard(card);
        observer.disconnect();
      }
    });
    observer.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true,
    });
    return card;
  }
}
