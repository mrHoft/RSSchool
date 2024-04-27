import { createElement } from '~/utils/dom';
import styles from './styles.module.css';
import { FormInputProps } from './types';

export default class FormSelect {
  private $el: HTMLElement;
  private $select: HTMLSelectElement;

  constructor({ name, options, onChange, placeholder = '', ...rest }: FormInputProps) {
    this.$el = createElement('div', { className: styles.form__select_container });
    const select = createElement<HTMLSelectElement>('select', {
      name,
      className: styles.form__select,
      id: `form_${name}`,
      ...rest,
    });
    this.$select = select;
    options.forEach((val, i) => {
      select.append(createElement<HTMLOptionElement>('option', { textContent: val, value: i }));
    });
    if (onChange) select.onchange = onChange;
    const label = createElement<HTMLLabelElement>('label', {
      className: styles.form__select_label,
      textContent: placeholder,
      htmlFor: `form_${name}`,
    });
    this.$el.append(label, select);
  }

  public get el() {
    return this.$el;
  }

  public get select() {
    return this.$select;
  }
}
