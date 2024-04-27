export default class Route {
  private _pathname: string;
  protected _render: () => void;

  constructor(pathname: string, render: () => void) {
    this._pathname = pathname;
    this._render = render;
  }

  public get pathname() {
    return this._pathname;
  }

  public navigate() {
    this._render();
  }
}
