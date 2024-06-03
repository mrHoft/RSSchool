export default class Route {
  protected _pathname: string;

  protected _page: () => void;

  protected _block: boolean;

  constructor(pathname: string, page: () => void) {
    this._pathname = pathname;
    this._page = page;
    this._block = false;
  }

  public get pathname() {
    return this._pathname;
  }

  public navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  public leave() {
    if (this._block) {
      // Not implemented
    }
  }

  public match(pathname: string) {
    return pathname === this._pathname;
  }

  public render() {
    this._block = true;
    this._page();
  }
}
