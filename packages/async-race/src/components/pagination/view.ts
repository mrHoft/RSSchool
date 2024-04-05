import { createElement } from '~/utils/dom';
import PaginationModel from './model';

import styles from './styles.module.css';

export default class PaginationView extends PaginationModel {
  protected $el: HTMLElement;
  protected $left: HTMLElement;
  protected $right: HTMLElement;
  protected $current: HTMLElement;
  protected $page: HTMLElement[] = new Array<HTMLElement>(5);
  protected $first: HTMLElement;
  protected $last: HTMLElement;

  protected constructor() {
    super();

    this.$el = createElement('div', {
      className: styles.pagination,
    });
    this.$left = createElement('button', {
      className: styles.pagination__btn,
      textContent: '\u2190',
    });
    this.$right = createElement('button', {
      className: styles.pagination__btn,
      textContent: '\u2192',
    });
    this.$current = createElement('div', {
      className: styles.pagination__current,
      textContent: this._props.current.toString(),
    });
    for (let i = 0; i < 5; i += 1) {
      this.$page[i] = createElement('button', {
        className: styles.pagination__btn,
        textContent: (i + 1).toString(),
      });
    }
    this.$first = createElement('button', {
      className: `${styles.pagination__btn} ${styles.pagination__btn_first}`,
      textContent: '1',
    });
    this.$last = createElement('button', {
      className: `${styles.pagination__btn} ${styles.pagination__btn_last}`,
    });
    this.$el.append(this.$left, this.$first, ...this.$page, this.$last, this.$current, this.$right);
  }
}
