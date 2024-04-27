import EventBus from '~/services/eventbus';
import { createElement } from '~/utils/dom';
import UsersModel from './model';
import Search from './search/search';
import styles from './styles.module.scss';

export default class UsersView extends UsersModel {
  protected $el: HTMLElement;
  protected $users: HTMLElement;
  protected $search: Search;

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.$el = createElement('div', { className: styles.chat__left });
    this.$search = new Search(this.eventBus);
    this.$users = createElement('ul', { className: `${styles.chat__users} scrolled` });
    this.$el.append(this.$search.el, this.$users);
  }

  public get el() {
    return this.$el;
  }
}
