import { createElement } from '~/utils/dom';
import ColorPickerModel from './model';

import './styles.css';

export default class ColorPickerView extends ColorPickerModel {
  protected $el: HTMLElement;
  protected $ctrls: HTMLElement;
  protected $saturation: HTMLElement;
  protected $hue: HTMLElement;
  protected $pointer: HTMLElement;
  protected $selector: HTMLElement;
  protected $value: HTMLElement;

  constructor() {
    super();
    this.$el = createElement('div', { className: 'picker' });

    this.$ctrls = createElement('div', { className: 'picker__ctrls' });
    this.$saturation = createElement('div', { className: 'picker__saturation' });
    const brightness = createElement('div', { className: 'picker__brightness' });
    this.$pointer = createElement('div', { className: 'picker__pointer' });
    this.$saturation.append(brightness, this.$pointer);

    this.$selector = createElement('div', { className: 'picker__selector' });
    this.$hue = createElement('div', { className: 'picker__hue' });
    this.$hue.append(this.$selector);
    this.$ctrls.append(this.$saturation, this.$hue);

    const values = createElement('div', { className: 'picker__values' });
    this.$value = createElement('div', { className: 'picker__rgb' });
    values.append(this.$value);

    this.$el.append(this.$ctrls, values);
  }
}
