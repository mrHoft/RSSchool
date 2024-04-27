import EventBus from '~/services/eventbus';
import { createElement } from '~/utils/dom';
import MessagesListModel from './model';
import styles from './styles.module.scss';

export default class MessagesListView extends MessagesListModel {
  protected $el: HTMLElement;

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.$el = createElement('div', { className: `${styles.chat__messages} scrolled` });
  }

  public get el() {
    return this.$el;
  }
}
