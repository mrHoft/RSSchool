import { createElement } from '~/utils/dom';
import styles from './styles.module.css';

export default class FormSubmit {
  private $el: HTMLButtonElement;

  constructor({ children, disabled }: { children: string; disabled?: boolean }) {
    this.$el = createElement<HTMLButtonElement>('button', {
      className: `${styles.form__submit}${disabled ? ` ${styles.form__submit_disabled}` : ''}`,
      type: 'submit',
      textContent: children,
    });
  }

  public get el() {
    return this.$el;
  }

  public toggle(disabled: boolean) {
    this.$el.classList.toggle(styles.form__submit_disabled, disabled);
  }

  public loading(loading: boolean) {
    this.$el.classList.toggle(styles.form__submit_loading, loading);
  }
}
