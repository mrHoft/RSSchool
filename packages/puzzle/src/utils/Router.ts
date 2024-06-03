import Route from './Route.ts';

class Router {
  private history: History = window.history;

  private routes: Route[] = [];

  protected _currentRoute: Route | null = null;

  protected _rootQuery: string = '/';

  constructor(rootQuery?: string) {
    this._rootQuery = rootQuery ?? window.location.pathname;
  }

  public use(pathname: string, page: () => void) {
    const route = new Route(pathname, page);
    this.routes.push(route);
    return this;
  }

  public start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const path = pathname.substring(pathname.lastIndexOf('/'));
    let route: Route | null = this.getRoute(path);
    if (!route) route = this.getRoute('/404');
    if (route) {
      if (this._currentRoute) this._currentRoute.leave();
      this._currentRoute = route;
      route.render();
    }
  }

  public go(pathname: string) {
    this.history.pushState(
      { route: pathname },
      '',
      `${this._rootQuery}${pathname}`.replace('//', '/'),
    );
    this._onRoute(pathname);
  }

  public back() {
    this.history.back();
  }

  public forward() {
    this.history.forward();
  }

  public getRoute(pathname?: string) {
    if (pathname) return this.routes.find(route => route.match(pathname)) || null;
    return this._currentRoute;
  }
}

const router = new Router();
export default router;
