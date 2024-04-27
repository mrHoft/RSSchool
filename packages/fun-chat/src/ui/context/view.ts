import { createElement } from '~/utils/dom';
import styles from './styles.module.css';

const menuItems = [
  {
    icon: './icons/edit.svg',
    title: 'Edit',
  },
  {
    icon: './icons/trash.svg',
    title: 'Delete',
  },
];

export default class ContextMenuView {
  protected $el: HTMLElement;
  protected $items: HTMLElement[] = [];

  constructor() {
    this.$el = createElement('div', { className: `${styles.context__menu} hidden` });
    const ul = createElement('ul', { className: styles.context__menu_list });
    menuItems.forEach(item => {
      const li = createElement('li', { className: styles.context__menu_item });
      const img = createElement<HTMLImageElement>('img', { src: item.icon, alt: '' });
      const title = createElement('span', { textContent: item.title });
      li.append(img, title);
      ul.append(li);
      this.$items.push(li);
    });
    this.$el.append(ul);
  }

  public get el() {
    return this.$el;
  }
}
