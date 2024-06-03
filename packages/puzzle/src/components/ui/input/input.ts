import { createElement } from '~/utils/dom';
import { FormInputProps } from './types';
import styles from './styles.module.css';

const FormInput = ({
  name,
  onChange,
  onInput,
  type = 'text',
  placeholder = '',
  ...rest
}: FormInputProps) => {
  const container = createElement('div', { className: styles.form__input_container });
  const input = createElement<HTMLInputElement>('input', {
    name,
    className: styles.form__input,
    id: `form_${name}`,
    type,
    placeholder: '',
    minLength: 3,
    maxLength: 16,
    required: true,
    autocomplete: 'off',
    ...rest,
  });
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
  container.append(input, label, valid);
  return container;
};

export default FormInput;
