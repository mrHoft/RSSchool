import FormInput from '~/ui/input/input';
import modal from '~/ui/modal/modal';
import FormSubmit from '~/ui/submit/submit';
import { createElement } from '~/utils/dom';

import styles from './styles.module.css';

export default function makeLink(callback: (link: string) => void) {
  const fragment = document.createDocumentFragment();
  const title = createElement('h2', { textContent: 'Create link' });
  const form = createElement<HTMLFormElement>('form', { className: styles['create-link__form'] });
  const input = new FormInput({ name: 'link', placeholder: 'Link address', maxLength: '128' });
  const submit = new FormSubmit({ children: 'Create' });
  form.append(input.el, submit.el);
  form.onsubmit = (event: Event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const link = formData.get('link')?.toString() || '';
    modal.close();
    callback(link);
  };
  fragment.append(title, form);
  modal.show(fragment);
  (input.el.firstElementChild as HTMLInputElement).focus();
}
