export type TRGBAColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type THSVAColor = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

export function hexNumberToRgb(color: number): TRGBAColor {
  const r = ((color >> 16) & 255) / 255;
  const g = ((color >> 8) & 255) / 255;
  const b = (color & 255) / 255;
  return { r, g, b };
}

export function rgbToHex(color: TRGBAColor): string {
  const { r, g, b } = color;
  const hex = [
    '#',
    `0${Math.round(r * 255).toString(16)}`.slice(-2),
    `0${Math.round(g * 255).toString(16)}`.slice(-2),
    `0${Math.round(b * 255).toString(16)}`.slice(-2),
  ];

  return hex.join('').toUpperCase();
}

export function numberToHexString(color: number): string {
  return `#${`00000${(color | 0).toString(16)}`.slice(-6).toUpperCase()}`;
}

export function hexStringToNumber(color: string): number {
  return parseInt(color.replace('#', ''), 16);
}

export function hsvToRgb(color: THSVAColor): TRGBAColor {
  const { h, s, v } = color;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return { r, g, b };
}

export function rgbToHsv(color: TRGBAColor): THSVAColor {
  const { r, g, b } = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return { h, s, v };
}

class Color {
  private _rgba: TRGBAColor = { r: 0, g: 0, b: 0, a: 1 };
  private _hsva: THSVAColor = { h: 0, s: 0, v: 0, a: 1 };
  private _hexNumber = 0;
  private _brightness = 0;
  private _hexString = '';

  constructor(color: number | string) {
    this.fromHex(color);
  }

  public fromHex(color: number | string): void {
    if (!color) color = 0;

    if (typeof color === 'number' && !Number.isNaN(color)) {
      this._hexNumber = color as number;
      this._hexString = numberToHexString(this._hexNumber);
    } else {
      this._hexString = (color as string).toUpperCase();
      this._hexNumber = hexStringToNumber(this._hexString);
    }
    const { r, g, b } = hexNumberToRgb(this._hexNumber);

    this._rgba.r = r;
    this._rgba.g = g;
    this._rgba.b = b;

    const { h, s, v } = rgbToHsv(this._rgba);

    this._hsva.h = h;
    this._hsva.s = s;
    this._hsva.v = v;

    this._updateBrightness();
  }

  public fromHsv(color: THSVAColor): void {
    const { h, s, v } = color;

    this._hsva.h = h;
    this._hsva.s = s;
    this._hsva.v = v;

    const { r, g, b } = hsvToRgb(this._hsva);

    this._rgba.r = r;
    this._rgba.g = g;
    this._rgba.b = b;

    this._hexString = rgbToHex(this._rgba);
    this._hexNumber = hexStringToNumber(this._hexString);

    this._updateBrightness();
  }

  private _updateBrightness(): void {
    const { r, g, b } = this._rgba;
    this._brightness = (r * 299 + g * 587 + b * 114) / 1000;
  }

  get rgb(): TRGBAColor {
    return this._rgba;
  }

  get hsv(): THSVAColor {
    return this._hsva;
  }

  get hex(): number {
    return this._hexNumber;
  }

  get hexString(): string {
    return this._hexString;
  }

  get brightness(): number {
    return this._brightness;
  }
}

export default Color;
