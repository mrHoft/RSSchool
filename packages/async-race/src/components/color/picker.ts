import Color, { type TRGBAColor, type THSVAColor } from './utils';
import ColorPickerView from './view';

const isNumber = (num: unknown) => Number.isFinite(num) && !Number.isNaN(num);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type TPosition = {
  x: number;
  y: number;
};

export function getMousePosition(e: MouseEvent | TouchEvent): TPosition {
  if (e.type.indexOf('touch') === 0) {
    const touch = (e as TouchEvent).touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  const mouse = e as MouseEvent;
  return { x: mouse.clientX, y: mouse.clientY };
}

type TCallback = (hexString: string) => void;
type TColorPickerProps = {
  window?: Window;
  el?: HTMLElement | string;
  background?: string | number;
  widthUnits?: string;
  heightUnits?: string;
  width?: number;
  height?: number;
  color?: string | number;
  callback?: TCallback;
};

class ColorPicker extends ColorPickerView {
  public hue: number = 0;
  public position: TPosition = { x: 0, y: 0 };
  public color: Color = new Color(0);
  public backgroundColor: Color = new Color(0);
  public hueColor: Color = new Color(0);

  constructor(props: TColorPickerProps = {}) {
    super();
    this.$saturation.addEventListener('mousedown', this._onSaturationMouseDown);
    this.$saturation.addEventListener('touchstart', this._onSaturationMouseDown);
    this.$hue.addEventListener('mousedown', this._onHueMouseDown);
    this.$hue.addEventListener('touchstart', this._onHueMouseDown);

    if (props.widthUnits) {
      this._widthUnits = props.widthUnits;
    }

    if (props.heightUnits) {
      this._heightUnits = props.heightUnits;
    }

    if (props.callback) {
      this._callbacks.push(props.callback);
    }

    this.setSize(props.width || 175, props.height || 175);
    this.setColor(props.color ?? '');
  }

  get el() {
    return this.$el;
  }

  public remove() {
    this._callbacks = [];

    this._onSaturationMouseUp();
    this._onHueMouseUp();

    this.$saturation.removeEventListener('mousedown', this._onSaturationMouseDown);
    this.$saturation.removeEventListener('touchstart', this._onSaturationMouseDown);
    this.$hue.removeEventListener('mousedown', this._onHueMouseDown);
    this.$hue.removeEventListener('touchstart', this._onHueMouseDown);

    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }

  public setColor(color: string | number): ColorPicker {
    this._inputIsNumber = isNumber(color);
    this.color.fromHex(color);

    const { h, s, v } = this.color.hsv;

    if (!Number.isNaN(h)) {
      this.hue = h;
    }

    this._moveSelectorTo(this._saturationWidth * s, (1 - v) * this._hueHeight);
    this._moveHueTo((1 - this.hue) * this._hueHeight);

    this._updateHue();
    return this;
  }

  public setSize(width: number, height: number): ColorPicker {
    this._width = width;
    this._height = height - 25;
    this.$ctrls.style.width = this._width + this._widthUnits;
    this.$ctrls.style.height = this._height + this._heightUnits;

    this._saturationWidth = this._width - 25;
    this.$saturation.style.width = `${this._saturationWidth}px`;

    this._hueHeight = this._height;
    this._maxHue = this._hueHeight - 2;

    return this;
  }

  public onChange(callback: TCallback): ColorPicker {
    if (this._callbacks.indexOf(callback) < 0) {
      this._callbacks.push(callback);
      callback(this.getHexString());
    }
    return this;
  }

  public get isChoosing(): boolean {
    return this._isChoosing;
  }

  public getColor(): number | string {
    if (this._inputIsNumber) {
      return this.getHexNumber();
    }
    return this.getHexString();
  }

  public getHexString(): string {
    return this.color.hexString.toUpperCase();
  }

  public getHexNumber(): number {
    return this.color.hex;
  }

  public getRGB(): TRGBAColor {
    return this.color.rgb;
  }

  public getHSV(): THSVAColor {
    return this.color.hsv;
  }

  private _moveSelectorTo(x: number, y: number): void {
    this.position.x = clamp(x, 0, this._saturationWidth);
    this.position.y = clamp(y, 0, this._hueHeight);

    this.$pointer.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }

  private _updateColorFromPosition(): void {
    this.color.fromHsv({
      h: this.hue,
      s: this.position.x / this._saturationWidth,
      v: 1 - this.position.y / this._hueHeight,
    });
    this._updateColor();
  }

  private _moveHueTo(y: number): void {
    this._huePosition = clamp(y, 0, this._maxHue);
    this.$selector.style.transform = `translateY(${this._huePosition}px)`;
  }

  private _updateHueFromPosition(): void {
    const hsvColor = this.getHSV();
    this.hue = 1 - this._huePosition / this._maxHue;
    this.color.fromHsv({ h: this.hue, s: hsvColor.s, v: hsvColor.v });
    this._updateHue();
  }

  private _updateHue(): void {
    this.hueColor.fromHsv({ h: this.hue, s: 1, v: 1 });
    this.$saturation.style.background = `linear-gradient(to right, #fff, ${this.hueColor.hexString})`;
    this._updateColor();
  }

  private _updateColor(): void {
    this.$pointer.style.background = this.getHexString();
    const r = `00${~~(this.color.rgb.r * 255)}`.slice(-3);
    const g = `00${~~(this.color.rgb.g * 255)}`.slice(-3);
    const b = `00${~~(this.color.rgb.b * 255)}`.slice(-3);
    const value = `${r} ${g} ${b} ${this.getHexString()}`;
    this.$value.textContent = value;
    this._triggerChange();
  }

  private _triggerChange(): void {
    this._callbacks.forEach(callback => callback(this.getHexString()));
  }

  private _onSaturationMouseDown = (e: MouseEvent | TouchEvent): void => {
    const sbOffset = this.$saturation.getBoundingClientRect();
    const { x, y } = getMousePosition(e);
    this._isChoosing = true;
    this._moveSelectorTo(x - sbOffset.left, y - sbOffset.top);
    this._updateColorFromPosition();
    window.addEventListener('mouseup', this._onSaturationMouseUp);
    window.addEventListener('touchend', this._onSaturationMouseUp);
    window.addEventListener('mousemove', this._onSaturationMouseMove);
    window.addEventListener('touchmove', this._onSaturationMouseMove);
    e.preventDefault();
  };

  private _onSaturationMouseMove = (e: MouseEvent | TouchEvent): void => {
    const sbOffset = this.$saturation.getBoundingClientRect();
    const { x, y } = getMousePosition(e);
    this._moveSelectorTo(x - sbOffset.left, y - sbOffset.top);
    this._updateColorFromPosition();
  };

  private _onSaturationMouseUp = () => {
    this._isChoosing = false;
    window.removeEventListener('mouseup', this._onSaturationMouseUp);
    window.removeEventListener('touchend', this._onSaturationMouseUp);
    window.removeEventListener('mousemove', this._onSaturationMouseMove);
    window.removeEventListener('touchmove', this._onSaturationMouseMove);
  };

  private _onHueMouseDown = (e: MouseEvent | TouchEvent): void => {
    const hOffset = this.$hue.getBoundingClientRect();
    const { y } = getMousePosition(e);
    this._isChoosing = true;
    this._moveHueTo(y - hOffset.top);
    this._updateHueFromPosition();
    window.addEventListener('mouseup', this._onHueMouseUp);
    window.addEventListener('touchend', this._onHueMouseUp);
    window.addEventListener('mousemove', this._onHueMouseMove);
    window.addEventListener('touchmove', this._onHueMouseMove);
    e.preventDefault();
  };

  private _onHueMouseMove = (e: MouseEvent | TouchEvent) => {
    const hOffset = this.$hue.getBoundingClientRect();
    const { y } = getMousePosition(e);
    this._moveHueTo(y - hOffset.top);
    this._updateHueFromPosition();
  };

  private _onHueMouseUp = () => {
    this._isChoosing = false;
    window.removeEventListener('mouseup', this._onHueMouseUp);
    window.removeEventListener('touchend', this._onHueMouseUp);
    window.removeEventListener('mousemove', this._onHueMouseMove);
    window.removeEventListener('touchmove', this._onHueMouseMove);
  };
}

export default ColorPicker;
