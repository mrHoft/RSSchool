import { createElement } from '~/utils/dom';
import styles from './styles.module.css';
import { FormInputProps } from './types';

export default class FormInput {
  private $el: HTMLElement;
  private $input: HTMLInputElement;

  constructor({ name, type, onChange, onInput, placeholder = '', ...rest }: FormInputProps) {
    const autocomplete = 'off';
    this.$el = createElement('div', { className: styles.form__input_container });
    const input = createElement<HTMLInputElement>('input', {
      name,
      className: styles.form__input,
      id: `form_${name}`,
      type: type === 'password' ? 'password' : 'text',
      placeholder: '',
      minLength: 3,
      maxLength: 16,
      required: true,
      autocomplete,
      ...rest,
    });
    this.$input = input;
    if (onChange) input.onchange = onChange;
    if (onInput) input.oninput = onInput;
    const label = createElement<HTMLLabelElement>('label', {
      className: styles.form__input_label,
      textContent: placeholder,
      htmlFor: `form_${name}`,
    });
    const valid = createElement('span', {
      className: styles.form__input_valid,
      textContent: '\u2714',
    });
    this.$el.append(input, label, valid);
  }

  public get el() {
    return this.$el;
  }

  public get input() {
    return this.$input;
  }
}
