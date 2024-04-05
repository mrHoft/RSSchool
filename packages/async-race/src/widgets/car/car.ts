export type HTMLSvgElement = HTMLElement & SVGElement;

export default class Car {
  private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  private static XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
  private static URL_SPRITE = './image/sprite.svg';
  private $el: HTMLSvgElement;

  public constructor({ id, color, size = 32 }: { id?: number; color?: string; size?: number }) {
    const i = id ?? ~~(Math.random() * 7 + 1);
    this.$el = <HTMLSvgElement>document.createElementNS(Car.SVG_NAMESPACE, 'svg');
    const use = document.createElementNS(Car.SVG_NAMESPACE, 'use');
    use.setAttributeNS(Car.XLINK_NAMESPACE, 'xlink:href', `${Car.URL_SPRITE}#car${i}`);
    this.$el.append(use);
    this.$el.style.fill = color ?? '#FFF';
    this.$el.setAttribute('width', (size * 3).toString());
    this.$el.setAttribute('height', size.toString());
  }

  public get el() {
    return this.$el;
  }

  public setColor(color: string): void {
    this.$el.style.fill = color;
  }
}
