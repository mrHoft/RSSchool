import { createElement } from '~/utils/dom';

export default class GarageView {
  protected $el: HTMLElement;
  protected $pageNum: HTMLElement;
  protected $track: HTMLElement;
  protected $manage: HTMLElement;
  protected $pagination: HTMLElement;

  constructor() {
    this.$el = createElement('div', { className: 'garage' });
    const title = createElement('div', { className: 'garage__title' });
    this.$pageNum = document.createElement('span');
    title.append(createElement('h1', { textContent: 'Garage' }), this.$pageNum);
    this.$manage = createElement('section', { className: 'garage__manage' });
    this.$track = createElement('section', { className: 'garage__track' });
    this.$pagination = createElement('div', { className: 'garage__pagination' });
    this.$el.append(title, this.$manage, this.$track, this.$pagination);
  }
}
