import { createElement } from '~/utils/dom';
import styles from './styles.module.scss';

const urlClear = './icons/close.svg';
const urlSearch = './icons/search.svg';

export default class SearchView {
  protected $el: HTMLFormElement;
  protected $field: HTMLInputElement;
  protected $btnClear: HTMLElement;
  protected $imgClear: HTMLElement;
  protected $btnSubmit: HTMLElement;
  protected $imgSubmit: HTMLElement;

  constructor() {
    this.$el = createElement<HTMLFormElement>('form', { className: styles.chat__search });
    this.$field = createElement<HTMLInputElement>('input', {
      className: styles.chat__search_field,
      placeholder: 'Search',
      maxLength: 16,
      required: true,
    });
    this.$btnClear = createElement<HTMLButtonElement>('button', {
      className: styles.chat__search_btn,
      type: 'button',
    });
    this.$imgClear = createElement<HTMLImageElement>('img', {
      className: styles['chat__search_btn-clear'],
      src: urlClear,
      alt: '',
    });
    this.$btnClear.append(this.$imgClear);
    this.$btnClear.classList.add('hidden');
    this.$btnSubmit = createElement<HTMLButtonElement>('button', {
      className: styles.chat__search_btn,
      type: 'submit',
    });
    this.$imgSubmit = createElement<HTMLImageElement>('img', {
      className: styles['chat__search_btn-search'],
      src: urlSearch,
      alt: '',
    });
    this.$btnSubmit.append(this.$imgSubmit);
    this.$btnSubmit.classList.add('hidden');
    this.$el.append(this.$field, this.$btnClear, this.$btnSubmit);
  }

  public get el() {
    return this.$el;
  }
}
