import Route from './Route.ts';

class Router {
  private history: History = window.history;
  private _routes: Route[] = [];
  private _currentRoute: Route | null = null;
  private _basePathName = '/';

  public use(pathname: string, page: () => void) {
    const route = new Route(pathname, page);
    this._routes.push(route);
    return this;
  }

  public start() {
    this._basePathName = window.location.pathname;
    window.onpopstate = (event: Event) => {
      event.preventDefault();
      this._onRoute(this._getParam(window.location.search));
    };

    this._onRoute(this._getParam(window.location.search));
  }

  public go(pathname: string) {
    const path = pathname.length <= 1 ? '' : `?page=${pathname}`;
    this.history.pushState({ route: path }, '', `${this._basePathName}${path}`);
    this._onRoute(pathname);
  }

  public back() {
    this.history.back();
  }

  public forward() {
    this.history.forward();
  }

  public getRoute(pathname?: string) {
    if (pathname !== undefined) {
      return this._routes.find(route => route.pathname === pathname) || null;
    }
    return this._currentRoute;
  }

  private _getParam(searchParams: string) {
    const param = searchParams.split('?').find(val => val.startsWith('page'));
    return param ? param.split('=')[1] : '';
  }

  private _onRoute(pathname: string) {
    let route: Route | null = this.getRoute(pathname);
    if (!route) route = this.getRoute('404');
    if (route) {
      this._currentRoute = route;
      route.navigate();
    }
  }
}

const router = new Router();
export default router;
