import { createElement } from '~/utils/dom';
import './styles.css';

const FormSubmit = ({ children, disabled }: { children: string; disabled?: boolean }) =>
  createElement<HTMLButtonElement>('button', {
    className: `form__submit${disabled ? ' disabled' : ''}`,
    type: 'submit',
    textContent: children,
  });

export default FormSubmit;
