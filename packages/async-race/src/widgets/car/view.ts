import { createElement } from '~/utils/dom';
import Car, { type HTMLSvgElement } from './car';

import styles from './styles.module.css';

export default class ManageCarView {
  protected $carProps: HTMLElement;
  protected $name: HTMLInputElement;
  protected $colorBtn: HTMLElement;
  protected $colorInput: HTMLElement;
  protected $carSvg: HTMLSvgElement;
  protected $rndBtn: HTMLElement;
  protected $addBtn: HTMLElement;
  public el: HTMLElement;

  constructor() {
    const editor = createElement('div', { className: styles.editor });
    this.$carProps = createElement('div', { className: styles.editor__props });
    this.$carSvg = new Car({ id: 1 }).el;
    this.$name = createElement<HTMLInputElement>('input', {
      className: styles.editor__name,
      placeholder: 'Name',
      maxLength: 24,
    });
    this.$colorInput = createElement('div', {
      className: styles.editor__color,
    });
    this.$colorBtn = createElement('div', { className: `${styles.editor__color_picker} hidden` });
    this.$colorInput.append(this.$colorBtn);
    this.$carProps.append(this.$name, this.$colorInput, this.$carSvg);
    const buttons = createElement('div', { className: styles.editor__buttons });
    this.$rndBtn = createElement('button', {
      className: `${styles.editor__btn} button`,
      textContent: 'Random',
    });
    this.$addBtn = createElement('button', {
      className: `${styles.editor__btn} button`,
      textContent: 'Create',
    });
    buttons.append(this.$rndBtn, this.$addBtn);
    editor.append(this.$carProps, buttons);
    this.el = editor;
  }

  protected setCar(id: number) {
    const newCar = new Car({ id }).el;
    this.$carProps.replaceChild(newCar, this.$carSvg);
    this.$carSvg = newCar;
  }

  public get carSvg() {
    return this.$carSvg;
  }
}
